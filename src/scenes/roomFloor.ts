import { ShaderMaterial } from 'three';

/** Architectural seams carry a travelling signal, rather than a stock particle background. */
export function makeRoomFloor() {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uTravel: { value: 0 }, uMotion: { value: 0 }, uSpeed: { value: 0 } },
    vertexShader: `
      varying vec2 vFloor;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vFloor = world.xz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec2 vFloor;
      uniform float uTime;
      uniform float uTravel;
      uniform float uMotion;
      uniform float uSpeed;
      void main() {
        float seam = abs(fract((vFloor.x - 1.5) / .65) - .5) * .65;
        float line = 1.0 - smoothstep(.006, .025, seam);
        float lane = smoothstep(1.2, 1.7, vFloor.x) * (1.0 - smoothstep(6.5, 7.2, vFloor.x));
        float wave = fract(vFloor.y * .046 + uTravel * .72 - uTime * (.052 + uSpeed * .018));
        float head = pow(max(0.0, 1.0 - abs(wave - .5) * 2.0), 24.0);
        float glow = exp(-seam * 22.0) * head * lane * uMotion;
        float fade = 1.0 - smoothstep(10.0, 27.0, abs(vFloor.y + 3.0));
        vec3 base = mix(vec3(.976,.984,1.0), vec3(.9,.941,.996), line * lane * fade * .16);
        base = mix(base, vec3(.26,.51,1.0), glow * fade * (.28 + line * .38));
        gl_FragColor = vec4(base, 1.0);
      }
    `
  });
}
