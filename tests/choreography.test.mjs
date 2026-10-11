import test from 'node:test';
import assert from 'node:assert/strict';
import { BoxGeometry, CylinderGeometry, TorusGeometry, Group, Mesh, PerspectiveCamera, Vector3, MathUtils } from 'three';
import { ANIME_STAGE, HERO_STAGE, JOURNEY_STAGE, JOURNEY_SHAPES, WORK_STAGE, heroFramePose, heroGroupPose, journeyCamera, journeyLayout, workFramePose } from '../src/scenes/choreography.mjs';
import { fitDistance } from '../src/scenes/spatialMath.mjs';

const viewports = [[284,320],[324,320],[354,320],[520,375],[570,430]];

function subject() {
  const scene=new Group();const phone=new Group();scene.add(phone);
  const bounds=(parent,size,position=[0,0,0])=>{const mesh=new Mesh(new BoxGeometry(...size));mesh.position.set(...position);parent.add(mesh);return mesh;};
  bounds(phone,JOURNEY_SHAPES.phone);
  const laptop=new Group();scene.add(laptop);bounds(laptop,JOURNEY_SHAPES.base,[0,-.91,.3]);const hinge=new Group();hinge.position.set(0,-.85,-.58);laptop.add(hinge);bounds(hinge,JOURNEY_SHAPES.lid,[0,.95,0]);
  const modules=new Group();scene.add(modules);const cubes=Array.from({length:6},()=>bounds(modules,JOURNEY_SHAPES.module));
  const platform=new Mesh(new CylinderGeometry(JOURNEY_SHAPES.platform[0],JOURNEY_SHAPES.platform[0],JOURNEY_SHAPES.platform[1],48));platform.position.y=JOURNEY_SHAPES.platform[2];scene.add(platform);
  for(const extra of [.15,.45]){const ring=new Mesh(new TorusGeometry(JOURNEY_SHAPES.platform[0]+extra,.011,6,64));ring.rotation.x=Math.PI/2;ring.position.y=JOURNEY_SHAPES.platform[2]+.05;scene.add(ring);}
  const pose=(a,b,t,progress,pointer,angle)=>{
    scene.rotation.y=.03+progress*.11;
    for(const [object,key] of [[phone,'phone'],[laptop,'laptop'],[modules,'modules']]){
      const p=a[key].map((v,i)=>MathUtils.lerp(v,b[key][i],t));object.position.set(...p.slice(0,3));object.scale.setScalar(p[3]);
    }
    phone.rotation.set(0,-.32+pointer*.3+angle,.055+(progress-.5)*.04);
    laptop.rotation.set(0,-.26+pointer*.18+(progress-.5)*.09,-.035);hinge.rotation.x=MathUtils.lerp(a.hinge,b.hinge,t);modules.rotation.y=-.12;
    cubes.forEach((cube,i)=>cube.position.set(...a.cubes[i].map((v,j)=>MathUtils.lerp(v,b.cubes[i][j],t))));
    scene.updateMatrixWorld(true);
  };
  const dispose=()=>scene.traverse(object=>{if(object.isMesh){object.geometry.dispose();object.material.dispose();}});
  return {scene,pose,dispose};
}

function inside(scene,camera,context) {
  const point=new Vector3();
  scene.traverse(object=>{
    if(!object.isMesh)return;
    const vertices=object.geometry.attributes.position;
    for(let i=0;i<vertices.count;i++){
      point.fromBufferAttribute(vertices,i).applyMatrix4(object.matrixWorld).project(camera);
      assert.ok(Math.abs(point.x)<=1&&Math.abs(point.y)<=1&&point.z>=-1&&point.z<=1,`${context}: ${point.toArray().join(', ')}`);
    }
  });
}

test('the physical Journey workspace fits narrow mobile and desktop stages through chapter transitions',()=>{
  const model=subject();
  try{
    const transitions=Array.from({length:6},(_,from)=>Array.from({length:6},(_,to)=>[from,to])).flat();
    for(const [width,height] of viewports){
      const camera=new PerspectiveCamera(JOURNEY_STAGE.fov,width/height,.1,80);
      for(const [from,to] of transitions)for(const t of [0,.5,1])for(const progress of [0,1])for(const pointer of [-.5,.5])for(const angle of [-1.6,0,1.6]){
        const eye=journeyCamera(progress,pointer,true);camera.position.set(eye.x,eye.y,fitDistance(JOURNEY_STAGE.width,JOURNEY_STAGE.height,camera.aspect,camera.fov));camera.lookAt(0,0,0);camera.updateMatrixWorld();
        model.pose(journeyLayout(from),journeyLayout(to),t,progress,pointer,angle);
        inside(model.scene,camera,`${width}×${height} chapter ${from}→${to} at ${t}`);
      }
    }
  }finally{model.dispose();}
});

test('focused and side work frames stay within their native viewports at pointer and swipe extremes',()=>{
  const mesh=new Mesh(new BoxGeometry(...WORK_STAGE.bounds));
  try{
    for(const aspect of [1.46,1.9,1.64]){
      const camera=new PerspectiveCamera(36,aspect,.1,80);camera.position.set(0,.2,fitDistance(WORK_STAGE.width,WORK_STAGE.height,aspect,36));camera.lookAt(0,0,0);camera.updateMatrixWorld();
      for(const center of [-1.5,-.5,0,.5,1.5])for(const focused of [false,true])for(const velocity of [-4,0,4])for(const pointer of [-.5,.5]){
        const pose=workFramePose(center,velocity,focused,true);mesh.position.z=pose.depth;mesh.scale.setScalar(pose.scale);mesh.rotation.set(pointer*.12+velocity*.012,pose.yaw+pointer*.24,0);mesh.updateMatrixWorld(true);inside(mesh,camera,`work ${aspect}, center ${center}, velocity ${velocity}, focus ${focused}`);
      }
    }
  }finally{mesh.geometry.dispose();mesh.material.dispose();}
});

test('swipe velocity cannot over-rotate the shelf and pause removes velocity from its pose',()=>{
  for(const center of [-100,-1,0,1,100])for(const velocity of [-10000,10000]){
    const pose=workFramePose(center,velocity,false,true);assert.ok(Math.abs(pose.yaw)<=.58);assert.ok(pose.scale>0&&pose.scale<=1);assert.ok(pose.depth<0);
    assert.deepEqual(workFramePose(center,velocity,false,false),workFramePose(center,0,false,false));
  }
});

test('Journey camera respects paused pointer motion and invalid chapter indices stay bounded',()=>{
  assert.deepEqual(journeyCamera(.5,-.5,false),journeyCamera(.5,.5,false));
  assert.deepEqual(journeyLayout(-10),journeyLayout(0));assert.deepEqual(journeyLayout(900),journeyLayout(5));
  for(let i=0;i<6;i++)assert.equal(journeyLayout(i).cubes.length,6);
});

test('hero portrait frames and physical base fit mobile and desktop while fanning out and reacting to scroll',()=>{
  const group=new Group();const frames=HERO_STAGE.frames.map(([w,h])=>new Mesh(new BoxGeometry(w+.14,h+.38,.28)));frames.forEach(frame=>group.add(frame));
  const [radius,depth,y]=HERO_STAGE.platform;
  const base=new Mesh(new CylinderGeometry(radius,radius,depth,64));base.position.y=y;group.add(base);
  for(const extra of [.15,.45]){const ring=new Mesh(new TorusGeometry(radius+extra,.011,6,96));ring.rotation.x=Math.PI/2;ring.position.y=y+.05;group.add(ring);}
  try{
    for(const [width,height] of [[284,345],[324,345],[354,385],[520,460],[590,530],[730,550],[630,610]]){
      const camera=new PerspectiveCamera(36,width/height,.1,80);
      for(const open of [0,.25,.5,.75,1])for(const scroll of [0,.5,1])for(const px of [-.5,.5])for(const py of [-.5,.5])for(const velocity of [-2,2]){
        frames.forEach((frame,i)=>{const pose=heroFramePose(i,open,1,3,true,velocity);frame.position.set(...pose.position);frame.rotation.set(...pose.rotation);});
        const pose=heroGroupPose(1,scroll,px,py,true);group.rotation.set(...pose.rotation);group.position.y=pose.y;group.updateMatrixWorld(true);
        camera.position.set(px*.08,.2,fitDistance(MathUtils.lerp(HERO_STAGE.width,HERO_STAGE.expandedWidth,open),HERO_STAGE.height,camera.aspect,36));camera.lookAt(0,.02,0);camera.updateMatrixWorld();
        inside(group,camera,`hero ${width}×${height}, open ${open}, scroll ${scroll}, pointer ${px}/${py}`);
      }
    }
  }finally{group.traverse(object=>{if(object.isMesh){object.geometry.dispose();object.material.dispose();}});}
});

test('all character frames fit their native mobile and desktop gallery stages at pointer extremes',()=>{
  const [w,h]=ANIME_STAGE.screen;const frame=new Mesh(new BoxGeometry(w+.14,h+.38,.28));
  try{
    for(const [width,height] of [[238,360],[272,360],[297,390],[205,310],[290,370],[352,445],[390,445]]){
      const camera=new PerspectiveCamera(36,width/height,.1,80);camera.position.set(0,.2,fitDistance(ANIME_STAGE.width,ANIME_STAGE.height,camera.aspect,36));camera.lookAt(0,0,0);camera.updateMatrixWorld();
      for(const px of [-.5,.5])for(const py of [-.5,.5])for(const velocity of [-4,4])for(const bob of [-.022,.022]){
        frame.rotation.set(py*.12+velocity*.012,-.06+px*.24,-.015);frame.position.y=bob;frame.updateMatrixWorld(true);
        inside(frame,camera,`anime ${width}×${height}, pointer ${px}/${py}`);
      }
    }
  }finally{frame.geometry.dispose();frame.material.dispose();}
});
