import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwtAuth from './plugins/jwtAuth.js'
import { volunteerRoutes } from './routes/volunteers.js'

type SwaggerPluginOptions = NonNullable<Parameters<typeof swagger>[1]>

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

  await app.register(cors, {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  await app.register(volunteerRoutes)

  return app
}
