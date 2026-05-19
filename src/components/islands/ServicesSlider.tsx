/**
 * src/components/islands/ServicesSlider.tsx
 *
 * HIDRATACIÓN: client:visible
 *
 * HoverSlider pattern adaptado para IndexArts.
 * Requiere: pnpm add motion
 *
 * Arquitectura:
 * - Recibe services[] desde Services.astro (build time, dataStore)
 * - Imágenes mapeadas localmente — concern de UI, no del DataStore
 * - useWaNavigation para los CTAs de WhatsApp
 * - copy importado desde @/data/copy (patrón aceptado, ver RoiCalculator)
 *
 * Patrón visual:
 *   Izquierda: lista de servicios con char-stagger al hover
 *   Derecha:   imagen con clip-path reveal + overlay de metadata
 */

import {
  useState,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
} from 'react'
import { motion, MotionConfig } from 'motion/react'
import type { ServiceItem } from '@/types'
import { useWaNavigation } from '@/hooks'
import { copy } from '@/data/copy'

// ─── Imágenes por servicio (UI concern — IDs estables del mock) ───────────────

const SERVICE_IMAGES: Record<string, string> = {
  'sistema-ventas':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
  'canal-propio':
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop',
  'bot-respuesta':
    'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=900&q=80&auto=format&fit=crop',
  'seo-local':
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop',
}

// Labels cortos para el efecto char-stagger (títulos originales son muy largos)
const SERVICE_LABELS: Record<string, string> = {
  'sistema-ventas': 'Ventas automáticas',
  'canal-propio':   'Sin comisiones',
  'bot-respuesta':  'Respuesta en 3 min',
  'seo-local':      'Primero en Google',
}

// ─── Context del slider ───────────────────────────────────────────────────────

interface SliderContextValue {
  activeIndex: number
  setActiveIndex: (i: number) => void
}

const SliderContext = createContext<SliderContextValue>({
  activeIndex: 0,
  setActiveIndex: () => {},
})

const useSlider = () => useContext(SliderContext)

// ─── Helper: split texto en caracteres (preserva espacios) ───────────────────

function splitToChars(text: string): string[] {
  return text.split('')
}

// ─── Animación clip-path para imágenes ───────────────────────────────────────

const clipVariants = {
  visible: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { ease: [0.33, 1, 0.68, 1] as const, duration: 0.75 },
  },
  hidden: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    transition: { ease: [0.33, 1, 0.68, 1] as const, duration: 0.75 },
  },
}

// ─── Componente: char-stagger en hover ────────────────────────────────────────

function ServiceTitle({
  text,
  index,
}: {
  text: string
  index: number
}) {
  const { activeIndex, setActiveIndex } = useSlider()
  const isActive = activeIndex === index
  const chars = splitToChars(text)

  return (
    <span
      onMouseEnter={() => setActiveIndex(index)}
      style={{
        display: 'inline-block',
        cursor: 'default',
        lineHeight: 1,
        overflow: 'hidden',
      }}
    >
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{ display: 'inline-block', overflow: 'hidden', position: 'relative' }}
        >
          <MotionConfig
            transition={{
              delay: i * 0.018,
              duration: 0.28,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Char saliente */}
            <motion.span
              style={{
                display: 'inline-block',
                color: isActive
                  ? 'var(--color-cream-100)'
                  : 'rgba(242,237,230,0.22)',
                transition: 'color 0.3s ease',
              }}
              animate={isActive ? { y: '-115%' } : { y: '0%' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>

            {/* Char entrante — en rojo */}
            <motion.span
              style={{
                display: 'inline-block',
                position: 'absolute',
                left: 0,
                top: 0,
                color: 'var(--color-cream-100)',
              }}
              initial={{ y: '115%' }}
              animate={isActive ? { y: '0%' } : { y: '115%' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </MotionConfig>
        </span>
      ))}
    </span>
  )
}

// ─── Componente: imagen con overlay de metadata ───────────────────────────────

function ServiceImage({
  service,
  index,
}: {
  service: ServiceItem
  index: number
}) {
  const { activeIndex } = useSlider()
  const isActive = activeIndex === index
  const imageUrl =
    SERVICE_IMAGES[service.id] ?? SERVICE_IMAGES['sistema-ventas']

  return (
    <motion.div
      variants={clipVariants}
      animate={isActive ? 'visible' : 'hidden'}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {/* Imagen de fondo */}
      <img
        src={imageUrl}
        alt={service.title}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(0.55)',
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
        }}
      />

      {/* Overlay con metadata del servicio */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(12,12,12,0.92) 0%, rgba(12,12,12,0.2) 55%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '28px 24px',
        }}
      >
        {/* Número */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(192,57,43,0.85)',
            marginBottom: '8px',
          }}
        >
          {service.number}
        </span>

        {/* Título completo */}
        <p
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(15px, 1.8vw, 20px)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--color-cream-100)',
            marginBottom: '12px',
          }}
        >
          {service.title}
        </p>

        {/* Descripción */}
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(242,237,230,0.65)',
            lineHeight: 1.6,
            marginBottom: '14px',
          }}
        >
          {service.description}
        </p>

        {/* Precio + tiempo en la misma fila */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(242,237,230,0.12)',
            paddingTop: '10px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-brand-gold)',
              fontWeight: 500,
            }}
          >
            {service.price}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'rgba(242,237,230,0.35)',
              letterSpacing: '0.06em',
            }}
          >
            {service.deliveryTime}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Island principal ─────────────────────────────────────────────────────────

interface ServicesSliderProps {
  services?: ServiceItem[]
}

export default function ServicesSlider({ services = [] }: ServicesSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { open } = useWaNavigation()
  const { services: c } = copy

  const handleWaClick = useCallback(() => {
    open('servicios')
  }, [open])

  const handleServiceWaClick = useCallback(
    (service: ServiceItem) => {
      open(service.waVariant)
    },
    [open]
  )

  if (!services.length) return null

  return (
    <SliderContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div style={{ padding: 'var(--section-py) var(--section-px)' }}>

        {/* Eyebrow */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(242,237,230,0.30)',
            display: 'inline-block',
            marginBottom: '52px',
            paddingBottom: '6px',
            borderBottom: '1px solid var(--color-border-2)',
          }}
        >
          {c.eyebrow}
        </span>

        {/* Layout principal */}
        <div className="svc-layout">

          {/* ── Columna izquierda: lista de servicios ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {services.map((service, i) => {
              const isActive = activeIndex === i
              const label = SERVICE_LABELS[service.id] ?? service.title

              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    padding: '22px 0',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease',
                    borderBottomColor: isActive
                      ? 'rgba(192,57,43,0.35)'
                      : 'var(--color-border)',
                  }}
                >
                  {/* Número + label en la misma fila */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '18px',
                    }}
                  >
                    {/* Número decorativo */}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        color: isActive
                          ? 'var(--color-brand-red)'
                          : 'rgba(242,237,230,0.18)',
                        transition: 'color 0.3s ease',
                        flexShrink: 0,
                        width: '18px',
                      }}
                    >
                      {service.number}
                    </span>

                    {/* Título con char-stagger */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 'clamp(28px, 4.5vw, 56px)',
                        fontWeight: 700,
                        lineHeight: 1,
                        margin: 0,
                        letterSpacing: '-0.02em',
                        overflow: 'hidden',
                      }}
                    >
                      <ServiceTitle text={label} index={i} />
                    </h3>
                  </div>

                  {/* Precio + delivery — aparece solo en el ítem activo */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? 'auto' : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden', paddingLeft: '36px' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        paddingTop: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--color-brand-gold)',
                        }}
                      >
                        {service.price}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          color: 'rgba(242,237,230,0.28)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        · {service.deliveryTime}
                      </span>
                      <button
                        onClick={() => handleServiceWaClick(service)}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--color-brand-red)',
                          background: 'transparent',
                          border: '1px solid rgba(192,57,43,0.35)',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          marginLeft: 'auto',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(192,57,43,0.12)'
                          e.currentTarget.style.borderColor = 'var(--color-brand-red)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'rgba(192,57,43,0.35)'
                        }}
                      >
                        Consultar →
                      </button>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* ── Columna derecha: imagen con clip-path ── */}
          <div
            className="svc-image-col"
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              background: 'var(--color-ink-700)',
              flexShrink: 0,
            }}
          >
            {/* Imagen de placeholder / fallback */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'repeating-linear-gradient(45deg, var(--color-ink-700) 0px, var(--color-ink-700) 10px, var(--color-ink-600) 10px, var(--color-ink-600) 20px)',
                opacity: 0.5,
              }}
            />

            {/* Imágenes apiladas con clip-path reveal */}
            {services.map((service, i) => (
              <ServiceImage key={service.id} service={service} index={i} />
            ))}

            {/* Número del servicio activo — decorativo grande */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '80px',
                fontWeight: 500,
                color: 'rgba(242,237,230,0.06)',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {services[activeIndex]?.number}
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid var(--color-border)',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handleWaClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-ink-600)',
              color: 'var(--color-cream-100)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '13px 24px',
              border: '1px solid var(--color-border-2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-brand-red)'
              e.currentTarget.style.borderColor = 'var(--color-brand-red)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-ink-600)'
              e.currentTarget.style.borderColor = 'var(--color-border-2)'
            }}
          >
            {c.cta}
          </button>

          
           <a href={c.ctaGhostHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: 'rgba(242,237,230,0.45)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-cream-100)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(242,237,230,0.45)'
            }}
          >
            {c.ctaGhost}
            <motion.span
              style={{ display: 'inline-block' }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </a>
        </div>

      </div>

      {/* Grid responsive */}
      <style>{`
        .svc-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 60px;
          align-items: start;
        }
        .svc-image-col {
          position: sticky;
          top: 80px;
        }
        @media (max-width: 900px) {
          .svc-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .svc-image-col {
            position: relative;
            top: 0;
            aspect-ratio: 16/9;
            order: -1;
          }
        }
      `}</style>
    </SliderContext.Provider>
  )
}