/**
 * Cria ou atualiza o usuário administrador (tabela `users`).
 *
 * Variáveis (.env):
 *   - DATABASE_URL — conexão PostgreSQL (ex.: Neon)
 *   - ADMIN_EMAIL — e-mail do admin (único)
 *   - ADMIN_PASSWORD — senha em texto puro no .env só para este seed; no banco vai bcrypt (src/lib/password.ts)
 *
 * Rodar: na pasta `server`, `npm run db:seed` (ou `npx prisma db seed`).
 */
import 'dotenv/config'
import { hashPassword } from '../src/lib/password.js'
import { prisma } from '../src/lib/prisma.js'

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Configure ADMIN_EMAIL e ADMIN_PASSWORD no .env (veja .env.example). Seed abortado.',
    )
  }

  const hashed = await hashPassword(password)

  await prisma.user.upsert({
    where: { email },
    create: { email, password: hashed },
    update: { password: hashed },
  })

  console.log(
    `Administrador criado/atualizado: ${email} (use esta senha no .env para login em /admin via POST /api/login).`,
  )
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
