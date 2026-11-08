import { Fragment, useEffect, useState } from 'react'
import { profile } from '../data/profile'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setOpen(false)

  // Once the hero scrolls away, give the bar a dark glass background so links stay readable over content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-10 flex w-full items-center justify-between px-5 py-4 transition-colors duration-300 sm:px-8 sm:py-5 ${
          scrolled && !open ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <a href="#top" onClick={close} className="flex items-center gap-3 text-white">
          <span
            className="text-[21px] tracking-tight sm:text-[26px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {profile.name}®
          </span>
          <span
            className="select-none text-[25px] sm:text-[30px]"
            style={{ letterSpacing: '-0.02em' }}
            aria-hidden="true"
          >
            ✳︎
          </span>
        </a>

        <div className="hidden text-[23px] text-white md:block">
          {LINKS.map((link, i) => (
            <Fragment key={link.href}>
              <a href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </a>
              {i < LINKS.length - 1 && ', '}
            </Fragment>
          ))}
        </div>

        <a
          href={profile.cvPath}
          download
          className="hidden text-[23px] text-white underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Download CV
        </a>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-[5px] p-1 md:hidden"
        >
          <span
            className="block h-[2px] w-6 bg-white transition-all duration-300"
            style={{ transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }}
          />
          <span
            className="block h-[2px] w-6 bg-white transition-all duration-300"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[2px] w-6 bg-white transition-all duration-300"
            style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </nav>

      <div
        className="fixed inset-0 z-[9] flex flex-col items-start justify-center gap-8 bg-black/90 px-8 backdrop-blur-md transition-opacity duration-300 md:hidden"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={close}
            tabIndex={open ? 0 : -1}
            className="text-[32px] font-medium text-white transition-opacity hover:opacity-60"
          >
            {link.label}
          </a>
        ))}
        <a
          href={profile.cvPath}
          download
          onClick={close}
          tabIndex={open ? 0 : -1}
          className="text-[32px] font-medium text-white underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          Download CV
        </a>
      </div>
    </>
  )
}
