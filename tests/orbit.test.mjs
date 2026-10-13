import test from 'node:test';
import assert from 'node:assert/strict';
import { ORBIT_LANES, orbitLayout, orbitPath, advanceOrbit, shouldAnimateOrbit } from '../src/interaction/orbit.mjs';

test('all 19 upright orbit hit targets stay separate and inside mobile/desktop wrappers throughout motion',()=>{
  assert.equal(ORBIT_LANES.reduce((total,lane)=>total+lane.count,0),19);
  for(let time=0;time<160;time+=.33){
    const points=orbitLayout(time,time*.13);assert.equal(points.length,19);
    for(const width of [284,324,354,400,460,540]){
      const host=width-18,tile=Math.max(host*.12,width<=300?33:36)*.98;
      for(let i=0;i<points.length;i++){
        const point=points[i],x=9+point.x*host,y=9+point.y*host;
        assert.ok(x-tile/2>=0&&x+tile/2<=width);assert.ok(y-tile/2>=0&&y+tile/2<=width);
        assert.ok(Math.hypot(point.x-.5,point.y-.5)*host>(host*.28+tile)/2);
        for(let j=i+1;j<points.length;j++)assert.ok(Math.abs(point.x-points[j].x)*host>=tile||Math.abs(point.y-points[j].y)*host>=tile,`overlapping targets at ${width}px`);
      }
    }
  }
});

test('orbit inertia travels identically at 30, 60 and 120 Hz and resumes from its preserved angle',()=>{
  const results=[];
  for(const rate of [30,60,120]){let state={time:12,rotation:.7,momentum:-.65};for(let step=0;step<rate*2;step++)state=advanceOrbit(state,1/rate);results.push(state);}
  for(const state of results){assert.ok(Math.abs(state.time-14)<1e-10);assert.ok(Math.abs(state.rotation-results[0].rotation)<1e-10);assert.ok(Math.abs(state.momentum-results[0].momentum)<1e-10);}
  const state=results[0];assert.deepEqual(advanceOrbit(state,0),state);
});

test('orbit renders stop for hidden tabs, offscreen scenes, dialogs, intro, focus, selection and reduced motion',()=>{
  const moving={visible:true,hidden:false,paused:false,reduced:false,selected:false,interacting:false,blocked:false};
  assert.equal(shouldAnimateOrbit(moving),true);
  for(const key of ['hidden','paused','reduced','selected','interacting','blocked'])assert.equal(shouldAnimateOrbit({...moving,[key]:true}),false,key);
  assert.equal(shouldAnimateOrbit({...moving,visible:false}),false);
});

test('silver rails form finite closed paths and orbit state remains reversible and bounded',()=>{
  for(const lane of ORBIT_LANES){const path=orbitPath(lane);assert.ok(path.startsWith('M'));assert.ok(path.endsWith(' Z'));assert.ok(!/NaN|Infinity/.test(path));}
  assert.deepEqual(orbitLayout(20,-4),orbitLayout(20,-4));
  for(const point of orbitLayout(300,-300)){assert.ok(point.x>0&&point.x<1&&point.y>0&&point.y<1);assert.ok(point.z>=-1&&point.z<=1);}
});
