export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); return res.status(405).json({ error: 'Method not allowed' }); }
  return res.status(200).json({ status: 'ok', app: 'R_HMT V2', architecture: 'static + serverless', upstream: 'not-probed' });
}
