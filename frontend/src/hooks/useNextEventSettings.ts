import { useEffect, useState } from 'react'
import { ADMIN_SETTINGS_ENDPOINT } from '../config/api'

export type NextEventSettings = {
  nextEventDate: string | null
  eventLocation: string | null
}

export const NEXT_EVENT_TZ = 'America/Sao_Paulo'

export function formatEventParts(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const day = new Intl.DateTimeFormat('pt-BR', { timeZone: NEXT_EVENT_TZ, day: '2-digit' }).format(d)
  const monthRaw = new Intl.DateTimeFormat('pt-BR', { timeZone: NEXT_EVENT_TZ, month: 'long' }).format(d)
  const month = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1)
  const year = new Intl.DateTimeFormat('pt-BR', { timeZone: NEXT_EVENT_TZ, year: 'numeric' }).format(d)
  const weekdayRaw = new Intl.DateTimeFormat('pt-BR', { timeZone: NEXT_EVENT_TZ, weekday: 'long' }).format(d)
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1)
  const hm = new Intl.DateTimeFormat('pt-BR', {
    timeZone: NEXT_EVENT_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
  const time = hm.replace(':', 'h')
  return { day, month, year, weekday, time }
}

export function parseEventMs(iso: string | null): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? null : t
}

let cachedSettings: NextEventSettings | null = null
let inflight: Promise<NextEventSettings> | null = null

async function fetchNextEventSettings(): Promise<NextEventSettings> {
  if (cachedSettings) return cachedSettings
  if (inflight) return inflight
  inflight = (async () => {
    try {
      const res = await fetch(ADMIN_SETTINGS_ENDPOINT)
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = (await res.json()) as {
        nextEventDate?: string | null
        eventLocation?: string | null
      }
      const next: NextEventSettings = {
        nextEventDate: data.nextEventDate ?? null,
        eventLocation: data.eventLocation ?? null,
      }
      cachedSettings = next
      return next
    } catch {
      const empty: NextEventSettings = { nextEventDate: null, eventLocation: null }
      cachedSettings = empty
      return empty
    } finally {
      inflight = null
    }
  })()
  return inflight
}

export function useNextEventSettings() {
  const [settings, setSettings] = useState<NextEventSettings>(
    () => cachedSettings ?? { nextEventDate: null, eventLocation: null }
  )
  const [loading, setLoading] = useState(() => !cachedSettings)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const data = await fetchNextEventSettings()
      if (!cancelled) {
        setSettings(data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { settings, loading }
}
