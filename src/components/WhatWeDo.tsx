import './WhatWeDo.css'

const items = [
  {
    color: 'yellow',
    title: 'Marmitas quentes',
    desc: 'Preparamos e distribuímos marmitas nutritivas para pessoas em situação de rua, com afeto e respeito.',
  },
  {
    color: 'blue',
    title: 'Kits de higiene',
    desc: 'Levamos itens essenciais de higiene pessoal para auxiliar no bem-estar e autoestima.',
  },
  {
    color: 'orange',
    title: 'Escuta ativa',
    desc: 'Mais do que comida, oferecemos tempo, conversa e presença humana para quem muitas vezes é invisível.',
  },
  {
    color: 'green',
    title: 'Arrecadação de alimentos',
    desc: 'Mobilizamos a comunidade para arrecadar alimentos não-perecíveis e itens de necessidade básica.',
  },
  {
    color: 'purple',
    title: 'Formação de voluntários',
    desc: 'Capacitamos cada voluntário para atuar com responsabilidade, empatia e segurança nas ruas.',
  },
  {
    color: 'pink',
    title: 'Conscientização',
    desc: 'Utilizamos as redes sociais para sensibilizar a sociedade sobre a realidade da população de rua.',
  },
]

export default function WhatWeDo() {
  return (
    <section id="o-que-fazemos" className="section section--surface">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--orange">O que fazemos</span>
          <h2>Ação que transforma</h2>
          <div className="divider" style={{ background: 'var(--clr-orange)' }} />
          <p>Nosso trabalho vai muito além da distribuição de marmitas.</p>
        </div>

        <div className="whatwedo__grid">
          {items.map(i => (
            <div className={`whatwedo__card whatwedo__card--${i.color}`} key={i.title}>
              <h4>{i.title}</h4>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
