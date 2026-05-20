# Recruita backend

**Spring Boot 3** API (Java 21) — match scoring, Groq integration, security.

Part of the Recruita monorepo; npm scripts are defined at the **repository root** (`package.json`).

## Layout

| Path | Role |
|------|------|
| `src/main/java/` | Application code |
| `src/main/resources/` | `application.yml`, profiles |
| `src/test/java/` | JUnit 5 tests |
| `config/` | Checkstyle, SpotBugs |
| `pom.xml` | Maven build |
| `.env.example` | Secrets template → copy to `.env` |

## Run locally

From the **repository root**:

```bash
npm run start:backend
# or: sh scripts/start-backend.sh
```

With Angular:

```bash
npm run dev
```

- API: http://localhost:3001  
- Frontend proxies `/api` from :4200

Secrets: `backend/.env` (from `.env.example`).

## Quality

| Command | Purpose |
|---------|---------|
| `npm run quality:backend` | Spotless + Checkstyle |
| `npm run test:backend` | Tests only |
| `npm run verify:backend` | Full verify (CI gate) |
| `npm run validate:ci:backend` | `quality:backend` + `verify:backend` |

From this directory: `./mvnw verify`

Pre-commit runs `precommit:backend` when any path under `backend/` is staged.

**JDK:** Java 21+ (see `.java-version`).
