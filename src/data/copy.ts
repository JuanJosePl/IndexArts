/**
 * data/copy.ts — copy editorial de la landing IndexArts
 *
 * Solo strings de UI (headlines, labels, CTAs, textos descriptivos).
 * Los mensajes de WhatsApp son lógica de negocio → domain/whatsapp-message.ts
 *
 * Uso en componentes Astro:
 *   import { copy } from '@/data/copy'
 *   <h1>{copy.hero.h1.line1}</h1>
 */

export const copy = {

  // ── Navegación ──────────────────────────────────────────────────────────────
  nav: {
    logo:        'IndexArts',
    logoAccent:  'Arts',           // parte que va en rojo
    phone:       '+57 300 123 4567',
    links: [
      { label: 'Servicios',        href: '#servicios'   },
      { label: 'Por qué nosotros', href: '#diferencial' },
    ],
    cta:         'Diagnóstico gratis',
    ctaHref:     '#final',
  },

  // ── Hero ────────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'Barranquilla · Colombia · Diseño & Automatización',
    h1: {
      line1:    'Tu negocio tiene',
      line2:    'clientes reales.',
      emphasis: 'El sistema',          // en rojo itálico
      dim:      'para que no se escapen,\nlo construimos nosotros.',  // gris claro
    },
    subtitle:
      'Webs que venden, automatizaciones que trabajan de noche, sistemas que escalan sin que tú estés.',
    subtitleStrong:
      'Para negocios colombianos que ya están listos para el siguiente nivel.',
    ctaPrimary:       '¿Cuánto te está costando no tener esto? →',
    ctaPrimaryHref:   '#calc',
    ctaGhost:         'Ver qué construimos',
    ctaGhostHref:     '#servicios',
    metricsNote:      'Resultados verificables · Barranquilla · 2026–2026',
  },

  // ── Sección Dolor (Pain) ────────────────────────────────────────────────────
  pain: {
    eyebrow: 'El costo real de no tener el sistema',
    questions: [
      {
        h: '¿Cuántos prospectos perdiste este mes porque nadie respondió el sábado a las 9pm?',
        hEmphasis: 'porque nadie respondió el sábado a las 9pm?',
        note: 'Cada prospecto sin respuesta en menos de 5 minutos tiene 80% de probabilidad de ir donde la competencia. No es hipótesis — es el estudio de Harvard Business Review de 2023.',
      },
      {
        h: '¿Cuántas citas se perdieron porque el paciente escribió de noche y nadie confirmó?',
        hEmphasis: 'porque el paciente escribió de noche y nadie confirmó?',
        note: 'Un no-show en una clínica barranquillera vale entre $80.000 y $400.000 COP. Con 15 no-shows al mes son $6M que salen de tu bolsillo cada 30 días.',
      },
      {
        h: '¿Cuánto le pagaste a Rappi el mes pasado? Multiplícalo por 0.30.',
        hEmphasis: 'Multiplícalo por 0.30.',
        note: 'Un restaurante con $120M en ventas mensuales paga $36M en comisiones. Eso es un empleado y medio. Cada mes. Sin que te avisen cuando sube la tarifa.',
      },
    ],
    punch:     '"Todos esos números son reales.',
    punchEmphasis: 'Y tienen solución."',
    punchCta:  'Calculemos el costo exacto de tu negocio',
    punchCtaHref: '#calc',
  },

  // ── Calculadora ──────────────────────────────────────────────────────────────
  calc: {
    eyebrow:        'Calculadora de inacción',
    claim:          '¿Cuánto te cuesta no tener el sistema?',
    claimEmphasis:  'no tener',
    description:
      'Ingresa los datos reales de tu negocio. El número que sale no es una proyección — es lo que ya estás perdiendo cada mes. Sin exagerar.',
    ctaCalcular:    'Calcular mi costo mensual →',
    result: {
      label:        'Estás perdiendo cada mes',
      annualSuffix: 'al año — sin el sistema',
      cta:          'Recuperar este dinero con IndexArts →',
      trust:        'Tu WhatsApp se abrirá con este número. Respondemos antes de 2 horas.',
    },
  },

  // ── Sección Transición (Stats) ───────────────────────────────────────────────
  stats: {
    eyebrow: 'Hay negocios como el tuyo que ya lo resolvieron',
  },

  // ── Servicios ────────────────────────────────────────────────────────────────
  services: {
    eyebrow:      'Qué construimos — no cómo se llama la tecnología',
    cta:          'Quiero hablar de mi negocio →',
    ctaHref:      '#final',
    ctaGhost:     'Por qué IndexArts',
    ctaGhostHref: '#diferencial',
  },

  // ── Diferencial ──────────────────────────────────────────────────────────────
  differential: {
    eyebrow: 'Por qué no somos otra agencia',
    tableHeaders: {
      aspect:  'Aspecto',
      others:  'Agencias típicas',
      ours:    'IndexArts',
    },
    rows: [
      {
        aspect:  'Lo que venden',
        others:  'Un entregable bonito. Diseño, web o app.',
        ours:    'El resultado del entregable. Medible en pesos.',
        oursPositive: true,
      },
      {
        aspect:  'Precio visible',
        others:  'No. "Cotizamos según el proyecto."',
        ours:    'Sí. Desde el primer contacto.',
        othersNegative: true,
        oursPositive:   true,
      },
      {
        aspect:  'Garantía real',
        others:  'Satisfacción subjetiva. Sin métricas.',
        ours:    '60 días para recuperar la inversión. Si no, seguimos sin cobrar más.',
        othersNegative: true,
        oursPositive:   true,
      },
      {
        aspect:  'Después de entregar',
        others:  'Desaparecen o cobran mantenimiento.',
        ours:    'Monitoreamos resultados 90 días post-entrega.',
        othersNegative: true,
        oursPositive:   true,
      },
      {
        aspect:  'Contexto local',
        others:  'Plantillas gringas adaptadas.',
        ours:    'Construido para el cliente colombiano, el mercado local y el WhatsApp como canal real.',
        othersNegative: true,
        oursPositive:   true,
      },
    ],
    promise:
      '"Si en 60 días el sistema no recuperó lo que costó,',
    promiseEmphasis:
      'lo seguimos trabajando sin cobrar más.',
    promiseSuffix:
      'Así de seguros estamos."',
  },

  // ── CTA Final ────────────────────────────────────────────────────────────────
  finalCta: {
    eyebrow:  'El siguiente paso es el más fácil',
    h2: {
      line1:    '15 minutos.',
      emphasis: 'Sin compromiso.',
      line3:    'Con el número.',
    },
    subtitle:
      'Una llamada o WhatsApp para entender tu negocio y decirte exactamente cuánto te está costando no tener el sistema — y cuánto te costaría tenerlo. Sin pitch. Sin presión. Con datos reales.',
    cta:      'Hablar con IndexArts ahora →',
    trust: [
      { text: 'Respondemos antes de 2 horas en horario hábil', dot: 'green' },
      { text: 'Barranquilla, Colombia · Presencia física',      dot: 'neutral' },
      { text: 'Primera consulta 100% gratuita',                 dot: 'neutral' },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    logo:       'IndexArts',
    logoAccent: 'Arts',
    info:       'Barranquilla · Colombia · +57 300 123 4567 · hola@indexarts.co',
    copyright:  '© 2026 IndexArts · Diseño & Automatización',
  },

} as const

// Tipo inferido para uso en componentes con autocompletado
export type SiteCopy = typeof copy