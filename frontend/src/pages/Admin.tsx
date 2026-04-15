import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ADMIN_MANUAL_POSTS_ENDPOINT,
  ADMIN_MANUAL_POSTS_ORDER_ENDPOINT,
  ADMIN_SETTINGS_ENDPOINT,
  API_BASE,
} from '../config/api'
import './Admin.css'

const AUTH_JWT_KEY = 'rango_admin_jwt'

const MAX_GALLERY = 6

export type VolunteerDto = {
  id: string
  nome: string
  idade: number | null
  email: string
  whatsApp: string | null
  localidade: string | null
  disponibilidade: string
  motivacao: string | null
}

export type ManualPostDto = {
  id: string
  imageUrl: string
  permalink: string
  sortOrder: number
  createdAt: string
}

function getStoredToken(): string | null {
  return sessionStorage.getItem(AUTH_JWT_KEY)
}

function setStoredToken(token: string) {
  sessionStorage.setItem(AUTH_JWT_KEY, token)
}

function clearStoredToken() {
  sessionStorage.removeItem(AUTH_JWT_KEY)
}

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function authJsonHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

function sortPostsByGalleryOrder(posts: ManualPostDto[]): ManualPostDto[] {
  return [...posts].sort((a, b) => {
    const so = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    if (so !== 0) return so
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * Área /admin: login (JWT), próximo encontro, galeria com upload e voluntários.
 */
export default function Admin() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const [volunteers, setVolunteers] = useState<VolunteerDto[]>([])
  const [manualPosts, setManualPosts] = useState<ManualPostDto[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  const [agendaDatetime, setAgendaDatetime] = useState('')
  const [agendaLocation, setAgendaLocation] = useState('')
  const [agendaSaving, setAgendaSaving] = useState(false)
  const [agendaFeedback, setAgendaFeedback] = useState<'idle' | 'success' | 'error'>('idle')
  const [agendaErrorMsg, setAgendaErrorMsg] = useState<string | null>(null)

  const [galleryFile, setGalleryFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [gallerySaving, setGallerySaving] = useState(false)
  const [galleryFeedback, setGalleryFeedback] = useState<'idle' | 'success' | 'error'>('idle')
  const [galleryErrorMsg, setGalleryErrorMsg] = useState<string | null>(null)
  const [galleryDraggingId, setGalleryDraggingId] = useState<string | null>(null)
  const [galleryReorderSaving, setGalleryReorderSaving] = useState(false)

  useEffect(() => {
    if (!galleryFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(galleryFile)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [galleryFile])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    void (async () => {
      setLoading(true)
      setListError(null)
      try {
        const [volRes, settingsRes, postsRes] = await Promise.all([
          fetch(`${API_BASE}/api/volunteers`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(ADMIN_SETTINGS_ENDPOINT),
          fetch(ADMIN_MANUAL_POSTS_ENDPOINT),
        ])

        if (volRes.status === 401) {
          clearStoredToken()
          if (!cancelled) {
            setToken(null)
            setListError('Sessão expirada ou token inválido. Entre novamente.')
          }
          return
        }
        if (!volRes.ok) {
          const text = await volRes.text()
          throw new Error(text || `Voluntários: erro ${volRes.status}`)
        }
        if (!settingsRes.ok) {
          throw new Error(`Configurações: erro ${settingsRes.status}`)
        }
        if (!postsRes.ok) {
          throw new Error(`Galeria: erro ${postsRes.status}`)
        }

        const volData = (await volRes.json()) as VolunteerDto[]
        const settingsData = (await settingsRes.json()) as {
          nextEventDate?: string | null
          eventLocation?: string | null
        }
        const postsData = (await postsRes.json()) as ManualPostDto[]

        if (!cancelled) {
          setVolunteers(Array.isArray(volData) ? volData : [])
          const nextIso = settingsData.nextEventDate ?? null
          setAgendaDatetime(nextIso ? toDatetimeLocalValue(nextIso) : '')
          setAgendaLocation(settingsData.eventLocation ?? '')
          setManualPosts(sortPostsByGalleryOrder(Array.isArray(postsData) ? postsData : []))
        }
      } catch (err) {
        if (!cancelled) {
          setListError(err instanceof Error ? err.message : 'Falha ao carregar o painel.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoginSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const text = await res.text()
      let msg = `Erro ${res.status}`
      try {
        const j = JSON.parse(text) as { token?: string; error?: string }
        if (res.ok && typeof j.token === 'string') {
          setStoredToken(j.token)
          setToken(j.token)
          setPassword('')
          return
        }
        if (typeof j.error === 'string' && j.error) msg = j.error
        else if (text) msg = text
      } catch {
        if (text) msg = text
      }
      if (res.status === 401) setLoginError('E-mail ou senha inválidos.')
      else setLoginError(msg)
    } catch {
      setLoginError('Não foi possível conectar ao servidor.')
    } finally {
      setLoginSubmitting(false)
    }
  }

  async function handleSaveAgenda(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setAgendaSaving(true)
    setAgendaFeedback('idle')
    setAgendaErrorMsg(null)
    try {
      const nextEventDate =
        agendaDatetime.trim() === '' ? null : new Date(agendaDatetime).toISOString()
      const res = await fetch(ADMIN_SETTINGS_ENDPOINT, {
        method: 'PUT',
        headers: authJsonHeaders(token),
        body: JSON.stringify({
          nextEventDate,
          eventLocation: agendaLocation.trim() === '' ? null : agendaLocation.trim(),
        }),
      })
      const text = await res.text()
      if (res.status === 401) {
        clearStoredToken()
        setToken(null)
        setListError('Sessão expirada. Entre novamente.')
        return
      }
      if (!res.ok) {
        let msg = text || `Erro ${res.status}`
        try {
          const j = JSON.parse(text) as { error?: string }
          if (j.error) msg = j.error
        } catch {
          /* keep msg */
        }
        setAgendaFeedback('error')
        setAgendaErrorMsg(msg)
        return
      }
      setAgendaFeedback('success')
      window.setTimeout(() => setAgendaFeedback('idle'), 2500)
    } catch {
      setAgendaFeedback('error')
      setAgendaErrorMsg('Não foi possível salvar.')
    } finally {
      setAgendaSaving(false)
    }
  }

  async function handleAddGalleryPost(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !galleryFile) return
    setGallerySaving(true)
    setGalleryFeedback('idle')
    setGalleryErrorMsg(null)
    try {
      const fd = new FormData()
      fd.append('image', galleryFile)
      const res = await fetch(ADMIN_MANUAL_POSTS_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const text = await res.text()
      if (res.status === 401) {
        clearStoredToken()
        setToken(null)
        setListError('Sessão expirada. Entre novamente.')
        return
      }
      if (!res.ok) {
        let msg = text || `Erro ${res.status}`
        try {
          const j = JSON.parse(text) as { error?: string }
          if (j.error) msg = j.error
        } catch {
          /* keep */
        }
        setGalleryFeedback('error')
        setGalleryErrorMsg(msg)
        return
      }
      const created = JSON.parse(text) as ManualPostDto
      setManualPosts(prev => sortPostsByGalleryOrder([...prev.filter(p => p.id !== created.id), created]))
      setGalleryFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setGalleryFeedback('success')
      window.setTimeout(() => setGalleryFeedback('idle'), 2500)
    } catch {
      setGalleryFeedback('error')
      setGalleryErrorMsg('Não foi possível enviar.')
    } finally {
      setGallerySaving(false)
    }
  }

  async function handleDeletePost(id: string) {
    if (!token) return
    setGalleryErrorMsg(null)
    try {
      const res = await fetch(`${ADMIN_MANUAL_POSTS_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        clearStoredToken()
        setToken(null)
        setListError('Sessão expirada. Entre novamente.')
        return
      }
      if (!res.ok && res.status !== 204) {
        const text = await res.text()
        let msg = text || `Erro ${res.status}`
        try {
          const j = JSON.parse(text) as { error?: string }
          if (j.error) msg = j.error
        } catch {
          /* keep */
        }
        setGalleryErrorMsg(msg)
        return
      }
      setGalleryErrorMsg(null)
      setManualPosts(prev => prev.filter(p => p.id !== id))
    } catch {
      setGalleryErrorMsg('Falha ao excluir.')
    }
  }

  async function reloadGalleryPosts() {
    if (!token) return
    try {
      const res = await fetch(ADMIN_MANUAL_POSTS_ENDPOINT)
      if (!res.ok) return
      const postsData = (await res.json()) as ManualPostDto[]
      setManualPosts(sortPostsByGalleryOrder(Array.isArray(postsData) ? postsData : []))
    } catch {
      /* ignorado */
    }
  }

  async function persistGalleryOrder(orderedIds: string[]) {
    if (!token || orderedIds.length === 0) return
    setGalleryReorderSaving(true)
    setGalleryErrorMsg(null)
    try {
      const res = await fetch(ADMIN_MANUAL_POSTS_ORDER_ENDPOINT, {
        method: 'PUT',
        headers: authJsonHeaders(token),
        body: JSON.stringify({ ids: orderedIds }),
      })
      if (res.status === 401) {
        clearStoredToken()
        setToken(null)
        setListError('Sessão expirada. Entre novamente.')
        return
      }
      if (!res.ok && res.status !== 204) {
        const text = await res.text()
        let msg = text || `Erro ${res.status}`
        try {
          const j = JSON.parse(text) as { error?: string }
          if (j.error) msg = j.error
        } catch {
          /* keep */
        }
        setGalleryErrorMsg(msg)
        await reloadGalleryPosts()
        return
      }
      if (res.status === 204) {
        setManualPosts(prev => {
          const byId = new Map(prev.map(p => [p.id, p]))
          return orderedIds.map((id, i) => {
            const p = byId.get(id)
            if (!p) return null
            return { ...p, sortOrder: i }
          }).filter((x): x is ManualPostDto => x !== null)
        })
      }
    } catch {
      setGalleryErrorMsg('Não foi possível salvar a ordem.')
      await reloadGalleryPosts()
    } finally {
      setGalleryReorderSaving(false)
    }
  }

  function handleGalleryDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleGalleryDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')
    if (!draggedId || draggedId === targetId) return
    setManualPosts(prev => {
      const from = prev.findIndex(p => p.id === draggedId)
      const to = prev.findIndex(p => p.id === targetId)
      if (from < 0 || to < 0 || from === to) return prev
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      const ids = next.map(p => p.id)
      queueMicrotask(() => {
        void persistGalleryOrder(ids)
      })
      return next
    })
  }

  function handleLogout() {
    clearStoredToken()
    setToken(null)
    setVolunteers([])
    setManualPosts([])
    setListError(null)
    setLoginError(null)
    setLoading(false)
    setGalleryFile(null)
    navigate('/', { replace: true })
  }

  if (!token) {
    return (
      <section className="admin-login section section--dark">
        <div className="container admin-login__box">
          <h1>Painel da equipe</h1>
          <p className="admin-login__hint">
            Acesso exclusivo para administradores. Use o <strong>e-mail institucional</strong> cadastrado e a{' '}
            <strong>senha de acesso</strong> fornecida pela equipe técnica.
          </p>
          <form className="vol-form" onSubmit={handleLogin}>
            {loginError && (
              <p className="admin-login__error" role="alert">
                {loginError}
              </p>
            )}
            <div className="form-group">
              <label htmlFor="admin-email">E-mail do administrador</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="ex.: gestao@suaong.org.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-pass">Senha de acesso</label>
              <input
                id="admin-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Senha definida no servidor"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loginSubmitting}
            >
              {loginSubmitting ? 'Validando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-dashboard section section--dark">
      <div className="container">
        <div className="admin-dashboard__head">
          <h1>Painel administrativo</h1>
          <button type="button" className="btn btn--outline" onClick={handleLogout}>
            Sair
          </button>
        </div>

        {loading && <p className="admin-dashboard__status">Carregando…</p>}
        {listError && (
          <p className="admin-dashboard__error" role="alert">
            {listError}
          </p>
        )}

        {!loading && !listError && (
          <>
            <section className="admin-card" aria-labelledby="admin-next-event-title">
              <h2 id="admin-next-event-title">Próximo encontro</h2>
              <p className="admin-section__hint max-w-none">
                Salva na base e atualiza o banner da página inicial (próxima saída).
              </p>
              <form className="vol-form admin-section__form" onSubmit={handleSaveAgenda}>
                <div className="form-group">
                  <label htmlFor="admin-next-datetime">Data e hora</label>
                  <input
                    id="admin-next-datetime"
                    name="nextEvent"
                    type="datetime-local"
                    value={agendaDatetime}
                    onChange={e => setAgendaDatetime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="admin-event-location">Local (opcional)</label>
                  <input
                    id="admin-event-location"
                    name="eventLocation"
                    type="text"
                    placeholder="Ex.: Centro – Curitiba, PR"
                    value={agendaLocation}
                    onChange={e => setAgendaLocation(e.target.value)}
                  />
                </div>
                <div className="admin-section__actions">
                  <button type="submit" className="btn btn--primary" disabled={agendaSaving}>
                    {agendaSaving ? 'Salvando…' : 'Salvar'}
                  </button>
                  {agendaFeedback === 'success' && (
                    <span className="admin-feedback-success" role="status">
                      Sucesso
                    </span>
                  )}
                  {agendaFeedback === 'error' && agendaErrorMsg && (
                    <span className="admin-feedback-error" role="alert">
                      {agendaErrorMsg}
                    </span>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-section" aria-labelledby="admin-gallery-title">
              <h2 id="admin-gallery-title">Galeria (substitui o feed no site)</h2>
              <p className="admin-section__hint max-w-none">
                Envie uma imagem (máx. 8 MB). Com 6 fotos, a mais antiga é removida automaticamente. No site, o clique
                na foto leva ao perfil @rangoderua no Instagram. <strong>Arraste as fotos</strong> abaixo para definir a
                ordem em que aparecem na home.
              </p>
              <p className="admin-section__count">
                {manualPosts.length} / {MAX_GALLERY} fotos
              </p>
              <form className="vol-form admin-section__form" onSubmit={handleAddGalleryPost}>
                <div className="form-group">
                  <label htmlFor="admin-gi-file">Imagem</label>
                  <input
                    ref={fileInputRef}
                    id="admin-gi-file"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={e => {
                      const f = e.target.files?.[0] ?? null
                      setGalleryFile(f)
                    }}
                  />
                </div>
                {previewUrl && (
                  <div className="admin-upload-preview">
                    <span className="admin-section__hint">Pré-visualização</span>
                    <img src={previewUrl} alt="" className="admin-upload-preview__img" />
                  </div>
                )}
                <div className="admin-section__actions">
                  <button type="submit" className="btn btn--primary" disabled={gallerySaving || !galleryFile}>
                    {gallerySaving ? 'Enviando…' : 'Enviar foto'}
                  </button>
                  {galleryFeedback === 'success' && (
                    <span className="admin-feedback-success" role="status">
                      Sucesso
                    </span>
                  )}
                  {galleryFeedback === 'error' && galleryErrorMsg && (
                    <span className="admin-feedback-error" role="alert">
                      {galleryErrorMsg}
                    </span>
                  )}
                </div>
              </form>

              {manualPosts.length > 0 && (
                <>
                  <p className="admin-gallery-dnd-hint" role="note">
                    Dica: segure e arraste um card sobre outro para reordenar. A ordem da esquerda para a direita é a
                    mesma do site.
                  </p>
                  <ul className="admin-gallery-grid" aria-label="Fotos da galeria (arraste para reordenar)">
                    {manualPosts.map(p => (
                      <li
                        key={p.id}
                        className={`admin-gallery-card${galleryDraggingId === p.id ? ' admin-gallery-card--dragging' : ''}`}
                        draggable
                        onDragStart={e => {
                          e.dataTransfer.setData('text/plain', p.id)
                          e.dataTransfer.effectAllowed = 'move'
                          setGalleryDraggingId(p.id)
                        }}
                        onDragEnd={() => setGalleryDraggingId(null)}
                        onDragOver={handleGalleryDragOver}
                        onDrop={e => handleGalleryDrop(e, p.id)}
                      >
                        <span className="admin-gallery-card__handle" aria-hidden>
                          ⋮⋮
                        </span>
                        <a
                          href={p.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-gallery-card__img-wrap"
                          draggable={false}
                        >
                          <img src={p.imageUrl} alt="" draggable={false} />
                        </a>
                        <div className="admin-gallery-card__body">
                          <span className="admin-gallery-card__date">
                            {new Date(p.createdAt).toLocaleString('pt-BR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                          <a className="admin-gallery-card__link" href={p.permalink} target="_blank" rel="noopener noreferrer">
                            Ver no Instagram
                          </a>
                          <button type="button" className="btn btn--outline admin-gallery-delete" onClick={() => void handleDeletePost(p.id)}>
                            Excluir
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {galleryReorderSaving && (
                    <p className="admin-gallery-reorder-status" role="status">
                      Salvando ordem…
                    </p>
                  )}
                </>
              )}
              {galleryErrorMsg != null && galleryFeedback === 'idle' && (
                <p className="admin-feedback-error admin-section__foot" role="alert">
                  {galleryErrorMsg}
                </p>
              )}
            </section>

            <section className="admin-section" aria-labelledby="admin-vol-title">
              <h2 id="admin-vol-title">Voluntários cadastrados</h2>
              {volunteers.length === 0 ? (
                <p className="admin-dashboard__status">Nenhum voluntário cadastrado ainda.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>E-mail</th>
                        <th>WhatsApp</th>
                        <th>Localidade</th>
                        <th>Disponibilidade</th>
                        <th>Motivação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.map(v => (
                        <tr key={v.id}>
                          <td>{v.nome}</td>
                          <td>{v.idade ?? '—'}</td>
                          <td>{v.email}</td>
                          <td>{v.whatsApp ?? '—'}</td>
                          <td>{v.localidade ?? '—'}</td>
                          <td>{v.disponibilidade}</td>
                          <td className="admin-table__motivacao">{v.motivacao ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  )
}
