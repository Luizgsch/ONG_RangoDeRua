import { Link } from 'react-router-dom'
import './NextBatch.css'

// This section announces the next marmita distribution date
const nextDate = {
  day: '19',
  month: 'Abril',
  year: '2026',
  weekday: 'Domingo',
  time: '08h00',
  location: 'Centro – Curitiba, PR',
  spots: 12,
  totalSpots: 30,
}

export default function NextBatch() {
  const pct = Math.round((nextDate.spots / nextDate.totalSpots) * 100)

  return (
    <section id="proxima-leva" className="section section--surface">
      <div className="container">
        <div className="nextbatch">
          <div className="nextbatch__badge">
            <span className="tag tag--orange">🍱 Próxima saída</span>
          </div>

          <div className="nextbatch__main">
            <div className="nextbatch__date">
              <span className="nextbatch__day">{nextDate.day}</span>
              <div>
                <span className="nextbatch__month">{nextDate.month} {nextDate.year}</span>
                <span className="nextbatch__weekday">{nextDate.weekday}</span>
              </div>
            </div>

            <div className="nextbatch__divider" />

            <div className="nextbatch__info">
              <div className="nextbatch__detail">
                <span>⏰</span><strong>{nextDate.time}</strong>
              </div>
              <div className="nextbatch__detail">
                <span>📍</span><strong>{nextDate.location}</strong>
              </div>
              <div className="nextbatch__spots">
                <div className="nextbatch__spots-text">
                  <span>Vagas para voluntários</span>
                  <strong className="nextbatch__spots-num" style={{ color: pct > 70 ? 'var(--clr-red)' : 'var(--clr-green)' }}>
                    {nextDate.spots} / {nextDate.totalSpots} vagas
                  </strong>
                </div>
                <div className="nextbatch__bar">
                  <div
                    className="nextbatch__bar-fill"
                    style={{ width: `${pct}%`, background: pct > 70 ? 'var(--clr-orange)' : 'var(--clr-green)' }}
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
