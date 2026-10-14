import { createGL, fullscreen, fit, PRECISION } from './gl';

export interface PlanetState { time: number; rx: number; ry: number; light: number }

/** Planet prosedural: kontinen fbm, awan, es kutub, lampu kota malam, atmosfer, dan cincin berbayangan. Bulan dirender terpisah sebagai gambar HD yang mengorbit di DOM (3D CSS). */
const FRAGMENT = PRECISION + `
uniform vec2 uRes;uniform float uTime;uniform vec2 uRot;uniform float uLight;
float hash31(vec3 p){p=fract(p*0.3183099+vec3(0.1,0.2,0.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<6;i++){s+=a*noise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return s;}
vec3 rotY(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
vec3 rotZ(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
vec4 over(vec4 top,vec4 bottom){return top+bottom*(1.0-top.a);}
const float R=0.52;
const vec3 L=vec3(-0.55,0.45,0.70);

vec4 surface(vec3 n){
  vec3 Ln=normalize(L);
  vec3 p=rotY(rotZ(n,-0.42+uRot.y*0.35),uTime*0.07+uRot.x*0.7);
  float h=fbm(p*2.1+vec3(0.0,0.0,3.0));
  float lat=abs(p.y);
  vec3 deep=vec3(0.015,0.04,0.20),shallow=vec3(0.06,0.34,0.72);
  vec3 land1=vec3(0.40,0.26,0.78),land2=vec3(0.95,0.62,0.38),ice=vec3(0.92,0.96,1.0);
  float sea=smoothstep(0.47,0.53,h);
  vec3 c=mix(mix(deep,shallow,smoothstep(0.18,0.50,h)),mix(land1,land2,smoothstep(0.55,0.82,h)),sea);
  c=mix(c,ice,smoothstep(0.80,0.93,lat+(h-0.5)*0.22));
  float cl=smoothstep(0.52,0.80,fbm(p*3.6+vec3(uTime*0.025,0.0,0.0)));
  c=mix(c,vec3(1.0),cl*0.72);
  float ndl=dot(n,Ln);
  float day=smoothstep(-0.12,0.55,ndl);
  vec3 lit=c*(0.05+1.18*day);
  float city=step(0.78,noise(p*46.0))*sea*(1.0-cl)*(1.0-smoothstep(-0.25,0.08,ndl));
  lit+=vec3(1.0,0.78,0.42)*city*0.9;
  float fr=pow(1.0-clamp(n.z,0.0,1.0),2.6);
  lit+=vec3(0.30,0.58,1.0)*fr*(0.25+0.95*day);
  lit+=vec3(1.0,0.72,0.5)*pow(1.0-clamp(n.z,0.0,1.0),5.0)*smoothstep(-0.1,0.2,ndl)*(1.0-smoothstep(0.2,0.5,ndl))*0.5;
  return vec4(lit,1.0);
}
void main(){
  vec2 uv=(gl_FragCoord.xy*2.0-uRes)/min(uRes.x,uRes.y);
  vec3 Ln=normalize(L);
  float r2=dot(uv,uv),r=sqrt(r2);
  bool inSph=r2<R*R;
  float zs=inSph?sqrt(R*R-r2):0.0;
  vec4 acc=vec4(0.0);

  // halo atmosfer
  float halo=exp(-max(r-R,0.0)*7.5)*(1.0-uLight*0.55);
  vec3 haloCol=mix(vec3(0.28,0.45,1.0),vec3(0.70,0.45,1.0),smoothstep(-0.8,0.8,uv.x));
  float haloA=halo*0.55*(inSph?0.0:1.0)*(0.45+0.55*clamp(dot(normalize(vec3(uv,0.2)),Ln)*0.5+0.5,0.0,1.0));
  acc=over(vec4(haloCol*haloA,haloA),acc);

  // cincin: bidang miring + roll
  float tilt=1.12,roll=-0.30;
  float cr=cos(roll),sr=sin(roll);
  vec2 ruv=vec2(cr*uv.x-sr*uv.y,sr*uv.x+cr*uv.y);
  float zr=ruv.y*tan(tilt);
  float rho=length(vec2(ruv.x,ruv.y/cos(tilt)));
  float ringMask=smoothstep(0.66,0.69,rho)*(1.0-smoothstep(0.93,0.98,rho))*(1.0-0.8*exp(-pow((rho-0.81)/0.012,2.0)));
  float bands=0.35+0.65*noise(vec3(rho*70.0,0.0,1.0));
  bands*=0.55+0.45*noise(vec3(rho*16.0,2.0,0.0));
  vec3 P=vec3(uv,zr);
  float bsh=dot(P,Ln);float cs=dot(P,P)-R*R;float disc=bsh*bsh-cs;
  float shadow=bsh<0.0?1.0-0.62*smoothstep(0.0,0.32,disc):1.0;
  vec3 ringCol=mix(vec3(0.72,0.66,0.98),vec3(1.0,0.86,0.66),smoothstep(0.66,0.98,rho))*shadow*(0.55+0.7*dot(vec3(0.0,0.0,1.0),Ln));
  float ringA=ringMask*bands*0.92;
  bool ringFront=zr>=0.0;
  bool ringHidden=inSph&&!ringFront;

  // belakang
  if(!ringFront&&ringA>0.0&&!ringHidden)acc=over(vec4(ringCol*ringA,ringA),acc);
  // planet
  if(inSph){
    vec3 n=vec3(uv,zs)/R;
    vec4 s=surface(n);
    float edge=smoothstep(R,R-0.006,r);
    acc=over(vec4(s.rgb*edge,edge),acc);
  }
  // depan
  if(ringFront&&ringA>0.0)acc=over(vec4(ringCol*ringA,ringA),acc);
  gl_FragColor=acc;
}`;

export function mountPlanet(canvas: HTMLCanvasElement, state: () => PlanetState, maxDpr: () => number = () => 2) {
  const gl = createGL(canvas); if (!gl) return null;
  const program = fullscreen(gl, FRAGMENT); if (!program) return null;
  let lost = false;
  const onLost = (e: Event) => { e.preventDefault(); lost = true; };
  canvas.addEventListener('webglcontextlost', onLost);
  return {
    render() {
      if (lost) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr());
      const { w, h } = fit(canvas, dpr, 1800); const s = state();
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); program.use();
      program.f2('uRes', w, h); program.f1('uTime', s.time); program.f2('uRot', s.rx, s.ry); program.f1('uLight', s.light);
      program.draw();
    },
    destroy() { canvas.removeEventListener('webglcontextlost', onLost); program.dispose(); }
  };
}
