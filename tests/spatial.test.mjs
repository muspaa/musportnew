import test from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { decaySpin, fitDistance, horizontalIntent, isSceneKind, projectHit, settleFitDistance } from '../src/scenes/spatialMath.mjs';
import { introCanContinue } from '../src/scenes/sceneReadiness.mjs';

test('intro waits for its own rendered stage even if a different scene or empty frame was ready',()=>{
  for(const renderer of ['ready','loading',undefined])assert.equal(introCanContinue(renderer,false),false);
  assert.equal(introCanContinue('ready',true),true);
  assert.equal(introCanContinue('unavailable',false),true);
});

test('the first frame after a narrower viewport fits immediately and zooming back in cannot crop',()=>{
  let previous=fitDistance(8.45,6.6,620/560,36);
  for(const aspect of [324/355,284/430,620/560]){
    const required=fitDistance(8.45,6.6,aspect,36);
    for(const rate of [30,60,120]){
      const distance=settleFitDistance(previous,required,1/rate);
      assert.ok(distance>=required);
      const camera=new PerspectiveCamera(36,aspect,.1,80);camera.position.z=distance;camera.lookAt(0,0,0);camera.updateMatrixWorld();
      for(const x of [-8.45/2,8.45/2])for(const y of [-6.6/2,6.6/2]){
        const p=new Vector3(x,y,0).project(camera);assert.ok(Math.abs(p.x)<=1+1e-10&&Math.abs(p.y)<=1+1e-10);
      }
    }
    previous=required;
  }
});

test('renderer status metadata cannot become a scene or suppress native fallback imagery', () => {
  for(const kind of ['ready','unavailable','on','',undefined])assert.equal(isSceneKind(kind),false);
  for(const kind of ['room','hero','intro','journey','orbit','project','anime'])assert.equal(isSceneKind(kind),true);
});

test('orbit release travels the same distance at 30, 60 and 120 updates per second', () => {
  function run(rate) {
    let angle=0,velocity=2.7;
    for(let i=0;i<rate*2;i++){const step=decaySpin(velocity,1/rate);angle+=step.travel;velocity=step.velocity;}
    return {angle,velocity};
  }
  const reference=run(60);
  for(const rate of [30,120]){
    const actual=run(rate);
    assert.ok(Math.abs(reference.angle-actual.angle)<1e-10);
    assert.ok(Math.abs(reference.velocity-actual.velocity)<1e-10);
  }
  assert.ok(reference.angle>0&&reference.angle<2.7/7);
});

test('vertical or small touch movement retains native page scroll; horizontal intent can orbit', () => {
  assert.equal(horizontalIntent(4,5),false);
  assert.equal(horizontalIntent(8,0),false);
  assert.equal(horizontalIntent(12,40),false);
  assert.equal(horizontalIntent(-11,-35),false);
  assert.equal(horizontalIntent(24,3),true);
  assert.equal(horizontalIntent(-28,4),true);
});

test('perspective fit keeps all subject corners inside mobile and desktop frustums', () => {
  for(const [width,height] of [[324,355],[354,390],[444,430],[620,560]]){
    const camera=new PerspectiveCamera(36,width/height,.1,80);
    camera.position.z=fitDistance(8.45,6.6,camera.aspect,camera.fov);camera.lookAt(0,0,0);camera.updateMatrixWorld();
    for(const x of [-8.45/2,8.45/2])for(const y of [-6.6/2,6.6/2]){
      const projected=new Vector3(x,y,0).project(camera);
      assert.ok(Math.abs(projected.x)<=1+1e-10,`${width}: horizontal fit`);
      assert.ok(Math.abs(projected.y)<=1+1e-10,`${width}: vertical fit`);
    }
  }
});

test('off-axis nodes on the same camera plane have equal projected touch sizes', () => {
  const camera=new PerspectiveCamera(36,1,.1,80);camera.position.z=10;camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const center=projectHit(new Vector3(0,0,0),camera,500,500,.7);
  const side=projectHit(new Vector3(2.4,0,0),camera,500,500,.7);
  assert.equal(center.depth,side.depth);assert.equal(center.size,side.size);assert.equal(side.visible,true);
  assert.ok(side.x>center.x);
  const front=projectHit(new Vector3(0,0,3.15),camera,500,500,.7);
  assert.ok(front.size>center.size);
});

test('nodes behind the camera or outside the stage cannot create invisible click targets', () => {
  const camera=new PerspectiveCamera(36,1,.1,80);camera.position.z=10;camera.lookAt(0,0,0);camera.updateMatrixWorld();
  assert.equal(projectHit(new Vector3(0,0,12),camera,400,400,.7).visible,false);
  assert.equal(projectHit(new Vector3(40,0,0),camera,400,400,.7).visible,false);
  assert.equal(projectHit(new Vector3(0,0,0),camera,400,400,.7).visible,true);
});

test('camera-space projection follows a rotated camera and resizes with the stage', () => {
  const camera=new PerspectiveCamera(36,1,.1,80);camera.position.set(3,2,10);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const point=new Vector3(0,0,0);const small=projectHit(point,camera,324,324,.7);const large=projectHit(point,camera,620,620,.7);
  assert.ok(Math.abs(small.x-162)<1e-8&&Math.abs(small.y-162)<1e-8);
  assert.ok(Math.abs(large.x-310)<1e-8&&Math.abs(large.y-310)<1e-8);
  assert.ok(small.size>=34&&large.size<=86);
});
