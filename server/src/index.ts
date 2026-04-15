import './server.js'
import 'dotenv/config'
import type { FastifyBaseLogger } from 'fastify'
import { buildApp } from './app.js'
import { fetchAndCacheInstagramPosts } from './services/instagramSync.js'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

function scheduleInstagramSync(log: FastifyBaseLogger) {
  const run = () => {
    void fetchAndCacheInstagramPosts().then(result => {
      if (!result.ok) {
        log.error({ msg: 'instagram_sync_failed', err: result.error })
        return
      }
      if ('skipped' in result && result.skipped) {
        log.info({ msg: 'instagram_sync_skipped', reason: result.reason })
        return
      }
      log.info({ msg: 'instagram_sync_ok', count: result.count })
    })
  }
  run()
  setInterval(run, ONE_DAY_MS)
}

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
      { name: 'Instagram', description: 'Cache do feed para o site' },
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
  console.log(app.printRoutes())
  scheduleInstagramSync(app.log)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
