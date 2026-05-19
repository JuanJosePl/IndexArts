// ─── Dominio de negocio ────────────────────────────────────────────────────

export type WaVariant = 'hero' | 'calc' | 'servicios' | 'casos' | 'final' | 'nav'

export interface MetricItem { value: string; label: string; context?: string }

export interface ServiceItem {
  id: string
  number: string
  title: string
  description: string
  price: string
  deliveryTime: string
  waVariant: WaVariant
}

export interface CaseItem {
  id: string
  client: string
  sector: string
  location: string
  period: string
  metric: string
  metricLabel: string
  testimonial?: string
}

// ─── Proyectos ────────────────────────────────────────────────────────────────

export interface ProjectItem {
  id: string
  title: string
  sector: string
  location: string
  description: string
  result: string
  thumbnail: string
  tag: string
}

export interface CalcField {
  id: string
  label: string
  placeholder: string
  defaultValue: number
  prefix?: string
  suffix?: string
}

export interface CalcSector {
  id: string
  label: string
  icon: string
  fields: CalcField[]
  calculate: (values: Record<string, number>) => number
  lossContext: string
}

export interface CalcResult {
  monthly: number
  annual: number
  context: string
  sectorLabel: string
}

// ─── SEO ──────────────────────────────────────────────────────────────────

export interface SeoProps {
  title?: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

// ─── Analytics — [ISSUE-7 AUD / AUD-7] vocabulario de negocio centralizado ──

export type ConversionEvent =
  | 'whatsapp_click'
  | 'calc_result_shown'
  | 'calc_wa_click'
  | 'section_viewed'

export interface AnalyticsEventParams {
  cta_variant?: string
  calc_sector?: string
  calc_monthly?: number
  section_name?: string
}

// ─── Data layer — [ISSUE-4] DataSource<T> para adapters pattern ──────────────

export interface DataSource<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | undefined>
}

export interface DataStore {
  services: DataSource<ServiceItem>
  cases: DataSource<CaseItem>
  sectors: DataSource<CalcSector>
  projects: DataSource<ProjectItem>
  metrics: {
    hero(): Promise<MetricItem[]>
    transition(): Promise<MetricItem[]>
  }
}

// ─── Hooks — [ISSUE-5] tipos de retorno explícitos ───────────────────────────

export interface UseInViewReturn {
  ref: React.RefObject<HTMLElement | null>
  inView: boolean
}

export interface UseCounterReturn {
  value: number
}

export interface UseHoverReturn {
  isHovered: boolean
  handlers: {
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
}

export interface UseScrollYReturn {
  scrollY: number
}

export interface UseWaNavigationReturn {
  open: (variant: WaVariant, customMessage?: string) => void
  openWithCalcResult: (result: CalcResult) => void
}
