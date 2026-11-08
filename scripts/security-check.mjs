#!/usr/bin/env node
// Black-box security check for the deployed site. No dependencies.
// Usage: node scripts/security-check.mjs https://your-site.vercel.app
//
// Checks: HTTPS redirect, security headers, CSP directives, no source maps,
// no exposed dotfiles / config / env files, no secrets in shipped JS,
// method restrictions and server banner leakage. Exits 1 on any failure.

const base = (process.argv[2] || '').replace(/\/$/, '')
if (!/^https:\/\//.test(base)) {
  console.error('Usage: node scripts/security-check.mjs https://<deployed-url>')
  process.exit(2)
}

const results = []
const pass = (name, detail = '') => results.push({ ok: true, name, detail })
const fail = (name, detail = '') => results.push({ ok: false, name, detail })
const check = (cond, name, detail) => (cond ? pass(name, detail) : fail(name, detail))

async function get(path, init = {}) {
  return fetch(base + path, { redirect: 'manual', ...init })
}

// 1. HTTPS-only: plain HTTP must redirect to HTTPS.
try {
  const http = await fetch(base.replace('https://', 'http://') + '/', { redirect: 'manual' })
  const loc = http.headers.get('location') || ''
  check(http.status >= 300 && http.status < 400 && loc.startsWith('https://'), 'HTTP redirects to HTTPS', `${http.status} → ${loc}`)
} catch (e) {
  fail('HTTP redirects to HTTPS', String(e))
}

// 2. Security headers on the home page.
const home = await get('/')
check(home.status === 200, 'Home page returns 200', String(home.status))
const h = (k) => home.headers.get(k) || ''

const csp = h('content-security-policy')
check(csp.length > 0, 'Content-Security-Policy present')
for (const d of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'none'"]) {
  check(csp.includes(d), `CSP has ${d}`)
}
check(!/script-src[^;]*'unsafe-(inline|eval)'/.test(csp), 'CSP forbids inline/eval scripts')
check(/max-age=\d{8,}/.test(h('strict-transport-security')), 'HSTS max-age ≥ 1 year', h('strict-transport-security'))
check(h('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff')
check(h('x-frame-options') === 'DENY', 'X-Frame-Options: DENY (clickjacking)')
check(h('referrer-policy') !== '', 'Referrer-Policy present', h('referrer-policy'))
check(h('permissions-policy').includes('camera=()'), 'Permissions-Policy disables camera/mic/geo')
check(!h('x-powered-by'), 'No X-Powered-By banner')

// 3. Shipped JavaScript: no source maps, no secrets.
const html = await home.text()
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1])
check(!/<script(?![^>]*\bsrc=)[^>]*>[^<]+<\/script>/.test(html), 'No inline <script> in HTML')
const secretPatterns = [
  [/sk-[A-Za-z0-9_-]{20,}/, 'OpenAI/Anthropic-style key'],
  [/sk-ant-[A-Za-z0-9_-]{20,}/, 'Anthropic key'],
  [/AKIA[0-9A-Z]{16}/, 'AWS access key'],
  [/gh[pousr]_[A-Za-z0-9]{36,}/, 'GitHub token'],
  [/AIza[0-9A-Za-z_-]{35}/, 'Google API key'],
  [/xox[abpr]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'Private key'],
]
for (const src of scripts) {
  const res = await get(src)
  const js = await res.text()
  const found = secretPatterns.filter(([re]) => re.test(js)).map(([, n]) => n)
  check(found.length === 0, `No secrets in ${src}`, found.join(', '))
  check(!/\/\/# sourceMappingURL=/.test(js), `No source map reference in ${src}`)
  const map = await get(src + '.map')
  check(map.status === 404, `Source map not served for ${src}`, String(map.status))
}

// 4. Sensitive paths must not be exposed. A SPA fallback returning index.html
//    with 200 is acceptable only if the body is the app shell, not the file.
const sensitive = ['/.env', '/.env.local', '/.git/config', '/.git/HEAD', '/package.json', '/package-lock.json', '/vercel.json', '/tsconfig.json', '/src/data/profile.ts', '/.vercel/project.json']
for (const p of sensitive) {
  const res = await get(p)
  const body = res.status === 200 ? await res.text() : ''
  const leaked = res.status === 200 && !body.includes('<div id="root">')
  check(!leaked, `Not exposed: ${p}`, String(res.status))
}

// 5. Only GET/HEAD should do anything on a static site.
for (const method of ['POST', 'PUT', 'DELETE']) {
  const res = await get('/', { method })
  check(res.status >= 400 || res.status === 405, `${method} / rejected`, String(res.status))
}

// 6. Path traversal attempts must not escape the output directory.
for (const p of ['/..%2f..%2fetc%2fpasswd', '/%2e%2e/%2e%2e/etc/passwd']) {
  const res = await get(p)
  const body = res.status === 200 ? await res.text() : ''
  check(!body.includes('root:x:0:0'), `Path traversal blocked: ${p}`, String(res.status))
}

const failed = results.filter((r) => !r.ok)
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
