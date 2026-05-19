/**
 * src/components/islands/ProjectsParallax.tsx
 *
 * HIDRATACIÓN: client:visible
 * Requiere: pnpm add motion  (ya instalado si tienes ServicesSlider)
 *
 * Dos fases coordinadas por un único scroll container:
 *
 * ① ENTRADA [0 → 18% scroll]
 *    3 filas de project-cards en perspectiva 3D que se "despliegan"
 *    y nivelan — idéntico a HeroParallax de Aceternity.
 *
 * ② CARRUSEL [18% → 100% scroll]
 *    Sticky fullscreen. Cada proyecto ocupa un tramo de scroll igual.
 *    AnimatePresence + dirección de scroll controlan las transiciones.
 *
 * Flujo de datos:
 *    dataStore.projects.getAll() → Projects.astro → ProjectsParallax (prop)
 */

import { useState, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react'
import type { ProjectItem } from '@/types'
import { useWaNavigation } from '@/hooks'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectsParallaxProps {
  projects?: ProjectItem[]
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const ENTRY_FRACTION = 0.18
const SPRING_CFG = { stiffness: 300, damping: 30, bounce: 100 }

// ─── Helper: rellena array hasta length ──────────────────────────────────────

function fillRow<T>(items: T[], length: number): T[] {
  return Array.from({ length }, (_, i) => items[i % items.length])
}

// ─── ParallaxCard ─────────────────────────────────────────────────────────────

function ParallaxCard({
  project,
  translate,
}: {
  project: ProjectItem
  translate: ReturnType<typeof useSpring>
}) {
  return (
    <motion.div
      style={{ x: translate, flexShrink: 0 }}
      whileHover={{ y: -14, transition: { duration: 0.3 } }}
      className="p-card"
    >
      <img
        src={project.thumbnail}
        alt={project.title}
        loading="eager"
        decoding="async"
        className="p-card-img"
      />
      <div className="p-card-overlay" />
      <div className="p-card-meta">
        <span className="p-card-tag">{project.tag}</span>
        <h4 className="p-card-title">{project.title}</h4>
      </div>
    </motion.div>
  )
}

// ─── CarouselSlide ────────────────────────────────────────────────────────────

function CarouselSlide({
  project,
  index,
  total,
  direction,
}: {
  project: ProjectItem
  index: number
  total: number
  direction: 'down' | 'up'
}) {
  const { open } = useWaNavigation()
  const yEnter  = direction === 'down' ?  50 : -50
  const yExit   = direction === 'down' ? -50 :  50

  return (
    <motion.div
      initial={{ opacity: 0, y: yEnter }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: yExit }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', inset: 0, display: 'flex' }}
    >
      {/* ── Imagen de fondo full-bleed ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src={project.thumbnail}
          alt={project.title}
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '115%',
            objectFit: 'cover',
            objectPosition: 'center',
            marginTop: '-7%',
            filter: 'brightness(0.3)',
          }}
        />
        {/* Gradiente lateral izquierdo para legibilidad */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, rgba(12,12,12,0.97) 0%, rgba(12,12,12,0.75) 45%, rgba(12,12,12,0.1) 100%)',
          }}
        />
        {/* Gradiente inferior */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(12,12,12,0.6) 0%, transparent 40%)',
          }}
        />
      </div>

      {/* ── Contenido principal ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(32px, 7vw, 96px)',
          maxWidth: '700px',
        }}
      >
        {/* Tag + counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '22px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--color-brand-red)',
              border: '1px solid rgba(192,57,43,0.4)',
              padding: '4px 10px',
            }}
          >
            {project.tag}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'rgba(242,237,230,0.22)',
              letterSpacing: '0.12em',
            }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Título enorme */}
        <h3
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(40px, 7vw, 88px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: 'var(--color-cream-100)',
            margin: '0 0 18px 0',
          }}
        >
          {project.title}
        </h3>

        {/* Descripción */}
        <p
          style={{
            fontSize: 'clamp(13px, 1.4vw, 16px)',
            color: 'rgba(242,237,230,0.6)',
            lineHeight: 1.75,
            maxWidth: '460px',
            marginBottom: '26px',
          }}
        >
          {project.description}
        </p>

        {/* Resultado — métrica destacada */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            border: '1px solid rgba(192,57,43,0.25)',
            background: 'rgba(192,57,43,0.07)',
            marginBottom: '30px',
            alignSelf: 'flex-start',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-brand-green)',
              flexShrink: 0,
              boxShadow: '0 0 0 4px rgba(11,122,69,0.2)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-cream-200)',
              letterSpacing: '0.04em',
            }}
          >
            {project.result}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => open('casos')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            alignSelf: 'flex-start',
            background: 'transparent',
            color: 'var(--color-cream-100)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '13px',
            border: '1px solid var(--color-border-2)',
            padding: '12px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-brand-red)'
            e.currentTarget.style.borderColor = 'var(--color-brand-red)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--color-border-2)'
          }}
        >
          Quiero resultados como este →
        </button>
      </div>

      {/* ── Indicadores de slide (barra vertical derecha) ── */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(20px, 4vw, 56px)',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 2,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '2px',
              height: i === index ? '36px' : '10px',
              background:
                i === index
                  ? 'var(--color-cream-100)'
                  : 'rgba(242,237,230,0.18)',
              borderRadius: '1px',
              transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        ))}
      </div>

      {/* ── Número decorativo de fondo ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          right: 'clamp(20px, 6vw, 80px)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(120px, 20vw, 220px)',
          fontWeight: 500,
          color: 'rgba(242,237,230,0.035)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* ── Hint scroll (solo primer slide) ── */}
      {index === 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '7px',
            opacity: 0.35,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--color-cream-100)',
            }}
          >
            scroll para ver más
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '22px',
              background: 'var(--color-cream-100)',
            }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ─── Island principal ─────────────────────────────────────────────────────────

export default function ProjectsParallax({ projects = [] }: ProjectsParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [activeSlide, setActiveSlide]     = useState(0)
  const [phase, setPhase]                 = useState<'entry' | 'carousel'>('entry')
  const [scrollDir, setScrollDir]         = useState<'down' | 'up'>('down')
  const prevScroll                        = useRef(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const n         = Math.max(projects.length, 1)
  const SLIDE_SZ  = (1 - ENTRY_FRACTION) / n

  // ── Actualizar estado según scroll ──────────────────────────────────────────

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollDir(v >= prevScroll.current ? 'down' : 'up')
    prevScroll.current = v

    if (v < ENTRY_FRACTION) {
      setPhase('entry')
    } else {
      setPhase('carousel')
      const next = Math.min(Math.floor((v - ENTRY_FRACTION) / SLIDE_SZ), n - 1)
      setActiveSlide(next)
    }
  })

  // ── Transforms del parallax de entrada ──────────────────────────────────────

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, ENTRY_FRACTION], [15, 0]),
    SPRING_CFG
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, ENTRY_FRACTION], [20, 0]),
    SPRING_CFG
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, ENTRY_FRACTION], [-700, 500]),
    SPRING_CFG
  )
  const opacityRows = useSpring(
    useTransform(scrollYProgress, [0, ENTRY_FRACTION * 0.4], [0.15, 1]),
    SPRING_CFG
  )
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1400]),
    SPRING_CFG
  )
  const translateXR = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1400]),
    SPRING_CFG
  )

  // Opacidades de capa
  const entryOpacity    = useTransform(
    scrollYProgress, [ENTRY_FRACTION * 0.55, ENTRY_FRACTION], [1, 0]
  )
  const carouselOpacity = useTransform(
    scrollYProgress, [ENTRY_FRACTION * 0.8, ENTRY_FRACTION * 1.2], [0, 1]
  )

  // ── Filas del parallax (3 × 5 cards) ────────────────────────────────────────

  const row1 = fillRow(projects, 5)
  const row2 = fillRow([...projects].reverse(), 5)
  const row3 = fillRow([...projects.slice(1), projects[0]!], 5)

  if (!projects.length) return null

  return (
    <>
      {/* CSS local — no interfiere con tokens Tailwind v4 */}
      <style>{`
        .pp-outer {
          position: relative;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        .pp-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: var(--color-ink-950);
        }
        .pp-rows {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          transform-style: preserve-3d;
        }
        .pp-row {
          display: flex;
          flex-direction: row;
          gap: 18px;
          margin-bottom: 18px;
          flex-shrink: 0;
        }
        .pp-row-rev { flex-direction: row-reverse; }
        .p-card {
          position: relative;
          width: 380px;
          height: 240px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
        }
        .p-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.55);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      filter 0.4s ease;
        }
        .p-card:hover .p-card-img {
          transform: scale(1.06);
          filter: brightness(0.4);
        }
        .p-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(12,12,12,0);
          transition: background 0.3s ease;
        }
        .p-card:hover .p-card-overlay {
          background: rgba(12,12,12,0.45);
        }
        .p-card-meta {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 14px 16px;
          background: linear-gradient(to top, rgba(12,12,12,0.92) 0%, transparent 100%);
        }
        .p-card-tag {
          display: block;
          font-family: var(--font-mono);
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--color-brand-red);
          margin-bottom: 4px;
        }
        .p-card-title {
          font-family: var(--font-head);
          font-size: clamp(14px, 1.4vw, 18px);
          font-weight: 700;
          color: var(--color-cream-100);
          margin: 0;
          line-height: 1.2;
        }
        .pp-entry-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          padding: clamp(28px, 5vw, 52px) var(--section-px);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .p-card { width: 260px; height: 180px; }
        }
      `}</style>

      <div
        ref={containerRef}
        className="pp-outer"
        style={{ height: `${(1 + n) * 100}vh` }}
      >
        <div className="pp-sticky">

          {/* ══ CAPA A: Parallax de entrada ════════════════════════════════════ */}
          <motion.div
            style={{ opacity: entryOpacity, position: 'absolute', inset: 0 }}
            aria-hidden={phase === 'carousel'}
          >
            {/* Header fijo encima de las filas */}
            <div className="pp-entry-header">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(242,237,230,0.28)',
                  display: 'inline-block',
                  marginBottom: '10px',
                  paddingBottom: '6px',
                  borderBottom: '1px solid var(--color-border-2)',
                }}
              >
                Casos reales · Resultados verificables
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 'clamp(26px, 4.5vw, 52px)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  color: 'var(--color-cream-100)',
                  margin: 0,
                }}
              >
                Proyectos que{' '}
                <em style={{ color: 'var(--color-brand-red)', fontStyle: 'italic' }}>
                  mueven el negocio.
                </em>
              </h2>
            </div>

            {/* Filas con perspectiva 3D */}
            <motion.div
              className="pp-rows"
              style={{
                rotateX,
                rotateZ,
                translateY,
                opacity: opacityRows,
              }}
            >
              <div className="pp-row pp-row-rev">
                {row1.map((p, i) => (
                  <ParallaxCard key={`r1-${i}`} project={p} translate={translateX} />
                ))}
              </div>
              <div className="pp-row">
                {row2.map((p, i) => (
                  <ParallaxCard key={`r2-${i}`} project={p} translate={translateXR} />
                ))}
              </div>
              <div className="pp-row pp-row-rev">
                {row3.map((p, i) => (
                  <ParallaxCard key={`r3-${i}`} project={p} translate={translateX} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ══ CAPA B: Carrusel sticky ════════════════════════════════════════ */}
          <motion.div
            style={{
              opacity: carouselOpacity,
              position: 'absolute',
              inset: 0,
            }}
            aria-hidden={phase === 'entry'}
          >
            <AnimatePresence mode="sync">
              <CarouselSlide
                key={`slide-${activeSlide}`}
                project={projects[activeSlide]!}
                index={activeSlide}
                total={n}
                direction={scrollDir}
              />
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  )
}