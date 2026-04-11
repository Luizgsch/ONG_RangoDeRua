1. Arquitetura do Ecossistema
Para manter a agilidade e facilitar a manutenção, a estrutura será:

Frontend (O Astro): React + Tailwind + Shadcn/ui (essencial para o Cursor gerar telas profissionais).

Backend (A Ponte): Spring Boot atuando como um BFF (Backend For Frontend). Ele não vai gerenciar regras de negócio complexas, apenas consumir as APIs externas (Instagram, Sistema de Doação, Sistema de Voluntários) e entregar os dados limpos para o Front.

Integração Social: Utilizaremos a Instagram Basic Display API para o feed vivo, trazendo o dinamismo que você sugeriu.

2. Identidade Visual: "Alegria com Propósito"
Já que no Instagram eles são coloridos, a proposta é:

Fundo: Dark Mode elegante (Preto/Grafite) para destacar as fotos da comida e das pessoas.

Acentos: Cores vibrantes (Laranja, Verde, Amarelo) usadas em gradients ou botões, representando a diversidade dos alimentos e a energia dos voluntários.

Tipografia: Fontes Sans-serif robustas (ex: Inter ou Montserrat) para passar a seriedade de uma governança de 11 anos.

3. Mapeamento de Seções (Site Multi-page ou One-page robusta)
Hero: Impacto imediato com os números principais (Ex: +100k marmitas entregues).

A ONG: História, Governança, Prêmios e Reconhecimentos.

Frentes de Atuação: Explicação visual do "O que fazemos".

Mural Social: Feed do Instagram integrado (Prova Social).

Transparência: Gráficos simples gerados via Shadcn/Charts com os dados de impacto.

Conversão:

Card de Doação: Botão direto para o sistema que eles já usam.

Card de Voluntariado: Form ou link externo para o sistema atual.

Notícias/Próxima Leva: Um "sticker" ou banner de aviso rápido no topo do site.

4. Estratégia de Implementação (Cursor Pro)
Para que o Cursor gere o código com precisão, o seu context.md deve seguir este padrão de "Simplicidade Crítica":

Padrão de Código: "Single File Components" quando possível para o Front. No Back, apenas Controllers que chamam Services de integração.

Database: Se não houver necessidade de salvar dados novos, podemos rodar o Backend Stateless (sem banco de dados local), apenas repassando informações das APIs externas. Isso reduz o custo de infra para zero no início.

Ferramentas Sugeridas:

Lucide Icons: Para ícones de interface.

Framer Motion: Para animações sutis de entrada (dá um ar de site "premium" com pouco código).