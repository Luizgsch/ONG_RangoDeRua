import jwt from '@fastify/jwt'
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { verifyPassword } from '../lib/password.js'

const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.'),
})

const errorBodySchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
  required: ['error'],
} as const

const jwtAuthPlugin: FastifyPluginAsync = async fastify => {
  const secret = process.env.JWT_SECRET?.trim()
  if (!secret) {
    throw new Error('Defina JWT_SECRET no .env (string forte, ex.: openssl rand -base64 32).')
  }

  await fastify.register(jwt, {
    secret,
    sign: { expiresIn: '7d' },
  })

  /** Middleware: exige Bearer JWT válido; caso contrário 401 Unauthorized. */
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
  })

  fastify.post(
    '/api/login',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Login administrativo',
        description:
          'Valida e-mail e senha (bcrypt) e retorna JWT. Use Authorization: Bearer no GET e no DELETE /api/volunteers.',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: { token: { type: 'string' } },
            required: ['token'],
          },
          400: errorBodySchema,
          401: errorBodySchema,
        },
      },
    },
    async (request, reply) => {
      const parsed = loginSchema.safeParse(request.body ?? {})
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? 'Dados inválidos.'
        return reply.status(400).send({ error: msg })
      }

      const email = parsed.data.email.toLowerCase()
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !(await verifyPassword(parsed.data.password, user.password))) {
        return reply.status(401).send({ error: 'E-mail ou senha inválidos.' })
      }

      const token = await reply.jwtSign({ sub: user.id, email: user.email })
      return reply.send({ token })
    },
  )
}

export default fp(jwtAuthPlugin, { name: 'rango-jwt-auth' })
