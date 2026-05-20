// src/data/copy.ts
export const copy = {
  nav: {
    logo: 'IndexArts',
    logoAccent: 'Arts',
    phone: '+57 300 123 4567',
    links: [
      { label: 'Servicios', href: '#servicios' },
      { label: 'Por qué nosotros', href: '#diferencial' },
    ],
    cta: 'Diagnóstico gratis',
    ctaHref: '#final',
  },

  hero: {
    eyebrow: '3 negocios en Barranquilla · $11.8M recuperados · Q1 2026',

    h1: {
      line1: 'Tu negocio debería vender',
      line2: '24 horas al día.',
      emphasis: '24 horas al día.',
      dim: 'O ahora mismo estás perdiendo ventas que ya eran tuyas.',
    },

    subtitle:
      'Si un cliente escribe y no le respondes en menos de 5 minutos, ya lo perdiste.',

    subtitleStrong:
      'Y lo peor: probablemente ni te diste cuenta.\n\nConstruimos sistemas que cotizan, responden y cierran por ti — incluso mientras duermes.',

    ctaPrimary: 'Calcular cuánto estoy perdiendo ahora →',
    ctaPrimaryHref: '#calculadora',

    ctaGhost: 'Ver los casos reales →',
    ctaGhostHref: '#servicios',

    metricsNote: 'Resultados verificables · Barranquilla · Q1 2026',
  },

  pain: {
    eyebrow: 'Lo que le pasa a tu negocio ahora mismo',
    questions: [
      {
        h: 'Tu competencia está respondiendo a tus clientes. En este momento.',
        hEmphasis: 'En este momento.',
        note: 'Cada prospecto sin respuesta en menos de 5 minutos tiene 80% de probabilidad de ir donde la competencia. No es hipótesis — es el estudio de Harvard Business Review de 2023.',
      },
      {
        h: 'La gente te busca en Google y no te encuentra. Encuentra a ellos.',
        hEmphasis: 'Encuentra a ellos.',
        note: 'El 78% de búsquedas locales termina en una visita o compra en menos de 24 horas. Si no apareces primero, ese dinero se lo llevan.',
      },
      {
        h: 'Rappi se lleva el 30% de cada pedido. Ese margen es tuyo.',
        hEmphasis: 'Ese margen es tuyo.',
        note: 'Un restaurante con $120M en ventas mensuales paga $36M en comisiones. Eso es un empleado y medio. Cada mes. Sin que te avisen cuando sube la tarifa.',
      },
    ],
    punch: '"Todos esos números son reales.',
    punchEmphasis: 'Y tienen solución."',
    punchCta: 'Calculemos el costo exacto de tu negocio',
    punchCtaHref: '#calculadora',
  },

  calc: {
    eyebrow: 'Calculadora de inacción',
    claim: '¿Cuánto sale de tu bolsillo',
    claimEmphasis: 'cada mes sin el sistema?',
    description:
      'Completa los datos de tu negocio. El número que aparece no es una estimación — es lo que ya estás perdiendo ahora mismo.',
    ctaCalcular: 'Calcular mi pérdida mensual →',
    result: {
      label: 'Estás perdiendo cada mes',
      annualSuffix: 'al año — sin el sistema',
      cta: 'Recuperar este dinero con IndexArts →',
      trust: 'Tu WhatsApp se abrirá con este número. Respondemos antes de 2 horas.',
    },
  },

  stats: {
    eyebrow: 'Estos son los resultados reales',
  },

  services: {
    eyebrow: 'No vendemos tecnología. Resolvemos problemas.',
    cta: 'Quiero hablar de mi negocio →',
    ctaHref: '#final',
    ctaGhost: 'Por qué IndexArts',
    ctaGhostHref: '#diferencial',
  },

  differential: {
    eyebrow: 'No te vendemos un proyecto',
    tableHeaders: {
      aspect: 'Aspecto',
      others: 'Agencias típicas',
      ours: 'IndexArts',
    },
    rows: [
      {
        aspect: 'Lo que venden',
        others: 'Un entregable bonito. Diseño, web o app.',
        ours: 'El resultado del entregable. Medible en pesos.',
        oursPositive: true,
      },
      {
        aspect: 'Precio visible',
        others: 'No. "Cotizamos según el proyecto."',
        ours: 'Sí. Desde el primer contacto.',
        othersNegative: true,
        oursPositive: true,
      },
      {
        aspect: 'Garantía real',
        others: 'Satisfacción subjetiva. Sin métricas.',
        ours: '60 días para recuperar la inversión. Si no, seguimos sin cobrar más.',
        othersNegative: true,
        oursPositive: true,
      },
      {
        aspect: 'Después de entregar',
        others: 'Desaparecen o cobran mantenimiento.',
        ours: 'Monitoreamos resultados 90 días post-entrega.',
        othersNegative: true,
        oursPositive: true,
      },
      {
        aspect: 'Contexto local',
        others: 'Plantillas gringas adaptadas.',
        ours: 'Construido para el cliente colombiano, el mercado local y el WhatsApp como canal real.',
        othersNegative: true,
        oursPositive: true,
      },
    ],
    promise:
      '"Si en 60 días el sistema no recuperó lo que costó,',
    promiseEmphasis:
      'lo seguimos trabajando sin cobrar más.',
    promiseSuffix:
      'Así de seguros estamos."',
  },

  finalCta: {
    eyebrow: 'Ya calculaste lo que pierdes',
    h2: {
      line1: 'Ahora recupera',
      emphasis: 'ese dinero.',
      line3: '',
    },
    subtitle:
      'Una llamada de 15 minutos. Sin pitch. Sin presión. Te decimos exactamente qué sistema necesitas y cuánto te va a costar — antes de que firmes cualquier cosa.',
    cta: 'Hablar con IndexArts ahora →',
    trust: [
      { text: 'Respondemos antes de 2 horas en horario hábil', dot: 'green' },
      { text: 'Barranquilla, Colombia · Presencia física', dot: 'neutral' },
      { text: 'Primera consulta 100% gratuita', dot: 'neutral' },
    ],
  },

  footer: {
    logo: 'IndexArts',
    logoAccent: 'Arts',
    info: 'Barranquilla · Colombia · +57 300 123 4567 · hola@indexarts.co',
    copyright: '© 2026 IndexArts · Diseño & Automatización',
  },

} as const

export type SiteCopy = typeof copy