import './Programs.css'

const programs = [
  {
    color: 'yellow',
    emoji: '🍱',
    title: 'Rango nas Ruas',
    category: 'Programa próprio',
    desc: 'Nossa saída mensal de distribuição de marmitas, o coração do Rango de Rua. Voluntários se reúnem para cozinhar e depois sair às ruas.',
    frequency: '2x por mês',
  },
  {
    color: 'orange',
    emoji: '📦',
    title: 'Mutirão do Bem',
    category: 'Programa próprio',
    desc: 'Campanha de arrecadação de alimentos não-perecíveis, roupas e itens de higiene realizada em parceria com empresas e condomínios.',
    frequency: 'Mensal',
  },
  {
    color: 'purple',
    emoji: '🎓',
    title: 'Escola de Voluntários',
    category: 'Programa próprio',
    desc: 'Formação de novos voluntários com capacitação sobre abordagem humanizada, segurança e trabalho em equipe nas ruas.',
    frequency: 'Trimestral',
  },
  {
    color: 'blue',
    emoji: '🤝',
    title: 'Rede de Apoio SP',
    category: 'Programa em parceria',
    desc: 'Articulação entre ONGs e entidades assistenciais de São Paulo para troca de recursos, voluntários e informações sobre pontos de atendimento.',
    frequency: 'Contínuo',
  },
  {
    color: 'green',
    emoji: '🌱',
    title: 'Horta Solidária',
    category: 'Programa em parceria',
    desc: 'Projeto em parceria com hortas comunitárias que fornecem ingredientes frescos e orgânicos para as marmitas do Rango de Rua.',
    frequency: 'Contínuo',
  },
  {
    color: 'pink',
    emoji: '🎭',
    title: 'Arte & Rua',
    category: 'Programa em parceria',
    desc: 'Em conjunto com grupos de teatro e música, levamos arte, cultura e alegria para além da comida nas saídas às ruas.',
    frequency: 'Bimestral',
  },
]

export default function Programs() {
  return (
    <section id="programas" className="section section--surface">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--purple">Iniciativas</span>
          <h2>Programas & projetos</h2>
          <div className="divider" style={{ background: 'var(--clr-purple)' }} />
          <p>Atuamos com programas próprios e em parceria com outras organizações.</p>
        </div>

        <div className="programs__grid">
          {programs.map(p => (
            <div className={`programs__card programs__card--${p.color}`} key={p.title}>
              <div className="programs__card-header">
                <span className="programs__emoji">{p.emoji}</span>
                <span className={`tag tag--${p.color}`}>{p.category}</span>
              </div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <div className="programs__freq">
                <span>🗓 {p.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
