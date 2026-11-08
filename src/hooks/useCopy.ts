import { useCallback, useEffect, useRef, useState } from 'react'

// Copies text to the clipboard and exposes a short-lived "copied" flag for feedback.
export function useCopy(resetMs = 1600) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    (text: string) => {
      if (!navigator.clipboard) return
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true)
          window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setCopied(false), resetMs)
        })
        .catch(() => {})
    },
    [resetMs],
  )

  return { copied, copy }
}
