/**
 * Todas as chamadas à API devem usar estes endpoints.
 * - `import.meta.env.VITE_API_URL` vem do `.env.production` no build de produção (ex.: Render).
 * - Em desenvolvimento (`vite`), se a variável não existir, usamos o backend local.
 */
const viteApiUrl = import.meta.env.VITE_API_URL

const resolvedBase =
  typeof viteApiUrl === 'string' && viteApiUrl.trim() !== ''
    ? viteApiUrl.trim()
    : 'http://localhost:3333'

export const API_BASE = resolvedBase.replace(/\/$/, '')

export const VOLUNTEERS_ENDPOINT = `${API_BASE}/api/volunteers`

export const INSTAGRAM_CACHE_ENDPOINT = `${API_BASE}/api/instagram-cache`

export const HEALTH_ENDPOINT = `${API_BASE}/health`
