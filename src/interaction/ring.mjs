/** Matematika karusel ring 3D: murni, bisa dites tanpa DOM. Satuan kursor = satu kartu. */
export const RING_MIN_SLOTS = 6;

export function ringLayout(count, cardWidth, gap = 28) {
  const slots = Math.max(count, RING_MIN_SLOTS);
  const step = 360 / slots;
  const radius = Math.round((cardWidth + gap) / 2 / Math.tan(Math.PI / slots));
  return { slots, step, radius, wraps: count >= RING_MIN_SLOTS };
}

export function clampCursor(cursor, count, wraps) {
  if (!count) return 0;
  return wraps ? cursor : Math.max(0, Math.min(count - 1, cursor));
}

export function activeIndex(cursor, count) {
  if (!count) return 0;
  return ((Math.round(cursor) % count) + count) % count;
}

/** Pilih titik berhenti setelah drag dengan sedikit inersia (kartu per detik). */
export function snapTarget(cursor, velocity, count, wraps) {
  const projected = cursor + Math.max(-2, Math.min(2, velocity * 0.18));
  return clampCursor(Math.round(projected), count, wraps);
}

/** Target setara terdekat pada ring agar perjalanan ke indeks tertentu selalu lewat sisi terpendek. */
export function shortestTarget(cursor, index, count, wraps) {
  if (!count) return 0;
  if (!wraps) return clampCursor(index, count, false);
  const base = Math.round(cursor), current = ((base % count) + count) % count;
  let diff = index - current;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return base + diff;
}

/** Peredaman eksponensial yang identik pada 30, 60, atau 120 Hz. */
export function stepTowards(cursor, target, dt) {
  const k = 1 - Math.exp(-Math.max(0, Math.min(0.1, dt)) * 9);
  const next = cursor + (target - cursor) * k;
  return Math.abs(target - next) < 0.0015 ? target : next;
}

/** Batas karet saat drag melewati ujung pada ring yang tidak berputar penuh. */
export function rubberBand(cursor, count, wraps) {
  if (wraps || !count) return cursor;
  if (cursor < 0) return cursor * 0.35;
  if (cursor > count - 1) return count - 1 + (cursor - (count - 1)) * 0.35;
  return cursor;
}
