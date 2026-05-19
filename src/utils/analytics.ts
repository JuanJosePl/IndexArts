/**
 * utils/analytics.ts — infraestructura de tracking
 *
 * [AUD-7] Tipos importados desde types/index.ts
 * [ISSUE-2] islands no importan esto directamente — usan hooks/use-wa-navigation
 */
import type { ConversionEvent, AnalyticsEventParams } from '@/types'

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Record<string, unknown>) => void
  }
}

export function trackEvent(event: ConversionEvent, params?: AnalyticsEventParams): void {
  if (typeof window === 'undefined') return
  if (window.gtag) window.gtag('event', event, params)
  if (import.meta.env.DEV) console.info(`[analytics] ${event}`, params)
}
