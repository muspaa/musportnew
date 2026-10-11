"""Execute production Lua with a small Redis command model, without a live database.
This checks script semantics, not Upstash connectivity or real Redis concurrency.
"""
import ctypes
import ctypes.util
import json
import sys

path=ctypes.util.find_library('lua5.4') or ctypes.util.find_library('lua5.3')
if not path:
    print('Native Lua unavailable; optional script check skipped.')
    sys.exit(75)
lib=ctypes.CDLL(path)
lib.luaL_newstate.restype=ctypes.c_void_p
lib.luaL_openlibs.argtypes=[ctypes.c_void_p]
lib.luaL_loadstring.argtypes=[ctypes.c_void_p,ctypes.c_char_p]
lib.luaL_loadstring.restype=ctypes.c_int
lib.lua_pcallk.argtypes=[ctypes.c_void_p,ctypes.c_int,ctypes.c_int,ctypes.c_int,ctypes.c_longlong,ctypes.c_void_p]
lib.lua_pcallk.restype=ctypes.c_int
lib.lua_tolstring.argtypes=[ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p]
lib.lua_tolstring.restype=ctypes.c_char_p
lib.lua_close.argtypes=[ctypes.c_void_p]
scripts=json.load(sys.stdin)
source=r'''
local data,expires,NOW={},{},0
local function read(key)
 if expires[key] and expires[key]<=NOW then data[key]=nil expires[key]=nil end
 return data[key]
end
redis={}
function redis.error_reply(msg) error(msg) end
function redis.call(command,key,...)
 local a={...} local v=read(key)
 if command=='TYPE' then return {ok=v and v.kind or 'none'} end
 if command=='GET' then return v and v.value or false end
 if command=='EXISTS' then return v and 1 or 0 end
 if command=='SET' then data[key]={kind='string',value=a[1]} if a[2]=='PX' then expires[key]=NOW+tonumber(a[3]) end return 'OK' end
 if command=='INCR' then local n=tonumber(v and v.value or '0') assert(n,'integer expected') n=n+1 data[key]={kind='string',value=tostring(n)} return n end
 if command=='PEXPIRE' then expires[key]=NOW+tonumber(a[1]) return 1 end
 if command=='PTTL' then if not v then return -2 end return expires[key] and expires[key]-NOW or -1 end
 if command=='HGET' then assert(not v or v.kind=='hash','WRONGTYPE') return v and v.value[a[1]] or false end
 if command=='HINCRBY' then if not v then v={kind='hash',value={}} data[key]=v end local n=tonumber(v.value[a[1]] or '0')+tonumber(a[2]) v.value[a[1]]=tostring(n) return n end
 if command=='LPUSH' then if not v then v={kind='list',value={}} data[key]=v end table.insert(v.value,1,a[1]) return #v.value end
 if command=='LRANGE' then local out={} if v then for i=tonumber(a[1])+1,math.min(#v.value,tonumber(a[2])+1) do table.insert(out,v.value[i]) end end return out end
 if command=='LTRIM' then local out={} if v then for i=tonumber(a[1])+1,math.min(#v.value,tonumber(a[2])+1) do table.insert(out,v.value[i]) end v.value=out end return 'OK' end
 error('Unmodelled command: '..command)
end
local write=assert(load(WRITE))
local readScript=assert(load(READ))
local function reset() data={} expires={} NOW=0 end
local function vote(ip,browser,id,stars,fingerprint)
 KEYS={'cool:'..ip,'day:'..ip,'browser:'..browser,'day:global','summary','reviews','request:'..browser..':'..id,'attempt:'..ip}
 ARGV={'{"id":"'..id..'"}',tostring(stars or 5),fingerprint or string.rep('a',64)}
 return write()
end
reset()
local expected=0
for i=1,100 do local stars=i%5+1 assert(vote('ip'..i,'b'..i,'r'..i,stars)[1]==1) expected=expected+stars end
assert(tonumber(data.summary.value.count)==100 and tonumber(data.summary.value.sum)==expected,'aggregate across independent visitors')
assert(#data.reviews.value==100,'reviews retained')
reset()
for i=1,100 do assert(vote('same-ip','same-browser','stable-request',4)[1]==(i<=12 and 1 or 0),'replays obey request limit') end
assert(tonumber(data.summary.value.count)==1 and tonumber(data.summary.value.sum)==4,'idempotent retry')
assert(tonumber(data['attempt:same-ip'].value)==100,'all retries consume request quota')
NOW=600001
assert(vote('same-ip','same-browser','stable-request',4,string.rep('b',64))[1]==2,'changed payload is a conflict')
assert(vote('same-ip','same-browser','stable-request',4)[1]==1,'retry recovers original result after request window')
assert(vote('other-ip','same-browser','new-request',5)[1]==0,'browser limit across networks')
reset()
assert(vote('shared-ip','b1','r1',5)[1]==1)
assert(vote('shared-ip','b2','r2',5)[1]==0,'shared IP cooldown')
NOW=600001 assert(vote('shared-ip','b2','r2',5)[1]==1)
NOW=1200002 assert(vote('shared-ip','b3','r3',5)[1]==1)
NOW=1800003 assert(vote('shared-ip','b4','r4',5)[1]==0,'three per IP per day')
NOW=86400001 assert(vote('shared-ip','b1','r5',5)[1]==1,'TTL expiry permits next day')
reset()
for i=1,520 do local result=vote('ip'..i,'browser'..i,'req'..i,3) assert(result[1]==(i<=500 and 1 or 0),'global daily ceiling') end
assert(tonumber(data.summary.value.count)==500 and tonumber(data.summary.value.sum)==1500,'no rejected vote changes summary')
assert(#data.reviews.value==250,'storage bounded to 250 recent reviews')
reset()
data.summary={kind='string',value='corrupt'}
local ok=pcall(function() vote('ip','browser','req',5) end)
assert(not ok and data['attempt:ip']==nil,'type failure precedes mutation')
reset()
data.summary={kind='hash',value={sum='bad',count='1'}}
ok=pcall(function() vote('ip','browser','req',5) end)
assert(not ok and data['attempt:ip']==nil,'corrupt aggregate precedes mutation')
reset()
data['day:ip']={kind='string',value='1.5'}
ok=pcall(function() vote('ip','browser','req',5) end)
assert(not ok and data['attempt:ip']==nil,'corrupt counter precedes mutation')
reset()
data['day:ip']={kind='string',value='bad'}
ok=pcall(function() vote('ip','browser','req',5) end)
assert(not ok and data['attempt:ip']==nil,'non-numeric counter precedes mutation')
reset()
for i=1,61 do KEYS={'read:ip','read:global','summary','reviews'} local result=readScript() assert(result[1]==(i<=60 and 1 or 0),'read rate limit') end
local deadline=expires['read:ip'] NOW=4000 KEYS={'read:ip','read:global','summary','reviews'} readScript() assert(expires['read:ip']==deadline,'fixed expiry does not slide on each request')
print('Lua: aggregate, retry, conflict, IP/browser/daily limits, expiry, bounded storage, corrupt types, read throttling passed.')
'''
source='WRITE=[=====['+scripts['write']+']=====]\nREAD=[=====['+scripts['read']+']=====]\n'+source
state=lib.luaL_newstate()
try:
    lib.luaL_openlibs(state)
    result=lib.luaL_loadstring(state,source.encode())
    if result==0:
        result=lib.lua_pcallk(state,0,0,0,0,None)
    if result:
        message=lib.lua_tolstring(state,-1,None)
        raise RuntimeError(message.decode() if message else 'Lua failure')
finally:
    lib.lua_close(state)
