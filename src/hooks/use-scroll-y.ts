import { useState, useEffect } from 'react'
import type { UseScrollYReturn } from '@/types'

export function useScrollY(): UseScrollYReturn {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { scrollY }
}
