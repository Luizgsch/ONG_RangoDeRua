import './Location.css'

export default function Location() {
  return (
    <section id="localizacao" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--orange">Onde estamos</span>
          <h2>Localização</h2>
          <div className="divider" style={{ background: 'var(--clr-orange)' }} />
          <p>Atuamos em Curitiba e você pode nos encontrar nos seguintes pontos.</p>
        </div>

        <div className="location__layout">
          <div className="location__map">
            <iframe
              title="Localização Rango de Rua"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.9!2d-49.2583053!3d-25.3782641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce7dfa1f9580b%3A0x1e65940982c5528f!2sRango%20de%20Rua!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
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
              <p>Rango de Rua<br />Curitiba, PR</p>
            </div>
            <div className="location__card">
              <h4>🗺 Bairros atendidos</h4>
              <div className="location__tags">
                {['Centro', 'Rebouças', 'Portão', 'Água Verde', 'Boqueirão', 'Cajuru', 'CIC', 'Pinheirinho', 'Bairro Alto', 'Tatuquara'].map(b => (
                  <span key={b} className="tag tag--orange" style={{ fontSize: '0.75rem' }}>{b}</span>
                ))}
              </div>
            </div>
            <div className="location__card">
              <h4>🔗 Ver no Google Maps</h4>
              <p>
                <a
                  href="https://maps.app.goo.gl/Q1uQHL4wPHCnoTBD9"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--outline"
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  Abrir no Maps ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
