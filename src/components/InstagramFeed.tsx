import './InstagramFeed.css'

// Placeholder posts – will be replaced with real Instagram API integration
const posts = [
  { id: 1, emoji: '🍱', caption: 'Mais uma saída incrível! 50 marmitas entregues no centro de SP com muito amor ❤️', likes: 342, color: 'yellow' },
  { id: 2, emoji: '🤝', caption: 'Novos voluntários chegando! Bem-vindos à família Rango de Rua 🙌', likes: 218, color: 'orange' },
  { id: 3, emoji: '🌱', caption: 'Parceria com a Horta Viva: ingredientes frescos nas nossas marmitas 🥦', likes: 195, color: 'green' },
  { id: 4, emoji: '📦', caption: 'Arrecadação do Mutirão do Bem: 200kg de alimentos recolhidos! 📦', likes: 401, color: 'blue' },
  { id: 5, emoji: '🎓', caption: 'Formação de voluntários: aprendendo a abordar com empatia e respeito 💛', likes: 287, color: 'purple' },
  { id: 6, emoji: '❤️', caption: 'A recompensa de cada saída é o sorriso de quem recebe. Obrigado a todos!', likes: 524, color: 'pink' },
]

export default function InstagramFeed() {
  return (
    <section id="instagram" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--pink">Redes sociais</span>
          <h2>
            <svg className="ig-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--clr-pink)' }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
            Nos siga no Instagram
          </h2>
          <div className="divider" style={{ background: 'var(--clr-pink)' }} />
          <p>Acompanhe nossas ações, histórias e saídas em tempo real.</p>
        </div>

        <div className="instagram__grid">
          {posts.map(p => (
            <a
              key={p.id}
              href="https://www.instagram.com/rangoderua"
              target="_blank"
              rel="noreferrer"
              className={`instagram__post instagram__post--${p.color}`}
            >
              <div className={`instagram__thumb instagram__thumb--${p.color}`}>
                <span>{p.emoji}</span>
              </div>
              <div className="instagram__info">
                <p>{p.caption}</p>
                <span className="instagram__likes">❤️ {p.likes}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="instagram__cta">
          <a
            href="https://www.instagram.com/rangoderua"
            target="_blank"
            rel="noreferrer"
            className="btn btn--outline"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
            @rangoderua
          </a>
        </div>
      </div>
    </section>
  )
}
