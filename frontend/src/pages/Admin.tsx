import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../config/api'
import './Admin.css'

const AUTH_JWT_KEY = 'rango_admin_jwt'

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

function getStoredToken(): string | null {
  return sessionStorage.getItem(AUTH_JWT_KEY)
}

function setStoredToken(token: string) {
  sessionStorage.setItem(AUTH_JWT_KEY, token)
}

function clearStoredToken() {
  sessionStorage.removeItem(AUTH_JWT_KEY)
}

/**
 * Área /admin: login via POST /api/login (JWT); lista com GET /api/volunteers + Bearer.
 */
export default function Admin() {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const [volunteers, setVolunteers] = useState<VolunteerDto[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    let cancelled = false

    void (async () => {
      setLoading(true)
      setListError(null)
      try {
        const res = await fetch(`${API_BASE}/api/volunteers`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          clearStoredToken()
          if (!cancelled) {
            setToken(null)
            setListError('Sessão expirada ou token inválido. Entre novamente.')
          }
          return
        }
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erro ${res.status}`)
        }
        const data = (await res.json()) as VolunteerDto[]
        if (!cancelled) setVolunteers(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) {
          setListError(err instanceof Error ? err.message : 'Falha ao carregar voluntários.')
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

  function handleLogout() {
    clearStoredToken()
    setToken(null)
    setVolunteers([])
    setListError(null)
    setLoginError(null)
    setLoading(false)
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
          <h1>Voluntários cadastrados</h1>
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

        {!loading && !listError && volunteers.length === 0 && (
          <p className="admin-dashboard__status">Nenhum voluntário cadastrado ainda.</p>
        )}

        {volunteers.length > 0 && (
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
      </div>
    </section>
  )
}
