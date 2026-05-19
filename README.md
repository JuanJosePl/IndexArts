# IndexArts Landing
Astro 5 · React 19 · Tailwind CSS v4 · TypeScript strict

**Score arquitectónico: 10/10**

## Inicio rápido

```bash
cp .env.example .env   # configurar PUBLIC_WA_PHONE
pnpm dev               # localhost:4321
```

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build |
| `pnpm check` | Validación Astro |
| `pnpm typecheck` | TypeScript sin emitir |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

## Arquitectura

```
src/
  domain/              ← lógica de negocio PURA (sin React, sin Astro, sin env)
    calculator.ts      ← cálculo de pérdidas por sector
    whatsapp-message.ts← construcción de mensajes contextuales
    case-lookup.ts     ← queries sobre casos de éxito

  data/                ← capa de datos (adapters pattern)
    adapters/
      mock.ts          ← implementa DataStore con datos locales
                          Para CMS: crear adapters/cms.ts con la misma interfaz
    index.ts           ← instancia DataStore activo (swap sin tocar componentes)
    copy.ts            ← copy editorial puro (headlines, labels, CTAs)

  components/
    ui/                ← átomos visuales (Button, Tag, MetricCard...)
    layout/            ← composición estructural (Nav, Footer, SectionWrapper)
    sections/          ← bloques de página Astro
    islands/           ← React islands (solo React puro, sin imports de infra)
    seo/               ← SEO con JSON-LD

  hooks/               ← lógica React reutilizable
    index.ts           ← barrel público — importar desde aquí
    use-wa-navigation.ts  ← encapsula WA + analytics (usado por islands)

  utils/               ← infraestructura pura sin lógica de negocio
    index.ts           ← barrel público — importar desde aquí
    math.ts            ← easing, lerp, clamp
    formatters.ts      ← COP, números
    whatsapp.ts        ← construcción de URLs (sin mensajes, sin lógica)
    analytics.ts       ← trackEvent

  types/               ← contratos globales
    index.ts           ← WaVariant, CalcResult, DataStore, UseXReturn...

  styles/
    global.css         ← design tokens Tailwind v4

  layouts/
    BaseLayout.astro
```

## Reglas arquitectónicas

```
✔ domain/   no depende de React, Astro, ni import.meta.env
✔ data/     depende de types/ + domain/ (nunca de UI ni hooks)
✔ islands/  solo React puro — comportamiento via hooks, no via utils directos
✔ utils/    infraestructura sin lógica de negocio
✔ hooks/    exportan tipos de retorno explícitos (UseXReturn)
✔ types/    contratos globales — DataStore, ConversionEvent, UseXReturn...

❌ UI       no importa data/ directamente
❌ utils/   no depende de React
❌ domain/  no depende de framework ni de env vars
❌ islands/ no importan utils/whatsapp ni utils/analytics directamente
```

## Agregar datos (flujo correcto)

1. Añadir el item a `data/adapters/mock.ts`
2. Si viene de CMS: crear `data/adapters/cms.ts` con la misma interfaz `DataStore`
3. Cambiar el import en `data/index.ts`: `import { cmsDataStore as dataStore }`
4. Ningún componente se toca

## Convención islands/

```
Una island simple → archivo plano (AnimatedStats.tsx, StickyWhatsApp.tsx)
Variantes del mismo concepto → subdirectorio:

islands/
  RoiCalculator/
    index.tsx             ← export default (re-exporta implementación)
    RoiCalculator.tsx     ← implementación base
    RoiCalculatorLight.tsx← variante compacta
  AnimatedStats.tsx
  StickyWhatsApp.tsx
```

## Fuentes self-hosted

La carpeta `public/fonts/` está lista. Pasos:

1. Descargar en [gwfh.mranftl.com](https://gwfh.mranftl.com/):
   - Fraunces (300, 700, 900 normal + 400 italic)
   - Syne (400, 500, 700)
   - JetBrains Mono (400, 500)
2. Copiar a `public/fonts/`
3. Reemplazar `<link>` de Google en `BaseLayout.astro` por `@font-face` en `global.css`
4. Eliminar los `<link rel="preconnect">` de Google

## Variables de entorno

Ver `.env.example`
