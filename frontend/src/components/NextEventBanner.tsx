import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ADMIN_SETTINGS_ENDPOINT } from '../config/api'
import './NextBatch.css'

type Settings = {
  nextEventDate: string | null
  eventLocation: string | null
}

const TZ = 'America/Sao_Paulo'

const spots = 12
const totalSpots = 30

function formatEventParts(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const day = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, day: '2-digit' }).format(d)
  const monthRaw = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, month: 'long' }).format(d)
  const month = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1)
  const year = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, year: 'numeric' }).format(d)
  const weekdayRaw = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, weekday: 'long' }).format(d)
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1)
  const hm = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
  const time = hm.replace(':', 'h')
  return { day, month, year, weekday, time }
}

function parseEventMs(iso: string | null): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? null : t
}

export default function NextEventBanner() {
  const [settings, setSettings] = useState<Settings>({ nextEventDate: null, eventLocation: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(ADMIN_SETTINGS_ENDPOINT)
        if (!res.ok) throw new Error(`Erro ${res.status}`)
        const data = (await res.json()) as {
          nextEventDate?: string | null
          eventLocation?: string | null
        }
        if (!cancelled) {
          setSettings({
            nextEventDate: data.nextEventDate ?? null,
            eventLocation: data.eventLocation ?? null,
          })
        }
      } catch {
        if (!cancelled) {
          setSettings({ nextEventDate: null, eventLocation: null })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const eventMs = parseEventMs(settings.nextEventDate)
  const hasUpcoming = eventMs !== null && eventMs >= Date.now()
  const hasPassed = eventMs !== null && eventMs < now

  const parts = hasUpcoming ? formatEventParts(settings.nextEventDate) : null
  const locationLabel = settings.eventLocation?.trim() || 'A definir'
  const timeLabel = parts?.time ?? (hasPassed ? '—' : 'A definir')
  const pct = Math.round((spots / totalSpots) * 100)

  return (
    <section id="proxima-leva" className="section section--surface">
      <div className="container">
        <div className="nextbatch">
          <div className="nextbatch__badge">
            <span className="tag tag--orange">🍱 Próxima saída</span>
          </div>

          <div className="nextbatch__main">
            <div className="nextbatch__date">
              {loading ? (
                <>
                  <span className="nextbatch__day" aria-hidden>
                    …
                  </span>
                  <div>
                    <span className="nextbatch__month">Carregando…</span>
                  </div>
                </>
              ) : hasPassed ? (
                <>
                  <span className="nextbatch__day" aria-hidden>
                    —
                  </span>
                  <div>
                    <span className="nextbatch__month">Aguardando próxima data</span>
                    <span className="nextbatch__weekday">A equipe atualizará em breve</span>
                  </div>
                </>
              ) : parts ? (
                <>
                  <span className="nextbatch__day">{parts.day}</span>
                  <div>
                    <span className="nextbatch__month">
                      {parts.month} {parts.year}
                    </span>
                    <span className="nextbatch__weekday">{parts.weekday}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="nextbatch__day" aria-hidden>
                    —
                  </span>
                  <div>
                    <span className="nextbatch__month">A definir</span>
                    <span className="nextbatch__weekday">Data a confirmar pela equipe</span>
                  </div>
                </>
              )}
            </div>

            <div className="nextbatch__divider" />

            <div className="nextbatch__info">
              <div className="nextbatch__detail">
                <span>⏰</span>
                <strong>{timeLabel}</strong>
              </div>
              <div className="nextbatch__detail">
                <span>📍</span>
                <strong>{locationLabel}</strong>
              </div>
              <div className="nextbatch__spots">
                <div className="nextbatch__spots-text">
                  <span>Vagas para voluntários</span>
                  <strong
                    className="nextbatch__spots-num"
                    style={{ color: pct > 70 ? 'var(--clr-red)' : 'var(--clr-green)' }}
                  >
                    {spots} / {totalSpots} vagas
                  </strong>
                </div>
                <div className="nextbatch__bar">
                  <div
                    className="nextbatch__bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct > 70 ? 'var(--clr-orange)' : 'var(--clr-green)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="nextbatch__actions">
              <Link to="/voluntario" className="btn btn--primary btn--lg">
                Quero participar
              </Link>
              <p>Chegue com 30 min de antecedência</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
