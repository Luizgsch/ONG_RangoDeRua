# Role: UX/UI Designer & Conversion Specialist (NGO & Social Impact)
# Strategy: Institutional Authority & Donation Conversion - "Plataforma ONG"

## 1. Hierarquia de Conversão (CTAs Críticos)
O sistema deve distinguir claramente entre o suporte financeiro (manutenção) e o suporte operacional (voluntariado):
- **Botão Primário ("Quero Doar"):** Estilo sólido (Brand Orange/Yellow). Deve ser o elemento de maior peso visual no Hero e no Sticky Header.
- **Botão Secundário ("Ser Voluntário"):** Estilo Outline (apenas borda). 
- **Micro-copy de Doação:** Substitua valores genéricos (R$ 25, R$ 50) por frases conectivas: "Doar 5 Marmitas", "Garantir 10 Almoços".

## 2. Prova Social e Legibilidade (UI Refinement)
- **Números de Impacto:** Aumente o peso visual de métricas como "50k refeições" ou "13 anos". Use `font-extrabold` e `tracking-tight`.
- **Contraste de Cards:** Melhore a separação visual dos cards de "Valores" e "Projetos" adicionando `border-white/10` e aumentando levemente a opacidade do background para não fundir com o fundo da página.
- **Respiro Textual:** Em blocos densos (como "Sobre Nós"), aplique `leading-relaxed` e quebre em parágrafos menores para evitar a fadiga de leitura.

## 3. Estrutura Institucional e "Site Vivo"
Transforme a página de uma "montra estática" num centro operacional:
- **Banner de Próxima Ação:** Crie um card de destaque estilo 'Status Bar' com informações dinâmicas: "Próxima entrega: Sábado, 14/04 às 19h - Precisamos de 5 voluntários".
- **Rodapé Profissional:** Adicione obrigatoriamente campos para CNPJ, Endereço da Sede e Selos de Transparência (Placeholders).
- **Formulário de Voluntariado:** Adicione placeholders amigáveis, validação visual de campos e uma animação de 'Sucesso' via `framer-motion` após o envio.

## 4. Polimento e Limpeza (Sobriedade)
- **Animações:** Suavize o 'spring' do Framer Motion. Evite overshoots excessivos para manter um tom sério e profissional.
- **Links Reais:** Remova links "Saiba mais" genéricos. Se a página interna não existir, transforme o link num scroll suave (anchor link) para a secção correspondente na One-Page.

## 5. Instruções de Execução para a IA (Agente Cursor)
- Refatore os componentes de Header, Hero e Footer seguindo esta nova hierarquia.
- Garanta que o botão de doação no Header seja um `button` real que "persiga" o utilizador durante o scroll (Sticky).
- Utilize a paleta de cores definida no design system, mas priorize o contraste acessível para leitura de textos longos.
- **Objetivo Final:** O site deve transmitir confiança imediata, facilitando o caminho do doador e mostrando que a ONG é uma organização ativa e transparente.