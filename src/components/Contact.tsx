import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrate with contact form backend
    setSent(true)
  }

  return (
    <section id="contato" className="section section--surface">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--yellow">Fale conosco</span>
          <h2>Contato</h2>
          <div className="divider" />
          <p>Tem alguma dúvida, quer ser parceiro ou só quer mandar um oi? Estamos aqui!</p>
        </div>

        <div className="contact__layout">
          <div className="contact__channels">
            {[
              { label: 'WhatsApp', value: '(11) 99999-9999', color: 'green', href: 'https://wa.me/5511999999999' },
              { label: 'E-mail',   value: 'contato@rangoderua.org.br', color: 'blue', href: 'mailto:contato@rangoderua.org.br' },
              { label: 'Instagram', value: '@rangoderua', color: 'pink', href: 'https://www.instagram.com/rangoderua' },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className={`contact__channel contact__channel--${c.color}`}
              >
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </div>
              </a>
            ))}
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            {sent ? (
              <div className="contact__success">
                <h3>Mensagem enviada!</h3>
                <p>Obrigado pelo contato. Responderemos em breve!</p>
              </div>
            ) : (
              <>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="name">Nome</label>
                    <input id="name" name="name" type="text" placeholder="Seu nome completo" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Assunto</label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="" disabled>Selecione o assunto</option>
                    <option value="voluntario">Quero ser voluntário</option>
                    <option value="doacao">Fazer uma doação</option>
                    <option value="parceria">Proposta de parceria</option>
                    <option value="imprensa">Imprensa / Mídia</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensagem</label>
                  <textarea id="message" name="message" placeholder="Escreva sua mensagem..." value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn--primary">
                  Enviar mensagem
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
