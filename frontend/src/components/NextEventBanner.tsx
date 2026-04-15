import { Link } from 'react-router-dom'
import {
  formatEventParts,
  parseEventMs,
  useNextEventSettings,
} from '../hooks/useNextEventSettings'
import './NextBatch.css'

const spots = 12
const totalSpots = 30

export default function NextEventBanner() {
  const { settings, loading } = useNextEventSettings()

  const eventMs = parseEventMs(settings.nextEventDate)
  const hasUpcoming = eventMs !== null && eventMs >= Date.now()
  const hasPassed = eventMs !== null && eventMs < Date.now()

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
