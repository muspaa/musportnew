import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceReviewRail } from '../src/interaction/reviews.mjs';
test('slow review movement survives integer scrollLeft rounding at 30, 60 and 120Hz',()=>{
 for(const fps of [30,60,120]){
  let state={position:0,direction:1},roundedDOM=0;
  for(let i=0;i<fps*5;i++){state=advanceReviewRail(state.position,state.direction,1000,1/fps);roundedDOM=Math.round(state.position);}
  assert.ok(Math.abs(state.position-110)<1e-8);assert.equal(roundedDOM,110);
 }
});
test('review rail reaches both edges and reverses without overshooting',()=>{
 const right=advanceReviewRail(99,1,100,.1);assert.deepEqual(right,{position:100,direction:-1,atEdge:true});
 const left=advanceReviewRail(1,-1,100,.1);assert.deepEqual(left,{position:0,direction:1,atEdge:true});
 assert.equal(advanceReviewRail(50,1,100,20).position,52.2);
});
