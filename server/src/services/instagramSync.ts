import { createHash } from 'node:crypto'
import axios, { AxiosError } from 'axios'
import { prisma } from '../lib/prisma.js'

type CacheRow = {
  id: string
  imageUrl: string
  permalink: string
  caption: string | null
  createdAt: Date
}

function resolveFeedUrl(): string | null {
  const raw = process.env.INSTAGRAM_FEED_URL?.trim()
  if (!raw) {
    return null
  }
  try {
    const u = new URL(raw)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return null
    }
    return u.toString()
  } catch {
    return null
  }
}

function isValidHttpUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return (u.protocol === 'http:' || u.protocol === 'https:') && s.length < 8000
  } catch {
    return false
  }
}

function isValidImageUrl(s: string): boolean {
  if (!isValidHttpUrl(s)) return false
  const path = new URL(s).pathname.toLowerCase()
  if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(path)) return true
  // CDNs (Instagram, etc.) muitas vezes não têm extensão no path
  return true
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&')
}

function stripCdata(s: string): string {
  const t = s.trim()
  if (t.startsWith('<![CDATA[')) {
    return t.slice(9).replace(/\]\]>\s*$/, '').trim()
  }
  return decodeXmlEntities(t)
}

function extractTagBlock(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const m = xml.match(re)
  return m ? m[1] ?? null : null
}

function extractTagText(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const m = block.match(re)
  return m ? stripCdata(m[1].trim()) : null
}

function extractFirstImgSrc(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return m ? decodeXmlEntities(m[1]) : null
}

function extractMediaContentUrl(block: string): string | null {
  const m =
    block.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)
  return m ? m[1] : null
}

function extractEnclosureImage(block: string): string | null {
  const enc = block.match(/<enclosure([^/>]*)\/?>/i)
  if (!enc) return null
  const attrs = enc[1] ?? ''
  const typeM = attrs.match(/type=["']([^"']+)["']/i)
  if (typeM && !typeM[1].toLowerCase().startsWith('image/')) {
    return null
  }
  const urlM = attrs.match(/url=["']([^"']+)["']/i)
  return urlM ? urlM[1] : null
}

function extractAtomLinkHref(block: string): string | null {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)]
  for (const m of links) {
    const attrs = m[1] ?? ''
    const href = attrs.match(/href=["']([^"']+)["']/i)
    if (!href) continue
    const rel = attrs.match(/rel=["']([^"']+)["']/i)
    if (!rel || rel[1].toLowerCase() === 'alternate') {
      return href[1]
    }
  }
  const first = block.match(/<link\b[^>]+href=["']([^"']+)["']/i)
  return first ? first[1] : null
}

function stableId(permalink: string, imageUrl: string, index: number): string {
  return createHash('sha256')
    .update(`${permalink}\0${imageUrl}\0${index}`)
    .digest('hex')
    .slice(0, 40)
}

type JsonFeedItem = {
  id?: string
  url?: string
  title?: string
  content_html?: string
  summary?: string
  image?: string | { url?: string }
  date_published?: string
}

function parseJsonFeed(text: string): CacheRow[] {
  let parsed: { items?: JsonFeedItem[] }
  try {
    parsed = JSON.parse(text) as { items?: JsonFeedItem[] }
  } catch {
    return []
  }
  if (!Array.isArray(parsed.items)) {
    return []
  }
  const rows: CacheRow[] = []
  let i = 0
  for (const item of parsed.items) {
    const permalink = item.url?.trim() || item.id?.trim() || ''
    const imageRaw =
      typeof item.image === 'string'
        ? item.image
        : item.image && typeof item.image === 'object' && item.image.url
          ? item.image.url
          : undefined
    const fromHtml =
      extractFirstImgSrc(item.content_html ?? '') || extractFirstImgSrc(item.summary ?? '')
    const imageUrl = (imageRaw || fromHtml || '').trim()
    if (!permalink || !imageUrl || !isValidImageUrl(imageUrl)) {
      i += 1
      continue
    }
    const caption = item.title?.trim() || null
    const createdAt = item.date_published ? new Date(item.date_published) : new Date()
    const id = item.id?.trim() || stableId(permalink, imageUrl, i)
    rows.push({
      id: id.slice(0, 512),
      imageUrl,
      permalink,
      caption,
      createdAt: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt,
    })
    i += 1
  }
  return rows
}

function parseRss2Items(xml: string): CacheRow[] {
  const rows: CacheRow[] = []
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  let m
  let index = 0
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1] ?? ''
    const link = extractTagText(block, 'link') || extractTagText(block, 'guid')
    const title = extractTagText(block, 'title')
    const pub = extractTagText(block, 'pubDate')
    const desc = extractTagBlock(block, 'description')
    const descHtml = desc ? stripCdata(desc) : ''

    const imageUrl =
      extractMediaContentUrl(block) ||
      extractEnclosureImage(block) ||
      extractFirstImgSrc(descHtml)

    const permalink = link?.trim() || ''
    if (!permalink || !imageUrl || !isValidImageUrl(imageUrl)) {
      index += 1
      continue
    }

    const createdAt = pub ? new Date(pub) : new Date()
    const guid = extractTagText(block, 'guid')
    const id = (guid || permalink).slice(0, 512)

    rows.push({
      id,
      imageUrl,
      permalink,
      caption: title?.trim() || null,
      createdAt: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt,
    })
    index += 1
  }
  return rows
}

function parseAtomEntries(xml: string): CacheRow[] {
  const rows: CacheRow[] = []
  const entryRe = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi
  let m
  let index = 0
  while ((m = entryRe.exec(xml)) !== null) {
    const block = m[1] ?? ''
    const permalink = extractAtomLinkHref(block)?.trim() || ''
    const title = extractTagText(block, 'title')
    const updated = extractTagText(block, 'updated') || extractTagText(block, 'published')
    const summary = extractTagBlock(block, 'summary')
    const content = extractTagBlock(block, 'content')
    const html = [summary, content]
      .filter(Boolean)
      .map(s => stripCdata(s!))
      .join('\n')

    const imageUrl =
      extractMediaContentUrl(block) || extractEnclosureImage(block) || extractFirstImgSrc(html)

    if (!permalink || !imageUrl || !isValidImageUrl(imageUrl)) {
      index += 1
      continue
    }

    const id =
      extractTagText(block, 'id')?.trim() || stableId(permalink, imageUrl, index).slice(0, 512)
    const createdAt = updated ? new Date(updated) : new Date()

    rows.push({
      id: id.slice(0, 512),
      imageUrl,
      permalink,
      caption: title?.trim() || null,
      createdAt: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt,
    })
    index += 1
  }
  return rows
}

function parseFeedBody(body: string): CacheRow[] {
  const trimmed = body.trim()
  if (trimmed.startsWith('{')) {
    const fromJson = parseJsonFeed(trimmed)
    if (fromJson.length > 0) {
      return fromJson
    }
  }
  if (/<rss\b/i.test(trimmed) || /<rdf:rdf/i.test(trimmed) || /<feed\b/i.test(trimmed)) {
    const rss = parseRss2Items(trimmed)
    if (rss.length > 0) {
      return rss
    }
    return parseAtomEntries(trimmed)
  }
  return []
}

/**
 * Só permite substituir o cache se houver pelo menos uma imagem válida.
 * Falhas de rede ou feed vazio/ilegível não apagam dados antigos.
 */
export function passesFeedSanityCheck(rows: CacheRow[]): boolean {
  return rows.length >= 1
}

async function fetchFeedText(url: string): Promise<string> {
  const { data, status } = await axios.get<string>(url, {
    responseType: 'text',
    timeout: 25_000,
    validateStatus: s => s >= 200 && s < 400,
    headers: {
      Accept: 'application/rss+xml, application/atom+xml, application/xml, application/json, text/xml, */*',
      'User-Agent': 'RangoDeRua-InstagramSync/1.0 (+https://rangoderua.org.br)',
    },
    transformResponse: r => r,
  })

  if (typeof data !== 'string') {
    throw new Error(`Resposta inesperada (tipo ${typeof data}) para status ${status}`)
  }
  return data
}

export type InstagramSyncResult =
  | { ok: true; count: number; skipped: true; reason: 'no_feed_url' }
  | { ok: true; count: number; skipped: true; reason: 'sanity_check_failed' }
  | { ok: true; count: number }
  | { ok: false; error: string }

/**
 * Baixa um feed público (RSS/Atom/JSON Feed) com axios, interpreta imagens e atualiza o cache.
 * O banco só é limpo e reescrito após passar no sanity check (≥1 imagem válida).
 */
export async function fetchAndCacheInstagramPosts(): Promise<InstagramSyncResult> {
  const url = resolveFeedUrl()
  if (!url) {
    return { ok: true, count: 0, skipped: true, reason: 'no_feed_url' }
  }

  let body: string
  try {
    body = await fetchFeedText(url)
  } catch (e) {
    const message =
      e instanceof AxiosError
        ? `HTTP ${e.response?.status ?? '—'}: ${e.message}`
        : e instanceof Error
          ? e.message
          : String(e)
    return { ok: false, error: message }
  }

  const rows = parseFeedBody(body)

  const deduped = dedupeRowsById(rows)

  if (!passesFeedSanityCheck(deduped)) {
    return { ok: true, count: 0, skipped: true, reason: 'sanity_check_failed' }
  }

  try {
    await prisma.$transaction([
      prisma.instagramPost.deleteMany(),
      prisma.instagramPost.createMany({ data: deduped }),
    ])
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, error: message }
  }

  return { ok: true, count: deduped.length }
}

function dedupeRowsById(rows: CacheRow[]): CacheRow[] {
  const seen = new Set<string>()
  const out: CacheRow[] = []
  for (const r of rows) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    out.push(r)
  }
  return out
}
