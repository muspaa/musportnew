import { createHash } from 'node:crypto';
import { buildPrompt } from '../shared/knowledge.mjs';
// Best-effort per warm instance; Vercel Firewall is the deployment-wide limit.
const buckets = new Map();
const MAX_MESSAGES = 8, MAX_MESSAGE = 1200, MAX_BODY = 20000;
export function validateMessages(body) {
  if (!body || typeof body !== 'object' || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > MAX_MESSAGES) return null;
  const cleaned = [];
  for (const message of body.messages) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') return null;
    const text = message.content.trim();
    if (!text || text.length > MAX_MESSAGE) return null;
    if (cleaned.length && cleaned.at(-1).role === message.role) return null;
    cleaned.push({ role: message.role, content: text });
  }
  return cleaned.at(-1)?.role === 'user' ? cleaned : null;
}
export function extractAnswer(body) {
  if (!body || typeof body !== 'object' || body.error || body.success === false || body.status === false || (typeof body.status === 'number' && body.status >= 400)) return '';
  const paths = [body.text, body.response, body.result?.text, body.result?.response, body.result?.answer, body.result?.content, body.result, body.data?.text, body.data?.response, body.data?.answer, body.data?.result, body.data?.content, body.data, body.answer, body.content, body.choices?.[0]?.message?.content];
  const answer = paths.find(x => typeof x === 'string' && x.trim());
  if (!answer || /<!doctype|<html[\s>]/i.test(answer)) return '';
  return answer.trim().slice(0, 12000);
}
function limited(ip, now) {
  if (buckets.size > 2000) { for (const [key, item] of buckets) if (item.until < now) buckets.delete(key); if (buckets.size > 2000) buckets.delete(buckets.keys().next().value); }
  const key = createHash('sha256').update(ip).digest('hex');
  const item = buckets.get(key);
  if (!item || item.until < now) { buckets.set(key, { count: 1, until: now + 60000 }); return false; }
  item.count++; return item.count > 8;
}
export function createChatHandler({ fetchImpl = fetch, now = Date.now } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Gunakan POST untuk percakapan.' }); }
    const contentType = req.headers?.['content-type'] || '';
    if (!contentType.toLowerCase().includes('application/json')) return res.status(415).json({ error: 'Format pesan harus JSON.' });
    if (req.headers?.['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Permintaan tidak diizinkan.' });
    try {
      if (Number(req.headers?.['content-length']) > MAX_BODY || Buffer.byteLength(JSON.stringify(req.body || {})) > MAX_BODY) return res.status(413).json({ error: 'Percakapan terlalu panjang.' });
      const messages = validateMessages(req.body);
      if (!messages) return res.status(400).json({ error: 'Pesan tidak valid. Maksimum 1.200 karakter per pesan.' });
      const ip = String(req.headers?.['x-real-ip'] || req.headers?.['x-forwarded-for']?.split(',')[0] || req.ip || 'anonymous');
      if (limited(ip, now())) { res.setHeader('Retry-After', '60'); return res.status(429).json({ error: 'Terlalu banyak pesan. Tunggu sekitar satu menit.' }); }
      const upstream = new URL(process.env.CHAT_API_URL || 'https://api.nexray.eu.cc/ai/copilot');
      if (upstream.protocol !== 'https:' || upstream.username || upstream.password || upstream.hostname.startsWith('.')) throw new Error('CONFIG');
      upstream.searchParams.set('text', buildPrompt(messages));
      // Retain the complete public profile and newest user message when a GET URI needs a shorter context.
      while (upstream.href.length > 26000 && messages.length > 1) { messages.shift(); upstream.searchParams.set('text', buildPrompt(messages)); }
      if (upstream.href.length > 30000) return res.status(413).json({ error: 'Pesan terlalu panjang untuk layanan ini. Coba ringkas pertanyaan.' });
      const abort = new AbortController();
      const value = Number(process.env.CHAT_TIMEOUT_MS || 18000);
      const timeout = Math.min(22000, Math.max(1000, Number.isFinite(value) ? value : 18000));
      const timer = setTimeout(() => abort.abort(), timeout);
      try {
        const headers = { Accept: 'application/json' };
        if (process.env.CHAT_API_KEY) headers.Authorization = `Bearer ${process.env.CHAT_API_KEY}`;
        const response = await fetchImpl(upstream, { method: 'GET', headers, signal: abort.signal });
        if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('UPSTREAM');
        const raw = await response.text();
        if (raw.length > 200000) throw new Error('UPSTREAM_SIZE');
        const text = extractAnswer(JSON.parse(raw));
        if (!text) throw new Error('EMPTY_RESPONSE');
        return res.status(200).json({ text });
      } catch (error) {
        return res.status(abort.signal.aborted ? 504 : 502).json({ error: abort.signal.aborted ? 'Respons terlalu lama. Coba lagi sebentar lagi.' : 'Layanan AI sementara tidak tersedia. Coba lagi nanti.' });
      } finally { clearTimeout(timer); }
    } catch { return res.status(503).json({ error: 'Layanan AI sementara tidak tersedia. Coba lagi nanti.' }); }
  };
}
export default createChatHandler();
