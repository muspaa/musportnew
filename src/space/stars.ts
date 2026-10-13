export interface StarState { time: number; scroll: number; px: number; py: number; light: number; mx: number; my: number; hot: number }

/**
 * Starfield 3D di Canvas 2D: bintang punya kedalaman (z), kamera "terbang" mengikuti scroll,
 * dan kecepatan scroll memanjangkan bintang menjadi garis warp. Murni JS, tanpa library.
 */
export function mountStars(canvas: HTMLCanvasElement, state: () => StarState, count: number) {
  const ctx = canvas.getContext('2d'); if (!ctx) return null;
  const x = new Float32Array(count), y = new Float32Array(count), z0 = new Float32Array(count), seed = new Float32Array(count), klass = new Uint8Array(count);
  // Urutan deterministik (tanpa Math.random) supaya hasil render konsisten antar kunjungan.
  let r = 1337; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  const order: { x: number; y: number; z: number; s: number; k: number }[] = [];
  for (let i = 0; i < count; i++) { const s = rnd(); order.push({ x: rnd() * 2 - 1, y: rnd() * 2 - 1, z: rnd(), s, k: s < 0.62 ? 0 : s < 0.8 ? 1 : s < 0.93 ? 2 : 3 }); }
  order.sort((a, b) => a.k - b.k);
  const bounds = [0, 0, 0, 0, count];
  order.forEach((o, i) => { x[i] = o.x; y[i] = o.y; z0[i] = o.z; seed[i] = o.s; klass[i] = o.k; });
  for (let k = 1; k < 4; k++) { const first = order.findIndex(o => o.k >= k); bounds[k] = first === -1 ? count : first; }
  const dark = ['220,230,255', '190,172,255', '150,222,255', '255,214,160'], pale = ['50,60,150', '90,60,190', '20,100,150', '170,90,20'];
  let prevCam = 0, velocity = 0, prevTime = 0;
  const nearX = new Float32Array(48), nearY = new Float32Array(48);

  return {
    render() {
      const s = state(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      const bw = Math.round(w * dpr), bh = Math.round(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const cam = s.scroll * 0.00042 + s.time * 0.010, dt = Math.max(0.001, s.time - prevTime);
      const instant = prevTime ? (cam - prevCam) / dt : 0; prevCam = cam; prevTime = s.time;
      velocity += (Math.max(-3, Math.min(3, instant)) - velocity) * 0.18;
      const focal = Math.max(w, h) * 0.5, cx = w / 2, cy = h / 2, light = s.light > 0.5, palette = light ? pale : dark;
      const streak = Math.min(0.16, Math.abs(velocity) * 0.018), fade = light ? 0.55 : 1;
      let near = 0; const radius = 150;
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = `rgb(${palette[k]})`; ctx.strokeStyle = `rgb(${palette[k]})`;
        for (let i = bounds[k]; i < bounds[k + 1]; i++) {
          let z = (z0[i] - cam) % 1; if (z < 0) z += 1; z = 0.035 + z * 0.965;
          const sx = cx + (x[i] / z) * focal * 0.62 + s.px * (1 - z) * 38, sy = cy + (y[i] / z) * focal * 0.62 + s.py * (1 - z) * 26;
          if (sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) continue;
          const depth = 1 - z, tw = 0.78 + 0.22 * Math.sin(s.time * 1.7 + seed[i] * 60);
          ctx.globalAlpha = Math.min(1, (0.18 + depth * 0.95) * tw) * fade;
          const size = 0.35 + depth * depth * 2.4 + (klass[i] === 3 ? 0.5 : 0);
          if (s.hot > 0.02 && depth > 0.25 && near < 48) { const dx = sx - s.mx, dy = sy - s.my; if (dx * dx + dy * dy < radius * radius) { nearX[near] = sx; nearY[near] = sy; near++; } }
          if (streak > 0.004) {
            const z2 = Math.min(1, z + streak * (0.4 + depth)), ex = cx + (x[i] / z2) * focal * 0.62 + s.px * (1 - z2) * 38, ey = cy + (y[i] / z2) * focal * 0.62 + s.py * (1 - z2) * 26;
            ctx.lineWidth = Math.max(0.5, size * 0.9); ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sx, sy); ctx.stroke();
          } else ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        }
      }
      // Konstelasi: bintang dekat kursor saling terhubung dengan garis halus.
      if (near > 1) {
        ctx.lineWidth = 0.8; ctx.strokeStyle = `rgb(${light ? '70,60,200' : '160,220,255'})`;
        for (let a = 0; a < near; a++) for (let b = a + 1; b < near; b++) {
          const dx = nearX[a] - nearX[b], dy = nearY[a] - nearY[b], d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) { ctx.globalAlpha = (1 - d / 110) * 0.55 * Math.min(1, s.hot); ctx.beginPath(); ctx.moveTo(nearX[a], nearY[a]); ctx.lineTo(nearX[b], nearY[b]); ctx.stroke(); }
        }
        ctx.fillStyle = light ? 'rgb(70,60,200)' : 'rgb(200,235,255)'; ctx.globalAlpha = 0.9 * Math.min(1, s.hot);
        for (let a = 0; a < near; a++) { ctx.beginPath(); ctx.arc(nearX[a], nearY[a], 1.6, 0, 6.2832); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }
  };
}
