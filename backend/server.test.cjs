const assert = require('node:assert/strict');
const test = require('node:test');

const { createApp } = require('./server.cjs');
const {
  buildMatchRequestBody,
  pickAnonymizedMatchCandidates,
  pickMinimalMatchBody,
  SERVER_CONFIG,
  readServerSecurityEnv,
  validateMatchProxyStartup,
} = require('./server-config.cjs');
const { HTTP_STATUS } = require('./http-status.enum.cjs');

function createGroqMock({
  content = '{"scores":[]}',
  shouldThrow = false,
} = {}) {
  let calls = 0;
  return {
    getCalls: () => calls,
    chat: {
      completions: {
        create: async () => {
          calls += 1;
          if (shouldThrow) {
            throw new Error('boom');
          }
          return {
            choices: [{ message: { content } }],
          };
        },
      },
    },
  };
}

async function startTestServer(
  groqClient,
  security,
  suppressErrorDetail = undefined
) {
  const app = createApp({ groqClient, security, suppressErrorDetail });
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

function getBaseUrl(server) {
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

test('GET /api/health returns ok', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.HEALTH}`
  );
  assert.equal(res.status, SERVER_CONFIG.STATUS.OK);
  assert.deepEqual(await res.json(), { ok: true });
});

test('POST /api/match returns 400 when jobDescription is missing', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ candidates: [] }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.JOB_DESCRIPTION_REQUIRED
  );
});

test('POST /api/match returns 400 when candidates is not an array', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        candidates: null,
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATES_MUST_BE_ARRAY
  );
});

test('POST /api/match returns parsed JSON payload from Groq', async (t) => {
  const payload = { scores: [{ id: '1', matchScore: 90 }] };
  const groqMock = createGroqMock({ content: JSON.stringify(payload) });
  const server = await startTestServer(groqMock);
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        candidates: [{ id: '1', name: 'Test' }],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.OK);
  assert.deepEqual(await res.json(), payload);
  assert.equal(groqMock.getCalls(), 1);
});

test('POST /api/match returns {} when Groq content is invalid JSON', async (t) => {
  const server = await startTestServer(createGroqMock({ content: 'not-json' }));
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        candidates: [],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.OK);
  assert.deepEqual(
    await res.json(),
    JSON.parse(SERVER_CONFIG.GROQ.EMPTY_JSON_OBJECT_LITERAL)
  );
});

test('POST /api/match-job (legacy route) still works', async (t) => {
  const payload = { scores: [] };
  const server = await startTestServer(
    createGroqMock({ content: JSON.stringify(payload) })
  );
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH_LEGACY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        candidates: [],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.OK);
  assert.deepEqual(await res.json(), payload);
});

test('POST /api/match returns 500 when Groq throws', async (t) => {
  const server = await startTestServer(createGroqMock({ shouldThrow: true }));
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        candidates: [],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.INTERNAL_SERVER_ERROR);
  assert.equal((await res.json()).error, 'boom');
});

test('POST /api/match returns generic error when error detail is suppressed', async (t) => {
  const server = await startTestServer(
    createGroqMock({ shouldThrow: true }),
    undefined,
    true
  );
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        candidates: [],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.INTERNAL_SERVER_ERROR);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.GROQ_FAILED_CLIENT
  );
});

test('POST /api/match returns 400 when jobDescription exceeds max length', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const tooLong = 'x'.repeat(
    SERVER_CONFIG.REQUEST_LIMITS.JOB_DESCRIPTION_MAX_CHARS + 1
  );
  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: tooLong,
        candidates: [],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.JOB_DESCRIPTION_TOO_LONG
  );
});

test('POST /api/match returns 400 when too many candidates', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const candidates = Array.from(
    { length: SERVER_CONFIG.REQUEST_LIMITS.CANDIDATES_MAX_COUNT + 1 },
    (_, i) => ({ id: String(i) })
  );
  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need dev',
        candidates,
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.TOO_MANY_CANDIDATES
  );
});

test('POST /api/match returns 400 when model parameter is invalid', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need dev',
        candidates: [],
        model: 'bad model!',
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.MODEL_INVALID
  );
});

test('POST /api/match returns 400 when candidate skills is not an array', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need dev',
        candidates: [{ id: '1', skills: 'TypeScript' }],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_SKILLS_INVALID
  );
});

test('pickAnonymizedMatchCandidates drops personal and HR free-text fields', () => {
  const stripped = pickAnonymizedMatchCandidates([
    {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@corp.test',
      phone: '+41790000000',
      location: 'Geneva',
      notes: 'Reference checked',
      applicationStatus: 'interview',
      skills: ['TypeScript'],
      yearsOfExperience: 5,
      currentJobTitle: 'Senior developer',
    },
  ]);
  assert.deepEqual(stripped, [
    {
      id: '1',
      skills: ['TypeScript'],
      yearsOfExperience: 5,
      currentJobTitle: 'Senior developer',
    },
  ]);
});

test('buildMatchRequestBody comes from config and applies defaults', () => {
  const payload = buildMatchRequestBody({
    jobDescription: 'Need Angular dev',
    candidates: [{ id: '1' }],
    model: undefined,
    temperature: undefined,
  });

  assert.equal(payload.model, SERVER_CONFIG.GROQ.DEFAULT_MODEL);
  assert.equal(payload.temperature, SERVER_CONFIG.GROQ.DEFAULT_TEMPERATURE);
  assert.equal(payload.top_p, SERVER_CONFIG.GROQ.DEFAULT_TOP_P);
  assert.equal(payload.seed, SERVER_CONFIG.GROQ.DEFAULT_SEED);
  assert.equal(
    payload.response_format.type,
    SERVER_CONFIG.GROQ.RESPONSE_FORMAT_TYPE
  );
  assert.equal(payload.response_format.json_schema, undefined);
});

test('POST /api/match returns cached result for same normalized input', async (t) => {
  const payload = { scores: [{ id: '1', matchScore: 90 }] };
  const groqMock = createGroqMock({ content: JSON.stringify(payload) });
  const server = await startTestServer(groqMock);
  t.after(() => server.close());

  const body = {
    jobDescription: 'Need Angular dev',
    candidates: [
      { id: '2', name: 'B', skills: ['ts', 'angular'] },
      { id: '1', name: 'A', skills: ['angular', 'ts'] },
    ],
  };

  const first = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const second = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...body,
        candidates: [...body.candidates].reverse(),
      }),
    }
  );

  assert.equal(first.status, SERVER_CONFIG.STATUS.OK);
  assert.equal(second.status, SERVER_CONFIG.STATUS.OK);
  assert.deepEqual(await first.json(), payload);
  assert.deepEqual(await second.json(), payload);
  assert.equal(groqMock.getCalls(), 1);
});

test('POST /api/match deterministic mode bypasses Groq and is stable', async (t) => {
  const groqMock = createGroqMock({ shouldThrow: true });
  const server = await startTestServer(groqMock);
  t.after(() => server.close());

  const body = {
    jobDescription: 'Senior Angular developer with 5 years experience',
    deterministic: true,
    candidates: [
      {
        id: '1',
        name: 'Alice',
        currentJobTitle: 'Angular Developer',
        yearsOfExperience: 6,
        skills: ['TypeScript', 'Angular', 'NgRx'],
      },
    ],
  };

  const first = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const second = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  assert.equal(first.status, SERVER_CONFIG.STATUS.OK);
  assert.equal(second.status, SERVER_CONFIG.STATUS.OK);
  const firstPayload = await first.json();
  const secondPayload = await second.json();
  assert.deepEqual(firstPayload, secondPayload);
  assert.equal(groqMock.getCalls(), 0);
  assert.equal(Array.isArray(firstPayload.scores), true);
  assert.equal(typeof firstPayload.scores[0].matchScore, 'number');
});

test('POST /api/match returns 429 after exceeding rate limit', async (t) => {
  const security = readServerSecurityEnv({
    ...process.env,
    MATCH_RATE_LIMIT_MAX: '2',
  });
  const server = await startTestServer(createGroqMock(), security);
  t.after(() => server.close());

  const url = `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`;
  const payload = JSON.stringify({
    jobDescription: 'Lead engineer',
    candidates: [{ id: '1', name: 'A', skills: ['Go'] }],
    deterministic: true,
  });
  const headers = { 'content-type': 'application/json' };

  const first = await fetch(url, {
    method: 'POST',
    headers,
    body: payload,
  });
  const second = await fetch(url, {
    method: 'POST',
    headers,
    body: payload,
  });
  const third = await fetch(url, {
    method: 'POST',
    headers,
    body: payload,
  });

  assert.equal(first.status, SERVER_CONFIG.STATUS.OK);
  assert.equal(second.status, SERVER_CONFIG.STATUS.OK);
  assert.equal(third.status, HTTP_STATUS.TOO_MANY_REQUESTS);
});

test('POST /api/match returns 400 for malformed JSON body', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{ not-json',
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.INVALID_JSON_BODY
  );
});

test('unknown GET routes return JSON 404', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(`${getBaseUrl(server)}/api/does-not-exist`);
  assert.equal(res.status, SERVER_CONFIG.STATUS.NOT_FOUND);
  assert.equal((await res.json()).error, SERVER_CONFIG.MESSAGES.NOT_FOUND);
});

test('GET /api/health includes Strict-Transport-Security when ENABLE_HSTS=1', async (t) => {
  const security = readServerSecurityEnv({
    ENABLE_HSTS: '1',
  });
  const server = await startTestServer(createGroqMock(), security);
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.HEALTH}`
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.OK);
  const hsts = res.headers.get('strict-transport-security');
  assert.match(hsts || '', /^max-age=/iu);
});

test('GET /api/health omits HSTS header when ENABLE_HSTS is unset', async (t) => {
  const security = readServerSecurityEnv({
    ENABLE_HSTS: '',
  });
  const server = await startTestServer(createGroqMock(), security);
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.HEALTH}`
  );

  assert.equal(res.headers.get('strict-transport-security'), null);
});

test('pickMinimalMatchBody ignores unknown JSON keys', () => {
  const slim = pickMinimalMatchBody({
    jobDescription: 'x',
    candidates: [],
    extraField: [1, 2, 3],
  });
  assert.equal(Object.prototype.hasOwnProperty.call(slim, 'extraField'), false);
  assert.equal(slim.jobDescription, 'x');
});

test('validateMatchProxyStartup rejects wildcard CORS in production', () => {
  const bad = validateMatchProxyStartup(
    { NODE_ENV: 'production' },
    { corsOriginOption: true }
  );
  assert.equal(bad.ok, false);
  assert.match(bad.error || '', /CORS_ORIGIN/iu);

  const ok = validateMatchProxyStartup(
    { NODE_ENV: 'production' },
    { corsOriginOption: ['https://app.example.com'] }
  );
  assert.equal(ok.ok, true);
});

test('readServerSecurityEnv enables HSTS when TLS active unless DISABLE_HSTS=1', () => {
  const on = readServerSecurityEnv(
    {
      ENABLE_HSTS: '',
      DISABLE_HSTS: '',
    },
    { tlsActive: true }
  );
  assert.equal(on.enableHsts, true);

  const off = readServerSecurityEnv(
    {
      DISABLE_HSTS: '1',
    },
    { tlsActive: true }
  );
  assert.equal(off.enableHsts, false);
});

test('POST /api/match returns 400 when correlation id missing on candidate', async (t) => {
  const server = await startTestServer(createGroqMock());
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need dev',
        candidates: [{ yearsOfExperience: 3 }],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.BAD_REQUEST);
  assert.equal(
    (await res.json()).error,
    SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_ID_REQUIRED
  );
});

test('POST /api/match ignores benign extra top-level properties', async (t) => {
  const payload = { scores: [{ id: '1', matchScore: 90 }] };
  const groqMock = createGroqMock({ content: JSON.stringify(payload) });
  const server = await startTestServer(groqMock);
  t.after(() => server.close());

  const res = await fetch(
    `${getBaseUrl(server)}${SERVER_CONFIG.ROUTES.MATCH}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Need Angular dev',
        injected: false,
        candidates: [{ id: '1', name: 'Leak', skills: ['ts'] }],
      }),
    }
  );

  assert.equal(res.status, SERVER_CONFIG.STATUS.OK);
  assert.deepEqual(await res.json(), payload);
});
