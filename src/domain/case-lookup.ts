/**
 * domain/case-lookup.ts
 *
 * Lógica de consulta sobre casos de éxito.
 * Recibe el array de datos como parámetro — no importa data/ directamente.
 * Esto hace que sea testeable sin instanciar el adaptador de datos.
 *
 * [ISSUE-3] Movido desde data/index.ts donde mezclaba lógica con re-exports.
 */
import type { CaseItem, CalcSector } from '@/types'

export function findCaseById(cases: CaseItem[], id: string): CaseItem | undefined {
  return cases.find((c) => c.id === id)
}

export function findSectorBySlug(sectors: CalcSector[], slug: string): CalcSector | undefined {
  return sectors.find((s) => s.id === slug)
}

export function filterCasesBySector(cases: CaseItem[], sector: string): CaseItem[] {
  return cases.filter((c) => c.sector.toLowerCase() === sector.toLowerCase())
}
