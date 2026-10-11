import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export function mountScene(container: HTMLElement, host: HTMLElement, mode: 'hero' | 'orbit', paused: () => boolean, onFailure: () => void) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) throw new Error('WebGL2 unavailable; use the static study.');
  const renderer = new T.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' });
  const mobile = host.clientWidth < 600;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.3 : 1.6));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(37, 1, 0.1, 50);
  camera.position.set(mode === 'hero' ? 0.25 : 0, 0.15, mode === 'hero' ? 8 : 9.2);
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.06);
  scene.environment = env.texture; room.dispose(); pmrem.dispose();
  scene.add(new T.AmbientLight(0xf5eedf, 1.2));
  const key = new T.DirectionalLight(0xffedce, 5); key.position.set(3, 6, 4); scene.add(key);
  const fill = new T.DirectionalLight(0xa2b8bd, 2.5); fill.position.set(-4, 1, 3); scene.add(fill);
  const back = new T.PointLight(0xc19e69, 18); back.position.set(1, -2, -2); scene.add(back);
  const group = new T.Group(); scene.add(group);
  const brass = new T.MeshStandardMaterial({ color: 0xc3a274, metalness: 0.9, roughness: 0.27 });
  const graphite = new T.MeshStandardMaterial({ color: 0x30343a, metalness: 0.85, roughness: 0.3 });
  const silver = new T.MeshStandardMaterial({ color: 0xc4c9c6, metalness: 0.85, roughness: 0.22 });
  const lineMat = new T.LineBasicMaterial({ color: 0xc5a275, transparent: true, opacity: 0.25 });
  if (mode === 'hero') {
    for (let i = 0; i < 3; i++) {
      const frame = new T.Group();
      const m = i === 1 ? silver : graphite;
      const h = new RoundedBoxGeometry(4.9, 0.038, 0.09, 2, 0.025);
      const v = new RoundedBoxGeometry(0.038, 3.55, 0.09, 2, 0.025);
      for (const y of [-1.775, 1.775]) { const x = new T.Mesh(h, m); x.position.y = y; frame.add(x); }
      for (const x of [-2.45, 2.45]) { const y = new T.Mesh(v, m); y.position.x = x; frame.add(y); }
      frame.position.z = -0.9 - i * 0.38; group.add(frame);
    }
    group.rotation.set(-0.2, -0.44, -0.13);
    const ticks: T.Vector3[] = [];
    for (let i = 0; i < 80; i++) { const a = i / 80 * Math.PI * 2; const r = i % 10 === 0 ? 2.4 : 2.32; ticks.push(new T.Vector3(Math.cos(a) * 2.26, Math.sin(a) * 2.26, -1.8), new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, -1.8)); }
    scene.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(ticks), lineMat));
  } else {
    const core = new T.Mesh(new T.CylinderGeometry(0.87, 0.87, 0.23, 6), brass); core.rotation.x = Math.PI / 2; core.rotation.z = 0.1; group.add(core);
    const face = new T.Mesh(new T.CylinderGeometry(0.77, 0.77, 0.25, 6), graphite); face.rotation.x = Math.PI / 2; group.add(face);
    const portrait = new T.TextureLoader().load('/images/pp-dev.webp'); portrait.colorSpace = T.SRGBColorSpace;
    const identity = new T.Mesh(new T.CircleGeometry(.65, 64), new T.MeshBasicMaterial({ map: portrait, toneMapped: false })); identity.position.z = .14; group.add(identity);
  }
  const nodes: { mesh: T.Mesh; plane: T.Group; angle: number; element: HTMLElement | null }[] = [];
  if (mode === 'orbit') {
    for (let i = 0; i < 4; i++) {
      const plane = new T.Group(); plane.rotation.set([0.8, -0.9, 0.65, -0.6][i], [0.32, -0.2, 0.9, -0.85][i], i * Math.PI / 4); scene.add(plane);
      const points = Array.from({ length: 181 }, (_, n) => { const a = n / 180 * Math.PI * 2; return new T.Vector3(Math.cos(a) * 2.8, Math.sin(a) * 2.12, 0); });
      plane.add(new T.Line(new T.BufferGeometry().setFromPoints(points), lineMat.clone()));
      const node = new T.Mesh(new T.SphereGeometry(0.11, 12, 12), brass); plane.add(node);
      nodes.push({ mesh: node, plane, angle: i * Math.PI / 2 + 0.6, element: host.querySelector(`[data-orbit-node="${i}"]`) });
    }
  }
  let width = 0, height = 0, frame = 0, visible = true, clock = 0, last = 0, hover = false, dirty = true, scrollProgress = 0;
  const pointer = { x: 0, y: 0 };
  const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; const rect = host.getBoundingClientRect(); pointer.x = (e.clientX - rect.left) / rect.width - 0.5; pointer.y = (e.clientY - rect.top) / rect.height - 0.5; };
  const leave = () => { pointer.x = 0; pointer.y = 0; hover = false; };
  const over = (e: PointerEvent) => { hover = Boolean((e.target as HTMLElement).closest('.orbit-node')); };
  const out = (e: PointerEvent) => { hover = e.relatedTarget instanceof Element && Boolean(e.relatedTarget.closest('.orbit-node')); };
  const scroll = () => { scrollProgress = Math.max(0, Math.min(1, -host.getBoundingClientRect().top / Math.max(host.clientHeight, 1))); };
  host.addEventListener('pointermove', move); host.addEventListener('pointerover', over); host.addEventListener('pointerleave', leave); host.addEventListener('pointerout', out);
  if (mode === 'hero') window.addEventListener('scroll', scroll, { passive: true });
  const resize = () => { width = container.clientWidth; height = container.clientHeight; renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); dirty = true; scroll(); };
  const ro = new ResizeObserver(resize); ro.observe(container); resize();
  const v = new T.Vector3();
  function loop(now: number) {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    const frozen = paused() || hover || Boolean(host.querySelector('.orbit-node:focus'));
    if (frozen && !dirty) { frame = requestAnimationFrame(loop); return; }
    dirty = false;
    if (!frozen) clock += dt;
    if (mode === 'hero') {
      group.rotation.y = -0.44 + Math.sin(clock * 0.2) * 0.12 + pointer.x * 0.16 + scrollProgress * 0.18;
      group.rotation.x = -0.2 + pointer.y * 0.07;
      group.position.y = Math.sin(clock * 0.5) * 0.065;
    } else {
      nodes.forEach((n, i) => {
        const angle = n.angle + clock * (0.095 + i * 0.013);
        n.mesh.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 2.12, 0);
        n.mesh.getWorldPosition(v); const depth = v.z; v.project(camera);
        if (n.element) { n.element.style.left = `${(v.x + 1) / 2 * width}px`; n.element.style.top = `${(-v.y + 1) / 2 * height}px`; n.element.style.transform = `translate(-50%,-50%) scale(${0.92 + depth * 0.04})`; n.element.style.zIndex = String(5 + Math.round(depth)); }
      });
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(loop);
  }
  const start = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(loop); } };
  const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) { cancelAnimationFrame(frame); frame = 0; } else start(); }); io.observe(host);
  const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start(); };
  document.addEventListener('visibilitychange', visibility);
  const lost = (e: Event) => { e.preventDefault(); visible = false; cancelAnimationFrame(frame); onFailure(); };
  renderer.domElement.addEventListener('webglcontextlost', lost);
  start();
  return () => {
    cancelAnimationFrame(frame); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', visibility);
    host.removeEventListener('pointermove', move); host.removeEventListener('pointerover', over); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerout', out); window.removeEventListener('scroll', scroll);
    renderer.domElement.removeEventListener('webglcontextlost', lost);
    nodes.forEach(n => n.element?.removeAttribute('style'));
    scene.traverse(object => { if (object instanceof T.Mesh || object instanceof T.Line) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(m => { if (m instanceof T.MeshBasicMaterial) m.map?.dispose(); m.dispose(); }); } });
    brass.dispose(); graphite.dispose(); silver.dispose(); lineMat.dispose(); env.dispose(); renderer.dispose(); renderer.domElement.remove();
  };
}
