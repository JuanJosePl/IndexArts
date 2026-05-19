/**
 * hooks/use-wa-navigation.ts
 *
 * Encapsula apertura de WhatsApp + tracking de analytics.
 * Las islands usan este hook — no importan utils/whatsapp ni utils/analytics.
 *
 * [ISSUE-7] Composition over direct dependency.
 * [ISSUE-2] Desacopla islands de infraestructura.
 */
import type { WaVariant, CalcResult, UseWaNavigationReturn } from '@/types'
import { getMessageForVariant } from '@/domain/whatsapp-message'
import { buildWaUrl, getWaPhone } from '@/utils'
import { trackEvent } from '@/utils'

export function useWaNavigation(): UseWaNavigationReturn {
  function open(variant: WaVariant, customMessage?: string): void {
    const message = customMessage ?? getMessageForVariant(variant)
    const url = buildWaUrl(getWaPhone(), message)
    trackEvent('whatsapp_click', { cta_variant: variant })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function openWithCalcResult(result: CalcResult): void {
    const message = getMessageForVariant('calc', result)
    const url = buildWaUrl(getWaPhone(), message)
    trackEvent('calc_wa_click', { calc_sector: result.sectorLabel, calc_monthly: result.monthly })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return { open, openWithCalcResult }
}
