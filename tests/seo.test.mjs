import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalOrigin } from '../scripts/seo.mjs';
test('canonical uses explicit domain, otherwise Vercel production origin, otherwise the real site domain', () => {
  assert.equal(canonicalOrigin('https://example.com/', 'demo.vercel.app'), 'https://example.com/');
  assert.equal(canonicalOrigin(undefined, 'demo.vercel.app'), 'https://demo.vercel.app/');
  assert.equal(canonicalOrigin(), 'https://musfamus.my.id/');
});
test('canonical rejects insecure, credentialed and non-root URLs', () => {
  for (const u of ['http://example.com/', 'https://user:pass@example.com/', 'https://example.com/project', 'https://example.com/?token=abc', 'https://example.com/#home']) assert.throws(() => canonicalOrigin(u));
});
