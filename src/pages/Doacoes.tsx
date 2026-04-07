import './Doacoes.css'

const donationOptions = [
  { amount: 'R$ 25', desc: 'Custeia 5 marmitas', color: 'yellow' },
  { amount: 'R$ 50', desc: 'Custeia um kit de higiene completo', color: 'orange' },
  { amount: 'R$ 100', desc: 'Ajuda a equipar uma saída', color: 'green' },
  { amount: 'R$ 250', desc: 'Patrocina uma saída completa', color: 'blue' },
]

export default function Doacoes() {
  return (
    <>
      {/* Hero */}
      <section className="don-hero">
        <div className="don-hero__bg" aria-hidden />
        <div className="container don-hero__content">
          <span className="tag tag--orange">Doações</span>
          <h1>Sua doação alimenta<br /><span className="don-highlight">vidas reais</span></h1>
          <p>Cada contribuição se transforma diretamente em marmitas quentes, kits de higiene e dignidade para quem mais precisa nas ruas.</p>
        </div>
      </section>

      {/* Options */}
      <section className="section section--surface">
        <div className="container">
          <div className="section-header">
            <span className="tag tag--yellow">Impacto direto</span>
            <h2>Escolha como ajudar</h2>
            <div className="divider" />
            <p>Cada valor abaixo representa um impacto real e concreto.</p>
          </div>
          <div className="don-options">
            {donationOptions.map(d => (
              <div className={`don-option don-option--${d.color}`} key={d.amount}>
                <strong className="don-option__amount">{d.amount}</strong>
                <span className="don-option__desc">{d.desc}</span>
                <button className={`btn btn--outline`} style={{ borderColor: `var(--clr-${d.color})`, color: `var(--clr-${d.color})` }}>
                  Doar {d.amount}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main donation CTA */}
      <section className="section section--dark">
        <div className="container">
          <div className="don-main">
            <div className="don-main__text">
              <span className="tag tag--orange">Doação monetária</span>
              <h2>Doe via PIX ou transferência</h2>
              <p>
                100% das doações são destinadas diretamente às nossas ações.
                Prestamos contas publicamente e com transparência total.
              </p>
              <div className="don-transparency">
                {['100% das doações vão às ações', 'Relatório anual público', 'CNPJ registrado', 'Nota fiscal disponível'].map(i => (
                  <span key={i} className="don-trust"> {i}</span>
                ))}
              </div>
            </div>
            <div className="don-pix-card">
              <h4>Chave PIX</h4>
              <div className="don-pix-key">
                <span>cnpj@rangoderua.org.br</span>
                <button
                  className="btn btn--outline"
                  onClick={() => navigator.clipboard.writeText('cnpj@rangoderua.org.br')}
                >
                  Copiar
                </button>
              </div>
              <p className="don-pix-note">Após o pagamento, guarde o comprovante. Você pode nos enviar por WhatsApp ou e-mail.</p>

              <div className="don-divider">ou</div>

              <h4>Transferência bancária</h4>
              <div className="don-bank">
                <div><strong>Banco:</strong> Nubank (260)</div>
                <div><strong>Agência:</strong> 0001</div>
                <div><strong>Conta:</strong> 00000000-0</div>
                <div><strong>CNPJ:</strong> XX.XXX.XXX/0001-XX</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Non-monetary */}
      <section className="section section--surface">
        <div className="container">
          <div className="section-header">
            <span className="tag tag--green">Outras formas</span>
            <h2>Doação de alimentos & itens</h2>
            <div className="divider" style={{ background: 'var(--clr-green)' }} />
            <p>Também recebemos doações de alimentos não-perecíveis, roupas e itens de higiene.</p>
          </div>
          <div className="don-items">
            {[
              { label: 'Alimentos não-perecíveis', color: 'yellow' },
              { label: 'Produtos de higiene pessoal', color: 'blue' },
              { label: 'Roupas em bom estado', color: 'orange' },
              { label: 'Itens de limpeza', color: 'green' },
            ].map(i => (
              <div className={`don-item don-item--${i.color}`} key={i.label}>
                <span>{i.label}</span>
              </div>
            ))}
          </div>
          <div className="don-items-contact">
            <p>Para agendar a entrega de doações físicas, entre em contato via WhatsApp:</p>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="btn btn--orange">
              (11) 99999-9999
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
