/**
 * src/components/islands/AnimatedStats.tsx
 *
 * HIDRATACIÓN: client:visible
 *
 * Recibe stats como prop desde Stats.astro (data inyectada en build time).
 * Si se monta sin props (caso index.astro sin pasar stats), retorna null.
 *
 * Flujo de datos:
 *   dataStore.metrics.transition() → Stats.astro → AnimatedStats (prop)
 *
 * Formato especial:
 *   "11.8" → anima 0→118 (×10) y muestra como "$11.8M" — evita pérdida
 *   de decimales ya que useCounter devuelve enteros via Math.round().
 */
import type { RefObject } from 'react'
import type { MetricItem } from '@/types'
import { useInView, useCounter } from '@/hooks'

// ─── Props ────────────────────────────────────────────────────────────────────

interface AnimatedStatsProps {
  stats?: MetricItem[]
}

// ─── Helpers de formato ───────────────────────────────────────────────────────

interface StatConfig {
  end: number
  format: (count: number) => string
  animationDelay: number
}

/**
 * Determina el valor de animación y la función de formato
 * según el valor crudo del stat.
 *
 * "11.8" → end:118, display "$11.8M"  (valor monetario en millones)
 * "23"   → end:23,  display "23"
 * "0"    → end:0,   display "0"
 */
function getStatConfig(stat: MetricItem, index: number): StatConfig {
  const raw = parseFloat(stat.value)
  const isDecimalMillions = stat.value.includes('.')

  if (isDecimalMillions) {
    return {
      end: Math.round(raw * 10),          // 11.8 → 118
      format: (v) => `$${(v / 10).toFixed(1)}M`,
      animationDelay: index * 200,
    }
  }

  return {
    end: raw,
    format: (v) => String(Math.round(v)),
    animationDelay: index * 200,
  }
}

// ─── Componente individual ────────────────────────────────────────────────────

interface StatItemProps {
  stat: MetricItem
  index: number
}

function StatItem({ stat, index }: StatItemProps) {
  const { ref, inView } = useInView()
  const { end, format, animationDelay } = getStatConfig(stat, index)
  const { value: count } = useCounter(end, inView, 1800)

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `
          opacity  0.8s cubic-bezier(0.22, 1, 0.36, 1) ${animationDelay}ms,
          transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${animationDelay}ms
        `,
      }}
    >
      {/* Número animado */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(38px, 6vw, 68px)',
          fontWeight: 500,
          lineHeight: 1,
          color: '#1A1A1A',
          marginBottom: '8px',
          letterSpacing: '-0.02em',
        }}
      >
        {format(count)}
      </p>

      {/* Label — serif itálica */}
      <p
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(14px, 2vw, 20px)',
          fontStyle: 'italic',
          color: '#1A1A1A',
          lineHeight: 1.2,
          marginBottom: '5px',
        }}
      >
        {stat.label}
      </p>

      {/* Contexto / meta */}
      {stat.context && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            color: 'rgba(26, 26, 26, 0.50)',
          }}
        >
          {stat.context}
        </p>
      )}
    </div>
  )
}

// ─── Island principal ─────────────────────────────────────────────────────────

export default function AnimatedStats({ stats = [] }: AnimatedStatsProps) {
  // Sin datos → null limpio.
  // Cubre el caso <AnimatedStats client:visible /> sin props en index.astro.
  if (!stats.length) return null

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(28px, 6vw, 72px)',
        maxWidth: '960px',
      }}
    >
      {stats.map((stat, i) => (
        <StatItem key={`${stat.label}-${i}`} stat={stat} index={i} />
      ))}
    </div>
  )
}