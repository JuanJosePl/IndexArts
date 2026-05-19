/**
 * utils/index.ts — barrel público
 *
 * Los consumidores importan desde '@/utils', no desde '@/utils/math' etc.
 * Cambiar la ruta interna de un util no rompe ningún import externo.
 *
 * [ISSUE-6]
 */
export { easeOutCubic, lerp, clamp }   from './math'
export { formatCOP, formatNumber }     from './formatters'
export { buildWaUrl, getWaPhone }      from './whatsapp'
export { trackEvent }                  from './analytics'
export { cn }                          from './cn'
export { scrollToId }                  from './scroll'
