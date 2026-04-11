import { z } from 'zod'

const availabilityEnum = z.enum(['ONCE_A_MONTH', 'TWICE_A_MONTH', 'EVENTUAL', 'REMOTE'], {
  error: 'Selecione uma disponibilidade válida.',
})

/** Telefone/WhatsApp: só dígitos após limpeza, entre 10 e 13 (BR + DDD + celular). */
function phoneDigitsOk(s: string): boolean {
  const digits = s.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13
}

export const createVolunteerSchema = z.object({
  nome: z
    .string({ error: 'Informe o nome.' })
    .trim()
    .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string({ error: 'Informe o e-mail.' }).trim().email('Informe um e-mail válido.'),
  whatsApp: z
    .string({ error: 'Informe o WhatsApp.' })
    .trim()
    .refine(phoneDigitsOk, {
      message: 'Informe um telefone válido (DDD + número, 10 a 13 dígitos).',
    }),
  localidade: z
    .string({ error: 'Informe a localidade.' })
    .trim()
    .min(1, 'Informe cidade ou bairro.'),
  disponibilidade: availabilityEnum,
  idade: z.coerce
    .number({ error: 'Informe a idade.' })
    .int('A idade deve ser um número inteiro.')
    .min(16, 'Idade mínima: 16 anos.')
    .max(120, 'Idade inválida.'),
  motivacao: z
    .string({ error: 'Informe sua motivação.' })
    .trim()
    .min(5, 'A motivação deve ter pelo menos 5 caracteres.'),
})

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>

export function formatZodIssues(err: z.ZodError): { error: string; issues: { path: string; message: string }[] } {
  const issues = err.issues.map(i => ({
    path: i.path.length ? i.path.join('.') : 'campo',
    message: i.message,
  }))
  const error = issues.map(i => `${i.message}`).join(' ')
  return { error: error || 'Dados inválidos.', issues }
}
