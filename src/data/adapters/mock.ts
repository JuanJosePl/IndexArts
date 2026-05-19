/**
 * data/adapters/mock.ts
 *
 * Adaptador mock — implementa DataStore con arrays en memoria.
 * Para migrar a un CMS: crear data/adapters/cms.ts con la misma interfaz
 * y cambiar la importación en data/index.ts. Ningún componente se toca.
 *
 * [ISSUE-4] Adapters pattern — swap a CMS sin tocar componentes.
 */
import type {
  DataStore,
  ServiceItem,
  CaseItem,
  CalcSector,
  MetricItem,
  ProjectItem,
} from '@/types'

// ─── Servicios ────────────────────────────────────────────────────────────────

const services: ServiceItem[] = [
  {
    id: 'sistema-ventas',
    number: '01',
    title: 'Tu negocio cotizando y agendando mientras duermes',
    description:
      'Canal de ventas 24/7 con cotizaciones automáticas, agendamiento integrado y seguimiento sin que nadie esté online. Diseño, desarrollo y automatización en un solo sistema.',
    price: 'Desde $4.500.000 COP',
    deliveryTime: 'Entrega en 21–28 días',
    waVariant: 'servicios',
  },
  {
    id: 'canal-propio',
    number: '02',
    title: 'Deja de pagarle el 30% a las plataformas',
    description:
      'Canal de pedidos propio — web + WhatsApp + domicilio directo. Sin comisiones, sin intermediarios, con toda la data de tus clientes en tus manos.',
    price: 'Desde $5.800.000 COP',
    deliveryTime: 'Entrega en 25–35 días',
    waVariant: 'servicios',
  },
  {
    id: 'bot-respuesta',
    number: '03',
    title: 'Ningún prospecto sin respuesta en menos de 3 minutos',
    description:
      'Bot inteligente en WhatsApp + Instagram que califica, cotiza y agenda. Sin perder el tono de tu marca. Sin respuestas robóticas que ahuyentan clientes.',
    price: 'Desde $2.200.000 COP',
    deliveryTime: 'Activo en 10–14 días',
    waVariant: 'servicios',
  },
  {
    id: 'seo-local',
    number: '04',
    title: 'Tu marca en Google antes que tu competencia',
    description:
      'SEO técnico + contenido + reputación local. El cliente que busca lo que tú haces en Barranquilla, te encuentra a ti primero. No a ellos.',
    price: 'Desde $1.800.000 COP/mes',
    deliveryTime: 'Resultados visibles en 60 días',
    waVariant: 'servicios',
  },
]

// ─── Casos de éxito ───────────────────────────────────────────────────────────

const cases: CaseItem[] = [
  {
    id: 'clinica-bquilla-2026',
    client: 'Clínica',
    sector: 'clinica',
    location: 'Barranquilla',
    period: 'Ene–Mar 2026',
    metric: '23',
    metricLabel: 'citas recuperadas',
  },
  {
    id: 'restaurante-bquilla-q1',
    client: 'Restaurante',
    sector: 'restaurante',
    location: 'Barranquilla',
    period: 'Primer trimestre 2026',
    metric: '$11.8M',
    metricLabel: 'ahorrados en comisiones',
  },
  {
    id: 'consultoria-bquilla-2026',
    client: 'Consultoría',
    sector: 'consultoria',
    location: 'Barranquilla',
    period: '30 días · sistema activo',
    metric: '0',
    metricLabel: 'prospectos perdidos',
  },
]

// ─── Sectores calculadora ─────────────────────────────────────────────────────

const sectors: CalcSector[] = [
  {
    id: 'clinica',
    label: 'Clínica / Bienestar / Médico',
    icon: '🏥',
    fields: [
      {
        id: 'citas',
        label: 'Citas agendadas al mes',
        placeholder: 'Ej: 80',
        defaultValue: 80,
      },
      {
        id: 'ticket',
        label: 'Valor promedio por cita (COP)',
        placeholder: 'Ej: 180000',
        defaultValue: 180000,
        prefix: '$',
      },
      {
        id: 'noshow',
        label: '% de no-shows (citas que no aparecen)',
        placeholder: 'Ej: 22',
        defaultValue: 22,
        suffix: '%',
      },
    ],
    calculate: (values) => {
      const citas  = values['citas']  ?? 80
      const ticket = values['ticket'] ?? 180000
      const ns     = (values['noshow'] ?? 22) / 100
      return Math.round(citas * ns * ticket)
    },
    lossContext: 'citas perdidas por no-shows',
  },
  {
    id: 'restaurante',
    label: 'Restaurante / Gastronomía',
    icon: '🍽️',
    fields: [
      {
        id: 'ventas',
        label: 'Ventas mensuales totales (COP)',
        placeholder: 'Ej: 120000000',
        defaultValue: 120000000,
        prefix: '$',
      },
      {
        id: 'pct',
        label: '% en plataformas (Rappi/iFood)',
        placeholder: 'Ej: 40',
        defaultValue: 40,
        suffix: '%',
      },
      {
        id: 'comision',
        label: 'Comisión promedio (%)',
        placeholder: 'Ej: 30',
        defaultValue: 30,
        suffix: '%',
      },
    ],
    calculate: (values) => {
      const ventas   = values['ventas']   ?? 120000000
      const pct      = (values['pct']     ?? 40) / 100
      const comision = (values['comision'] ?? 30) / 100
      return Math.round(ventas * pct * comision)
    },
    lossContext: 'pagados en comisiones a plataformas',
  },
  {
    id: 'consultoria',
    label: 'Consultoría / Servicios B2B',
    icon: '💼',
    fields: [
      {
        id: 'prospectos',
        label: 'Prospectos recibidos al mes',
        placeholder: 'Ej: 15',
        defaultValue: 15,
      },
      {
        id: 'perdidos',
        label: '% sin respuesta oportuna',
        placeholder: 'Ej: 40',
        defaultValue: 40,
        suffix: '%',
      },
      {
        id: 'ticket',
        label: 'Valor promedio de cierre (COP)',
        placeholder: 'Ej: 2500000',
        defaultValue: 2500000,
        prefix: '$',
      },
    ],
    calculate: (values) => {
      const prospectos = values['prospectos'] ?? 15
      const perdidos   = (values['perdidos']  ?? 40) / 100
      const ticket     = values['ticket']     ?? 2500000
      return Math.round(prospectos * perdidos * ticket)
    },
    lossContext: 'en prospectos sin respuesta oportuna',
  },
  {
    id: 'comercio',
    label: 'Comercio / Retail con web',
    icon: '🛒',
    fields: [
      {
        id: 'visitas',
        label: 'Visitas mensuales a tu web',
        placeholder: 'Ej: 2000',
        defaultValue: 2000,
      },
      {
        id: 'conv',
        label: 'Tasa de conversión actual (%)',
        placeholder: 'Ej: 1.2',
        defaultValue: 1.2,
        suffix: '%',
      },
      {
        id: 'ticket',
        label: 'Ticket promedio (COP)',
        placeholder: 'Ej: 85000',
        defaultValue: 85000,
        prefix: '$',
      },
    ],
    calculate: (values) => {
      const visitas = values['visitas'] ?? 2000
      const actual  = (values['conv']   ?? 1.2) / 100
      const target  = 0.04 // objetivo de conversión: 4%
      const ticket  = values['ticket']  ?? 85000
      return Math.round(visitas * (target - actual) * ticket)
    },
    lossContext: 'en ventas por baja conversión web',
  },
]

// ─── Métricas Hero ────────────────────────────────────────────────────────────

const heroMetrics: MetricItem[] = [
  {
    value: '$11.8M',
    label: 'Recuperados en comisiones · Q1 2026',
  },
  {
    value: '23',
    label: 'Citas recuperadas · mes 1',
  },
  {
    value: '0',
    label: 'Prospectos perdidos en 30 días',
  },
]

// ─── Métricas Transición (sección #trans) ────────────────────────────────────
// Estas alimentan AnimatedStats — los valores numéricos para el counter animado

const transitionStats: MetricItem[] = [
  {
    value: '23',
    label: 'citas recuperadas',
    context: 'Clínica · Bquilla · Ene–Mar 2026',
  },
  {
    value: '11.8',      // el island formatea como $11.8M
    label: 'ahorrados en comisiones',
    context: 'Restaurante · primer trimestre',
  },
  {
    value: '0',
    label: 'prospectos perdidos',
    context: 'Consultoría · 30 días · sistema activo',
  },
]

// ─── Proyectos ────────────────────────────────────────────────────────────────
// Añadir después del array de cases

const projects: ProjectItem[] = [
  {
    id: 'clinica-dermavida',
    title: 'DermaVida',
    sector: 'clinica',
    location: 'Barranquilla',
    description:
      'Sistema de agendamiento automático y web de alta conversión. Confirmación vía WhatsApp 24/7, cero no-shows.',
    result: '23 citas recuperadas · mes 1',
    thumbnail:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&q=85&auto=format&fit=crop',
    tag: 'Clínica · Automatización',
  },
  {
    id: 'restaurante-muelle',
    title: 'El Muelle Gastro',
    sector: 'restaurante',
    location: 'Barranquilla',
    description:
      'Canal de pedidos propio — web + WhatsApp + domicilio directo. Eliminaron Rappi completamente en 45 días.',
    result: '$11.8M ahorrados · Q1 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85&auto=format&fit=crop',
    tag: 'Restaurante · Canal propio',
  },
  {
    id: 'consultoria-aserta',
    title: 'Aserta B2B',
    sector: 'consultoria',
    location: 'Barranquilla',
    description:
      'Bot inteligente de calificación y seguimiento. Respuesta garantizada en menos de 3 minutos, sin importar la hora.',
    result: '0 prospectos perdidos · 30 días',
    thumbnail:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85&auto=format&fit=crop',
    tag: 'B2B · Bot WhatsApp',
  },
  {
    id: 'comercio-nova',
    title: 'Nova Commerce',
    sector: 'comercio',
    location: 'Barranquilla',
    description:
      'Rediseño web orientado a conversión + SEO local técnico. De invisible a primera posición en búsquedas locales.',
    result: 'Conversión ×3.4 · 60 días',
    thumbnail:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop',
    tag: 'Retail · SEO · Conversión',
  },
]

// ─── Implementación del adaptador ────────────────────────────────────────────

function makeSource<T extends { id: string }>(items: T[]) {
  return {
    getAll:   async () => items,
    getById:  async (id: string) => items.find((i) => i.id === id),
  }
}

export const mockDataStore: DataStore = {
  services: makeSource(services),
  cases:    makeSource(cases),
  sectors:  makeSource(sectors),
  projects: makeSource(projects),
  metrics: {
    hero:       async () => heroMetrics,
    transition: async () => transitionStats,
  },
}