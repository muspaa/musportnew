import test from 'node:test';
import assert from 'node:assert/strict';
import { coverProgress,heroPinTop } from '../src/interaction/chapters.mjs';
import { canonicalOrigin } from '../scripts/seo.mjs';
test('chapter cover remains reversible and bounded across mobile and desktop',()=>{
 for(const viewport of [568,720,900])for(const header of [64,72]){
  assert.equal(coverProgress(viewport+50,viewport,header),0);
  assert.equal(coverProgress(header,viewport,header),1);
  assert.equal(coverProgress(-300,viewport,header),1);
  const middle=(viewport+header)/2;assert.equal(coverProgress(middle,viewport,header),.5);
  assert.ok(coverProgress(middle-10,viewport,header)>coverProgress(middle+10,viewport,header));
 }
});
test('tall mobile hero is readable before the last scene pins; short hero stays below header',()=>{
 assert.equal(heroPinTop(1450,720,64),-730);
 assert.equal(heroPinTop(660,900,72),72);
 assert.equal(heroPinTop(850,900,72),50);
});
test('canonical uses explicit domain, otherwise Vercel production origin, otherwise source domain',()=>{
 assert.equal(canonicalOrigin('https://example.com/','demo.vercel.app'),'https://example.com/');
 assert.equal(canonicalOrigin(undefined,'demo.vercel.app'),'https://demo.vercel.app/');
 assert.equal(canonicalOrigin(), 'https://rhmt.biz.id/');
});
test('canonical rejects insecure, credentialed and non-root URLs',()=>{
 for(const u of ['http://example.com/','https://user:pass@example.com/','https://example.com/project','https://example.com/?token=abc','https://example.com/#home'])assert.throws(()=>canonicalOrigin(u));
});
test('short desktop hero starts unfolded even when work is initially visible below it',()=>{
 assert.equal(coverProgress(732,900,72,732),0);
 assert.equal(coverProgress(402,900,72,732),.5);
 assert.equal(coverProgress(72,900,72,732),1);
 assert.equal(coverProgress(720,720,64,1514),0);
});
