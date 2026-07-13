import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeOllamaTranslate } from './ollama.mjs';

function stubFetch(response) {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, opts });
    return response;
  };
  return { fetchImpl, calls };
}

const okResponse = (content) => ({
  ok: true,
  status: 200,
  json: async () => ({ message: { content } }),
});

test('POSTs to /api/chat with model, stream:false, and system+user messages', async () => {
  const { fetchImpl, calls } = stubFetch(okResponse('翻訳結果'));
  const translate = makeOllamaTranslate({ host: 'http://h:1', model: 'm1', fetchImpl });
  const out = await translate('Hello', 'ja');
  assert.equal(out, '翻訳結果');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://h:1/api/chat');
  assert.equal(calls[0].opts.method, 'POST');
  assert.equal(calls[0].opts.headers['Content-Type'], 'application/json');
  const body = JSON.parse(calls[0].opts.body);
  assert.equal(body.model, 'm1');
  assert.equal(body.stream, false);
  assert.equal(body.messages.length, 2);
  assert.equal(body.messages[0].role, 'system');
  assert.match(body.messages[0].content, /Japanese/);
  assert.equal(body.messages[1].role, 'user');
  assert.equal(body.messages[1].content, 'Hello');
});

test('maps pt-br to Brazilian Portuguese in the system prompt', async () => {
  const { fetchImpl, calls } = stubFetch(okResponse('x'));
  const translate = makeOllamaTranslate({ fetchImpl });
  await translate('Hi', 'pt-br');
  const body = JSON.parse(calls[0].opts.body);
  assert.match(body.messages[0].content, /Brazilian Portuguese/);
});

test('trims whitespace from the model output', async () => {
  const { fetchImpl } = stubFetch(okResponse('  spaced  \n'));
  const translate = makeOllamaTranslate({ fetchImpl });
  assert.equal(await translate('x', 'ja'), 'spaced');
});

test('throws a clear error on a non-ok HTTP response', async () => {
  const { fetchImpl } = stubFetch({ ok: false, status: 500, json: async () => ({}) });
  const translate = makeOllamaTranslate({ fetchImpl });
  await assert.rejects(translate('x', 'ja'), /HTTP 500/);
});

test('throws when the response shape is unexpected', async () => {
  const { fetchImpl } = stubFetch({ ok: true, status: 200, json: async () => ({ nope: true }) });
  const translate = makeOllamaTranslate({ fetchImpl });
  await assert.rejects(translate('x', 'ja'), /Unexpected Ollama response shape/);
});

test('wraps a network error with a helpful message', async () => {
  const fetchImpl = async () => { throw new Error('ECONNREFUSED'); };
  const translate = makeOllamaTranslate({ host: 'http://localhost:11434', fetchImpl });
  await assert.rejects(translate('x', 'ja'), /Ollama request to http:\/\/localhost:11434 failed/);
});
