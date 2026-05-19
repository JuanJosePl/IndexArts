/**
 * domain/calculator.ts
 *
 * Lógica de negocio pura para la calculadora de ROI.
 * Sin dependencias de framework. Testeable con Node puro.
 *
 * Regla: esta función no sabe nada de React, Astro, ni env vars.
 *
 * Las fórmulas por sector viven en data/adapters/mock.ts dentro de cada
 * CalcSector.calculate() — aquí solo vive la orquestación y validación.
 */
import type { CalcSector, CalcResult } from '@/types'

// ─── Orquestador principal ────────────────────────────────────────────────────

/**
 * Calcula la pérdida mensual de un negocio dado un sector y sus valores.
 * Recibe el sector completo (con su función calculate) y el mapa de valores
 * ingresados por el usuario.
 *
 * @example
 * const result = calculateLoss(clinicaSector, { citas: 100, ticket: 200000, noshow: 25 })
 * // → { monthly: 5000000, annual: 60000000, context: 'citas perdidas por no-shows', sectorLabel: 'Clínica / Bienestar / Médico' }
 */
export function calculateLoss(
  sector: CalcSector,
  values: Record<string, number>
): CalcResult {
  // Mezclar valores del usuario con defaults del sector
  const mergedValues: Record<string, number> = {}
  for (const field of sector.fields) {
    mergedValues[field.id] =
      values[field.id] !== undefined && !isNaN(values[field.id])
        ? values[field.id]
        : field.defaultValue
  }

  const monthly = Math.max(0, sector.calculate(mergedValues))

  return {
    monthly,
    annual:      monthly * 12,
    context:     sector.lossContext,
    sectorLabel: sector.label,
  }
}

// ─── Utilidades de validación ─────────────────────────────────────────────────

/**
 * Type guard — verifica que el resultado tenga un valor real calculable.
 * Usado en islands para mostrar/ocultar el bloque de resultado.
 */
export function isValidResult(result: CalcResult | null): result is CalcResult {
  return result !== null && result.monthly > 0
}

/**
 * Verifica que los valores ingresados por el usuario sean todos números válidos.
 * Útil para deshabilitar el botón "Calcular" si hay campos vacíos.
 */
export function areValuesComplete(
  sector: CalcSector,
  values: Record<string, number>
): boolean {
  return sector.fields.every(
    (field) =>
      values[field.id] !== undefined &&
      !isNaN(values[field.id]) &&
      values[field.id] >= 0
  )
}

/**
 * Inicializa el mapa de valores con los defaults de un sector.
 * Llamado cuando el usuario cambia de sector en la calculadora.
 */
export function getDefaultValues(
  sector: CalcSector
): Record<string, number> {
  return Object.fromEntries(
    sector.fields.map((field) => [field.id, field.defaultValue])
  )
}