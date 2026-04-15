import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/Logo.jpg'
import { homeHashFragment } from '../homeHref'
import './Navbar.css'

const links: { id: string; label: string }[] = [
  { id: 'proxima-leva', label: 'Próxima saída' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'o-que-fazemos', label: 'O que fazemos' },
  { id: 'numeros', label: 'Números' },
  { id: 'contato', label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const apply = () => {
      document.documentElement.style.setProperty('--site-header-offset', `${el.offsetHeight}px`)
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--site-header-offset')
    }
  }, [open, scrolled])

  return (
    <header ref={headerRef} className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container flex-between navbar__inner">
        <Link to="/" className="navbar__brand">
          <img src={logo} alt="Rango de Rua" className="navbar__brand-logo" />
        </Link>

        <nav className={`navbar__nav${open ? ' navbar__nav--open' : ''}`}>
          {links.map(l => (
            <a
              key={l.id}
              href={homeHashFragment(l.id)}
              className="navbar__link"
              onClick={() => setOpen(false)}
            >
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
