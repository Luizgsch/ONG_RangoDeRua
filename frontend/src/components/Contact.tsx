import './Contact.css'

const CHANNELS = [
  { label: 'E-mail', value: 'contato@rangoderua.org.br', color: 'blue', href: 'mailto:contato@rangoderua.org.br' },
  { label: 'WhatsApp', value: '(11) 99999-9999', color: 'green', href: 'https://wa.me/5511999999999' },
  { label: 'Instagram', value: '@rangoderua', color: 'pink', href: 'https://www.instagram.com/rangoderua' },
] as const

export default function Contact() {
  return (
    <section id="contato" className="section section--surface">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--yellow">Fale conosco</span>
          <h2>Contato</h2>
          <div className="divider" />
          <p>Tem alguma dúvida, quer ser parceiro ou só quer mandar um oi? Estamos aqui!</p>
        </div>

        <div className="contact__channels-wrap">
          {CHANNELS.map(c => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className={`contact__channel contact__channel--${c.color}`}
            >
              <strong>{c.label}</strong>
              <span>{c.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
