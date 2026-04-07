import { Link } from 'react-router-dom'
import { homeHashFragment } from '../homeHref'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg-grid" aria-hidden />
      <div className="container hero__content fade-up">
        <div className="hero__tag-row">
          <span className="tag tag--yellow">13 anos de história</span>
          <span className="tag tag--orange">Curitiba, PR</span>
        </div>

        <h1 className="hero__title">
          Cada marmita é um ato<br />
          <span className="hero__highlight">de amor</span> e dignidade
        </h1>

        <p className="hero__desc">
          O Rango de Rua leva refeições quentes, cuidado e humanidade para
          pessoas em situação de rua. Faça parte dessa corrente de solidariedade.
        </p>

        <div className="hero__actions">
          <Link to="/voluntario" className="btn btn--primary btn--lg">
            Quero ser voluntário
          </Link>
          <Link to="/doacoes" className="btn btn--orange btn--lg">
            Fazer doação
          </Link>
          <a href={homeHashFragment('sobre')} className="btn btn--secondary btn--lg">
            Conhecer a ONG
          </a>
        </div>

        <div className="hero__stats">
          {[
            { value: '+50.000', label: 'marmitas entregues' },
            { value: '13 anos', label: 'de atuação' },
            { value: '+200',   label: 'voluntários formados' },
            { value: '2x/mês', label: 'levadas nas ruas' },
          ].map(s => (
            <div className="hero__stat" key={s.label}>
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__wave" aria-hidden>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="#1a1a1a"/>
        </svg>
      </div>
    </section>
  )
}
