import './FrontLines.css'

const fronts = [
  {
    color: 'yellow',
    title: 'Frente de Alimentação',
    desc: 'Captação de ingredientes, preparo e entrega de marmitas nas saídas mensais.',
    tags: ['Marmitas', 'Nutrição', 'Logística'],
  },
  {
    color: 'blue',
    title: 'Frente de Higiene',
    desc: 'Montagem e distribuição de kits de higiene pessoal e materiais de limpeza.',
    tags: ['Kits', 'Saúde', 'Dignidade'],
  },
  {
    color: 'pink',
    title: 'Frente de Comunicação',
    desc: 'Gestão das redes sociais, criação de conteúdo e divulgação das ações da ONG.',
    tags: ['Instagram', 'Redes Sociais', 'Conteúdo'],
  },
  {
    color: 'green',
    title: 'Frente Financeira',
    desc: 'Captação de doações, gestão de recursos e transparência financeira.',
    tags: ['Doações', 'Gestão', 'Transparência'],
  },
  {
    color: 'orange',
    title: 'Frente de Parcerias',
    desc: 'Articulação com empresas, instituições e governos para ampliar o impacto.',
    tags: ['Parceiros', 'Empresas', 'Governo'],
  },
  {
    color: 'purple',
    title: 'Frente de Voluntariado',
    desc: 'Recrutamento, triagem, formação e gestão de voluntários ativos.',
    tags: ['Voluntários', 'Formação', 'Gestão'],
  },
]

export default function FrontLines() {
  return (
    <section id="frentes" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--blue">Organização</span>
          <h2>Frentes de atuação</h2>
          <div className="divider" style={{ background: 'var(--clr-blue)' }} />
          <p>Trabalhamos de forma organizada em frentes especializadas para maximizar nosso impacto.</p>
        </div>

        <div className="frontlines__grid">
          {fronts.map(f => (
            <div className={`frontlines__card frontlines__card--${f.color}`} key={f.title}>
              <div className={`frontlines__icon frontlines__icon--${f.color}`} />
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
              <div className="frontlines__tags">
                {f.tags.map(t => (
                  <span key={t} className={`tag tag--${f.color}`}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
