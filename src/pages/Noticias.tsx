import './Noticias.css'

const news = [
  {
    date: '28 Mar 2026',
    color: 'yellow',
    emoji: '🍱',
    category: 'Saída',
    title: 'Saída de março: 80 marmitas entregues no centro de SP',
    excerpt: 'Com um time de 25 voluntários, o Rango de Rua realizou mais uma saída especial com marmitas de frango ao molho e kits de higiene.',
  },
  {
    date: '15 Mar 2026',
    color: 'orange',
    emoji: '📦',
    category: 'Arrecadação',
    title: 'Mutirão do Bem: 300kg de alimentos arrecadados',
    excerpt: 'O Mutirão do Bem de março bateu recorde com a ajuda de 5 empresas parceiras que disponibilizaram pontos de coleta.',
  },
  {
    date: '1 Mar 2026',
    color: 'purple',
    emoji: '🎓',
    category: 'Formação',
    title: 'Nova turma de voluntários formada com 40 pessoas',
    excerpt: 'A Escola de Voluntários formou mais 40 pessoas prontas para atuar nas ruas com empatia, respeito e segurança.',
  },
  {
    date: '14 Fev 2026',
    color: 'pink',
    emoji: '❤️',
    category: 'Especial',
    title: 'Dia dos Namorados solidário: saída especial com 100 marmitas',
    excerpt: 'Em homenagem ao amor, realizamos uma saída especial com 100 marmitas e mensagens de carinho para as pessoas nas ruas.',
  },
  {
    date: '20 Jan 2026',
    color: 'blue',
    emoji: '🤝',
    category: 'Parceria',
    title: 'Nova parceria com Horta Viva garante ingredientes orgânicos',
    excerpt: 'Firmamos parceria com a Horta Viva para garantir vegetais frescos e orgânicos em todas as nossas marmitas a partir de fevereiro.',
  },
  {
    date: '5 Jan 2026',
    color: 'green',
    emoji: '🏆',
    category: 'Conquista',
    title: 'Rango de Rua completa 11 anos de atividades',
    excerpt: 'Começamos 2026 celebrando 11 anos de muita luta, amor e marmitas. Confira o resumo de tudo que realizamos em 2025.',
  },
]

export default function Noticias() {
  return (
    <>
      <section className="news-hero">
        <div className="news-hero__bg" aria-hidden />
        <div className="container news-hero__content">
          <span className="tag tag--green">📰 Notícias</span>
          <h1>O que está<br /><span className="news-highlight">acontecendo</span></h1>
          <p>Fique por dentro das nossas saídas, arrecadações, novidades e histórias.</p>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="news-grid">
            {news.map((n, i) => (
              <article className={`news-card news-card--${n.color}${i === 0 ? ' news-card--featured' : ''}`} key={n.title}>
                <div className={`news-card__thumb news-card__thumb--${n.color}`}>
                  <span>{n.emoji}</span>
                </div>
                <div className="news-card__body">
                  <div className="news-card__meta">
                    <span className={`tag tag--${n.color}`}>{n.category}</span>
                    <time>{n.date}</time>
                  </div>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                  <button className="btn btn--outline" style={{ marginTop: 'auto', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    Ler mais →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="news-newsletter">
            <h2>Receba nossas novidades</h2>
            <p>Cadastre seu e-mail e saiba primeiro sobre as próximas saídas e ações do Rango de Rua.</p>
            <form className="news-newsletter__form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="seu@email.com" required />
              <button type="submit" className="btn btn--primary">Cadastrar</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
