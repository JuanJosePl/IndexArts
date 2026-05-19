/** Easing y funciones matemáticas puras. Sin dependencias de framework. */

export function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - p, 3)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
