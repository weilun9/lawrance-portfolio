import { useEffect, useRef, useState, type CSSProperties } from 'react'

// Fades an element in the first time it scrolls into view.
// Triggers when the element's top passes 10% above the bottom of the viewport.
// (A ratio threshold like 0.15 never fires for sections taller than ~6.7 screens,
// e.g. the project list in one column on a phone.)
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity .7s ease, transform .7s ease',
  }

  return { ref, style }
}
