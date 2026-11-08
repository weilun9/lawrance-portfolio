import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useCopy } from '../hooks/useCopy'
import { useTypewriter } from '../hooks/useTypewriter'
import { CopyIcon } from './CopyIcon'
import { pillBase } from './pill'

const PILLS = [
  { label: 'Give me 30 seconds', href: '#tldr' },
  { label: 'See the AI that says no', href: '#work' },
  { label: 'What I do at work', href: '#experience' },
  { label: 'Download my CV', href: profile.cvPath, download: true },
]

export function Hero() {
  const { displayed, done } = useTypewriter(profile.hook, 38, 600)
  const [pillsVisible, setPillsVisible] = useState(false)
  const { copied, copy } = useCopy()

  useEffect(() => {
    const t = window.setTimeout(() => setPillsVisible(true), 400)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <section
      id="top"
      className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0"
    >
      <div className="relative z-10 max-w-xl">
        {/* Starts blurred and snaps into focus once the hook line finishes typing. */}
        <h1
          className="pointer-events-none mb-5 select-none sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: '#fff',
            filter: done ? 'blur(0px)' : 'blur(4px)',
            transition: 'filter .8s ease',
          }}
        >
          {profile.greeting[0]}
          <br />
          {profile.greeting[1]}
        </h1>

        <p
          className="mb-5 text-white sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: 54,
          }}
          aria-label={profile.hook}
        >
          <span aria-hidden="true">{displayed}</span>
          {!done && (
            <span
              className="ml-[2px] inline-block h-[1.1em] w-[2px] bg-white align-middle"
              style={{ animation: 'blink 1s step-end infinite' }}
              aria-hidden="true"
            />
          )}
        </p>

        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .4s ease, transform .4s ease',
          }}
        >
          {PILLS.map((pill) => (
            <a
              key={pill.label}
              href={pill.href}
              download={pill.download || undefined}
              className={`${pillBase} border border-black/10 bg-white text-black hover:bg-black hover:text-white`}
            >
              {pill.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => copy(profile.email)}
            title="Copy email"
            className={`${pillBase} gap-2 border border-white bg-transparent text-white hover:bg-white hover:text-black sm:gap-3`}
          >
            <span>
              {copied ? (
                'Copied — talk soon!'
              ) : (
                <>
                  Reach me: <span className="underline underline-offset-1">{profile.email}</span>
                </>
              )}
            </span>
            <CopyIcon />
          </button>
        </div>
      </div>

      <a
        href="#tldr"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[13px] tracking-[0.2em] text-white/70 uppercase transition-opacity hover:opacity-60 md:block"
      >
        Scroll ↓
      </a>
    </section>
  )
}
