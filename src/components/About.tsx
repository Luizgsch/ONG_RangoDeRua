import './About.css'

const values = [
  { icon: '❤️', color: 'red',    title: 'Amor',       desc: 'Cada marmita carrega afeto e respeito pela dignidade humana.' },
  { icon: '🤝', color: 'blue',   title: 'Solidariedade', desc: 'Acreditamos que juntos somos capazes de transformar realidades.' },
  { icon: '🌱', color: 'green',  title: 'Esperança',  desc: 'Plantamos sementes de mudança nas vidas que tocamos.' },
  { icon: '🔍', color: 'yellow', title: 'Transparência', desc: 'Prestamos contas a cada voluntário, doador e parceiro.' },
]

export default function About() {
  return (
    <section id="sobre" className="section section--surface">
      <div className="container">
        <div className="about__layout">
          <div className="about__text fade-up">
            <span className="tag tag--yellow">Nossa história</span>
            <h2>11 anos alimentando<br />quem mais precisa</h2>
            <p>
              O Rango de Rua nasceu em 2013 da vontade de um grupo de
              amigos em São Paulo que não conseguia fechar os olhos para
              a realidade das pessoas em situação de rua. O que começou
              como uma iniciativa de fim de semana se transformou em uma
              das maiores redes de voluntariado alimentar da cidade.
            </p>
            <p>
              Hoje, realizamos saídas duas vezes por mês, levando marmitas
              quentes e kits de higiene para quem mais precisa. Atuamos em
              diversos bairros de São Paulo, sempre com respeito, escuta e
              muito carinho.
            </p>
            <div className="about__mission-grid">
              {[
                { label: 'Missão',   color: 'orange', text: 'Levar alimentação, dignidade e acolhimento às pessoas em situação de vulnerabilidade social.' },
                { label: 'Visão',    color: 'purple', text: 'Um Brasil onde ninguém durma com fome ou sem ser visto como ser humano.' },
                { label: 'Propósito', color: 'green', text: 'Transformar realidades através do alimento, do afeto e da mobilização social.' },
              ].map(m => (
                <div className={`about__mission-card about__mission-card--${m.color}`} key={m.label}>
                  <strong>{m.label}</strong>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about__values fade-up">
            <h3>Nossos valores</h3>
            <div className="about__values-grid">
              {values.map(v => (
                <div className={`about__value-card`} key={v.title}>
                  <span className="about__value-icon">{v.icon}</span>
                  <strong>{v.title}</strong>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
