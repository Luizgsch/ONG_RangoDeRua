import './Numbers.css'

const stats = [
  { value: '+50.000', label: 'Marmitas entregues',     color: 'yellow' },
  { value: '+200',    label: 'Voluntários formados',    color: 'orange' },
  { value: '13',      label: 'Anos de atuação',         color: 'green'  },
  { value: '2x',      label: 'Saídas por mês',          color: 'blue'   },
  { value: '+30',     label: 'Parceiros e apoiadores',  color: 'purple' },
  { value: '+15',     label: 'Bairros atendidos no PR', color: 'pink'   },
]

export default function Numbers() {
  return (
    <section id="numeros" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--yellow">Nosso impacto</span>
          <h2>Números que<br />contam histórias</h2>
          <div className="divider" />
          <p>Cada número representa uma vida tocada, um sorriso devolvido.</p>
        </div>

        <div className="numbers__grid">
          {stats.map(s => (
            <div className={`numbers__card numbers__card--${s.color}`} key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
