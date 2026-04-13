import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import type { Availability, Volunteer } from '@prisma/client'

const AVAILABILITY_LABEL: Record<Availability, string> = {
  ONCE_A_MONTH: '1x por mês',
  TWICE_A_MONTH: '2x por mês (todas as saídas)',
  EVENTUAL: 'Eventual',
  REMOTE: 'Só online / remoto',
}

function getTransporter() {
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS
  if (!user || !pass?.trim()) {
    return null
  }

  const options: SMTPTransport.Options & { family?: number } = {
    host: '74.125.142.108',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    family: 4,
    tls: {
      servername: 'smtp.gmail.com',
      rejectUnauthorized: false,
    },
  }

  return nodemailer.createTransport(options)
}

let transporterCache: ReturnType<typeof nodemailer.createTransport> | null | undefined

function transporter() {
  if (transporterCache === undefined) {
    transporterCache = getTransporter()
  }
  return transporterCache
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function rowHighlight(label: string, value: string): string {
  const L = escapeHtml(label)
  const V = escapeHtml(value)
  return `
  <tr>
    <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#334155;width:38%;">${L}</td>
    <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;">${V}</td>
  </tr>`
}

function rowMuted(label: string, value: string): string {
  const L = escapeHtml(label)
  const V = escapeHtml(value)
  return `
  <tr>
    <td style="padding:10px 18px;background:#ffffff;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:600;color:#64748b;">${L}</td>
    <td style="padding:10px 18px;background:#ffffff;border-bottom:1px solid #f1f5f9;font-size:14px;color:#475569;">${V}</td>
  </tr>`
}

function formatVolunteerHtml(v: Volunteer): string {
  const destaque = [
    rowHighlight('Nome completo', v.nome),
    rowHighlight('E-mail', v.email),
    rowHighlight('Telefone (WhatsApp)', v.whatsApp ?? '—'),
    rowHighlight('Disponibilidade', AVAILABILITY_LABEL[v.disponibilidade]),
  ].join('')

  const outros = [
    rowMuted('Idade', v.idade != null ? `${v.idade} anos` : '—'),
    rowMuted('Localidade', v.localidade ?? '—'),
    rowMuted('Motivação', v.motivacao ?? '—'),
    rowMuted('ID do cadastro', v.id),
  ].join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Voluntário — Rango de Rua</title>
</head>
<body style="margin:0;padding:24px;background:#e2e8f0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#0f172a;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#ca8a04 0%,#eab308 50%,#facc15 100%);padding:28px 24px;text-align:center;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#422006;letter-spacing:-0.02em;">Novo Voluntário Cadastrado</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#713f12;font-weight:500;">Rango de Rua — inscrição pelo site</p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 0;">
        <p style="margin:20px 24px 8px;font-size:14px;color:#64748b;">Recebemos um novo cadastro de voluntário. Confira os dados principais:</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${destaque}</table>
        <p style="margin:24px 24px 8px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">Informações adicionais</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${outros}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:12px;color:#64748b;text-align:center;">Este e-mail foi enviado automaticamente pelo sistema de cadastro.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function formatVolunteerText(v: Volunteer): string {
  return [
    'Novo Voluntário Cadastrado — Rango de Rua',
    '',
    'Dados principais',
    `Nome: ${v.nome}`,
    `E-mail: ${v.email}`,
    `Telefone (WhatsApp): ${v.whatsApp ?? '—'}`,
    `Disponibilidade: ${AVAILABILITY_LABEL[v.disponibilidade]}`,
    '',
    'Informações adicionais',
    `Idade: ${v.idade != null ? v.idade : '—'}`,
    `Localidade: ${v.localidade ?? '—'}`,
    `Motivação: ${v.motivacao ?? '—'}`,
    `ID do cadastro: ${v.id}`,
  ].join('\n')
}

/**
 * Envia e-mail ao responsável (chefe) com os dados do voluntário recém-cadastrado.
 * Usa SMTP definido em SMTP_* no .env; destinatário em BOSS_EMAIL.
 */
export async function sendNewVolunteerEmail(volunteerData: Volunteer): Promise<void> {
  const tp = transporter()
  const to = process.env.BOSS_EMAIL?.trim()
  const from = (process.env.MAIL_FROM ?? process.env.SMTP_USER)?.trim()

  if (!tp || !to || !from) {
    console.warn(
      '[mailer] Envio ignorado: configure SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM (opcional) e BOSS_EMAIL no .env',
    )
    return
  }

  console.log('Tentando enviar e-mail...')
  try {
    const info = await tp.sendMail({
      from,
      to,
      subject: `Novo Voluntário Cadastrado - Rango de Rua: ${volunteerData.nome}`,
      text: formatVolunteerText(volunteerData),
      html: formatVolunteerHtml(volunteerData),
    })
    console.log('Resposta do SMTP:', info)
  } catch (error) {
    console.error('ERRO DETALHADO DO SMTP:', error)
    throw error
  }
}
