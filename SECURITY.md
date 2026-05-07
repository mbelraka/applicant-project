# Security posture (OWASP-aligned)

This document maps notable controls to [OWASP Top 10 (2021)](https://owasp.org/Top10/) themes and typical [ASVS](https://github.com/OWASP/ASVS) expectations. It is not a certification or audit.

## Application controls

| Area | What we do |
|------|------------|
| **A01 Broken access** | Match proxy uses server-side API key (`GROQ_API_KEY`); browser never receives it. Configure `CORS_ORIGIN` to your real front-end origin(s) in production. |
| **A02 Cryptographic failures & transport** | Prefer **TLS** at the edge or **Node HTTPS** (`TLS_CERT_PATH` + `TLS_KEY_PATH`). **HSTS** when served over HTTPS (`ENABLE_HSTS=1` behind a TLS proxy, or automatically with Node TLS unless `DISABLE_HSTS=1`). Optional **`HSTS_PRELOAD=1`** only if you deliberately join the browser preload list. |
| **Privacy (LLM)** | Match payloads use correlation ids; the proxy validates and **strips** all other candidate fields server-side before deterministic scoring or Groq. Names, contacts, location, notes, and status never reach the model. |
| **A03 Injection** | JSON body capped at **512kb**; `/api/match` honors only **allowlisted top-level keys**; each candidate is reduced to **`id`, `skills`, `yearsOfExperience`, `currentJobTitle`** with a required string **id**. Strict lengths, **`model`** pattern whitelist. LLM responses parsed as JSON only (no `eval`). |
| **A04 Insecure design** | Rate limiting on match routes; deterministic scoring path without external calls; privacy consent gates third-party behavior where applicable. |
| **A05 Misconfiguration** | Helmet (referrer policy, framing, Permissions-Policy, optional HSTS with optional **`HSTS_PRELOAD`**); CSP left to the SPA meta / proxy; `X-Powered-By` disabled; CORS allowlist — **`NODE_ENV=production` refuses `CORS_ORIGIN=*` at startup**; `TRUST_PROXY` behind reverse proxies so rate limits use real client IPs. |
| **A06 Vulnerable components** | Keep `npm` dependencies updated; run `npm audit` in CI or locally before releases. |
| **A07 Identification / auth** | Front-end auth patterns follow Angular and your IdP; store tokens per your security policy (see app auth code). |
| **A08 Software / data integrity** | Lockfile present; consider subresource integrity for any manually added third-party scripts (Angular build handles bundled assets). |
| **A09 Logging / monitoring** | Server logs Groq failures with `[match-proxy]`; production responses mask internal error strings from clients; malformed JSON and unknown routes return stable JSON without stack traces. |
| **A10 SSRF** | Outbound calls are constrained to the configured Groq client; request URLs are not user-controlled for server fetches in the match proxy. |

## Frontend (browser)

- **Trusted Types** and additional directives (`base-uri`, `frame-ancestors`, `object-src`) in `src/index.html` reduce DOM XSS and clickjacking surface where the meta policy applies.
- **`referrer`** and **`Permissions-Policy`** limit accidental leakage and ambient API exposure.
- For stricter **Content-Security-Policy** (e.g. `default-src`, `script-src`), set headers on the **hosting reverse proxy** or CDN so you can tune hashes nonces without fighting `ng serve`.

## Server deployment checklist

1. `NODE_ENV=production` so match errors return generic messages to clients.
2. `CORS_ORIGIN` = comma-separated **https://** front-end origin(s). Wildcard `*` is **refused** when `NODE_ENV=production`.
3. **TLS**: terminate at reverse proxy or set `TLS_CERT_PATH` and `TLS_KEY_PATH` for HTTPS in Node (same `PORT`). With Node TLS, **HSTS defaults on** unless `DISABLE_HSTS=1`. Behind an external TLS terminator, set `ENABLE_HSTS=1` when responses are always HTTPS.
4. `TRUST_PROXY=1` when clients connect through a proxy so rate limits use the real IP.
5. Rotate `GROQ_API_KEY` if exposed.

Report suspected vulnerabilities to the project maintainers through your organization’s usual channel.
