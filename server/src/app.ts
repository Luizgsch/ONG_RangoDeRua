import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { FastifyCorsOptions } from '@fastify/cors'
import helmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwtAuth from './plugins/jwtAuth.js'
import { adminRoutes } from './routes/admin.js'
import { instagramCacheRoutes } from './routes/instagramCache.js'
import { volunteerRoutes } from './routes/volunteers.js'

type SwaggerPluginOptions = NonNullable<Parameters<typeof swagger>[1]>

/** Domínio principal da ONG + www (CORS em produção; amplie com CORS_ORIGIN no .env). */
const DEFAULT_ONG_CORS_ORIGINS = ['https://rangoderua.org.br', 'https://www.rangoderua.org.br'] as const

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

function normalizeOriginUrl(origin: string): string {
  return origin.trim().replace(/\/$/, '')
}

/** Preview / deploy na Vercel: só hostname que termina em `.vercel.app` (evita match por substring). */
function isVercelAppOrigin(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin)
    if (protocol !== 'https:' && protocol !== 'http:') return false
    return hostname === 'vercel.app' || hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

function mergeCorsAllowlist(envOrigins: string[]): string[] {
  const set = new Set<string>()
  for (const o of DEFAULT_ONG_CORS_ORIGINS) {
    set.add(normalizeOriginUrl(o))
  }
  for (const o of envOrigins) {
    set.add(normalizeOriginUrl(o))
  }
  return [...set]
}

function buildCorsOriginOption(isProd: boolean): FastifyCorsOptions['origin'] {
  const fromEnv = parseCorsOriginsFromEnv(process.env.CORS_ORIGIN)

  if (!isProd) {
    if (fromEnv.length === 0) {
      return '*'
    }
    if (fromEnv.length === 1) {
      return normalizeOriginUrl(fromEnv[0]!)
    }
    return fromEnv.map(normalizeOriginUrl)
  }

  const allowlist = mergeCorsAllowlist(fromEnv)
  return (origin, cb) => {
    if (!origin) {
      cb(null, true)
      return
    }
    const normalized = normalizeOriginUrl(origin)
    if (allowlist.includes(normalized)) {
      cb(null, true)
      return
    }
    if (isVercelAppOrigin(origin)) {
      cb(null, true)
      return
    }
    cb(new Error('Origem não permitida pelo CORS'), false)
  }
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
      { name: 'Instagram', description: 'Cache do feed para o site' },
      { name: 'Admin', description: 'Painel: agenda e galeria manual' },
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

  const isProd = process.env.NODE_ENV === 'production'
  const corsOriginOption = buildCorsOriginOption(isProd)

  await app.register(cors, {
    origin: corsOriginOption,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.get('/health', async () => ({ ok: true as const, service: 'rango-de-rua-api' }))

  await app.register(instagramCacheRoutes)
  await app.register(adminRoutes)
  await app.register(volunteerRoutes)

  return app
}
