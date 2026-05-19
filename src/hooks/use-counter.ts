import { useState, useEffect } from 'react'
import { easeOutCubic } from '@/utils'
import type { UseCounterReturn } from '@/types'

export function useCounter(
  end: number,
  active: boolean,
  duration = 2000
): UseCounterReturn {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let startTime: number | null = null
    let raf: number

    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setValue(Math.round(easeOutCubic(progress) * end))
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [end, active, duration])

  return { value }
}
