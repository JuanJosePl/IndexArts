/**
 * hooks/index.ts — barrel público
 *
 * Los consumidores importan desde '@/hooks', no desde '@/hooks/use-counter' etc.
 * [ISSUE-6]
 */
export { useInView }         from './use-in-view'
export { useCounter }        from './use-counter'
export { useHover }          from './use-hover'
export { useScrollY }        from './use-scroll-y'
export { useWaNavigation }   from './use-wa-navigation'
