// src/components/islands/HeroCanvas.tsx
// Island React — canvas de profundidad para Hero scroll storytelling IndexArts
// Efecto "vuelo hacia el interior" con perspectiva falsa en Canvas 2D nativo.
// Sin dependencias externas. client:idle en pages/index.astro
//
// STAGE 0 → Grilla ortogonal + línea roja horizontal
// STAGE 1 → Túnel de líneas radiales convergentes + anillos de profundidad
// STAGE 2 → Bloom rojo en vanishing point + ondas expansivas
// STAGE 3 → Explosión de partículas brand-red + fondo carmesí

import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef  = useRef(0)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'hero-stage') stageRef.current = e.data.stage ?? 0
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0, H = 0, CX = 0, CY = 0

    const INK    = '#0C0C0C'
    const CREAM  = '#F2EDE6'
    const RED    = '#C0392B'
    const RED2   = '#E74C3C'
    const GOLD   = '#A8780A'

    let t             = 0
    let stageProgress = 0
    let lineBarrel    = 0
    let lastWaveT     = 0
    let exploding     = false

    const lerp  = (a: number, b: number, f: number) => a + (b - a) * f
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

    // ── Types ─────────────────────────────────────────────────────
    interface Wave  { r: number; life: number }
    interface Burst { x: number; y: number; vx: number; vy: number; life: number; size: number; col: string }
    interface Amb   { x: number; y: number; vx: number; vy: number; op: number; sz: number; p: number; ps: number }

    let waves:  Wave[]  = []
    let bursts: Burst[] = []
    let amb:    Amb[]   = []

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      CX = W / 2; CY = H / 2
      canvas.width  = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    const initAmb = () => {
      amb = Array.from({ length: 30 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.19, vy: (Math.random() - 0.5) * 0.19,
        op: Math.random() * 0.32 + 0.05, sz: Math.random() * 1.5 + 0.4,
        p: Math.random() * Math.PI * 2, ps: Math.random() * 0.013 + 0.004,
      }))
    }

    // ── Fondo por stage ───────────────────────────────────────────
    const drawBg = (sp: number) => {
      ctx.fillStyle = INK
      ctx.fillRect(0, 0, W, H)

      if (sp < 0.5) return

      const maxD = Math.max(W, H)
      let col: string, innerA: number, outerA: number

      if (sp < 1.5) {
        // Stage 0→1: tono oscuro profundo
        const f = clamp((sp - 0.5) * 2, 0, 1)
        col = `rgba(22,10,8,`; innerA = f * 0.5; outerA = 0
      } else if (sp < 2.5) {
        // Stage 1→2: rojo empieza a emerger del centro
        const f = clamp((sp - 1.5) * 2, 0, 1)
        col = `rgba(90,12,8,`; innerA = f * 0.65; outerA = f * 0.12
      } else {
        // Stage 2→3: explosión carmesí
        const f = clamp((sp - 2.5) * 2, 0, 1)
        col = `rgba(130,18,10,`; innerA = 0.75 + f * 0.15; outerA = 0.2 + f * 0.15
      }

      const bg = ctx.createRadialGradient(CX, CY * 0.84, 0, CX, CY * 0.84, maxD * 0.65)
      bg.addColorStop(0,    col + innerA + ')')
      bg.addColorStop(0.45, col + outerA + ')')
      bg.addColorStop(1,    'rgba(12,12,12,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
    }

    // ── Grilla (desaparece en stage 1) ────────────────────────────
    const drawGrid = (sp: number) => {
      const a = clamp(0.038 - sp * 0.065, 0, 0.038)
      if (a < 0.003) return
      ctx.save()
      ctx.strokeStyle = `rgba(242,237,230,${a})`
      ctx.lineWidth = 0.5
      const GRID = 68
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      ctx.restore()
    }

    // ── Línea roja barriendo (stage 0) ────────────────────────────
    const drawHLine = (sp: number) => {
      const a = clamp(1 - sp * 3.2, 0, 1)
      if (a < 0.01) return
      lineBarrel += 0.00017
      const p   = lineBarrel % 1
      const lY  = H * 0.42
      const lEnd = p * W

      ctx.save()
      ctx.globalAlpha = a
      const g = ctx.createLinearGradient(0, lY, lEnd, lY)
      g.addColorStop(0,   'rgba(192,57,43,0)')
      g.addColorStop(0.5, 'rgba(192,57,43,0.18)')
      g.addColorStop(1,   'rgba(192,57,43,0.72)')
      ctx.strokeStyle = g
      ctx.lineWidth = 0.9
      ctx.beginPath(); ctx.moveTo(0, lY); ctx.lineTo(lEnd, lY); ctx.stroke()

      if (p > 0.02) {
        const halo = ctx.createRadialGradient(lEnd, lY, 0, lEnd, lY, 12)
        halo.addColorStop(0, 'rgba(192,57,43,0.45)')
        halo.addColorStop(1, 'rgba(192,57,43,0)')
        ctx.fillStyle = halo
        ctx.beginPath(); ctx.arc(lEnd, lY, 12, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = RED
        ctx.beginPath(); ctx.arc(lEnd, lY, 2.5, 0, Math.PI * 2); ctx.fill()
      }
      ctx.restore()
    }

    // ── Túnel de perspectiva (stage 1+) ───────────────────────────
    const drawTunnel = (sp: number) => {
      if (sp < 0.6) return
      const tA = clamp((sp - 0.6) * 1.4, 0, 1)

      // Vanishing point respira (efecto flotante)
      const vpX = CX + Math.sin(t * 0.19) * 7
      const vpY = CY * 0.84 + Math.cos(t * 0.13) * 4

      // Velocidad del "vuelo" se acelera con el stage
      const speed  = 0.018 + clamp(sp - 1, 0, 2) * 0.025
      const depthT = (t * speed) % 1

      const maxR = Math.sqrt(
        Math.pow(Math.max(vpX, W - vpX), 2) +
        Math.pow(Math.max(vpY, H - vpY), 2)
      ) * 1.15

      // Color de líneas: cream en stage 1, vira a rojo en stage 2+
      const rFactor = clamp((sp - 1.5) * 1.5, 0, 1)
      const lR = Math.round(lerp(242, 192, rFactor))
      const lG = Math.round(lerp(237,  57, rFactor))
      const lB = Math.round(lerp(230,  43, rFactor))

      ctx.save()
      ctx.globalAlpha = tA

      // ─ Anillos de profundidad (simulan movimiento hacia adentro)
      const RINGS = 10
      for (let r = 0; r < RINGS; r++) {
        const frac  = ((r / RINGS) + depthT) % 1
        // frac 0=lejos, 1=cerca
        const ringR = frac * maxR * 0.88
        // Perspectiva: cerca más opaco
        const ringA = Math.pow(frac, 1.8) * tA * (sp < 2 ? 0.055 : 0.1)

        ctx.strokeStyle = `rgba(${lR},${lG},${lB},${ringA})`
        ctx.lineWidth   = 0.55 + frac * 0.3
        ctx.beginPath()
        // Elipse achatada → sensación de perspectiva
        ctx.ellipse(vpX, vpY, ringR, ringR * 0.68, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // ─ Líneas radiales desde VP
      const LINE_COUNT = sp < 1.5 ? 18 : 28
      for (let i = 0; i < LINE_COUNT; i++) {
        const angle = (i / LINE_COUNT) * Math.PI * 2 + t * 0.012
        const endX  = vpX + Math.cos(angle) * maxR
        const endY  = vpY + Math.sin(angle) * maxR

        const lg = ctx.createLinearGradient(vpX, vpY, endX, endY)
        const startA = sp < 1.5 ? 0 : 0.015
        const endA   = sp < 1.5
          ? tA * 0.04
          : tA * (sp < 2.5 ? 0.07 : 0.11)

        lg.addColorStop(0,    `rgba(${lR},${lG},${lB},${startA})`)
        lg.addColorStop(0.18, `rgba(${lR},${lG},${lB},${endA * 0.45})`)
        lg.addColorStop(1,    `rgba(${lR},${lG},${lB},${endA})`)

        ctx.strokeStyle = lg
        ctx.lineWidth   = 0.45 + rFactor * 0.35
        ctx.beginPath()
        ctx.moveTo(vpX, vpY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      ctx.restore()

      // ─ Bloom en VP
      if (sp >= 1.3) {
        const bF  = clamp((sp - 1.3) * 1.1, 0, 1)
        const bR  = 8 + bF * 30 + Math.sin(t * 2.4) * 4

        ctx.save()
        // Halo exterior
        const h1 = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, bR * 5.5)
        h1.addColorStop(0,   `rgba(192,57,43,${0.5 * bF})`)
        h1.addColorStop(0.25,`rgba(192,57,43,${0.22 * bF})`)
        h1.addColorStop(1,   'rgba(192,57,43,0)')
        ctx.fillStyle = h1
        ctx.beginPath(); ctx.arc(vpX, vpY, bR * 5.5, 0, Math.PI * 2); ctx.fill()

        // Inner glow blanco-rojo
        if (bF > 0.3) {
          const h2 = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, bR * 0.9)
          h2.addColorStop(0,   `rgba(255,220,200,${bF * 0.65})`)
          h2.addColorStop(0.5, `rgba(231,76,60,${bF * 0.4})`)
          h2.addColorStop(1,   'rgba(192,57,43,0)')
          ctx.fillStyle = h2
          ctx.beginPath(); ctx.arc(vpX, vpY, bR * 0.9, 0, Math.PI * 2); ctx.fill()
        }

        // Punto sólido
        ctx.fillStyle = bF > 0.5 ? RED2 : RED
        ctx.beginPath(); ctx.arc(vpX, vpY, Math.max(bR * 0.25, 2), 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
    }

    // ── Ondas expansivas (stage 2+) ────────────────────────────────
    const drawWaves = (sp: number) => {
      if (sp < 1.7) return
      const wA = clamp((sp - 1.7) * 1.6, 0, 1)
      const vpX = CX + Math.sin(t * 0.19) * 7
      const vpY = CY * 0.84 + Math.cos(t * 0.13) * 4

      if (t - lastWaveT > 0.7) {
        waves.push({ r: 0, life: 1 })
        lastWaveT = t
      }
      waves = waves.filter(w => w.life > 0.01)
      waves.forEach(w => {
        w.r    += 2.2
        w.life *= 0.978
        ctx.save()
        ctx.globalAlpha = w.life * wA * 0.32
        ctx.strokeStyle = RED
        ctx.lineWidth   = 1
        ctx.beginPath(); ctx.arc(vpX, vpY, w.r, 0, Math.PI * 2); ctx.stroke()
        ctx.restore()
      })
    }

    // ── Explosión (stage 3) ────────────────────────────────────────
    const spawnBursts = () => {
      const vpX = CX + Math.sin(t * 0.19) * 7
      const vpY = CY * 0.84 + Math.cos(t * 0.13) * 4
      for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4.5 + 0.6
        const col   = Math.random() < 0.65 ? RED : Math.random() < 0.5 ? RED2 : GOLD
        bursts.push({
          x: vpX + (Math.random() - 0.5) * 20,
          y: vpY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Math.random() * 0.65 + 0.35,
          size: Math.random() * 2.8 + 0.4,
          col,
        })
      }
    }

    const drawBursts = (sp: number) => {
      if (sp < 2.7) return
      if (!exploding) { spawnBursts(); exploding = true }

      bursts = bursts.filter(b => b.life > 0.02)
      bursts.forEach(b => {
        b.x += b.vx; b.y += b.vy
        b.vy += 0.045; b.vx *= 0.992
        b.life *= 0.973
        ctx.save()
        ctx.globalAlpha = b.life * 0.88
        ctx.fillStyle   = b.col
        ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      })

      // Reabastecer
      if (bursts.length < 25) {
        const vpX = CX + (Math.random() - 0.5) * 50
        const vpY = CY * 0.84 + (Math.random() - 0.5) * 40
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 2.8 + 0.3
          bursts.push({
            x: vpX, y: vpY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: Math.random() * 0.5 + 0.3,
            size: Math.random() * 2 + 0.4,
            col: Math.random() < 0.55 ? RED : GOLD,
          })
        }
      }
    }

    // ── Partículas ambient ────────────────────────────────────────
    const drawAmb = (sp: number) => {
      const maxOp = sp < 1 ? 0.24 : sp < 2 ? 0.14 : 0.07
      amb.forEach(a => {
        a.p += a.ps
        const alpha = Math.min(a.op * (0.7 + 0.3 * Math.sin(a.p)), maxOp)
        ctx.save()
        ctx.fillStyle = `rgba(242,237,230,${alpha})`
        ctx.beginPath(); ctx.arc(a.x, a.y, a.sz, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
        a.x += a.vx; a.y += a.vy
        if (a.x < -10) a.x = W + 10; if (a.x > W + 10) a.x = -10
        if (a.y < -10) a.y = H + 10; if (a.y > H + 10) a.y = -10
      })
    }

    // ── Viñeta ────────────────────────────────────────────────────
    const drawVig = (sp: number) => {
      const i = sp >= 3 ? 0.5 : 0.62
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.18, W/2, H/2, H*0.9)
      vig.addColorStop(0, 'rgba(12,12,12,0)')
      vig.addColorStop(1, `rgba(12,12,12,${i})`)
      ctx.save(); ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H); ctx.restore()
    }

    // ── Loop ──────────────────────────────────────────────────────
    const draw = (ts: number) => {
      t = ts * 0.001
      stageProgress = lerp(stageProgress, stageRef.current, 0.03)

      if (stageProgress < 2.5) {
        exploding = false; bursts = []; waves = []
      }

      ctx.clearRect(0, 0, W, H)

      drawBg(stageProgress)
      drawGrid(stageProgress)
      drawHLine(stageProgress)
      drawTunnel(stageProgress)
      drawWaves(stageProgress)
      drawBursts(stageProgress)
      drawAmb(stageProgress)
      drawVig(stageProgress)

      animId = requestAnimationFrame(draw)
    }

    resize(); initAmb()
    animId = requestAnimationFrame(draw)

    const ro = new ResizeObserver(() => { resize(); initAmb() })
    ro.observe(canvas)

    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}