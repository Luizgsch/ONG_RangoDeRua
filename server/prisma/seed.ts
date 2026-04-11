import 'dotenv/config'
import { hashPassword } from '../src/lib/password.js'
import { prisma } from '../src/lib/prisma.js'

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.warn(
      'Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env (veja .env.example). Seed de administrador ignorado.',
    )
    return
  }

  const hashed = await hashPassword(password)
  await prisma.user.upsert({
    where: { email },
    create: { email, password: hashed },
    update: { password: hashed },
  })

  console.log(`Administrador criado/atualizado: ${email} (login em /admin com este e-mail e a senha do .env).`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
