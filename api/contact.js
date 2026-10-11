// Compatibility endpoint: the old form did not send messages. No false success.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'Form kontak tidak digunakan. Hubungi R_HMT melalui kanal sosial di bagian Kontak.', contact: '/#contact' });
}
