/**
 * domain/whatsapp-message.ts
 *
 * Construcción de mensajes de negocio para WhatsApp.
 * Sin dependencias de framework. El copy vive aquí porque
 * es lógica de negocio (qué decir), no infraestructura (cómo enviarlo).
 *
 * Regla: esta función no construye URLs. Solo produce strings de mensaje.
 */
import type { WaVariant, CalcResult } from '@/types'

export const WA_MESSAGES: Record<WaVariant, string> = {
  hero:      'Hola IndexArts, quiero saber cuánto me está costando no tener el sistema.',
  calc:      '', // generado dinámicamente por buildCalcMessage()
  servicios: 'Hola IndexArts, vi los servicios. Quiero hablar de mi negocio.',
  casos:     'Hola IndexArts, quiero el mismo resultado para mi negocio.',
  final:     'Hola IndexArts, quiero mi diagnóstico gratuito ahora.',
  nav:       'Hola IndexArts, quiero más información.',
}

export function buildCalcMessage(result: CalcResult): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(result.monthly)

  return `Hola IndexArts, calculé que estoy perdiendo ${formatted}/mes (${result.context}). Quiero ver cómo resolverlo.`
}

export function getMessageForVariant(variant: WaVariant, result?: CalcResult): string {
  if (variant === 'calc' && result) return buildCalcMessage(result)
  return WA_MESSAGES[variant]
}
