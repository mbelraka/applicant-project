# Recruita

**Talent without boundaries** — a full-stack recruitment workspace for managing applicants locally, ranking candidates with AI-assisted matching, exporting hiring data, and giving users explicit control over privacy and third-party processing.

The codebase is structured for long-term growth: lazy-loaded feature modules, centralized configuration, NgRx state per domain, and quality gates that mirror CI on every commit.

> **Repository name:** The npm package is still `applicant-project`; the product name shown in the UI is **Recruita**.

---

## Application scope

| Area | Route | What it does |
|------|-------|----------------|
| **Landing** | `/main` | Home hub with navigation into the product |
| **Applicants** | `/applicants` | Create, view, edit, and delete applicants; grid and list views; pagination; skill filters; location autocomplete (Open-Meteo geocoding, consent-gated); application status chips |
| **Match** | `/match` | Score applicants against a job description via a **Groq**-backed proxy (consent-gated); top candidates with localized reasoning |
| **Export** | `/export` | Download applicant data as **CSV**, **JSON**, **Excel**, or **PDF** |
| **Privacy** | `/privacy` | Policy overview, consent preferences, local JSON export, and erase-all-local-data |

**Cross-cutting behavior**

- **i18n** — UI copy in `assets/i18n` (English, German, French, Italian, Romansh, Spanish); locale-aware dates and numbers via shared pipes
- **Notifications** — Transactional Material snackbars driven by NgRx (`showNotification`) with themed success / info / error panels
- **Persistence** — Applicant list and app preferences (language, privacy consent) rehydrate from `localStorage` via NgRx meta-reducers
- **PWA** — Production builds enable the Angular service worker (`ngsw-config.json`)

Applicant data is stored **in the browser** unless you integrate an external backend. AI matching requires the **Node match proxy** so match-provider credentials never reach the client.

---

## Security and data privacy

Recruita is designed around **privacy by default**, **consent-gated optional processing**, and **defense in depth** on the match proxy. Controls are mapped to [OWASP Top 10 (2021)](https://owasp.org/Top10/) themes and typical [OWASP ASVS](https://github.com/OWASP/ASVS) expectations. This is engineering documentation, not a certification or legal opinion.

Full control matrix and deployment checklist: **[SECURITY.md](./SECURITY.md)**.

### Data privacy principles

| Principle | How Recruita applies it |
|-----------|-------------------------|
| **Local-first storage** | Applicant records, workspace state, language, and consent live in the browser (`localStorage`). No applicant database is required for core features. |
| **Opt-in optional processing** | Translation, geocoding, and AI matching are **off until the user consents**. Services check `PrivacyConsentService` before calling external APIs. |
| **Data minimization (AI)** | Match requests send only ephemeral correlation ids, skills, years of experience, and job title — never name, email, phone, location, notes, or application status. The server strips again before scoring or Groq. |
| **Transparency** | `/privacy` explains what is stored locally and what each optional feature transmits. Consent can be reopened anytime. |
| **Portability** | Users can download a structured JSON snapshot of locally stored data (`PrivacyConsentService.buildLocalDataExportJson`). |
| **Right to erasure (local)** | “Erase local data” removes applicants, full state, locale keys, and consent, then reloads the app. This affects **this browser only** — not server logs at your host. |
| **Versioned consent** | Consent records include `PRIVACY_CONSENT_VERSION`; stale consent re-triggers the gate dialog. |

### Consent model

On first visit (or when consent is incomplete / outdated), a **non-dismissible** dialog collects choices:

| Optional feature | When enabled | External dependency |
|------------------|--------------|---------------------|
| **Remote translation** | Dynamic text (e.g. job titles) may call MyMemory | `api.mymemory.translated.net` |
| **Geocoding** | Location field autocomplete | Open-Meteo geocoding API |
| **AI matching** | Job description + anonymized candidates sent to match proxy | Your Express proxy → Groq |

Users can choose **necessary only**, **enable all optional**, or **custom** toggles. Implementation: `PrivacyConsentService`, `PrivacyConsentDialogService`, `/privacy` page.

### OWASP-aligned application security

| OWASP theme | Recruita controls |
|-------------|-------------------|
| **A01 Broken access control** | Match-provider credentials stay server-side only; the browser never receives them. Production `CORS_ORIGIN` must list real front-end origins (wildcard `*` refused when `NODE_ENV=production`). |
| **A02 Cryptographic failures** | Prefer TLS at the reverse proxy or Node (`TLS_CERT_PATH` / `TLS_KEY_PATH`). HSTS when served over HTTPS (`ENABLE_HSTS` or automatic with Node TLS). |
| **A03 Injection** | Match `POST` body capped at **512 KB**; allowlisted top-level keys only; per-candidate fields reduced to `id`, `skills`, `yearsOfExperience`, `currentJobTitle`; `model` name pattern whitelist; LLM output parsed as JSON only (no `eval`). |
| **A04 Insecure design** | Rate limiting on match routes; deterministic scoring path without external calls; privacy consent gates before third-party calls; generic client errors in production. |
| **A05 Security misconfiguration** | Helmet (referrer policy, framing, Permissions-Policy, optional HSTS); `X-Powered-By` disabled; `TRUST_PROXY` for correct client IPs behind reverse proxies. |
| **A06 Vulnerable components** | Lockfile committed; `npm run security:audit` in validate pipeline; keep dependencies updated. |
| **A07 Identification & auth** | `AuthInterceptor` and XSRF configuration ready for your IdP; session handling per your policy (no credentials documented here). |
| **A08 Software & data integrity** | `package-lock.json` verified in CI and pre-commit; Angular bundles third-party scripts (no ad-hoc script tags). |
| **A09 Logging & monitoring** | Proxy logs Groq failures as `[match-proxy]`; production masks internal error strings; malformed JSON returns stable JSON without stack traces. |
| **A10 SSRF** | Server outbound calls limited to the configured Groq client; match proxy does not fetch user-supplied URLs. |

### Browser hardening

Defined in `src/index.html`:

- **Trusted Types** with Angular bundler policy — reduces DOM XSS risk for script injection
- **CSP** fragments: `base-uri 'self'`, `frame-ancestors 'none'`, `object-src 'none'`
- **`referrer: strict-origin-when-cross-origin`** — limits accidental URL leakage
- **`Permissions-Policy`** — disables camera, microphone, geolocation, and payment APIs by default

Stricter CSP (`default-src`, `script-src` with nonces) should be set on your **hosting reverse proxy or CDN** so production hashes are not fighting `ng serve`.

### Match proxy and LLM privacy

```
Browser (Recruita)          Match proxy (Node)              Groq API
     │                              │                            │
     │  anonymized candidates       │  validate + strip again      │
     │  + job description           │  deterministic score path    │
     ├─────────────────────────────►│───────────────────────────►│
     │  (no credentials)            │  (credentials server-only)   │
```

- Client: `match-candidate-privacy.util.ts` replaces applicant ids with **one-time correlation UUIDs** per request.
- Server: `server-config.cjs` enforces allowlists, size limits, and field stripping before any model call.
- **Never** commit `server/.env` or put match-provider secrets in the Angular bundle or this README.

### Production deployment checklist

1. `NODE_ENV=production` — generic error messages to clients.
2. `CORS_ORIGIN` — comma-separated **https://** SPA origin(s); no `*` in production.
3. **TLS** — terminate at ingress or enable Node TLS; enable HSTS when responses are always HTTPS.
4. `TRUST_PROXY=1` when behind a load balancer so rate limits use real client IPs.
5. Rotate match-provider credentials if exposure is suspected (see `server/.env.example` for variable names).

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | Angular 20, Angular Material, Tailwind CSS, RxJS, NgRx (Store, Effects, Entity patterns per module) |
| **i18n** | `@ngx-translate` with HTTP-loaded JSON bundles |
| **Backend (match only)** | Express 5, `groq-sdk`, Helmet, CORS, rate limiting |
| **Export** | ExcelJS, pdf-lib, file-saver (client-side generation) |
| **Tooling** | ESLint, Prettier, Husky, lint-staged, Karma, Playwright, angular-doctor, ngx-security-audit, letify |
| **Runtime** | Node ≥ 18, npm 10.9.2 (see `packageManager` in `package.json`) |

---

## Architecture and design principles

### SOLID-oriented Angular structure

- **Single responsibility** — Templates, styles, and TypeScript live in separate files. Business logic stays out of templates; shared behavior uses pipes, utilities, and services.
- **Open / closed** — Behavior is driven by **`APP_CONFIG`** (`src/app/config/app.config.ts`): navigation, dialog sizes, match timeouts, export filenames, notification durations, and localization defaults.
- **Liskov substitution** — Domain models (e.g. `Applicant`) expose consistent validation and helpers.
- **Interface segregation** — Small models and enums per concern.
- **Dependency injection** — Services use `providedIn: 'root'`; HTTP cross-cutting via interceptors (`AuthInterceptor`, XSRF).

### Atomic design (component layering)

Reusable atoms (chips, pipes, grid cards) compose feature containers (`ApplicantsComponent`, `MatchCandidatesComponent`). Shared UI: `src/app/shared/`; shell: `src/app/containers/root/`.

### Material Design

Angular Material for forms, tables, dialogs, snackbars, and navigation. Theme and overrides: `src/app/styles/theme/`, `src/app/styles/overrides/`.

### Feature modules and lazy loading

```
main          → landing / hub
applicants    → CRUD + views + geocoding effects
match         → proxy client + match state
export        → format selection + download effects
```

Routes: `src/app/containers/root/root-routing.module.ts`. `RootComponent` owns nav, language, applicant seed/load, and the privacy consent gate.

### State management

| Store slice | Feature key | Responsibility |
|-------------|-------------|----------------|
| `app` | (root) | Language, notifications, global UI flags |
| `applicants` | `applicants` | List, filters, pagination, CRUD, location search |
| `match` | `match` | Job description, scores, loading / error |
| `export` | `export` | Selected format and export job state |

Effects for side effects; meta-reducers persist `FullState` to `localStorage` with validation on rehydrate.

### Responsiveness and accessibility

Responsive layouts; `prefers-reduced-motion` respected on the main landing language refresh animation.

---

## Project structure

```
applicant-project/          # npm package root (product: Recruita)
├── src/app/
│   ├── components/          # App-wide UI (e.g. notification snackbar)
│   ├── config/              # APP_CONFIG
│   ├── constants/           # Privacy, persistence, notification keys
│   ├── containers/root/     # Shell, routing, privacy page & consent dialog
│   ├── core/http/           # HTTP interceptors
│   ├── modules/             # Lazy features (applicants, match, export, main)
│   ├── services/            # Localization, localStorage, privacy, remote translate
│   ├── shared/              # Pipes, animations, mat-shared, grid card
│   ├── state/               # Root reducer, effects, meta-reducers
│   ├── styles/              # Theme, overrides, shared SCSS
│   └── utilities/           # Validators, factories, pure helpers
├── server/                  # Express match proxy (Groq)
├── e2e/                     # Playwright specs
├── src/assets/i18n/         # en, de, fr, it, rm, es
├── SECURITY.md              # OWASP control matrix (authoritative detail)
└── .github/workflows/ci.yml
```

---

## Getting started

### Prerequisites

- Node.js **≥ 18**
- npm **10.9.2** (recommended: `corepack enable && corepack prepare npm@10.9.2 --activate`)

### Install

```bash
npm ci
```

### Configure the match proxy

```bash
cp server/.env.example server/.env
```

Add required values in `server/.env` locally (never commit that file). Variable names and comments are documented in `server/.env.example` (match API credentials, `CORS_ORIGIN`, TLS paths, `TRUST_PROXY`, rate limits).

### Run locally

```bash
npm run start:all    # Angular :4200 + proxy :3000 (recommended)
# or separately:
npm start            # Frontend only
npm run start:server # Match proxy — POST /api/match
```

`ng serve` proxies `/api` to port 3000 via `proxy.conf.json`.

### Production build

```bash
npm run build:prod
# Output: dist/applicant-project/
```

Serve the static bundle behind HTTPS with the match proxy configured per [SECURITY.md](./SECURITY.md).

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Angular dev server |
| `npm run start:server` | Express match proxy |
| `npm run start:all` | Dev server + proxy |
| `npm run build` / `build:prod` | Development / production build |
| `npm test` | Karma unit tests (watch) |
| `npm run test:ci` | Headless unit tests + coverage |
| `npm run test:server` | Node tests for `server/` |
| `npm run e2e` | Playwright end-to-end tests |
| `npm run quality` | Prettier check + ESLint |
| `npm run validate` | Quality + doctor + security audit + letify + prod build + `test:ci` |
| `npm run validate:ci` | CI pipeline |
| `npm run lockfile:check` | Verify lockfile matches `package.json` |
| `npm run security:audit` | `ngx-security-audit` (high severity) |

Pre-commit (Husky): **lint-staged**, **lockfile:check**, **validate:ci**. Do not use `git commit --no-verify`.

---

## Testing and CI

- **Unit tests** — Jasmine + Karma across reducers, effects, services, and components.
- **Server tests** — Node test runner for `server/**/*.test.cjs`.
- **E2E** — Playwright (`e2e/smoke.spec.ts`, `e2e/match-candidates.spec.ts`).

GitHub Actions on push/PR to `master` / `main`: lockfile verify → `npm ci` → `npm run validate:ci`.

---

## Configuration reference

**`src/app/config/app.config.ts`** — navigation, dialogs, applicant UI, match endpoint/model/timeouts, export formats, languages, snackbar timing.

**Environments:** `src/environments/environment.ts`, `environment.prod.ts`.

---

## Internationalization

`src/assets/i18n/{en,de,fr,it,rm,es}.json` — includes `privacy.*` and `notifications.*` keys aligned with consent and snackbar behavior.

Language persists via `LocalizationService` / NgRx. Optional `RemoteTranslateService` (MyMemory) respects the translation consent flag.
