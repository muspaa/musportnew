import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createRatingsHandler,validateRating,sameOrigin,signChallenge,validChallenge,WRITE_SCRIPT,READ_SCRIPT } from '../api/ratings.js';
const env={UPSTASH_REDIS_REST_URL:'https://unit-test.upstash.io',UPSTASH_REDIS_REST_TOKEN:'a-server-only-test-token'};
const client='0728bef2-204c-4ed1-bb92-9188371c493c',requestId='752ca21e-3cfa-4c32-a1e2-1d7350b4c761',time=1791580000000;
const ip=createHmac('sha256',env.UPSTASH_REDIS_REST_TOKEN).update('203.0.113.2').digest('hex');
const proof=()=>signChallenge(env.UPSTASH_REDIS_REST_TOKEN,ip,client,time);
const body=()=>({name:'Rafi',stars:5,comment:'',website:'',client,requestId,challenge:proof()});
const req=(value=body())=>({method:'POST',headers:{host:'rhmt.biz.id',origin:'https://rhmt.biz.id','content-type':'application/json','x-vercel-forwarded-for':'203.0.113.2','x-forwarded-for':'spoofed'},body:value,url:'/api/ratings'});
const res=()=>({code:0,headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(value){this.body=value;return this;}});
const response=result=>new Response(JSON.stringify({result}),{headers:{'Content-Type':'application/json'}});
test('required name and integer stars; omitted or empty comment is valid',()=>{
 assert.ok(validateRating(body()));const omitted=body();delete omitted.comment;assert.equal(validateRating(omitted).comment,'');
 for(const change of [{name:' '},{name:'x'.repeat(51)},{stars:0},{stars:6},{stars:2.5},{stars:'5'},{comment:4},{comment:'x'.repeat(601)},{website:'spam'},{client:'spoof'},{requestId:'spoof'},{name:'bad\u0000name'}])assert.equal(validateRating({...body(),...change}),null);
});
test('exact origin comparison rejects null, prefixes and cross-site writes',()=>{
 assert.ok(sameOrigin(req()));for(const origin of ['null','https://rhmt.biz.id.evil.test','https://evil.test','http://rhmt.biz.id'])assert.equal(sameOrigin({...req(),headers:{...req().headers,origin}}),false);
 assert.equal(sameOrigin({...req(),headers:{...req().headers,'sec-fetch-site':'cross-site'}}),false);
});
test('signed challenge is bound to IP, browser, age and server secret',()=>{
 const token=proof();assert.ok(validChallenge(token,env.UPSTASH_REDIS_REST_TOKEN,ip,client,time+10));
 for(const [secret,address,browser,at] of [['wrong',ip,client,time],[env.UPSTASH_REDIS_REST_TOKEN,'wrong',client,time],[env.UPSTASH_REDIS_REST_TOKEN,ip,'wrong',time],[env.UPSTASH_REDIS_REST_TOKEN,ip,client,time+1800001],[env.UPSTASH_REDIS_REST_TOKEN,ip,client,time-1]])assert.equal(validChallenge(token,secret,address,browser,at),false);
});
test('invalid requests never reach Upstash',async()=>{
 let calls=0;const handler=createRatingsHandler({env,now:()=>time,fetchImpl:async()=>{calls++;throw Error('must not run');}});
 for(const [q,code] of [[{...req(),method:'DELETE'},405],[{...req(),headers:{...req().headers,origin:'https://evil.test'}},403],[{...req(),headers:{...req().headers,'content-type':'text/plain'}},415],[req({...body(),stars:9}),400],[req({...body(),comment:'x'.repeat(4500)}),413],[req({...body(),challenge:'fake'}),409]]){const r=res();await handler(q,r);assert.equal(r.code,code);}
 assert.equal(calls,0);
});
test('one atomic EVAL writes rating; no raw IP or token enters key arguments',async()=>{
 let command;const handler=createRatingsHandler({env,now:()=>time,fetchImpl:async(url,options)=>{assert.equal(url,env.UPSTASH_REDIS_REST_URL);assert.equal(options.headers.Authorization,`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`);command=JSON.parse(options.body);return response([1,5,1,command[11],0]);}});
 const r=res();await handler(req(),r);assert.equal(r.code,200);assert.equal(r.body.accepted,true);assert.equal(r.body.average,5);assert.equal(r.body.review.name,'Rafi');assert.equal(command[0],'EVAL');assert.equal(command[1],WRITE_SCRIPT);assert.equal(command[2],8);assert.equal(command.length,14);assert.ok(!JSON.stringify(command.slice(3)).includes('203.0.113.2'));assert.ok(!JSON.stringify(command).includes(env.UPSTASH_REDIS_REST_TOKEN));
});
test('retry across fresh handler instances uses the same idempotency key and fingerprint',async()=>{
 const calls=[];const fetchImpl=async(_url,options)=>{const command=JSON.parse(options.body);calls.push(command);return response([1,5,1,command[11],0]);};
 for(const at of [time,time+1000]){const r=res();await createRatingsHandler({env,now:()=>at,fetchImpl})(req(),r);assert.equal(r.code,200);}
 assert.equal(calls[0][9],calls[1][9]);assert.equal(calls[0][13],calls[1][13]);
});
test('Redis-wide limit and duplicate conflict become honest 429/409 responses',async()=>{
 for(const [result,code] of [[[0,5,1,'',590000],429],[[2,5,1,'',0],409]]){const r=res();await createRatingsHandler({env,now:()=>time,fetchImpl:async()=>response(result)})(req(),r);assert.equal(r.code,code);assert.equal(r.body.accepted,undefined);if(code===429)assert.equal(r.headers['Retry-After'],'590');}
});
test('GET returns real aggregate, bounded public reviews and a fresh signed challenge',async()=>{
 let command;const raw=JSON.stringify({id:requestId,name:'<script>example</script>',stars:4,comment:'Text, never HTML.',createdAt:new Date(time).toISOString(),privateIp:'must-not-leak'});
 const handler=createRatingsHandler({env,now:()=>time,fetchImpl:async(_url,options)=>{command=JSON.parse(options.body);return response([1,9,2,[raw,'broken'],0]);}});const r=res();await handler({...req(),method:'GET',url:`/api/ratings?client=${client}`,body:undefined},r);assert.equal(r.code,200);assert.equal(r.body.average,4.5);assert.equal(r.body.count,2);assert.equal(r.body.reviews.length,1);assert.equal(r.body.reviews[0].privateIp,undefined);assert.ok(validChallenge(r.body.challenge,env.UPSTASH_REDIS_REST_TOKEN,ip,client,time));assert.equal(command[1],READ_SCRIPT);assert.equal(r.headers['Cache-Control'],'private, no-store');
});
test('missing configuration, HTTP failure, malformed JSON and storage errors never fake success',async()=>{
 const configs=[{env:{}},{env:{...env,UPSTASH_REDIS_REST_URL:'https://upstash.io.evil.test'}}];
 for(const config of configs){const r=res();await createRatingsHandler({...config,now:()=>time})(req(),r);assert.equal(r.code,503);assert.equal(r.body.configured,false);}
 for(const upstream of [new Response('unauthorized',{status:401}),new Response('<html>Unavailable</html>'),new Response('{"error":"WRONGTYPE"}'),response([1,'bad',1,'bad',0])]){const r=res();await createRatingsHandler({env,now:()=>time,fetchImpl:async()=>upstream})(req(),r);assert.equal(r.code,503);assert.equal(r.body.accepted,undefined);assert.ok(!JSON.stringify(r.body).includes(env.UPSTASH_REDIS_REST_TOKEN));}
});
