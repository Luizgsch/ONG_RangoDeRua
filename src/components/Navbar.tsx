import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/#sobre',     label: 'Sobre' },
  { to: '/#o-que-fazemos', label: 'O que fazemos' },
  { to: '/#numeros',   label: 'Números' },
  { to: '/noticias',   label: 'Notícias' },
  { to: '/#contato',   label: 'Contato' },
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
          <span className="navbar__brand-icon">🍱</span>
          <span>Rango<strong>de Rua</strong></span>
        </Link>

        <nav className={`navbar__nav${open ? ' navbar__nav--open' : ''}`}>
          {links.map(l => (
            <a key={l.to} href={l.to} className="navbar__link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
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
