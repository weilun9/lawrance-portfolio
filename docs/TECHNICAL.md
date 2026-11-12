# Lawrance Tan — Portfolio Site: Technical Build Guide

A single-page portfolio for a Graduate AI Engineer, designed so an interviewer remembers one idea in 30 seconds:

> **"I build AI a business can trust: it cites its sources, and it knows when to say no."**

This document explains how the site is built, why it is built that way, and how to rebuild, edit, test and deploy it from scratch.

---

## 1. The 30-second design

Interviewers skim. The page is ordered so each scroll step answers one question:

| Seconds | What they see | Question it answers |
|---|---|---|
| 0–4 | Full-screen video, name in the navbar, hook line typing out | *Who is this?* |
| 4–5 | Blurred intro ("Hey there, I'm Lawrance Tan…") snaps into focus as typing ends | *What role?* — the motion makes the eye go back and read it |
| 5–10 | Action pills: *Give me 30 seconds*, *See the AI that says no*, *Download my CV*, copy-email | *What can I do next?* |
| 10–20 | **The 30-second version**: one sentence + three numbers (10/10, 91.4%, 98.6%) | *Is it real?* — numbers are easier to repeat than adjectives |
| 20–30 | **Selected work**: each project card leads with a single headline metric | *What did they build?* |
| 30+ | Experience, skills, education, contact | Details for anyone who keeps reading |

Three memory hooks are repeated on purpose: the **hook line** (hero), the **"refuse to guess"** heading (work), and **"knows when to say no"** (contact). One idea, said three times.

The interactive background (the video scrubs with the mouse instead of playing) is the visual hook: it is unusual enough to be talked about, and it shows front-end craft without distracting from the content.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript | Typed components; content kept in one typed data file |
| Build | Vite 7 | Instant dev server, small static output |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility classes, no separate CSS files per component |
| Fonts | Helvetica Now Display (onlinewebfonts CDN) | Heading font for name/numbers, body font for text |
| Runtime deps | `react`, `react-dom` only | No UI library, no icon library — icons are inline SVG |

Output is a static site (`dist/`): HTML + one CSS file + one JS file (~76 KB gzipped). It can be hosted anywhere that serves static files.

---

## 3. Project structure

```
lawrance-portfolio/
├── index.html                  # <head>: title, meta/OG tags, favicon, font stylesheets
├── package.json
├── vite.config.ts              # React + Tailwind plugins
├── tsconfig.json               # strict TypeScript
├── public/
│   └── Lawrance_Tan_CV.pdf     # served at /Lawrance_Tan_CV.pdf (Download CV buttons)
├── docs/
│   └── TECHNICAL.md            # this file
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # page layout: video → navbar → hero → content sections
    ├── index.css               # Tailwind import, font variables, blink keyframes
    ├── data/
    │   └── profile.ts          # ALL text content (single source of truth)
    ├── hooks/
    │   ├── useTypewriter.ts    # types text one character at a time
    │   ├── useReveal.ts        # fade-in when a section scrolls into view
    │   └── useCopy.ts          # clipboard copy + "Copied" feedback
    └── components/
        ├── BackgroundVideo.tsx # fixed full-screen video scrubbed by mouse movement
        ├── Navbar.tsx          # fixed navbar, mobile hamburger + overlay
        ├── Hero.tsx            # intro, typewriter hook, action pills
        ├── Sections.tsx        # Tldr, Work, Experience, Skills, Contact
        ├── CopyIcon.tsx        # 12×12 inline SVG
        └── pill.ts             # shared pill class string
```

**Rule:** components never contain CV text. To change any wording, edit `src/data/profile.ts` only.

---

## 4. Build it from scratch

Prerequisites: Node.js 20+ (built with Node 24) and npm.

Commands below are for Windows PowerShell 5.1 (run them one per line; PowerShell 5.1 does not support `&&`).

### 4.1 Create the project

```powershell
New-Item -ItemType Directory -Force F:\dev\lawrance-portfolio
cd F:\dev\lawrance-portfolio
npm init -y
npm install react react-dom
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite
```

### 4.2 Configure Vite and Tailwind

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Tailwind v4 needs no `tailwind.config.js` — one line in CSS enables it:

```css
/* src/index.css */
@import "tailwindcss";
```

In `package.json` set `"type": "module"` and the scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

`tsc -b` type-checks first, so a type error fails the build instead of shipping.

### 4.3 Fonts

In `index.html` `<head>`:

```html
<link rel="stylesheet" href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium" />
<link rel="stylesheet" href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg" />
```

In `src/index.css`:

```css
:root {
  --font-heading: 'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif;
  --font-body: 'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif;
}
body { font-family: var(--font-body); }
```

The heading font is applied with `style={{ fontFamily: 'var(--font-heading)' }}` on the logo, project titles and big numbers.

### 4.4 Add the files

Create the files listed in section 3. Section 5 explains each one.

### 4.5 Run

```powershell
npm run dev
```

Open http://localhost:5173.

---

## 5. How each part works

### 5.1 Page layering (`App.tsx`)

```
z-0   <video>            position: fixed, covers the viewport, never scrolls
z-1   <Hero>             100vh, transparent — the video shows through
z-1   content wrapper    bg-black/75 + backdrop-blur-xl — video still visible, text readable
z-9   mobile overlay     full-screen menu (mobile only)
z-10  <nav>              fixed on top of everything
```

Because the video is `fixed`, it stays behind the page as you scroll; the content sections slide over it like frosted glass.

### 5.2 Mouse-scrubbed video (`BackgroundVideo.tsx`)

The video is **not** autoplayed. Horizontal mouse movement moves its playhead:

```
delta       = currentX − prevX                         (pixels moved since last event)
offset      = (delta / window.innerWidth) × 0.8 × duration
targetTime  = clamp(targetTime + offset, 0, duration)
```

Moving the mouse across the full screen width scrubs 80% of the video. Left goes backwards, right goes forwards.

**Avoiding seek flooding.** `mousemove` fires ~60+ times a second, but a video seek takes time to decode. Setting `currentTime` on every event would queue dozens of seeks and make the video stutter. Instead:

1. A `seeking` flag (a ref) marks that a seek is in flight.
2. While it is set, mouse events only update `targetTime`.
3. The video's `onSeeked` event clears the flag and, if `targetTime` moved meanwhile, starts one more seek to the latest target.

So at most one seek runs at a time, and the video always ends on the latest position. (Measured: ~40 mouse events produced 5 seeks.)

Video attributes: `muted`, `playsInline` (iOS would otherwise go full screen), `preload="auto"` (load enough data to seek), `object-fit: cover`, `object-position: 58% center` (the character sits slightly right of centre; this keeps him centred when a portrait phone crops the sides, while leaving the left side free for text on desktop).

All mutable values (`prevX`, `targetTime`, `seeking`) are `useRef`, not state: they change on every mouse move and must not trigger re-renders.

### 5.3 Typewriter (`hooks/useTypewriter.ts`)

```ts
const { displayed, done } = useTypewriter(text, speed = 38, startDelay = 600)
```

- After `startDelay` ms, a `setInterval` adds one character every `speed` ms.
- When the full text is shown, the interval stops and `done` becomes `true`.
- The cleanup function clears both the timeout and the interval, so React StrictMode's double-mount in development does not run two typewriters.

The blinking cursor is a 2px-wide `<span>` with `animation: blink 1s step-end infinite` (opacity 1 → 0 → 1). `step-end` makes it blink sharply instead of fading. It is removed when `done` is true.

Accessibility: the `<p>` carries `aria-label` with the full text, and the typed span is `aria-hidden`, so screen readers read the sentence once instead of letter by letter.

### 5.4 Blur-to-focus intro (`Hero.tsx`)

The intro `<h1>` starts with `filter: blur(4px)`. When the typewriter reports `done`, it switches to `blur(0px)` with `transition: filter .8s ease`. The name "comes into focus" at the moment the hook line finishes — the motion pulls the eye back to the name.

### 5.5 Action pills (`Hero.tsx`)

- The pill row fades and slides in (opacity 0→1, translateY 8px→0, 0.4 s) **400 ms after load**, independently of the typewriter, so the call-to-actions are available immediately.
- Four white pills are links: three jump to sections (`#tldr`, `#work`, `#experience`), one downloads the CV (`download` attribute).
- The outline pill copies the email with `navigator.clipboard.writeText()` (via `useCopy`) and shows "Copied — talk soon!" for 1.6 s.

### 5.6 Clipboard (`hooks/useCopy.ts`)

Wraps `navigator.clipboard.writeText`. Sets `copied = true` only after the promise resolves, then resets it with a timer that is cleared on unmount. Errors are swallowed: the Clipboard API only works on HTTPS or `localhost`, and only when the page has focus.

### 5.7 Navbar (`Navbar.tsx`)

- Desktop (`md` = 768px and up): logo left, comma-separated section links centre, underlined *Download CV* right.
- On scroll past 60% of the viewport height, the bar gets `bg-black/60 backdrop-blur-md` so links stay readable over content.
- Mobile (below `md`): a three-bar hamburger. Opening it rotates the top bar `translateY(7px) rotate(45deg)`, hides the middle bar, and rotates the bottom bar `translateY(-7px) rotate(-45deg)` — the bars meet in an X. 7px = bar height (2px) + gap (5px).
- The mobile overlay is always mounted and toggles `opacity` + `pointer-events`, so it can fade in and out. Hidden links get `tabIndex={-1}` so keyboard users cannot tab into an invisible menu.

### 5.8 Content sections (`Sections.tsx`)

| Section | id | Content |
|---|---|---|
| `Tldr` | `#tldr` | One-sentence summary + three stat tiles + availability |
| `Work` | `#work` | Project cards: title, tagline, headline metric, bullets, stack tags, code link |
| `Experience` | `#experience` | Current role with numbered bullets |
| `Skills` | `#skills` | Skill groups as tags; education and languages |
| `Contact` | `#contact` | Closing line, copy-email, GitHub, CV download, footer |

Each section uses `useReveal`, which watches the section with `IntersectionObserver` and fades it in (opacity + 24px slide) the first time 15% of it is visible, then stops observing. If `IntersectionObserver` is missing, content is shown immediately.

`scroll-mt-20` on each section stops the fixed navbar from covering the heading after an anchor jump; `scroll-behavior: smooth` on `html` animates the jump.

---

## 6. Editing content

Everything lives in `src/data/profile.ts`:

| Export | Controls |
|---|---|
| `profile` | name, role, email, GitHub, CV path, hero greeting, hook line, TL;DR sentence, three stats |
| `projects` | project cards (add/remove objects; `metric` and `link` are optional) |
| `experience` | role, company, period, bullets |
| `skills` | skill groups and tags |
| `education`, `languages` | education entries and languages |

To replace the CV PDF, overwrite `public/Lawrance_Tan_CV.pdf` (keep the name, or update `profile.cvPath`).

To change the background video, replace `src/assets/hero.mp4` and `src/assets/hero-poster.jpg`. They are imported by `BackgroundVideo.tsx` rather than placed in `public/`, so Vite gives them content-hashed names (e.g. `/assets/hero-AbC123.mp4`): a new video gets a new URL, and browsers can cache it for a year without ever showing a stale copy.

**Use H.264, not HEVC.** The original template clip is 10-bit HEVC (H.265). Most Chrome and Firefox installs on Windows cannot decode it, and the video shows as a black screen. The site therefore self-hosts an H.264 re-encode. Encode any new clip like this:

```powershell
ffmpeg -i in.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -crf 26 -preset slow -movflags +faststart src\assets\hero.mp4
ffmpeg -i src\assets\hero.mp4 -frames:v 1 -q:v 4 src\assets\hero-poster.jpg
```

- `-g 1` makes every frame a keyframe, so each scrub seek decodes one frame (smooth, at the cost of a larger file — 4.1 MB for the 8 s, 720p clip at `-crf 26`).
- `-pix_fmt yuv420p` (8-bit) is the format every browser can play.
- `+faststart` puts the index at the start of the file so the browser can seek before the download finishes.
- The poster is shown before the video loads and is also the video element's CSS background, so the hero is never plain black.

Check a clip's codec with `ffprobe in.mp4` — the video stream must say `h264`, not `hevc`.

**Honesty rule.** Every number on the site must match the CV and the code in the linked repositories. Interviewers who click "View code" should find the same figures.

---

## 7. Testing checklist

Run before every deploy:

```powershell
npm run build
npm run preview
```

Then open http://localhost:4173 and check:

**Desktop (≥ 1024px)**
- [ ] Both Helvetica Now fonts load (DevTools → Network → Font)
- [ ] Hook line types out after ~0.6 s; cursor blinks while typing and disappears when done
- [ ] Intro text un-blurs when typing finishes
- [ ] Pills fade in after ~0.4 s, before typing finishes
- [ ] Moving the mouse right scrubs the video forward, left scrubs back; it stops at the start/end
- [ ] Copy-email pill shows "Copied — talk soon!" and the clipboard holds the email
- [ ] Navbar links jump to the right sections; navbar gets a dark background after scrolling
- [ ] Download CV returns the PDF
- [ ] Each section fades in on first scroll

**Mobile (375px, DevTools device mode)**
- [ ] Hero content sits at the bottom of the screen
- [ ] No horizontal scrolling
- [ ] Hamburger animates into an X; overlay fades in; tapping a link closes it and jumps
- [ ] Project cards stack in one column and remain readable

**Quick console checks** (DevTools console):

```js
// Scrub works and is clamped
const v = document.querySelector('video'); v.duration
// No horizontal overflow on mobile
document.documentElement.scrollWidth <= innerWidth
```

---

## 8. Deployment

The build output `dist/` is static.

### Vercel (recommended)

1. Push the project to a GitHub repository.
2. On vercel.com → *Add New Project* → import the repository.
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
4. Deploy. Every push to the main branch redeploys.

Or from the command line:

```powershell
npm install -g vercel
vercel
vercel --prod
```

### Netlify

Build command `npm run build`, publish directory `dist`.

### GitHub Pages

Set `base: '/<repo-name>/'` in `vite.config.ts`, build, and publish `dist/` (for example with the `actions/deploy-pages` workflow). Then update `profile.cvPath` to include the base path, or use `import.meta.env.BASE_URL + 'Lawrance_Tan_CV.pdf'`.

**Before going public:** the CV PDF in `public/` includes a phone number. Anything in `public/` is downloadable by anyone with the URL. Remove the number from the PDF first if you do not want it public.

---

## 9. Security

### 9.1 Threat model

The site is **fully static**: no backend, no database, no forms, no API calls, no API keys. The realistic risks are therefore:

| Risk | Mitigation |
|---|---|
| Secrets committed by mistake (now or later) | `.gitignore` blocks `.env*`, `.vercel`, `*.pem`, `*.key`; **gitleaks** scans the full git history on every push (CI) |
| Secrets bundled into the JS | Vite only exposes env vars prefixed `VITE_`, and the site uses none. `scripts/security-check.mjs` greps the shipped JS for key patterns |
| Cross-site scripting (XSS) | React escapes all text; no `dangerouslySetInnerHTML`; strict CSP: `script-src 'self'` (no inline or `eval` scripts), `object-src 'none'`, `base-uri 'self'` |
| Clickjacking (site framed by an attacker) | `frame-ancestors 'none'` + `X-Frame-Options: DENY` |
| Downgrade / man-in-the-middle | Vercel forces HTTPS; `Strict-Transport-Security` (2 years, preload); CSP `upgrade-insecure-requests` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Data leaking to third parties | `Referrer-Policy: strict-origin-when-cross-origin`; external links use `rel="noreferrer"`; only one third-party origin allowed (fonts) |
| Browser features abused | `Permissions-Policy` disables camera, microphone, geolocation, payment, USB |
| Source code exposure | Source maps are not built (Vite default); only `dist/` is deployed, so `src/`, `package.json`, `.git` are never served |
| Vulnerable dependencies | `npm audit --audit-level=high` in CI; Dependabot opens weekly update PRs |
| DDoS / bot floods | Vercel's platform DDoS mitigation is on by default for every deployment. Under attack, enable **Attack Challenge Mode** in the Vercel dashboard → Project → Firewall |

All headers are set in `vercel.json` and apply to every path.

**What "hide the API" means here.** There is no API key in this project. If a future feature needs one (for example an "Ask my CV" chatbot calling an LLM), the key must **never** go in frontend code — anything in the browser bundle is public. Put it in a Vercel Serverless Function (`/api/*.ts`), store the key in Vercel → Project → Settings → Environment Variables, and add rate limiting to that endpoint.

### 9.2 Security tests

Run against the live deployment:

```powershell
npm run security -- https://lawrancetan.vercel.app
```

The script (no dependencies) checks and exits non-zero on any failure:

1. HTTP → HTTPS redirect
2. CSP present with the required directives, and no `unsafe-inline` / `unsafe-eval` for scripts
3. HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, no `X-Powered-By`
4. No inline `<script>`, no source maps, no secret patterns (OpenAI/Anthropic, AWS, GitHub, Google, Slack, private keys) in shipped JS
5. Sensitive files not served: `.env`, `.git/config`, `package.json`, `vercel.json`, `src/…`, `.vercel/project.json`
6. `POST` / `PUT` / `DELETE` rejected
7. Path traversal (`../../etc/passwd`, encoded variants) does not escape the output directory

External second opinions (free): https://securityheaders.com and https://observatory.mozilla.org — both should grade the site A or above.

---

## 10. Performance and accessibility notes

- Runtime JavaScript is React + the page only (~76 KB gzipped). No icon or UI libraries.
- The video (`src/assets/hero.mp4`, 4.1 MB, served from `/assets/` with a hashed name) is the heaviest asset, loaded with `preload="auto"`. Until it loads, the poster image is shown, and the page is fully usable.
- Content uses semantic elements: `<nav>`, `<section>`, `<h1>`–`<h3>`, `<article>`, `<ul>`, `<footer>`.
- The hamburger has `aria-label` and `aria-expanded`; the overlay has `aria-hidden` when closed.
- Text over video uses white on a dark glass layer; secondary text is never below `white/40` opacity on near-black.
- Possible improvement: respect `prefers-reduced-motion` by skipping the typewriter and reveal animations.

---

## 11. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Background is black | The video codec is not supported (HEVC/H.265 on Windows Chrome/Firefox). Re-encode to H.264 (section 6). |
| Video does not move | `duration` is `NaN` until metadata loads; move the mouse again after a second. Check the video URL loads in Network. |
| Scrubbing is jerky | The video has few keyframes; re-encode with `-g 1` (section 6). |
| Copy button does nothing | Clipboard API needs HTTPS or `localhost`, and page focus. |
| Fonts look like Arial | The onlinewebfonts CDN is blocked or slow; the fallback stack (`Helvetica Neue`, Arial) is used. |
| Port already in use | `npm run dev -- --port 5180` |
| Build fails with a type error | `tsc -b` runs before `vite build`; fix the reported file and line. |

---

## 12. Talking points for interviews

If an interviewer asks about this site, three things are worth saying:

1. **Content is data.** All CV text is in one typed file; components only render it. Updating the site after a new project is a one-file change.
2. **The video scrub avoids seek flooding.** Mouse events update a target; only one seek runs at a time, and `onSeeked` catches up to the latest target. Same idea as debouncing a request queue.
3. **It is built to be skimmed.** The page is ordered by what a reviewer needs in the first 30 seconds: one hook line, three numbers, then evidence with links to the real code.
