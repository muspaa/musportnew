import { createGL, fullscreen, fit, PRECISION } from './gl';

export interface NebulaState { time: number; scroll: number; mx: number; my: number; light: number }

const FRAGMENT = PRECISION + `
uniform vec2 uRes;uniform float uTime;uniform float uScroll;uniform vec2 uMouse;uniform float uLight;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
float fbm(vec2 p){float a=0.5,s=0.0;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.02+vec2(3.1,1.7);a*=0.5;}return s;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;vec2 asp=vec2(uRes.x/uRes.y,1.0);
  vec2 p=uv*asp*1.55+uMouse*0.06+vec2(0.0,uScroll*0.00018);
  float t=uTime*0.018;
  vec2 q=vec2(fbm(p+vec2(0.0,t)),fbm(p+vec2(5.2,1.3)-t));
  float f=fbm(p+2.2*q+vec2(t*0.6,0.0));
  float mask=smoothstep(0.30,0.85,fbm(p*0.55+vec2(9.0,2.0)+q*0.8));
  vec3 base=mix(vec3(0.016,0.020,0.055),vec3(0.93,0.94,0.99),uLight);
  vec3 violet=mix(vec3(0.30,0.15,0.66),vec3(0.70,0.62,0.98),uLight);
  vec3 blue=mix(vec3(0.07,0.26,0.74),vec3(0.55,0.72,1.00),uLight);
  vec3 teal=mix(vec3(0.03,0.55,0.66),vec3(0.55,0.88,0.94),uLight);
  vec3 rose=mix(vec3(0.62,0.14,0.52),vec3(0.98,0.70,0.88),uLight);
  vec3 neb=mix(blue,violet,smoothstep(0.25,0.75,f));
  neb=mix(neb,teal,smoothstep(0.55,0.95,q.x)*0.65);
  neb=mix(neb,rose,smoothstep(0.62,1.0,q.y)*0.5);
  float density=pow(f,1.6)*mask*mix(0.95,0.55,uLight);
  vec3 col=mix(base,neb,clamp(density*1.35,0.0,0.82));
  col+=neb*pow(f,3.0)*mask*mix(0.35,0.0,uLight);
  float vig=smoothstep(1.25,0.25,length((uv-0.5)*vec2(1.1,1.0)));
  col=mix(base,col,mix(0.25,1.0,vig));
  col+=(hash(gl_FragCoord.xy+uTime)-0.5)/200.0;
  gl_FragColor=vec4(col,1.0);
}`;

export function mountNebula(canvas: HTMLCanvasElement, state: () => NebulaState, scale = 0.45) {
  const gl = createGL(canvas); if (!gl) return null;
  const program = fullscreen(gl, FRAGMENT); if (!program) return null;
  let lost = false;
  const onLost = (e: Event) => { e.preventDefault(); lost = true; };
  canvas.addEventListener('webglcontextlost', onLost);
  return {
    render() {
      if (lost) return;
      const { w, h } = fit(canvas, scale, 1400); const s = state();
      gl.viewport(0, 0, w, h); program.use();
      program.f2('uRes', w, h); program.f1('uTime', s.time); program.f1('uScroll', s.scroll); program.f2('uMouse', s.mx, s.my); program.f1('uLight', s.light);
      program.draw();
    },
    destroy() { canvas.removeEventListener('webglcontextlost', onLost); program.dispose(); }
  };
}
