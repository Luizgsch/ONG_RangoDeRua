import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwtAuth from './plugins/jwtAuth.js'
import { volunteerRoutes } from './routes/volunteers.js'

type SwaggerPluginOptions = NonNullable<Parameters<typeof swagger>[1]>

/** Lê CORS_ORIGIN: lista separada por vírgula, trim e aspas externas opcionais por item. */
function parseCorsOriginsFromEnv(raw: string | undefined): string[] {
  if (raw === undefined || raw.trim() === '') {
    return []
  }
  return raw
    .split(',')
    .map(segment => {
      let s = segment.trim()
      if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
      ) {
        s = s.slice(1, -1).trim()
      }
      return s
    })
    .filter(Boolean)
}

const defaultSwaggerOptions: SwaggerPluginOptions = {
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
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
}

export async function buildApp(swaggerOptions?: SwaggerPluginOptions) {
  const app = Fastify({ logger: true })

  await app.register(helmet)

  await app.register(jwtAuth)

  await app.register(swagger, swaggerOptions ?? defaultSwaggerOptions)

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  })

  const allowedOrigins = parseCorsOriginsFromEnv(process.env.CORS_ORIGIN)

  const isDev = process.env.NODE_ENV !== 'production'
  const corsOriginOption =
    allowedOrigins.length > 0
      ? allowedOrigins.length === 1
        ? allowedOrigins[0]
        : allowedOrigins
      : isDev
        ? '*'
        : false

  await app.register(cors, {
    origin: corsOriginOption,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.get('/health', async () => ({ ok: true as const, service: 'rango-de-rua-api' }))

  await app.register(volunteerRoutes)

  return app
}
