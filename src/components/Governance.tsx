import './Governance.css'

const team = [
  { role: 'Presidenta', name: 'Ana Paula Souza',  color: 'yellow', emoji: '👩' },
  { role: 'Vice-presidenta', name: 'Carla Lima',  color: 'orange', emoji: '👩' },
  { role: 'Diretora financeira', name: 'Marina Costa', color: 'green', emoji: '👩' },
  { role: 'Coord. de Voluntários', name: 'Pedro Alves', color: 'blue', emoji: '👨' },
]

export default function Governance() {
  return (
    <section id="governanca" className="section section--dark">
      <div className="container">
        <div className="section-header">
          <span className="tag tag--blue">Institucional</span>
          <h2>Governança & transparência</h2>
          <div className="divider" style={{ background: 'var(--clr-blue)' }} />
          <p>Acreditamos na gestão transparente e participativa.</p>
        </div>

        <div className="governance__layout">
          <div>
            <h3>Equipe diretora</h3>
            <div className="governance__team">
              {team.map(t => (
                <div className={`governance__member governance__member--${t.color}`} key={t.name}>
                  <span className="governance__avatar">{t.emoji}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="governance__docs">
            <h3>Documentos</h3>
            <div className="governance__doc-list">
              {[
                { icon: '📄', label: 'Estatuto Social', color: 'yellow' },
                { icon: '📊', label: 'Relatório anual 2023', color: 'blue' },
                { icon: '💰', label: 'Prestação de contas 2023', color: 'green' },
                { icon: '🏛️', label: 'CNPJ e registros', color: 'orange' },
              ].map(d => (
                <div className={`governance__doc governance__doc--${d.color}`} key={d.label}>
                  <span>{d.icon}</span>
                  <span>{d.label}</span>
                  <span className="governance__doc-action">↓ Download</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
