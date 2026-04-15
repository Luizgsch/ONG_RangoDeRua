import './Doacoes.css'

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

      {/* Doação física — mesmo ritmo visual da área PIX */}
      <section className="section section--surface don-inkind">
        <div className="container">
          <div className="section-header">
            <span className="tag tag--green">Doação em espécie</span>
            <h2>Alimentos & itens</h2>
            <div className="divider" style={{ background: 'var(--clr-green)' }} />
            <p>
              Sua doação física vira marmita, kit de higiene e cuidado nas ruas. Aceitamos o que estiver em bom estado,
              dentro da validade e alinhado às nossas necessidades.
            </p>
          </div>

          <div className="don-inkind__main">
            <div className="don-inkind__left">
              <h3 className="don-inkind__subhead">O que recebemos</h3>
              <p className="don-inkind__lead">
                Itens que passam por triagem da equipe e seguem direto para as saídas ou estoque da ONG.
              </p>
              <div className="don-inkind__cards">
                {[
                  {
                    emoji: '🥫',
                    title: 'Alimentos não perecíveis',
                    desc: 'Enlatados, macarrão, arroz, feijão, óleo, açúcar, sal — embalagem fechada e legível.',
                    color: 'yellow',
                  },
                  {
                    emoji: '🧴',
                    title: 'Higiene pessoal',
                    desc: 'Sabonete, pasta de dente, escova, absorvente, papel higiênico, shampoo.',
                    color: 'blue',
                  },
                  {
                    emoji: '👕',
                    title: 'Roupas e agasalhos',
                    desc: 'Peças limpas, sem furos ou manchas; calçados firmes quando possível.',
                    color: 'orange',
                  },
                  {
                    emoji: '🧹',
                    title: 'Limpeza e utilidades',
                    desc: 'Detergente, água sanitária, sacos de lixo, panos de limpeza (preferir não aberto).',
                    color: 'green',
                  },
                ].map(i => (
                  <div className={`don-inkind__card don-inkind__card--${i.color}`} key={i.title}>
                    <span className="don-inkind__emoji" aria-hidden>
                      {i.emoji}
                    </span>
                    <h4>{i.title}</h4>
                    <p>{i.desc}</p>
                  </div>
                ))}
              </div>

              <div className="don-inkind__tips">
                <h3 className="don-inkind__subhead">Antes de levar</h3>
                <ul>
                  <li>Confira validade e lote; não aceitamos produtos vencidos.</li>
                  <li>Prefira embalagens originais fechadas para alimentos e higiene.</li>
                  <li>Combine data e local pelo WhatsApp — assim organizamos recebimento e estoque.</li>
                </ul>
              </div>
            </div>

            <aside className="don-inkind__aside" aria-labelledby="don-inkind-cta-title">
              <div className="don-inkind-card">
                <span className="tag tag--green">Próximo passo</span>
                <h3 id="don-inkind-cta-title">Agende a entrega</h3>
                <p className="don-inkind-card__intro">
                  Chame no WhatsApp informando o que deseja doar e a quantidade aproximada. Respondemos com horário e
                  ponto de entrega em Curitiba.
                </p>
                <a
                  href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20doar%20itens%20%28alimentos%2Froupas%2Fhigiene%29%20para%20o%20Rango%20de%20Rua."
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--orange don-inkind-card__btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Falar no WhatsApp
                </a>
                <p className="don-inkind-card__meta">(11) 99999-9999 · resposta em horário comercial</p>

                <div className="don-inkind-card__steps">
                  <div className="don-inkind-card__step">
                    <span className="don-inkind-card__step-num">1</span>
                    <div>
                      <strong>Envie a lista</strong>
                      <span>Itens e quantidades aproximadas</span>
                    </div>
                  </div>
                  <div className="don-inkind-card__step">
                    <span className="don-inkind-card__step-num">2</span>
                    <div>
                      <strong>Receba o combinado</strong>
                      <span>Data, horário e endereço de entrega</span>
                    </div>
                  </div>
                  <div className="don-inkind-card__step">
                    <span className="don-inkind-card__step-num">3</span>
                    <div>
                      <strong>Entrega no local</strong>
                      <span>Equipe recebe e confere com você</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
