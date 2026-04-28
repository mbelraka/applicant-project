const assert = require('node:assert/strict');
const test = require('node:test');

const { createApp } = require('./server.cjs');
const { buildMatchRequestBody, SERVER_CONFIG } = require('./server-config.cjs');

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

async function startTestServer(groqClient) {
  const app = createApp({ groqClient });
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
  assert.deepEqual(await res.json(), {});
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
