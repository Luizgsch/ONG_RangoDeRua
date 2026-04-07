import './Awards.css'

const awards = [
  {
    year: '2023',
    color: 'yellow',
    title: 'Prêmio Voluntário Nacional',
    org: 'Ministério da Cidadania',
    desc: 'Reconhecimento pelo impacto no voluntariado alimentar urbano.',
    icon: '🏆',
  },
  {
    year: '2021',
    color: 'orange',
    title: 'Top 10 ONGs do PR',
    org: 'Associação Paranaense de ONGs',
    desc: 'Selecionados entre as 10 organizações com maior impacto social no Paraná.',
    icon: '🥇',
  },
  {
    year: '2020',
    color: 'blue',
    title: 'Reconhecimento Câmara Municipal',
    org: 'Câmara Municipal de Curitiba',
    desc: 'Moção de aplausos pelos serviços prestados durante a pandemia.',
    icon: '🏛️',
  },
  {
    year: '2018',
    color: 'green',
    title: 'Seleção Redes da Maré',
    org: 'Instituto Redes da Maré',
    desc: 'Projeto selecionado para programa de aceleração de organizações sociais.',
    icon: '🌱',
  },
]

export default function Awards() {
  return (
    <section id="premios" className="section section--surface">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--yellow">Reconhecimentos</span>
          <h2>Prêmios & conquistas</h2>
          <div className="divider" />
          <p>Nosso trabalho tem sido reconhecido por instituições de todo o Brasil.</p>
        </div>

        <div className="awards__timeline">
          {awards.map((a, idx) => (
            <div className={`awards__item awards__item--${idx % 2 === 0 ? 'left' : 'right'}`} key={a.title}>
              <div className={`awards__year awards__year--${a.color}`}>{a.year}</div>
              <div className={`awards__card awards__card--${a.color}`}>
                <span className="awards__icon">{a.icon}</span>
                <div>
                  <h4>{a.title}</h4>
                  <span className={`tag tag--${a.color}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{a.org}</span>
                  <p>{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
