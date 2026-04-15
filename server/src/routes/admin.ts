import multipart from '@fastify/multipart'
import type { FastifyPluginAsync } from 'fastify'
import { Prisma } from '@prisma/client'
import fp from 'fastify-plugin'
import { prisma } from '../lib/prisma.js'
import { deleteManualImage, uploadManualImage } from '../services/cloudinaryMedia.js'

const SETTINGS_ID = 'default' as const
const MAX_MANUAL_POSTS = 6

const DEFAULT_INSTAGRAM = 'https://www.instagram.com/rangoderua'

const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const errorBodySchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
  required: ['error'],
} as const

function defaultSettingsResponse() {
  return {
    id: SETTINGS_ID,
    nextEventDate: null as string | null,
    eventLocation: null as string | null,
    updatedAt: null as string | null,
  }
}

function isValidHttpUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const adminPlugin: FastifyPluginAsync = async app => {
  await app.register(multipart, {
    limits: {
      fileSize: 8 * 1024 * 1024,
      files: 1,
    },
  })

  app.get(
    '/api/admin/settings',
    {
      schema: {
        tags: ['Admin'],
        summary: 'Ler DashboardSettings (próximo encontro)',
        description:
          'GET público: `nextEventDate` e `eventLocation` da tabela DashboardSettings. Sem linha no banco, devolve valores nulos.',
        response: {
          200: {
            type: 'object',
            required: ['id', 'nextEventDate', 'eventLocation', 'updatedAt'],
            properties: {
              id: { type: 'string' },
              nextEventDate: { type: 'string', nullable: true },
              eventLocation: { type: 'string', nullable: true },
              updatedAt: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const row = await prisma.dashboardSettings.findUnique({ where: { id: SETTINGS_ID } })
      if (!row) {
        return reply.send(defaultSettingsResponse())
      }
      return reply.send({
        id: row.id,
        nextEventDate: row.nextEventDate?.toISOString() ?? null,
        eventLocation: row.eventLocation,
        updatedAt: row.updatedAt.toISOString(),
      })
    },
  )

  app.put(
    '/api/admin/settings',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Admin'],
        summary: 'Salvar DashboardSettings (próximo encontro)',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            nextEventDate: {
              type: 'string',
              nullable: true,
              description: 'ISO 8601 ou datetime-local; null para limpar.',
            },
            eventLocation: { type: 'string', nullable: true },
          },
        },
        response: {
          200: {
            type: 'object',
            required: ['id', 'nextEventDate', 'eventLocation', 'updatedAt'],
            properties: {
              id: { type: 'string' },
              nextEventDate: { type: 'string', nullable: true },
              eventLocation: { type: 'string', nullable: true },
              updatedAt: { type: 'string' },
            },
          },
          400: errorBodySchema,
          401: errorBodySchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        nextEventDate?: string | null
        eventLocation?: string | null
      }

      if (body.nextEventDate === undefined && body.eventLocation === undefined) {
        return reply.status(400).send({ error: 'Envie nextEventDate e/ou eventLocation.' })
      }

      let nextEventDate: Date | null = null
      if (body.nextEventDate !== undefined && body.nextEventDate !== null && body.nextEventDate !== '') {
        const d = new Date(body.nextEventDate)
        if (Number.isNaN(d.getTime())) {
          return reply.status(400).send({ error: 'Data inválida.' })
        }
        nextEventDate = d
      } else if (body.nextEventDate === null || body.nextEventDate === '') {
        nextEventDate = null
      }

      const eventLocation =
        body.eventLocation === undefined
          ? undefined
          : body.eventLocation === null || body.eventLocation.trim() === ''
            ? null
            : body.eventLocation.trim().slice(0, 500)

      const row = await prisma.dashboardSettings.upsert({
        where: { id: SETTINGS_ID },
        create: {
          id: SETTINGS_ID,
          nextEventDate,
          eventLocation: eventLocation ?? null,
        },
        update: {
          ...(body.nextEventDate !== undefined ? { nextEventDate } : {}),
          ...(body.eventLocation !== undefined ? { eventLocation } : {}),
        },
      })

      return reply.send({
        id: row.id,
        nextEventDate: row.nextEventDate?.toISOString() ?? null,
        eventLocation: row.eventLocation,
        updatedAt: row.updatedAt.toISOString(),
      })
    },
  )

  const manualPostPublicSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      imageUrl: { type: 'string' },
      permalink: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['id', 'imageUrl', 'permalink', 'createdAt'],
  } as const

  app.get(
    '/api/admin/posts',
    {
      schema: {
        tags: ['Admin'],
        summary: 'Listar posts manuais da galeria (Home)',
        description: 'Até 6 posts, mais recentes primeiro. Público para a seção Instagram no site.',
        response: {
          200: {
            type: 'array',
            items: manualPostPublicSchema,
          },
        },
      },
    },
    async (_request, reply) => {
      const list = await prisma.manualPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: MAX_MANUAL_POSTS,
      })
      return reply.send(
        list.map(p => ({
          id: p.id,
          imageUrl: p.imageUrl,
          permalink: p.permalink,
          createdAt: p.createdAt.toISOString(),
        })),
      )
    },
  )

  app.post(
    '/api/admin/posts',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Admin'],
        summary: 'Upload de imagem para a galeria (Cloudinary + roleta de 6)',
        description:
          'multipart/form-data: campo `image` (arquivo) e opcionalmente `permalink` (URL do post). Se já houver 6 posts, remove o mais antigo do storage e do banco antes de salvar o novo.',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        response: {
          201: manualPostPublicSchema,
          400: errorBodySchema,
          401: errorBodySchema,
          413: errorBodySchema,
          503: errorBodySchema,
        },
      },
    },
    async (request, reply) => {
      let imageBuffer: Buffer | null = null
      let permalinkField = ''

      try {
        const parts = request.parts()
        for await (const part of parts) {
          if (part.type === 'file' && part.fieldname === 'image') {
            if (!ALLOWED_IMAGE_MIME.has(part.mimetype)) {
              return reply.status(400).send({ error: 'Use apenas imagem JPEG, PNG, WebP ou GIF.' })
            }
            imageBuffer = await part.toBuffer()
          } else if (part.type === 'field' && part.fieldname === 'permalink') {
            permalinkField = String(part.value ?? '').trim()
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.toLowerCase().includes('max') || msg.includes('413')) {
          return reply.status(413).send({ error: 'Arquivo muito grande (máx. 8 MB).' })
        }
        request.log.error({ err: e }, 'multipart_parse_failed')
        return reply.status(400).send({ error: 'Não foi possível ler o formulário de upload.' })
      }

      if (!imageBuffer || imageBuffer.length === 0) {
        return reply.status(400).send({ error: 'Envie o arquivo no campo image.' })
      }

      if (permalinkField !== '' && !isValidHttpUrl(permalinkField)) {
        return reply.status(400).send({ error: 'Link do post inválido. Deixe em branco ou use uma URL http/https.' })
      }
      const permalink =
        permalinkField !== '' && isValidHttpUrl(permalinkField) ? permalinkField : DEFAULT_INSTAGRAM

      /**
       * Roleta (máx. 6): com 6 posts, remove o mais antigo antes de gravar o novo —
       * apaga no Cloudinary pelo public_id (`imageKey`) e remove o registro no Neon.
       */
      const count = await prisma.manualPost.count()
      if (count >= MAX_MANUAL_POSTS) {
        const oldest = await prisma.manualPost.findFirst({
          orderBy: { createdAt: 'asc' },
        })
        if (oldest) {
          await deleteManualImage(oldest.imageKey)
          await prisma.manualPost.delete({ where: { id: oldest.id } })
        }
      }

      let imageUrl: string
      let imageKey: string
      try {
        const up = await uploadManualImage(imageBuffer)
        imageUrl = up.imageUrl
        imageKey = up.imageKey
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes('Cloudinary não configurado')) {
          return reply.status(503).send({ error: msg })
        }
        request.log.error({ err: e }, 'cloudinary_upload_failed')
        return reply.status(400).send({ error: 'Falha ao enviar imagem para o storage.' })
      }

      const created = await prisma.manualPost.create({
        data: {
          imageUrl,
          imageKey,
          permalink,
        },
      })

      return reply.status(201).send({
        id: created.id,
        imageUrl: created.imageUrl,
        permalink: created.permalink,
        createdAt: created.createdAt.toISOString(),
      })
    },
  )

  app.delete(
    '/api/admin/posts/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Admin'],
        summary: 'Excluir post manual e imagem no storage',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        response: {
          204: { type: 'null' },
          401: errorBodySchema,
          404: errorBodySchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const row = await prisma.manualPost.findUnique({ where: { id } })
      if (!row) {
        return reply.status(404).send({ error: 'Post não encontrado.' })
      }
      await deleteManualImage(row.imageKey)
      try {
        await prisma.manualPost.delete({ where: { id } })
      } catch (caught: unknown) {
        if (caught instanceof Prisma.PrismaClientKnownRequestError && caught.code === 'P2025') {
          return reply.status(404).send({ error: 'Post não encontrado.' })
        }
        throw caught
      }
      return reply.status(204).send()
    },
  )
}

export const adminRoutes = fp(adminPlugin, {
  name: 'admin-routes',
  dependencies: ['rango-jwt-auth'],
})
