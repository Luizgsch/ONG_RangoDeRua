import { useState } from 'react'
import './Voluntario.css'

const steps = [
  { title: 'Preencha o formulário', desc: 'Nos conte um pouco sobre você, sua disponibilidade e motivação.' },
  { title: 'Entraremos em contato', desc: 'Nossa equipe de voluntariado vai analisar seu perfil e fazer o contato.' },
  { title: 'Formação gratuita', desc: 'Você passará por uma capacitação humanizada antes da primeira saída.' },
  { title: 'Primeira saída', desc: 'Você já está pronto para ir às ruas e transformar vidas!' },
]

const faqs = [
  { q: 'Preciso ter experiência?', a: 'Não! Aceitamos pessoas de todas as idades e perfis. O que importa é a vontade de ajudar.' },
  { q: 'Qual a frequência de saídas?', a: 'Fazemos saídas duas vezes por mês, aos domingos. Você se compromete com a frequência que puder.' },
  { q: 'Tem custo para ser voluntário?', a: 'Não. O voluntariado é 100% gratuito e você ainda recebe capacitação.' },
  { q: 'E se eu quiser ajudar de outra forma?', a: 'Temos frentes de comunicação, captação, gestão e mais. Mencione no formulário seu interesse!' },
]

const VOLUNTEERS_API = 'http://localhost:3333/api/volunteers'

export default function Voluntario() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({
    nome: '',
    idade: '',
    email: '',
    whatsApp: '',
    localidade: '',
    disponibilidade: '',
    motivacao: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSubmitError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    const body = {
      nome: form.nome,
      idade: Number(form.idade),
      email: form.email,
      whatsApp: form.whatsApp,
      localidade: form.localidade,
      disponibilidade: form.disponibilidade,
      motivacao: form.motivacao,
    }
    try {
      const res = await fetch(VOLUNTEERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const text = await res.text()
        let msg = text || `Erro ${res.status}`
        try {
          const j = JSON.parse(text) as { error?: string }
          if (typeof j?.error === 'string' && j.error) msg = j.error
        } catch {
          /* manter msg */
        }
        throw new Error(msg)
      }
      setSent(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível enviar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="vol-hero">
        <div className="vol-hero__bg" aria-hidden />
        <div className="container vol-hero__content">
          <span className="tag tag--yellow">Voluntariado</span>
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
                  <div key={h} className="vol-highlight"> {h}</div>
                ))}
              </div>
            </div>

            <div className="vol-form-box">
              {sent ? (
                <div className="contact__success">
                  <h3>Incrível! Inscrição recebida!</h3>
                  <p>Obrigado! Nossa equipe vai entrar em contato em até 5 dias úteis.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="vol-form">
                  {submitError && (
                    <p className="vol-form__error" role="alert">
                      {submitError}
                    </p>
                  )}
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="v-name">Nome completo</label>
                      <input id="v-name" name="nome" type="text" placeholder="Seu nome" value={form.nome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="v-age">Idade</label>
                      <input id="v-age" name="idade" type="number" placeholder="Ex: 25" min="16" max="99" value={form.idade} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="v-email">E-mail</label>
                      <input id="v-email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="v-phone">WhatsApp</label>
                      <input id="v-phone" name="whatsApp" type="tel" placeholder="(11) 99999-9999" value={form.whatsApp} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="v-city">Cidade / Bairro</label>
                      <input id="v-city" name="localidade" type="text" placeholder="Ex: São Paulo – Centro" value={form.localidade} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="v-avail">Disponibilidade</label>
                      <select id="v-avail" name="disponibilidade" value={form.disponibilidade} onChange={handleChange} required>
                        <option value="" disabled>Selecione</option>
                        <option value="ONCE_A_MONTH">1x por mês</option>
                        <option value="TWICE_A_MONTH">2x por mês (todas as saídas)</option>
                        <option value="EVENTUAL">Eventual</option>
                        <option value="REMOTE">Só online / remoto</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="v-motivation">Por que quer ser voluntário?</label>
                    <textarea id="v-motivation" name="motivacao" placeholder="Conte um pouco sobre você e sua motivação..." value={form.motivacao} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                    {submitting ? 'Enviando…' : 'Enviar inscrição'}
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
