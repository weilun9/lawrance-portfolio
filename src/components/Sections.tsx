import type { ReactNode } from 'react'
import { education, experience, languages, profile, projects, skills } from '../data/profile'
import { useCopy } from '../hooks/useCopy'
import { useReveal } from '../hooks/useReveal'
import { CopyIcon } from './CopyIcon'
import { pillBase } from './pill'

function Section({ id, kicker, children }: { id: string; kicker: string; children: ReactNode }) {
  const { ref, style } = useReveal<HTMLDivElement>()
  return (
    <section id={id} className="scroll-mt-20 px-5 py-20 sm:px-8 md:px-10 md:py-28">
      <div ref={ref} style={style} className="mx-auto max-w-5xl">
        <p className="mb-6 text-[13px] tracking-[0.2em] text-white/50 uppercase">{kicker}</p>
        {children}
      </div>
    </section>
  )
}

const heading = 'text-white text-[clamp(28px,5vw,48px)] leading-[1.1] tracking-tight'

export function Tldr() {
  return (
    <Section id="tldr" kicker="The 30-second version">
      <p className={`${heading} max-w-3xl`}>{profile.tldr}</p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
        {profile.stats.map((s) => (
          <div key={s.value} className="bg-black/60 p-6 sm:p-8">
            <div
              className="text-[clamp(40px,6vw,64px)] leading-none text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {s.value}
            </div>
            <p className="mt-3 text-[15px] leading-snug text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[15px] text-white/60">{profile.availability} · {profile.location}</p>
    </Section>
  )
}

export function Work() {
  return (
    <Section id="work" kicker="Selected work">
      <h2 className={`${heading} mb-12 max-w-3xl`}>Things I built that refuse to guess.</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.filter((p) => p.featured).map((p) => (
          <article
            key={p.id}
            className="flex flex-col rounded-2xl border border-white/10 bg-black/60 p-6 transition-colors duration-300 hover:border-white/40 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[24px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {p.title}
                </h3>
                <p className="mt-1 text-[15px] text-white/70">{p.tagline}</p>
              </div>
              {p.metric && (
                <div className="shrink-0 text-right">
                  <div className="text-[28px] leading-none text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {p.metric.value}
                  </div>
                  <div className="mt-1 text-[12px] text-white/50">{p.metric.label}</div>
                </div>
              )}
            </div>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/80">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span className="mt-[0.6em] h-[5px] w-[5px] shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full border border-white/20 px-3 py-1 text-[12px] text-white/70">
                  {s}
                </span>
              ))}
              <span className="ml-auto flex gap-4">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px] text-white underline underline-offset-2 transition-opacity hover:opacity-60"
                  >
                    Live demo ↗
                  </a>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px] text-white underline underline-offset-2 transition-opacity hover:opacity-60"
                  >
                    View code ↗
                  </a>
                )}
              </span>
            </div>
          </article>
        ))}
      </div>

      <h3 className="mt-16 mb-4 text-[13px] tracking-[0.2em] text-white/50 uppercase">More projects</h3>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {projects.filter((p) => !p.featured).map((p) => (
          <li key={p.id} className="grid gap-2 py-5 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-6">
            <div>
              <span className="text-[18px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {p.title}
              </span>
              <p className="text-[14px] text-white/50">{p.stack.join(' · ')}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-white/75">{p.points.join(' ')}</p>
            <span className="flex gap-4 md:justify-end">
              {p.metric && (
                <span className="text-[14px] text-white/60">
                  {p.metric.value} {p.metric.label}
                </span>
              )}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] whitespace-nowrap text-white underline underline-offset-2 transition-opacity hover:opacity-60"
                >
                  Code ↗
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Experience() {
  return (
    <Section id="experience" kicker="Experience">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className={heading}>{experience.role}</h2>
          <p className="mt-4 text-[15px] text-white/70">{experience.company}</p>
          <p className="text-[15px] text-white/50">{experience.period}</p>
        </div>
        <ul className="space-y-5 text-[17px] leading-relaxed text-white/80">
          {experience.points.map((pt, i) => (
            <li key={pt} className="flex gap-4">
              <span className="text-[13px] text-white/40 tabular-nums">0{i + 1}</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export function Skills() {
  return (
    <Section id="skills" kicker="Skills & education">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          {skills.map((g) => (
            <div key={g.group}>
              <h3 className="mb-3 text-[15px] text-white/50">{g.group}</h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-[14px] text-white">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-8">
          {education.map((e) => (
            <div key={e.title} className="border-l border-white/20 pl-5">
              <h3 className="text-[20px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {e.title}
              </h3>
              <p className="mt-1 text-[15px] text-white/70">{e.school}</p>
              <p className="text-[14px] text-white/50">{e.period}</p>
              {e.detail && <p className="mt-2 text-[15px] leading-relaxed text-white/80">{e.detail}</p>}
            </div>
          ))}
          <div className="border-l border-white/20 pl-5">
            <h3 className="text-[20px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Languages
            </h3>
            <p className="mt-1 text-[15px] text-white/80">{languages.join(' · ')}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Contact() {
  const { copied, copy } = useCopy()
  return (
    <Section id="contact" kicker="Contact">
      <h2 className="text-[clamp(36px,8vw,96px)] leading-[1] tracking-tight text-white">
        Let&apos;s build something
        <br />
        that knows when to say no.
      </h2>
      <div className="mt-10 flex flex-wrap gap-y-1">
        <button
          type="button"
          onClick={() => copy(profile.email)}
          className={`${pillBase} gap-2 border border-white bg-white text-black hover:bg-black hover:text-white sm:gap-3`}
        >
          {copied ? 'Copied — talk soon!' : profile.email}
          <CopyIcon />
        </button>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className={`${pillBase} border border-white text-white hover:bg-white hover:text-black`}
        >
          {profile.githubHandle} ↗
        </a>
        <a
          href={profile.cvPath}
          download
          className={`${pillBase} border border-white text-white hover:bg-white hover:text-black`}
        >
          Download CV (PDF)
        </a>
      </div>
      <footer className="mt-24 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-[13px] text-white/40">
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
        <span>Built with React, TypeScript, Vite & Tailwind CSS</span>
      </footer>
    </Section>
  )
}
