import { MathUtils } from 'three';

export const JOURNEY_STAGE = { width: 6.8, height: 6.3, fov: 36 };
export const JOURNEY_SHAPES = { phone: [1.8,3.57,.3], base: [3.08,.12,1.89], lid: [3.07,1.88,.14], module: [.46,.46,.52], platform: [2.35,.1,-2.06] };
export const WORK_STAGE = { width: 6.5, height: 4.7, screen: [5.1,3.1], bounds: [5.24,3.74,.28] };
export const HERO_STAGE = { width: 7.6, expandedWidth: 10.2, height: 7.4, platform: [2.5,.1,-2.18], frames: [[2.8,3.95],[2.8,3.4],[2.55,3.25],[2.65,2.65]] };
export const ANIME_STAGE = { width: 3.35, height: 4.95, screen: [2.75,4.08] };

const arrival = value => 1 - (1 - MathUtils.clamp(value,0,1)) ** 4;

/** The same physical frames assemble, fan out and react to scroll in the hero. */
export function heroFramePose(index, open, entrance, time, motion, velocity) {
  const local = arrival((entrance-index*.055)/.8);
  const origin = [[.04,-.01,1.1],[-.94,.16,-.12],[.81,.32,-1.24],[1.72,.19,-2.08]][index];
  return {
    position: [origin[0]+(index===0?-.18:index===1?-1.1:index===2?.8:1.1)*open+(1-local)*(index%2?-.6:.6),origin[1]+(1-local)*.42+(motion?Math.sin(time*.6+index*.6)*.025:0),origin[2]-.45*open*index-(1-local)*1.7],
    rotation: [0,(index===0?-.07:-.15+index*.1)+open*(index===1?-.21:.12)+(1-local)*.3,(index===0?-.025:index===1?.035:-.025)+velocity*.008*(index+1)]
  };
}

export function heroGroupPose(entrance, scroll, pointerX, pointerY, motion) {
  return { rotation: [(motion?pointerY*.09:0)+scroll*.1,-.23+(motion?pointerX*.24:0)+scroll*.38,-.02], y: (1-arrival(entrance))*.55-scroll*.15 };
}

export function journeyCamera(progress, pointer, motion) {
  return { x: motion ? (progress-.5)*.3+pointer*.16 : 0, y: .34+progress*.12 };
}

const chapters = [
  { phone: [0,.18,.4,1], laptop: [1.65,-.8,-1.8,.48], hinge: 1.42, modules: [1.35,-1.28,-.9,.23] },
  { phone: [-1.9,-.38,-.4,.5], laptop: [.43,.1,.3,.94], hinge: .14, modules: [1.55,-1.3,-.4,.25] },
  { phone: [-1.85,-.08,.34,.58], laptop: [.38,.12,0,.87], hinge: .25, modules: [1.8,.48,.05,.53] },
  { phone: [-2,.14,-.65,.4], laptop: [-.7,-.12,-.5,.67], hinge: .2, modules: [1.03,.26,.48,.94] },
  { phone: [-1.83,-.28,-.8,.41], laptop: [-.07,.32,.35,.95], hinge: .12, modules: [1.92,-.74,-.05,.46] },
  { phone: [-2,.12,-1.1,.39], laptop: [-1.06,-.36,-.8,.63], hinge: .28, modules: [.94,.35,.58,1] }
];

/** The phone remains the origin; six chapters rearrange a tangible workspace. */
export function journeyLayout(phase) {
  const index = MathUtils.clamp(Math.round(Number(phase) || 0), 0, chapters.length - 1);
  const pose = chapters[index];
  const cubes = Array.from({length: 6}, (_, i) => {
    if(index === 3) return [Math.cos(i / 6 * Math.PI * 2) * .87, Math.sin(i / 6 * Math.PI * 2) * .72, i % 2 ? .25 : -.25];
    if(index === 5) return [(i % 3 - 1) * .58, Math.floor(i / 3) * .6 + (i % 3) * .22 - .6, Math.floor(i / 3) * -.55];
    return [(i % 3 - 1) * .58, Math.floor(i / 3) * .6 - .3, index === 2 ? (i % 2 ? .22 : -.22) : 0];
  });
  return { ...pose, cubes };
}

export function createJourneyTurn(phase) {
  const current = MathUtils.clamp(Math.round(Number(phase) || 0), 0, 5);
  return { target: current, screen: current, elapsed: 2, direction: 1, angle: 0, velocity: 0 };
}

/** A critically damped turn retains angular velocity when a visitor changes direction mid-flight. */
export function advanceJourneyTurn(state, phase, seconds, motion) {
  const next = MathUtils.clamp(Math.round(Number(phase) || 0), 0, 5);
  if (next !== state.target) {
    state.direction = next > state.target ? 1 : -1;
    state.target = next;
    state.elapsed = 0;
  }
  if (!motion) {
    state.screen = next; state.elapsed = 2; state.angle = 0; state.velocity = 0;
    return state;
  }
  const dt = MathUtils.clamp(seconds, 0, .08);
  state.elapsed += dt;
  const progress = Math.min(1, state.elapsed / .68);
  const target = Math.sin(progress * Math.PI) * state.direction * 1.6;
  const offset = state.angle - target, spring = 14, decay = Math.exp(-spring * dt);
  const carry = state.velocity + spring * offset;
  state.angle = target + (offset + carry * dt) * decay;
  state.velocity = (state.velocity - spring * carry * dt) * decay;
  if (progress >= .5) state.screen = state.target;
  return state;
}

/** A single chapter change sends a staggered signal through the six physical modules. */
export function journeySignal(elapsed, node, motion) {
  if (!motion) return 0;
  const progress = MathUtils.clamp((elapsed - .12 - node * .075) / .42, 0, 1);
  return progress === 0 || progress === 1 ? 0 : Math.sin(progress * Math.PI) ** 2;
}

/** Positions on the native shelf drive depth and yaw; scroll never gets hijacked. */
export function workFramePose(center, horizontalVelocity, focused, motion) {
  const distance = Math.min(1.5, Math.abs(center));
  return {
    yaw: focused ? 0 : MathUtils.clamp(-center * .96 + (motion ? horizontalVelocity * .045 : 0), -.58, .58),
    depth: focused ? .48 : -.26 - distance * .22,
    scale: focused ? 1.035 : .95 - distance * .025
  };
}
