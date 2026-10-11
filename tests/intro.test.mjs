import test from 'node:test';
import assert from 'node:assert/strict';
import { introProgress } from '../src/interaction/intro.mjs';
test('cached critical assets still allow the whole opening choreography',()=>{
  assert.equal(introProgress(0,true),1);
  assert.ok(introProgress(3399,true)<100);
  assert.equal(introProgress(3400,true),100);
});
test('intro never regresses or reports completion before delayed assets settle',()=>{
  let previous=1;
  for(let time=0;time<5200;time+=13){const value=introProgress(time,false);assert.ok(value>=previous&&value<=96);previous=value;}
  assert.equal(introProgress(4800,true),100);
  assert.equal(introProgress(5199,false),96);
  assert.equal(introProgress(5200,false),100);
});
test('reduced motion has a short opening and a bounded network deadline',()=>{
  assert.ok(introProgress(299,true,true)<100);
  assert.equal(introProgress(300,true,true),100);
  assert.equal(introProgress(649,false,true),96);
  assert.equal(introProgress(650,false,true),100);
});
