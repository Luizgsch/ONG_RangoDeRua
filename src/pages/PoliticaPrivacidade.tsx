import './PoliticaPrivacidade.css'

export default function PoliticaPrivacidade() {
  return (
    <section className="privacy">
      <div className="privacy__hero">
        <div className="container">
          <span className="tag tag--blue">Legal</span>
          <h1>Política de privacidade</h1>
          <p>Última atualização: 7 de abril de 2026</p>
        </div>
      </div>

      <div className="container privacy__content">
        <nav className="privacy__toc">
          <h4>Sumário</h4>
          <ol>
            {['Coleta de dados', 'Uso dos dados', 'Compartilhamento', 'Cookies', 'Seus direitos', 'Contato'].map((t, i) => (
              <li key={t}><a href={`#pp-${i + 1}`}>{t}</a></li>
            ))}
          </ol>
        </nav>

        <div className="privacy__body">
          <p className="privacy__intro">
            A <strong>Rango de Rua</strong> respeita e protege a privacidade de todos os seus
            usuários, voluntários e doadores. Esta política descreve como coletamos,
            usamos e protegemos suas informações pessoais, em conformidade com a
            <strong> Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)</strong>.
          </p>

          {[
            {
              id: 'pp-1',
              title: '1. Coleta de dados',
              content: `Coletamos as seguintes informações quando você preenche formulários em nosso site:

• Nome completo
• Endereço de e-mail
• Número de telefone / WhatsApp
• Cidade e bairro de residência
• Informações fornecidas voluntariamente no campo de mensagem

Não coletamos dados sensíveis como CPF, dados financeiros completos ou documentos de identidade por meio deste site.`,
            },
            {
              id: 'pp-2',
              title: '2. Uso dos dados',
              content: `As informações coletadas são utilizadas exclusivamente para:

• Processar inscrições de voluntários e entrar em contato para os próximos passos
• Enviar confirmações e informações sobre doações
• Enviar nossa newsletter (somente com consentimento explícito)
• Melhorar a experiência de uso do nosso site
• Cumprir obrigações legais

Nunca utilizamos seus dados para fins comerciais ou os vendemos a terceiros.`,
            },
            {
              id: 'pp-3',
              title: '3. Compartilhamento de dados',
              content: `Seus dados pessoais não são vendidos, alugados ou compartilhados com terceiros, exceto:

• Ferramentas de gestão de voluntários que utilizamos internamente (sempre com cláusulas de confidencialidade)
• Obrigações legais exigidas por autoridades competentes
• Parceiros operacionais essenciais, mediante consentimento prévio

Todos os nossos parceiros estão sujeitos a políticas de privacidade equivalentes à nossa.`,
            },
            {
              id: 'pp-4',
              title: '4. Cookies e rastreamento',
              content: `Nosso site pode utilizar cookies para:

• Manter sessões ativas
• Analisar tráfego de forma anônima (ex: Google Analytics)
• Melhorar a performance e experiência de navegação

Você pode desativar os cookies nas configurações do seu navegador. Isso pode afetar algumas funcionalidades do site.`,
            },
            {
              id: 'pp-5',
              title: '5. Seus direitos (LGPD)',
              content: `Nos termos da LGPD, você tem direito a:

• Confirmar a existência de tratamento dos seus dados
• Acessar os dados que possuímos sobre você
• Corrigir dados incompletos, inexatos ou desatualizados
• Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários
• Solicitar a portabilidade dos seus dados
• Revogar o consentimento a qualquer momento

Para exercer qualquer um desses direitos, entre em contato conosco.`,
            },
            {
              id: 'pp-6',
              title: '6. Contato sobre privacidade',
              content: `Para dúvidas, solicitações ou exercício de direitos relacionados à sua privacidade:

📧 E-mail: privacidade@rangoderua.org.br
📱 WhatsApp: (11) 99999-9999
📬 Endereço: São Paulo, SP – Brasil

Respondemos em até 15 dias úteis.`,
            },
          ].map(s => (
            <div className="privacy__section" key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              <pre>{s.content}</pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
