# Recruita backend

Backend services for Recruita. This folder is the home for all server-side code.

## Current layout

The **Node.js match proxy** (Express + Groq) lives here while the production API is migrated to **Java Spring Boot**. Files at the repository root of `backend/`:

- `server.cjs` — HTTP entrypoint
- `server-config.cjs` — validation, rate limits, Groq integration
- `constants/` — shared server constants
- `.env.example` — environment variable names (copy to `.env` locally; never commit `.env`)

## Run locally

From the **repository root**:

```bash
npm run start:server
```

Or from this directory after `npm ci` at the root:

```bash
npm start
```

## Tests

```bash
npm test
```

## Spring Boot (planned)

New Spring modules will be added under this directory (for example `recruita-api/` or a standard Maven/Gradle layout) without moving the Angular app. The Node proxy may remain for match-only workloads or be retired once parity exists in Spring.
