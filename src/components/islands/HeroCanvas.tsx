// src/components/islands/HeroCanvas.tsx
// 2-stage canvas: Stage 0 → grilla + línea roja | Stage 1 → túnel + bloom
import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef(0)

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
    let W = 0,
      H = 0,
      CX = 0,
      CY = 0

    const INK = '#0C0C0C'
    const RED = '#C0392B'
    const RED2 = '#E74C3C'

    let t = 0
    let stageProgress = 0
    let lineBarrel = 0

    const lerp = (a: number, b: number, f: number) => a + (b - a) * f
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

    interface Amb {
      x: number
      y: number
      vx: number
      vy: number
      op: number
      sz: number
      p: number
      ps: number
    }
    let amb: Amb[] = []

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      CX = W / 2
      CY = H / 2
      canvas.width = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    const initAmb = () => {
      amb = Array.from({ length: 30 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.19,
        vy: (Math.random() - 0.5) * 0.19,
        op: Math.random() * 0.32 + 0.05,
        sz: Math.random() * 1.5 + 0.4,
        p: Math.random() * Math.PI * 2,
        ps: Math.random() * 0.013 + 0.004,
      }))
    }

    const drawBg = (sp: number) => {
      ctx.fillStyle = INK
      ctx.fillRect(0, 0, W, H)
      if (sp < 0.5) return
      const f = clamp((sp - 0.5) * 2, 0, 1)
      const maxD = Math.max(W, H)
      const bg = ctx.createRadialGradient(CX, CY * 0.84, 0, CX, CY * 0.84, maxD * 0.65)
      bg.addColorStop(0, `rgba(22,10,8,${f * 0.5})`)
      bg.addColorStop(0.45, `rgba(22,10,8,0)`)
      bg.addColorStop(1, 'rgba(12,12,12,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
    }

    const drawGrid = (sp: number) => {
      const a = clamp(0.038 - sp * 0.065, 0, 0.038)
      if (a < 0.003) return
      ctx.save()
      ctx.strokeStyle = `rgba(242,237,230,${a})`
      ctx.lineWidth = 0.5
      const GRID = 68
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawHLine = (sp: number) => {
      const a = clamp(1 - sp * 3.2, 0, 1)
      if (a < 0.01) return
      lineBarrel += 0.00017
      const p = lineBarrel % 1
      const lY = H * 0.42
      const lEnd = p * W
      ctx.save()
      ctx.globalAlpha = a
      const g = ctx.createLinearGradient(0, lY, lEnd, lY)
      g.addColorStop(0, 'rgba(192,57,43,0)')
      g.addColorStop(0.5, 'rgba(192,57,43,0.18)')
      g.addColorStop(1, 'rgba(192,57,43,0.72)')
      ctx.strokeStyle = g
      ctx.lineWidth = 0.9
      ctx.beginPath()
      ctx.moveTo(0, lY)
      ctx.lineTo(lEnd, lY)
      ctx.stroke()
      if (p > 0.02) {
        const halo = ctx.createRadialGradient(lEnd, lY, 0, lEnd, lY, 12)
        halo.addColorStop(0, 'rgba(192,57,43,0.45)')
        halo.addColorStop(1, 'rgba(192,57,43,0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(lEnd, lY, 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = RED
        ctx.beginPath()
        ctx.arc(lEnd, lY, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    const drawTunnel = (sp: number) => {
      if (sp < 0.6) return
      const tA = clamp((sp - 0.6) * 1.4, 0, 1)
      const vpX = CX + Math.sin(t * 0.19) * 7
      const vpY = CY * 0.84 + Math.cos(t * 0.13) * 4
      const speed = 0.018 + clamp(sp - 1, 0, 1) * 0.018
      const depthT = (t * speed) % 1
      const maxR =
        Math.sqrt(Math.pow(Math.max(vpX, W - vpX), 2) + Math.pow(Math.max(vpY, H - vpY), 2)) * 1.15

      ctx.save()
      ctx.globalAlpha = tA

      // Anillos
      const RINGS = 10
      for (let r = 0; r < RINGS; r++) {
        const frac = (r / RINGS + depthT) % 1
        const ringR = frac * maxR * 0.88
        const ringA = Math.pow(frac, 1.8) * tA * 0.055
        ctx.strokeStyle = `rgba(242,237,230,${ringA})`
        ctx.lineWidth = 0.55 + frac * 0.3
        ctx.beginPath()
        ctx.ellipse(vpX, vpY, ringR, ringR * 0.68, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Líneas radiales
      const LINE_COUNT = 18
      for (let i = 0; i < LINE_COUNT; i++) {
        const angle = (i / LINE_COUNT) * Math.PI * 2 + t * 0.012
        const endX = vpX + Math.cos(angle) * maxR
        const endY = vpY + Math.sin(angle) * maxR
        const lg = ctx.createLinearGradient(vpX, vpY, endX, endY)
        lg.addColorStop(0, 'rgba(242,237,230,0)')
        lg.addColorStop(0.18, `rgba(242,237,230,${tA * 0.018})`)
        lg.addColorStop(1, `rgba(242,237,230,${tA * 0.04})`)
        ctx.strokeStyle = lg
        ctx.lineWidth = 0.45
        ctx.beginPath()
        ctx.moveTo(vpX, vpY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      ctx.restore()

      // Bloom
      if (sp >= 1.3) {
        const bF = clamp((sp - 1.3) * 1.1, 0, 1)
        const bR = 8 + bF * 30 + Math.sin(t * 2.4) * 4
        ctx.save()
        const h1 = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, bR * 5.5)
        h1.addColorStop(0, `rgba(192,57,43,${0.5 * bF})`)
        h1.addColorStop(0.25, `rgba(192,57,43,${0.22 * bF})`)
        h1.addColorStop(1, 'rgba(192,57,43,0)')
        ctx.fillStyle = h1
        ctx.beginPath()
        ctx.arc(vpX, vpY, bR * 5.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = bF > 0.5 ? RED2 : RED
        ctx.beginPath()
        ctx.arc(vpX, vpY, Math.max(bR * 0.25, 2), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const drawAmb = (sp: number) => {
      const maxOp = sp < 1 ? 0.24 : 0.14
      amb.forEach((a) => {
        a.p += a.ps
        const alpha = Math.min(a.op * (0.7 + 0.3 * Math.sin(a.p)), maxOp)
        ctx.save()
        ctx.fillStyle = `rgba(242,237,230,${alpha})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.sz, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        a.x += a.vx
        a.y += a.vy
        if (a.x < -10) a.x = W + 10
        if (a.x > W + 10) a.x = -10
        if (a.y < -10) a.y = H + 10
        if (a.y > H + 10) a.y = -10
      })
    }

    const drawVig = () => {
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.18, W / 2, H / 2, H * 0.9)
      vig.addColorStop(0, 'rgba(12,12,12,0)')
      vig.addColorStop(1, 'rgba(12,12,12,0.62)')
      ctx.save()
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, W, H)
      ctx.restore()
    }

    const draw = (ts: number) => {
      t = ts * 0.001
      // Clamp stage a máximo 1 (2 stages)
      stageProgress = lerp(stageProgress, Math.min(stageRef.current, 1), 0.03)
      ctx.clearRect(0, 0, W, H)
      drawBg(stageProgress)
      drawGrid(stageProgress)
      drawHLine(stageProgress)
      drawTunnel(stageProgress)
      drawAmb(stageProgress)
      drawVig()
      animId = requestAnimationFrame(draw)
    }

    resize()
    initAmb()
    animId = requestAnimationFrame(draw)

    const ro = new ResizeObserver(() => {
      resize()
      initAmb()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
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
