🚀 Rango de Rua - Plataforma de Gestão e Visibilidade
Uma solução full-stack desenvolvida para a ONG Rango de Rua, focada em gerir voluntários, organizar a agenda de ações sociais e manter um feed de destaques visual e dinâmico, sem dependência de APIs externas pagas.

🧠 Arquitetura e Decisões Técnicas
O projeto foi migrado de uma integração direta com a API do Instagram para um CMS Próprio (Custom Management System). Esta decisão foi tomada para garantir:

Independência de Terceiros: Zero dependência de tokens da Meta ou serviços de terceiros (Behold).

Custo Zero: Utilização inteligente de camadas gratuitas (Neon para SQL e Cloudinary para Media).

Resiliência: O site permanece no ar e funcional mesmo que APIs externas mudem suas políticas.

🛠️ Stack Tecnológica
Frontend: React (Vite), TypeScript, Tailwind CSS, Framer Motion.

Backend: Node.js, Fastify, TypeScript.

Banco de Dados: PostgreSQL (via Neon.tech).

ORM: Prisma.

Storage de Imagens: Cloudinary.

Deploy: Render (Backend) e Vercel (Frontend).

✨ Funcionalidades Principais
🔐 Painel Administrativo
Gestão de Agenda: Controle dinâmico da data do próximo encontro de marmitas.

Mural Rotativo (FIFO): Sistema de upload de imagens para o "feed" do site.

Lógica de Roleta: O sistema mantém apenas os 6 posts mais recentes. Ao subir o 7º, o sistema deleta automaticamente o registro mais antigo no banco e o arquivo físico no Cloudinary para otimizar o storage.

👥 Gestão de Voluntários
Fluxo completo de cadastro de novos voluntários via métodos POST e consulta via GET.

🖼️ Feed Dinâmico
Bento Grid otimizado com aspect-square e object-cover, garantindo uma interface moderna e responsiva.

⚙️ Configuração do Ambiente
Crie um arquivo .env na pasta server com as seguintes chaves:

Snippet de código
# Banco de Dados (Neon)
DATABASE_URL="sua_string_de_conexao_neon"

# Cloudinary (Storage)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="sua_api_secret"

# Segurança
ADMIN_SECRET="sua_senha_para_o_painel"
🚀 Como Executar
Instalar dependências:

Bash
npm install
Preparar o Banco (Prisma):

Bash
npx prisma generate
npx prisma db push
Rodar o Servidor:

Bash
npm run dev
📈 Próximos Passos
[ ] Implementação de sistema de Drag and Drop (dnd kit) para reordenar os 6 posts manualmente.

[ ] Dashboard de métricas simples para contagem de voluntários ativos.
