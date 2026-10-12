/** Helper WebGL kecil: tanpa library, aman jika WebGL tidak tersedia. */
export type GL = WebGLRenderingContext;

export function createGL(canvas: HTMLCanvasElement): GL | null {
  try {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power', preserveDrawingBuffer: false }) as GL | null;
    return gl && !gl.isContextLost() ? gl : null;
  } catch { return null; }
}

function compile(gl: GL, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { console.warn('[space] shader gagal:', gl.getShaderInfoLog(shader)); gl.deleteShader(shader); return null; }
  return shader;
}

export const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';

/** Program layar-penuh (dua segitiga) dengan helper uniform. */
export function fullscreen(gl: GL, fragment: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX), fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('[space] link gagal:', gl.getProgramInfoLog(program)); return null; }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // satu segitiga besar
  gl.useProgram(program);
  const location = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  const uniforms = new Map<string, WebGLUniformLocation | null>();
  const u = (name: string) => { if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(program, name)); return uniforms.get(name) ?? null; };
  return {
    use: () => gl.useProgram(program),
    f1: (name: string, a: number) => gl.uniform1f(u(name), a),
    f2: (name: string, a: number, b: number) => gl.uniform2f(u(name), a, b),
    draw: () => gl.drawArrays(gl.TRIANGLES, 0, 3),
    dispose: () => { gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); }
  };
}

/** Ukuran buffer mengikuti ukuran CSS dikali skala, dengan batas aman. */
export function fit(canvas: HTMLCanvasElement, scale: number, maxSide = 2048) {
  const w = Math.max(2, Math.min(maxSide, Math.round(canvas.clientWidth * scale)));
  const h = Math.max(2, Math.min(maxSide, Math.round(canvas.clientHeight * scale)));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  return { w, h };
}

export const PRECISION = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
