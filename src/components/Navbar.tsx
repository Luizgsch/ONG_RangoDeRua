import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/Logo.jpg'
import { homeHashFragment } from '../homeHref'
import './Navbar.css'

const links: (
  | { kind: 'hash'; id: string; label: string }
  | { kind: 'route'; to: string; label: string }
)[] = [
  { kind: 'hash', id: 'sobre', label: 'Sobre' },
  { kind: 'hash', id: 'o-que-fazemos', label: 'O que fazemos' },
  { kind: 'hash', id: 'numeros', label: 'Números' },
  { kind: 'route', to: '/noticias', label: 'Notícias' },
  { kind: 'hash', id: 'contato', label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container flex-between navbar__inner">
        <Link to="/" className="navbar__brand">
          <img src={logo} alt="Rango de Rua" className="navbar__brand-logo" />
        </Link>

        <nav className={`navbar__nav${open ? ' navbar__nav--open' : ''}`}>
          {links.map(l =>
            l.kind === 'hash' ? (
              <a
                key={l.id}
                href={homeHashFragment(l.id)}
                className="navbar__link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                className="navbar__link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            )
          )}
          <NavLink to="/voluntario" className="btn btn--primary" onClick={() => setOpen(false)}>
            Seja voluntário
          </NavLink>
          <NavLink to="/doacoes" className="btn btn--orange" onClick={() => setOpen(false)}>
            Doe agora
          </NavLink>
        </nav>

        <button
          className={`navbar__burger${open ? ' navbar__burger--open' : ''}`}
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
