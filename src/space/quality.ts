/**
 * Kualitas render adaptif (hanya turun, tidak naik lagi agar tidak berkedip).
 * Cosmos mengirim durasi frame; nebula dan planet membaca `value` sebagai pengali resolusi.
 */
let q = 1, ema = 1 / 60, frames = 0;
export const quality = {
  get value() { return q; },
  sample(dt: number) {
    ema += (Math.min(0.25, dt) - ema) * 0.08;
    if (++frames > 90 && ema > 0.038 && q > 0.5) { q = Math.max(0.5, +(q - 0.15).toFixed(2)); frames = 0; document.documentElement.dataset.quality = String(q); }
  },
  reset() { frames = 0; }
};
