/** Formateo de datos. Sin lógica de negocio, sin dependencias de framework. */

export function formatCOP(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000)     return `$${Math.round(amount / 1_000)}K`
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n)
}
