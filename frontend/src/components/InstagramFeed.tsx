import { useEffect, useState } from 'react'
import { ADMIN_MANUAL_POSTS_ENDPOINT } from '../config/api'

const INSTAGRAM_PROFILE = 'https://www.instagram.com/rangoderua'

type ManualGalleryPost = {
  id: string
  imageUrl: string
  permalink: string
  createdAt: string
  sortOrder?: number
}

const SKELETON_COUNT = 6

const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4'

export default function InstagramFeed() {
  const [posts, setPosts] = useState<ManualGalleryPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(ADMIN_MANUAL_POSTS_ENDPOINT)
        if (!res.ok) {
          throw new Error(`Erro ${res.status}`)
        }
        const data = (await res.json()) as ManualGalleryPost[]
        if (!cancelled) {
          const list = Array.isArray(data) ? [...data] : []
          list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          setPosts(list)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Não foi possível carregar o feed.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="instagram" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--pink">Redes sociais</span>
          <h2>
            <svg
              className="ig-icon"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--clr-pink)' }}
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            Nos siga no Instagram
          </h2>
          <div className="divider" style={{ background: 'var(--clr-pink)' }} />
          <p>Acompanhe nossas ações, histórias e saídas em tempo real.</p>
        </div>

        {loading && (
          <div
            className={GRID_CLASS}
            role="status"
            aria-busy="true"
            aria-label="Carregando publicações do Instagram"
          >
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div key={i} className="min-h-0 min-w-0">
                <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-600/70 ring-1 ring-white/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p
            className="mb-6 text-center text-sm text-orange-400 sm:text-base"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-zinc-900/40 px-6 py-10 text-center">
            <p className="mb-4 max-w-none text-base text-zinc-200">
              Ainda não há fotos no mural por aqui — mas no Instagram a ONG compartilha o dia a dia,
              eventos e quem faz o Rango de Rua acontecer.
            </p>
            <p className="mb-6 max-w-none text-sm text-zinc-400">
              Siga a gente para não perder nenhuma novidade.
            </p>
            <a
              href={INSTAGRAM_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline inline-flex items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              Seguir @rangoderua
            </a>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className={GRID_CLASS}>
            {posts.map(p => (
              <a
                key={p.id}
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                title="Abrir no Instagram"
              >
                <div className="relative w-full max-w-full overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-[1.02] group-hover:ring-pink-400/40">
                  <img
                    src={p.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline inline-flex items-center gap-2"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            @rangoderua
          </a>
        </div>
      </div>
    </section>
  )
}
