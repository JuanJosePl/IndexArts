import { useState } from 'react'
import type { UseHoverReturn } from '@/types'

export function useHover(): UseHoverReturn {
  const [isHovered, setIsHovered] = useState(false)
  return {
    isHovered,
    handlers: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  }
}
