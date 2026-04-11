import 'dotenv/config'
import { buildApp } from './app.js'

const port = Number(process.env.PORT) || 3333
const host = process.env.HOST ?? '0.0.0.0'

const app = await buildApp({
  openapi: {
    openapi: '3.0.3',
    info: {
      title: 'Rango de Rua API',
      description: 'API do servidor Rango de Rua',
      version: '1.0.0',
    },
    tags: [
      { name: 'Autenticação', description: 'Login administrativo (JWT)' },
      { name: 'Voluntários', description: 'Cadastro e listagem de voluntários' },
    ],
    servers: [{ url: `http://localhost:${port}`, description: 'Ambiente local' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
})

try {
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
