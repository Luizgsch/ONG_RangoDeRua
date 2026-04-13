import type { FastifyPluginAsync } from 'fastify'
import rateLimit from '@fastify/rate-limit'
import { Prisma } from '@prisma/client'
import fp from 'fastify-plugin'
import { sendNewVolunteerEmail } from '../lib/mailer.js'
import { prisma } from '../lib/prisma.js'
import { createVolunteerSchema, formatZodIssues } from '../schemas/volunteerCreate.js'

const availabilityEnum = ['ONCE_A_MONTH', 'TWICE_A_MONTH', 'EVENTUAL', 'REMOTE'] as const

const volunteerJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nome: { type: 'string' },
    idade: { type: 'integer', nullable: true },
    email: { type: 'string', format: 'email' },
    whatsApp: { type: 'string', nullable: true },
    localidade: { type: 'string', nullable: true },
    disponibilidade: { type: 'string', enum: [...availabilityEnum] },
    motivacao: { type: 'string', nullable: true },
  },
  required: ['id', 'nome', 'email', 'disponibilidade'],
} as const

const errorBodySchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
  required: ['error'],
} as const

const validationErrorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  required: ['error'],
} as const

const rateLimitErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
} as const

/**
 * Listagem e exclusão com JWT via `preHandler` em cada rota.
 * POST /api/volunteers permanece no plugin pai (fora deste bloco).
 */
const volunteersListAndDeleteScoped: FastifyPluginAsync = async scope => {
  scope.get(
    '/api/volunteers',
    {
      preHandler: [scope.authenticate],
      schema: {
        tags: ['Voluntários'],
        summary: 'Listar voluntários',
        description:
          'Retorna todos os voluntários cadastrados, ordenados por nome. Requer Authorization: Bearer com JWT obtido em POST /api/login.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'array',
            items: volunteerJsonSchema,
          },
          401: errorBodySchema,
        },
      },
    },
    async (_request, reply) => {
      const list = await prisma.volunteer.findMany({
        orderBy: { nome: 'asc' },
      })
      return reply.send(list)
    },
  )

  scope.delete(
    '/api/volunteers/:id',
    {
      preHandler: [scope.authenticate],
      schema: {
        tags: ['Voluntários'],
        summary: 'Excluir voluntário',
        description:
          'Remove um voluntário pelo id (UUID). Requer Authorization: Bearer com JWT obtido em POST /api/login.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        response: {
          204: { type: 'null', description: 'Removido com sucesso.' },
          401: errorBodySchema,
          404: errorBodySchema,
          500: errorBodySchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        await prisma.volunteer.delete({ where: { id } })
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          return reply.status(404).send({ error: 'Voluntário não encontrado.' })
        }
        request.log.error({ err }, 'Erro ao excluir voluntário')
        return reply.status(500).send({ error: 'Não foi possível excluir o voluntário.' })
      }
      return reply.status(204).send()
    },
  )
}

const volunteerPlugin: FastifyPluginAsync = async app => {
  await app.register(rateLimit, { global: false })

  // Fora de `volunteersListAndDeleteScoped`: cadastro público (sem JWT).
  app.post(
    '/api/volunteers',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
      schema: {
        tags: ['Voluntários'],
        summary: 'Cadastrar voluntário',
        description:
          'Totalmente pública: sem preHandler/onRequest de JWT nesta rota. Cria um voluntário; corpo validado com Zod. Limite: 10 req/min por IP.',
        security: [],
        body: {
          type: 'object',
          additionalProperties: true,
          properties: {
            nome: { type: 'string' },
            email: { type: 'string' },
            whatsApp: { type: 'string' },
            localidade: { type: 'string' },
            disponibilidade: { type: 'string' },
            idade: {},
            motivacao: { type: 'string' },
          },
        },
        response: {
          201: volunteerJsonSchema,
          400: validationErrorSchema,
          429: rateLimitErrorSchema,
          500: errorBodySchema,
        },
      },
    },
    async (request, reply) => {
      const log = request.log
      try {
        const parsed = createVolunteerSchema.safeParse(request.body ?? {})
        if (!parsed.success) {
          const { error, issues } = formatZodIssues(parsed.error)
          return reply.status(400).send({ error, issues })
        }

        const d = parsed.data
        const volunteer = await prisma.volunteer.create({
          data: {
            nome: d.nome,
            idade: d.idade,
            email: d.email,
            whatsApp: d.whatsApp.trim() || null,
            localidade: d.localidade,
            disponibilidade: d.disponibilidade,
            motivacao: d.motivacao,
          },
        })

        await sendNewVolunteerEmail(volunteer)

        return reply.status(201).send(volunteer)
      } catch (err) {
        log.error({ err }, 'Erro ao cadastrar voluntário ou ao enviar e-mail (SMTP)')
        console.error('Falha no POST /api/volunteers (cadastro/e-mail):', err)
        return reply.status(500).send({
          error: 'Não foi possível concluir o cadastro. Tente novamente mais tarde.',
        })
      }
    },
  )

  await app.register(volunteersListAndDeleteScoped)
}

export const volunteerRoutes = fp(volunteerPlugin, {
  name: 'volunteer-routes',
  dependencies: ['rango-jwt-auth'],
})
