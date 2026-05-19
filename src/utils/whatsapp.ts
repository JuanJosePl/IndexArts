/**
 * utils/whatsapp.ts — infraestructura pura
 *
 * SOLO construye URLs de WhatsApp. Sin lógica de negocio.
 * Los mensajes se reciben como parámetro — vienen de domain/whatsapp-message.ts
 *
 * [ISSUE-2] islands no importan esto directamente — usan hooks/use-wa-navigation
 */

export function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function getWaPhone(): string {
  return import.meta.env.PUBLIC_WA_PHONE ?? '573001234567'
}
