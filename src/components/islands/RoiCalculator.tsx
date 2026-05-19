/**
 * src/components/islands/RoiCalculator.tsx
 *
 * HIDRATACIÓN: client:visible
 *
 * Island de la calculadora de inacción ROI.
 * - Arquitectura: UI → domain/calculator → useWaNavigation → domain/whatsapp-message
 * - NO importa utils/ directamente. Usa el barrel @/utils para formatCOP.
 * - NO importa data/ directamente. Recibe sectors como prop desde pages/index.astro.
 * - Estado local: sector activo, valores de inputs, resultado.
 */
import { useState, useCallback } from 'react'
import type { CalcSector, CalcResult } from '@/types'
import { calculateLoss, isValidResult, getDefaultValues } from '@/domain/calculator'
import { useWaNavigation } from '@/hooks'
import { formatCOP } from '@/utils'
import { copy } from '@/data/copy'

interface RoiCalculatorProps {
  sectors?: CalcSector[]
}

export default function RoiCalculator({ sectors = [] }: RoiCalculatorProps) {
  const [activeSector, setActiveSector] = useState<CalcSector>(sectors[0] ?? null!)
  const [values, setValues] = useState<Record<string, number>>(
    sectors[0] ? getDefaultValues(sectors[0]) : {}
  )
  const [result, setResult] = useState<CalcResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const { openWithCalcResult } = useWaNavigation()
  const { calc: c } = copy

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSectorChange = useCallback((sector: CalcSector) => {
    setActiveSector(sector)
    setValues(getDefaultValues(sector))
    setResult(null)
    setShowResult(false)
  }, [])

  const handleInputChange = useCallback((fieldId: string, raw: string) => {
    const parsed = parseFloat(raw.replace(/[^0-9.]/g, ''))
    setValues((prev) => ({ ...prev, [fieldId]: isNaN(parsed) ? 0 : parsed }))
  }, [])

  const handleCalculate = useCallback(() => {
    if (!activeSector) return
    const r = calculateLoss(activeSector, values)
    setResult(r)
    setShowResult(true)
    // Scroll suave al resultado
    setTimeout(() => {
      document.getElementById('calc-result-block')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }, 80)
  }, [activeSector, values])

  const handleWaClick = useCallback(() => {
    if (!isValidResult(result)) return
    openWithCalcResult(result)
  }, [result, openWithCalcResult])

  // ── Render ───────────────────────────────────────────────────────────────────

  if (!sectors.length) return null

  return (
    <div style={{ padding: 'var(--section-py) var(--section-px)' }}>

      {/* Eyebrow */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(242,237,230,0.3)',
          display: 'inline-block',
          marginBottom: '44px',
          paddingBottom: '6px',
          borderBottom: '1px solid var(--color-border-2)',
        }}
      >
        {c.eyebrow}
      </span>

      {/* Grid principal */}
      <div className="calc-layout-grid">

        {/* ── Columna izquierda — claim + selector sector ── */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(22px, 4vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '18px',
              color: 'var(--color-cream-100)',
            }}
          >
            {c.claim.replace(c.claimEmphasis, '')}{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-brand-red)' }}>
              {c.claimEmphasis}
            </em>{' '}
            {/* la palabra "el sistema?" al final */}
            el sistema?
          </h2>

          <p
            style={{
              fontSize: '13px',
              color: 'rgba(242,237,230,0.65)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}
          >
            {c.description}
          </p>

          {/* Selector de sectores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sectors.map((sector) => {
              const isActive = activeSector?.id === sector.id
              return (
                <button
                  key={sector.id}
                  onClick={() => handleSectorChange(sector)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: `1px solid ${isActive ? 'var(--color-brand-red)' : 'var(--color-border-2)'}`,
                    background: isActive ? 'rgba(192,57,43,0.12)' : 'transparent',
                    color: isActive ? 'var(--color-cream-100)' : 'rgba(242,237,230,0.65)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      const t = e.currentTarget
                      t.style.background = 'rgba(192,57,43,0.08)'
                      t.style.borderColor = 'rgba(192,57,43,0.5)'
                      t.style.color = 'var(--color-cream-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const t = e.currentTarget
                      t.style.background = 'transparent'
                      t.style.borderColor = 'var(--color-border-2)'
                      t.style.color = 'rgba(242,237,230,0.65)'
                    }
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      width: '28px',
                      textAlign: 'center',
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  >
                    {sector.icon}
                  </span>
                  {sector.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Columna derecha — inputs + resultado ── */}
        <div>

          {/* Inputs dinámicos del sector activo */}
          {activeSector && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {activeSector.fields.map((field) => (
                <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label
                    htmlFor={`calc-${field.id}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'rgba(242,237,230,0.3)',
                    }}
                  >
                    {field.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    {field.prefix && (
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          color: 'rgba(242,237,230,0.3)',
                          pointerEvents: 'none',
                        }}
                      >
                        {field.prefix}
                      </span>
                    )}
                    <input
                      id={`calc-${field.id}`}
                      type="number"
                      placeholder={field.placeholder}
                      defaultValue={field.defaultValue}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--color-ink-700)',
                        border: '1px solid var(--color-border-2)',
                        color: 'var(--color-cream-100)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        padding: field.prefix ? '10px 12px 10px 24px' : '10px 12px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        appearance: 'none',
                        MozAppearance: 'textfield',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(192,57,43,0.5)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border-2)'
                      }}
                    />
                    {field.suffix && (
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'rgba(242,237,230,0.3)',
                          pointerEvents: 'none',
                        }}
                      >
                        {field.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón calcular */}
          <button
            onClick={handleCalculate}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--color-brand-red)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-brand-red2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-brand-red)'
            }}
          >
            {c.ctaCalcular}
          </button>

          {/* Bloque de resultado */}
          <div
            id="calc-result-block"
            style={{
              marginTop: '18px',
              padding: '20px',
              border: '1px solid rgba(192,57,43,0.3)',
              background: 'rgba(192,57,43,0.07)',
              opacity: showResult ? 1 : 0,
              transform: showResult ? 'scale(1)' : 'scale(0.97)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              pointerEvents: showResult ? 'auto' : 'none',
            }}
          >
            {isValidResult(result) ? (
              <>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'rgba(242,237,230,0.3)',
                    marginBottom: '6px',
                  }}
                >
                  {c.result.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(26px, 4vw, 38px)',
                    fontWeight: 500,
                    color: 'var(--color-cream-100)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {formatCOP(result.monthly)}
                  <span style={{ fontSize: '0.5em', opacity: 0.6 }}> / mes</span>
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--color-brand-red2)',
                    marginBottom: '16px',
                  }}
                >
                  {formatCOP(result.annual)} {c.result.annualSuffix}
                </p>
                <button
                  onClick={handleWaClick}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    background: 'var(--color-brand-red)',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 500,
                    textAlign: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-brand-red2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-brand-red)'
                  }}
                >
                  {c.result.cta}
                </button>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'rgba(242,237,230,0.15)',
                    textAlign: 'center',
                    marginTop: '8px',
                  }}
                >
                  {c.result.trust}
                </p>
              </>
            ) : (
              /* Resultado en cero — sector sin pérdida calculable */
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'rgba(242,237,230,0.4)',
                  textAlign: 'center',
                }}
              >
                Revisa los valores ingresados — el cálculo dio 0.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Grid responsive — estilos en línea para no pisar Tailwind v4 */}
      <style>{`
        .calc-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 960px;
          align-items: start;
        }
        @media (max-width: 700px) {
          .calc-layout-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

    </div>
  )
}