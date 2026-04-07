import './Partners.css'

const investors = [
  { name: 'Empresa Alpha',   emoji: '🏢', color: 'yellow' },
  { name: 'Beta Indústrias', emoji: '🏭', color: 'blue'   },
  { name: 'Gamma Corp',      emoji: '💼', color: 'green'  },
  { name: 'Delta Soluções',  emoji: '⚙️', color: 'orange' },
]

const partners = [
  { name: 'Banco de Alimentos SP', emoji: '🥫', type: 'Parceiro' },
  { name: 'Prefeitura de SP',      emoji: '🏛️', type: 'Governo'  },
  { name: 'Igreja Matriz Centro',  emoji: '⛪', type: 'Parceiro' },
  { name: 'SESC SP',               emoji: '🎭', type: 'Parceiro' },
  { name: 'CRAS Central',          emoji: '🏥', type: 'Governo'  },
  { name: 'Horta Viva',            emoji: '🌱', type: 'Parceiro' },
]

export default function Partners() {
  return (
    <section id="parceiros" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--green">Quem nos apoia</span>
          <h2>Parceiros & investidores</h2>
          <div className="divider" style={{ background: 'var(--clr-green)' }} />
          <p>Juntos somos mais fortes. Conheça quem acredita no nosso trabalho.</p>
        </div>

        <div className="partners__block">
          <h3>Empresas investidoras</h3>
          <div className="partners__investors">
            {investors.map(i => (
              <div className={`partners__investor partners__investor--${i.color}`} key={i.name}>
                <span>{i.emoji}</span>
                <span>{i.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="partners__block" style={{ marginTop: '3rem' }}>
          <h3>Parceiros estratégicos</h3>
          <div className="partners__grid">
            {partners.map(p => (
              <div className="partners__card" key={p.name}>
                <span className="partners__emoji">{p.emoji}</span>
                <div>
                  <strong>{p.name}</strong>
                  <span className={`tag tag--${p.type === 'Governo' ? 'blue' : 'green'}`} style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>{p.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="partners__cta">
          <p>Sua empresa também pode fazer parte dessa história.</p>
          <a href="/#contato" className="btn btn--outline">Quero ser parceiro</a>
        </div>
      </div>
    </section>
  )
}
