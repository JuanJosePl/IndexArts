/**
 * HIDRATACIÓN: client:load
 *
 * [ISSUE-7] Usa useWaNavigation() — no importa utils/whatsapp ni utils/analytics.
 * [ISSUE-6] Usa hooks desde barrel @/hooks.
 */
import { useScrollY, useWaNavigation } from '@/hooks'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-7 h-7">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.86L.054 23.454a.75.75 0 0 0 .917.978l5.788-1.515A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 0 1-5.187-1.453l-.37-.22-3.84 1.006 1.026-3.745-.241-.386A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

export default function StickyWhatsApp() {
  const { scrollY } = useScrollY()
  const { open } = useWaNavigation()
  const visible = scrollY > 200

  return (
    <button
      onClick={() => open('nav')}
      aria-label="Contactar por WhatsApp"
      className={[
        'fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-brand-red text-cream-100',
        'flex items-center justify-center shadow-lg animate-btn-aura transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
    >
      <WhatsAppIcon />
    </button>
  )
}
