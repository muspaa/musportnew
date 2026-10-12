import test from 'node:test';
import assert from 'node:assert/strict';
import { ringLayout, clampCursor, activeIndex, snapTarget, shortestTarget, stepTowards, rubberBand, RING_MIN_SLOTS } from '../src/interaction/ring.mjs';

test('ring radius keeps neighbouring cards from overlapping and a short list becomes a fan', () => {
  for (const count of [1, 2, 5, 6, 8, 12]) {
    const { slots, step, radius, wraps } = ringLayout(count, 280, 28);
    assert.equal(slots, Math.max(count, RING_MIN_SLOTS));
    assert.ok(Math.abs(step * slots - 360) < 1e-9);
    // radius = apotema poligon: lebar sisi antar kartu bertetangga = 2 r tan(pi/slots) >= lebar kartu + celah
    assert.ok(2 * radius * Math.tan(Math.PI / slots) >= 280 + 28 - 2);
    assert.equal(wraps, count >= RING_MIN_SLOTS);
  }
});

test('cursor index wraps cleanly in both directions and clamps on a fan', () => {
  assert.equal(activeIndex(0, 8), 0); assert.equal(activeIndex(-1, 8), 7); assert.equal(activeIndex(8, 8), 0); assert.equal(activeIndex(9.4, 8), 1); assert.equal(activeIndex(3, 0), 0);
  assert.equal(clampCursor(9, 3, false), 2); assert.equal(clampCursor(-4, 3, false), 0); assert.equal(clampCursor(99, 8, true), 99);
});

test('goTo picks the shortest way around a full ring', () => {
  assert.equal(shortestTarget(0, 7, 8, true), -1);
  assert.equal(shortestTarget(0, 1, 8, true), 1);
  assert.equal(shortestTarget(7, 0, 8, true), 8);
  assert.equal(shortestTarget(2, 6, 8, true), 6);
  assert.equal(shortestTarget(0, 5, 3, false), 2);
});

test('drag release snaps to a whole card with bounded inertia', () => {
  assert.equal(snapTarget(1.4, 0, 8, true), 1); assert.equal(snapTarget(1.4, 6, 8, true), 2); assert.equal(snapTarget(1.4, -99, 8, true), -1);
  assert.equal(snapTarget(2.4, 5, 3, false), 2); assert.equal(snapTarget(0.1, -5, 3, false), 0);
});

test('easing is frame-rate independent and settles exactly on the target', () => {
  const end = [30, 60, 120].map(rate => { let c = 0; for (let i = 0; i < rate; i++) c = stepTowards(c, 3, 1 / rate); return c; });
  for (const c of end) assert.ok(Math.abs(c - end[0]) < 1e-6);
  let c = 0; for (let i = 0; i < 600; i++) c = stepTowards(c, 3, 1 / 60); assert.equal(c, 3);
  assert.equal(stepTowards(2, 2, 1 / 60), 2);
});

test('rubber band only resists beyond the ends of a fan', () => {
  assert.equal(rubberBand(1.5, 3, false), 1.5); assert.ok(rubberBand(-1, 3, false) > -1 && rubberBand(-1, 3, false) < 0); assert.ok(rubberBand(4, 3, false) < 4 && rubberBand(4, 3, false) > 2); assert.equal(rubberBand(-5, 8, true), -5);
});
