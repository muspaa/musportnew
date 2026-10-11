import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

export const READ_SCRIPT = `
local function hit(key, window)
  local n=redis.call('INCR',key)
  if n==1 then redis.call('PEXPIRE',key,window) end
  return n
end
if hit(KEYS[1],60000)>60 or hit(KEYS[2],60000)>500 then return {0,0,0,{},60000} end
return {1,tonumber(redis.call('HGET',KEYS[3],'sum') or '0'),tonumber(redis.call('HGET',KEYS[3],'count') or '0'),redis.call('LRANGE',KEYS[4],0,19),0}
`;
export const WRITE_SCRIPT = `
local function typ(key)
  local t=redis.call('TYPE',key)
  if type(t)=='table' then return t.ok end
  return t
end
for i=1,8 do
  local t=typ(KEYS[i])
  local wanted=i==5 and 'hash' or (i==6 and 'list' or 'string')
  if t~='none' and t~=wanted then return redis.error_reply('INVALID_STORAGE') end
end
local sum=tonumber(redis.call('HGET',KEYS[5],'sum') or '0')
local count=tonumber(redis.call('HGET',KEYS[5],'count') or '0')
if not sum or not count or sum<0 or count<0 or sum%1~=0 or count%1~=0 then return redis.error_reply('INVALID_STORAGE') end
for _,i in ipairs({2,4,8}) do
  local raw=redis.call('GET',KEYS[i])
  local n=tonumber(raw or '0')
  if not n or n<0 or n%1~=0 then return redis.error_reply('INVALID_STORAGE') end
end
local attempts=redis.call('INCR',KEYS[8])
if attempts==1 then redis.call('PEXPIRE',KEYS[8],600000) end
if attempts>12 then return {0,sum,count,'',math.max(1000,redis.call('PTTL',KEYS[8]))} end
local previous=redis.call('GET',KEYS[7])
if previous then
  if string.sub(previous,1,64)~=ARGV[3] then return {2,sum,count,'',0} end
  return {1,sum,count,string.sub(previous,66),0}
end
if redis.call('EXISTS',KEYS[1])==1 then return {0,sum,count,'',math.max(1000,redis.call('PTTL',KEYS[1]))} end
if redis.call('EXISTS',KEYS[3])==1 then return {0,sum,count,'',math.max(1000,redis.call('PTTL',KEYS[3]))} end
if tonumber(redis.call('GET',KEYS[2]) or '0')>=3 then return {0,sum,count,'',math.max(1000,redis.call('PTTL',KEYS[2]))} end
if tonumber(redis.call('GET',KEYS[4]) or '0')>=500 then return {0,sum,count,'',math.max(1000,redis.call('PTTL',KEYS[4]))} end
local stars=tonumber(ARGV[2])
if not stars or stars<1 or stars>5 or stars%1~=0 then return redis.error_reply('INVALID_RATING') end
redis.call('SET',KEYS[1],'1','PX',600000)
redis.call('SET',KEYS[3],'1','PX',86400000)
for _,i in ipairs({2,4}) do
  local n=redis.call('INCR',KEYS[i])
  if n==1 then redis.call('PEXPIRE',KEYS[i],86400000) end
end
sum=redis.call('HINCRBY',KEYS[5],'sum',stars)
count=redis.call('HINCRBY',KEYS[5],'count',1)
redis.call('LPUSH',KEYS[6],ARGV[1])
redis.call('LTRIM',KEYS[6],0,249)
redis.call('SET',KEYS[7],ARGV[3]..'|'..ARGV[1],'PX',86400000)
return {1,sum,count,ARGV[1],0}
`;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PREFIX='rhmt:{ratings}:v23:';
const CONTROL=/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
export function validateRating(body) {
  if(!body||typeof body!=='object'||Array.isArray(body))return null;
  const optionalComment=body.comment??'';
  if(typeof body.name!=='string'||typeof optionalComment!=='string'||!Number.isInteger(body.stars)||body.stars<1||body.stars>5)return null;
  const name=body.name.normalize('NFC').trim().replace(/\s+/g,' '),comment=optionalComment.normalize('NFC').trim();
  if(!name||name.length>50||comment.length>600||CONTROL.test(name+comment)||!UUID.test(body.client||'')||!UUID.test(body.requestId||'')||typeof body.challenge!=='string')return null;
  if(typeof body.website!=='string'||body.website!=='')return null;
  return {name,comment,stars:body.stars,client:body.client.toLowerCase(),requestId:body.requestId.toLowerCase(),challenge:body.challenge};
}
const hmac=(secret,value)=>createHmac('sha256',secret).update(value).digest('hex');
function clientIp(req) {return String(req.headers?.['x-vercel-forwarded-for']||req.headers?.['x-real-ip']||req.ip||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,128);}
export function sameOrigin(req) {
  if(req.headers?.['sec-fetch-site']==='cross-site')return false;
  const origin=req.headers?.origin;
  if(typeof origin!=='string'||origin==='null')return false;
  try {const url=new URL(origin);const host=String(req.headers?.host||'').toLowerCase();const local=['localhost','127.0.0.1','terminal.local'].includes(url.hostname);return url.host.toLowerCase()===host&&(url.protocol==='https:'||(local&&url.protocol==='http:'));}catch{return false;}
}
export function signChallenge(secret,ip,client,now) {const data=`${now}.${randomUUID()}`;return `${data}.${hmac(secret,`${ip}|${client}|${data}`)}`;}
export function validChallenge(token,secret,ip,client,now) {
  if(typeof token!=='string'||token.length>180)return false;
  const [timestamp,nonce,signature,...extra]=token.split('.');const age=now-Number(timestamp);
  if(extra.length||!UUID.test(nonce||'')||!/^\d{13}$/.test(timestamp||'')||!/^[0-9a-f]{64}$/.test(signature||'')||age<0||age>1800000)return false;
  const expected=Buffer.from(hmac(secret,`${ip}|${client}|${timestamp}.${nonce}`),'hex');return timingSafeEqual(expected,Buffer.from(signature,'hex'));
}
function publicReview(raw) {
  try {const r=typeof raw==='string'?JSON.parse(raw):raw;if(!r||!UUID.test(r.id||'')||typeof r.name!=='string'||!r.name||r.name.length>50||typeof r.comment!=='string'||r.comment.length>600||!Number.isInteger(r.stars)||r.stars<1||r.stars>5||!Number.isFinite(Date.parse(r.createdAt)))return null;return {id:r.id,name:r.name,comment:r.comment,stars:r.stars,createdAt:r.createdAt};}catch{return null;}
}
export function createRatingsHandler({fetchImpl=fetch,now=Date.now,env=process.env}={}) {
  async function evaluate(script,keys,args=[]) {
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),6500);
    try {
      const response=await fetchImpl(env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',script,keys.length,...keys,...args]),signal:controller.signal});
      if(!response.ok)throw new Error('STORAGE');const text=await response.text();if(text.length>150000)throw new Error('SIZE');const body=JSON.parse(text);
      if(body.error||!Array.isArray(body.result)||body.result.length!==5)throw new Error('STORAGE');return body.result;
    } finally {clearTimeout(timeout);}
  }
  return async function handler(req,res) {
    res.setHeader('Cache-Control','private, no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
    if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Metode tidak didukung.'});}
    let rating;
    if(req.method==='POST') {
      if(!sameOrigin(req))return res.status(403).json({error:'Permintaan tidak diizinkan.'});
      if(!String(req.headers?.['content-type']||'').toLowerCase().startsWith('application/json'))return res.status(415).json({error:'Gunakan format JSON.'});
      if(Number(req.headers?.['content-length'])>4096||Buffer.byteLength(JSON.stringify(req.body||{}))>4096)return res.status(413).json({error:'Pesan terlalu panjang.'});
      rating=validateRating(req.body);if(!rating)return res.status(400).json({error:'Isi nama, pilih 1–5 bintang, dan batasi komentar hingga 600 karakter.'});
    }
    try {
      const url=new URL(env.UPSTASH_REDIS_REST_URL||'');
      if(url.protocol!=='https:'||!url.hostname.endsWith('.upstash.io')||url.username||url.password||url.search||url.hash||!env.UPSTASH_REDIS_REST_TOKEN)throw new Error('CONFIG');
    } catch {return res.status(503).json({configured:false,error:'Rating belum tersedia.'});}
    const secret=env.UPSTASH_REDIS_REST_TOKEN,ip=hmac(secret,clientIp(req));
    try {
      if(req.method==='GET') {
        const query=new URL(req.url||'/api/ratings','http://localhost').searchParams;const client=String(req.query?.client||query.get('client')||'').toLowerCase();
        const result=await evaluate(READ_SCRIPT,[`${PREFIX}read:${ip}`,`${PREFIX}read:global`,`${PREFIX}summary`,`${PREFIX}reviews`]);
        const [accepted,sum,count,reviews,wait]=result;
        if(!accepted){res.setHeader('Retry-After',String(Math.ceil(wait/1000)));return res.status(429).json({error:'Tunggu sebentar sebelum memuat rating lagi.'});}
        if(!Number.isSafeInteger(sum)||!Number.isSafeInteger(count)||sum<0||count<0||!Array.isArray(reviews))throw new Error('INVALID_STORAGE');
        return res.status(200).json({configured:true,count,average:count?Math.round(sum/count*10)/10:0,reviews:reviews.map(publicReview).filter(Boolean),challenge:UUID.test(client)?signChallenge(secret,ip,client,now()):''});
      }
      if(!validChallenge(rating.challenge,secret,ip,rating.client,now()))return res.status(409).json({code:'REFRESH',error:'Sesi rating berakhir. Muat ulang rating lalu kirim lagi.'});
      const record={id:rating.requestId,name:rating.name,stars:rating.stars,comment:rating.comment,createdAt:new Date(now()).toISOString()};
      const browser=hmac(secret,rating.client);const fingerprint=hmac(secret,JSON.stringify([rating.name,rating.stars,rating.comment]));
      const result=await evaluate(WRITE_SCRIPT,[`${PREFIX}cooldown:${ip}`,`${PREFIX}daily:${ip}`,`${PREFIX}browser:${browser}`,`${PREFIX}daily:global`,`${PREFIX}summary`,`${PREFIX}reviews`,`${PREFIX}request:${browser}:${rating.requestId}`,`${PREFIX}attempts:${ip}`],[JSON.stringify(record),String(rating.stars),fingerprint]);
      const [accepted,sum,count,raw,wait]=result;
      if(accepted===2)return res.status(409).json({error:'Gunakan permintaan baru untuk rating yang berbeda.'});
      if(accepted!==1){res.setHeader('Retry-After',String(Math.max(1,Math.ceil(wait/1000))));return res.status(429).json({error:'Batas rating tercapai. Tunggu sebelum mencoba lagi.'});}
      const review=publicReview(raw);if(!review||!Number.isSafeInteger(sum)||!Number.isSafeInteger(count)||count<1)throw new Error('INVALID_STORAGE');
      return res.status(200).json({accepted:true,review,count,average:Math.round(sum/count*10)/10});
    } catch {return res.status(503).json({error:'Rating belum dapat tersimpan. Coba lagi sebentar lagi.'});}
  };
}
export default createRatingsHandler();
