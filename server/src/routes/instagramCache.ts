import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import type { InstagramPost } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { fetchAndCacheInstagramPosts } from '../services/instagramSync.js'

const postJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    imageUrl: { type: 'string' },
    permalink: { type: 'string' },
    caption: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'imageUrl', 'permalink', 'createdAt'],
} as const

const syncResponseSchema = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    count: { type: 'number' },
    skipped: { type: 'boolean' },
    reason: { type: 'string' },
    error: { type: 'string' },
  },
} as const

function syncAuthorized(secret: string | undefined, provided: string | undefined): boolean {
  if (!secret || secret.trim() === '') {
    return true
  }
  return provided === secret
}

function readSyncSecret(request: FastifyRequest): string | undefined {
  const h = request.headers['x-instagram-sync-secret']
  if (typeof h === 'string') {
    return h
  }
  const q = request.query as { secret?: string }
  if (typeof q?.secret === 'string') {
    return q.secret
  }
  return undefined
}

async function handleInstagramSync(request: FastifyRequest, reply: FastifyReply) {
  const secret = process.env.INSTAGRAM_SYNC_SECRET
  if (!syncAuthorized(secret, readSyncSecret(request))) {
    return reply.status(401).send({ error: 'Sync não autorizado.' })
  }

  const result = await fetchAndCacheInstagramPosts()

  if (!result.ok) {
    return reply.status(502).send({ ok: false, error: result.error })
  }

  if ('skipped' in result && result.skipped) {
    return { ok: true, count: 0, skipped: true, reason: result.reason }
  }

  return { ok: true, count: result.count }
}

const syncRouteSchema = {
  tags: ['Instagram'],
  summary: 'Atualizar cache do Instagram',
  description:
    'Baixa INSTAGRAM_FEED_URL (RSS/Atom/JSON Feed) e atualiza o cache. ' +
    'Só substitui o banco se houver pelo menos uma imagem válida (sanity check). ' +
    'GET disponível para teste no navegador. ' +
    'Se INSTAGRAM_SYNC_SECRET estiver definido: header X-Instagram-Sync-Secret ou query ?secret= (GET).',
  response: {
    200: syncResponseSchema,
    401: {
      type: 'object',
      properties: { error: { type: 'string' } },
      required: ['error'],
    },
    502: {
      type: 'object',
      properties: { ok: { type: 'boolean' }, error: { type: 'string' } },
      required: ['ok', 'error'],
    },
  },
} as const

export const instagramCacheRoutes: FastifyPluginAsync = async app => {
  app.get(
    '/api/instagram-cache',
    {
      schema: {
        tags: ['Instagram'],
        summary: 'Listar posts em cache',
        description:
          'Retorna os posts salvos no banco (cache). O site consome apenas este endpoint.',
        response: {
          200: {
            type: 'array',
            items: postJsonSchema,
          },
        },
      },
    },
    async () => {
      const rows = await prisma.instagramPost.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return rows.map((r: InstagramPost) => ({
        id: r.id,
        imageUrl: r.imageUrl,
        permalink: r.permalink,
        caption: r.caption,
        createdAt: r.createdAt.toISOString(),
      }))
    },
  )

  /** GET: mesmo comportamento do POST — útil para abrir no navegador durante os testes. */
  app.get(
    '/api/instagram-cache/sync',
    {
      schema: {
        ...syncRouteSchema,
        querystring: {
          type: 'object',
          properties: {
            secret: {
              type: 'string',
              description: 'Obrigatório se INSTAGRAM_SYNC_SECRET estiver definido (alternativa ao header).',
            },
          },
        },
      },
    },
    handleInstagramSync,
  )

  app.post(
    '/api/instagram-cache/sync',
    {
      schema: syncRouteSchema,
    },
    handleInstagramSync,
  )
}
