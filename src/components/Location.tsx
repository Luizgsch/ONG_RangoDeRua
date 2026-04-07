import './Location.css'

export default function Location() {
  return (
    <section id="localizacao" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--orange">Onde estamos</span>
          <h2>Localização</h2>
          <div className="divider" style={{ background: 'var(--clr-orange)' }} />
          <p>Atuamos em São Paulo e você pode nos encontrar nos seguintes pontos.</p>
        </div>

        <div className="location__layout">
          <div className="location__map">
            <iframe
              title="Localização Rango de Rua"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14631.356705684578!2d-46.6388!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sPra%C3%A7a%20da%20S%C3%A9%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: 'var(--radius)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="location__info">
            <div className="location__card">
              <h4>📍 Ponto de encontro principal</h4>
              <p>Praça da Sé – Centro Histórico<br />São Paulo, SP</p>
            </div>
            <div className="location__card">
              <h4>🗺 Bairros atendidos</h4>
              <div className="location__tags">
                {['Sé', 'Luz', 'Bom Retiro', 'Glicério', 'Campos Elíseos', 'Brás', 'Pari', 'Canindé', 'República', 'Santa Cecília'].map(b => (
                  <span key={b} className="tag tag--orange" style={{ fontSize: '0.75rem' }}>{b}</span>
                ))}
              </div>
            </div>
            <div className="location__card">
              <h4>🚌 Como chegar</h4>
              <p>Metrô Sé (Linhas 1 e 3) · Ônibus linhas 107, 178 · CPTM Estação Luz</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
