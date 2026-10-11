import test from 'node:test';
import assert from 'node:assert/strict';
import { ROOM_POSES, roomRoute } from '../src/scenes/roomRoute.mjs';
import { advanceJourneyTurn, createJourneyTurn, journeySignal } from '../src/scenes/choreography.mjs';
import { nearestShelfIndex, shelfDragIntent, shelfTargets } from '../src/interaction/shelf.mjs';

const anchors = Object.keys(ROOM_POSES).map((id, index) => ({ id, top: index * 800 + index ** 2 * 20 }));

test('room camera and floor travel remain continuous at every section boundary in both scroll directions', () => {
  for (let i = 1; i < anchors.length; i++) {
    const y = anchors[i].top;
    const before = roomRoute(anchors, y - .01), at = roomRoute(anchors, y), after = roomRoute(anchors, y + .01);
    assert.deepEqual(at.pose, ROOM_POSES[anchors[i].id]);
    assert.equal(at.travel, i);
    for (let axis = 0; axis < 4; axis++) assert.ok(Math.abs(before.pose[axis] - after.pose[axis]) < 1e-10);
    assert.ok(Math.abs(before.travel - after.travel) < 1e-10);
    assert.deepEqual(roomRoute(anchors, y - .01), before);
  }
  assert.deepEqual(roomRoute(anchors, -2000).pose, ROOM_POSES.home);
  assert.deepEqual(roomRoute(anchors, 20000).pose, ROOM_POSES.contact);
  assert.deepEqual(roomRoute([], 100).pose, ROOM_POSES.home);
});

test('room route uses actual section spacing and cannot overshoot its architectural camera limits', () => {
  let previous = -1;
  for (let y = -100; y < 14000; y += 29) {
    const value = roomRoute(anchors, y);
    assert.ok(value.travel >= previous); previous = value.travel;
    for (let axis = 0; axis < 4; axis++) {
      const values = Object.values(ROOM_POSES).map(pose => pose[axis]);
      assert.ok(value.pose[axis] >= Math.min(...values) && value.pose[axis] <= Math.max(...values));
    }
    const resized = anchors.map(anchor => ({ ...anchor, top: anchor.top * 1.7 - 300 }));
    const adapted = roomRoute(resized, y * 1.7 - 300);
    value.pose.forEach((v, axis) => assert.ok(Math.abs(v - adapted.pose[axis]) < 1e-12));
    assert.ok(Math.abs(value.travel - adapted.travel) < 1e-12);
  }
});

test('repeated Journey reversals preserve the instantaneous angle and angular velocity and then settle', () => {
  for (const rate of [30,60,120]) {
    const turn = createJourneyTurn(0);
    for (const target of [5,1,4,0,3,2,5,0]) {
      const angle = turn.angle, velocity = turn.velocity;
      advanceJourneyTurn(turn, target, 0, true);
      assert.equal(turn.angle, angle); assert.equal(turn.velocity, velocity);
      for (let frame = 0; frame < Math.round(rate * .19); frame++) {
        advanceJourneyTurn(turn, target, 1 / rate, true);
        assert.ok(Number.isFinite(turn.angle) && Math.abs(turn.angle) < 1.6);
      }
    }
    for (let frame = 0; frame < rate * 2; frame++) advanceJourneyTurn(turn, 0, 1 / rate, true);
    assert.equal(turn.screen, 0); assert.ok(Math.abs(turn.angle) < 1e-7 && Math.abs(turn.velocity) < 1e-6);
  }
});

test('Journey switches screens halfway through its turn; paused changes settle without a pulse', () => {
  const turn = createJourneyTurn(0);
  advanceJourneyTurn(turn, 5, .08, true); assert.equal(turn.screen, 0);
  for (let i = 0; i < 4; i++) advanceJourneyTurn(turn, 5, .08, true);
  assert.equal(turn.screen, 5);
  advanceJourneyTurn(turn, 2, 0, false);
  assert.equal(turn.target, 2); assert.equal(turn.screen, 2); assert.equal(turn.angle, 0); assert.equal(turn.velocity, 0);
  for (let node = 0; node < 6; node++) {
    const peak = .12 + node * .075 + .21;
    assert.ok(Math.abs(journeySignal(peak, node, true) - 1) < 1e-12);
    assert.equal(journeySignal(peak, node, false), 0);
    assert.equal(journeySignal(0, node, true), 0); assert.equal(journeySignal(2, node, true), 0);
  }
  advanceJourneyTurn(turn, 100, 0, false); assert.equal(turn.screen, 5);
  advanceJourneyTurn(turn, -10, 0, false); assert.equal(turn.screen, 0);
});

test('the last mobile work and centered desktop works have reachable native snap targets', () => {
  const mobile = shelfTargets([{left:0,width:280},{left:298,width:280},{left:596,width:280}],324,894,false);
  assert.deepEqual(mobile,[0,298,570]);
  assert.equal(nearestShelfIndex(mobile,570),2);
  assert.equal(nearestShelfIndex(mobile,450),2);
  assert.equal(nearestShelfIndex(mobile,285),1);
  const desktop = shelfTargets([{left:236,width:328},{left:590,width:328},{left:944,width:328}],800,1508,true);
  assert.deepEqual(desktop,[0,354,708]);
  assert.equal(nearestShelfIndex(desktop,708),2);
  assert.deepEqual(shelfTargets([{left:0,width:280}],324,324,false),[0]);
  assert.equal(nearestShelfIndex([],100),0);
});

test('work dragging requires horizontal intent and leaves small clicks and vertical gestures alone', () => {
  for (const [x,y] of [[0,0],[8,0],[4,4],[24,40],[-11,-35]]) assert.equal(shelfDragIntent(x,y),false);
  for (const [x,y] of [[24,3],[-28,4],[30,0]]) assert.equal(shelfDragIntent(x,y),true);
});
