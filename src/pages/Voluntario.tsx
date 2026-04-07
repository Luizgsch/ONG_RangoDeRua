import { useState } from 'react'
import './Voluntario.css'

const steps = [
  { icon: '📋', title: 'Preencha o formulário', desc: 'Nos conte um pouco sobre você, sua disponibilidade e motivação.' },
  { icon: '📞', title: 'Entraremos em contato', desc: 'Nossa equipe de voluntariado vai analisar seu perfil e fazer o contato.' },
  { icon: '🎓', title: 'Formação gratuita', desc: 'Você passará por uma capacitação humanizada antes da primeira saída.' },
  { icon: '🍱', title: 'Primeira saída', desc: 'Você já está pronto para ir às ruas e transformar vidas!' },
]

const faqs = [
  { q: 'Preciso ter experiência?', a: 'Não! Aceitamos pessoas de todas as idades e perfis. O que importa é a vontade de ajudar.' },
  { q: 'Qual a frequência de saídas?', a: 'Fazemos saídas duas vezes por mês, aos domingos. Você se compromete com a frequência que puder.' },
  { q: 'Tem custo para ser voluntário?', a: 'Não. O voluntariado é 100% gratuito e você ainda recebe capacitação.' },
  { q: 'E se eu quiser ajudar de outra forma?', a: 'Temos frentes de comunicação, captação, gestão e mais. Mencione no formulário seu interesse!' },
]

export default function Voluntario() {
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', age: '', availability: '', motivation: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrate with volunteer management system
    setSent(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="vol-hero">
        <div className="vol-hero__bg" aria-hidden />
        <div className="container vol-hero__content">
          <span className="tag tag--yellow">🙌 Voluntariado</span>
          <h1>Faça parte do<br /><span className="hero__highlight">Rango de Rua</span></h1>
          <p>Junte-se a mais de 200 voluntários que já transformaram vidas. É gratuito, é formativo, é amor em ação.</p>
        </div>
      </section>

      {/* Steps */}
      <section className="section section--surface">
        <div className="container">
          <div className="section-header">
            <span className="tag tag--green">Como funciona</span>
            <h2>4 passos para se tornar voluntário</h2>
            <div className="divider" style={{ background: 'var(--clr-green)' }} />
          </div>
          <div className="vol-steps">
            {steps.map((s, i) => (
              <div className="vol-step" key={s.title}>
                <div className="vol-step__num">{i + 1}</div>
                <span className="vol-step__icon">{s.icon}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section section--dark">
        <div className="container">
          <div className="vol-form-layout">
            <div className="vol-form-side">
              <h2>Quero ser voluntário</h2>
              <p>Preencha o formulário e nossa equipe entrará em contato para dar os próximos passos.</p>
              <div className="vol-highlights">
                {['100% gratuito', 'Formação incluída', 'Flexibilidade de horário', 'Comunidade incrível'].map(h => (
                  <div key={h} className="vol-highlight"><span>✅</span> {h}</div>
                ))}
              </div>
            </div>

            <div className="vol-form-box">
              {sent ? (
                <div className="contact__success">
                  <span>🎉</span>
                  <h3>Incrível! Inscrição recebida!</h3>
                  <p>Obrigado! Nossa equipe vai entrar em contato em até 5 dias úteis.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="vol-form">
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="v-name">Nome completo</label>
                      <input id="v-name" name="name" type="text" placeholder="Seu nome" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="v-age">Idade</label>
                      <input id="v-age" name="age" type="number" placeholder="Ex: 25" min="16" max="99" value={form.age} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="v-email">E-mail</label>
                      <input id="v-email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="v-phone">WhatsApp</label>
                      <input id="v-phone" name="phone" type="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="v-city">Cidade / Bairro</label>
                      <input id="v-city" name="city" type="text" placeholder="Ex: São Paulo – Centro" value={form.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="v-avail">Disponibilidade</label>
                      <select id="v-avail" name="availability" value={form.availability} onChange={handleChange} required>
                        <option value="" disabled>Selecione</option>
                        <option value="1x-mes">1x por mês</option>
                        <option value="2x-mes">2x por mês (todas as saídas)</option>
                        <option value="eventual">Eventual</option>
                        <option value="remoto">Só online / remoto</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="v-motivation">Por que quer ser voluntário?</label>
                    <textarea id="v-motivation" name="motivation" placeholder="Conte um pouco sobre você e sua motivação..." value={form.motivation} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%', justifyContent: 'center' }}>
                    Enviar inscrição
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--surface">
        <div className="container vol-faq-container">
          <div className="section-header">
            <span className="tag tag--purple">Dúvidas</span>
            <h2>Perguntas frequentes</h2>
            <div className="divider" style={{ background: 'var(--clr-purple)' }} />
          </div>
          <div className="vol-faq">
            {faqs.map((f, i) => (
              <div className="vol-faq__item" key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="vol-faq__q">
                  <span>{f.q}</span>
                  <span className={`vol-faq__arrow${openFaq === i ? ' vol-faq__arrow--open' : ''}`}>▼</span>
                </div>
                {openFaq === i && <p className="vol-faq__a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
