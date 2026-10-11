import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { WRITE_SCRIPT, READ_SCRIPT } from '../api/ratings.js';
test('production Lua executes rating and limiter boundaries in native Lua',t=>{
 const run=spawnSync('python3',['tests/ratings-lua.py'],{input:JSON.stringify({write:WRITE_SCRIPT,read:READ_SCRIPT}),encoding:'utf8',timeout:10000});
 if(run.error?.code==='ENOENT'||run.status===75){t.skip('Optional native Lua runtime unavailable.');return;}
 assert.equal(run.status,0,run.stderr||run.stdout);assert.match(run.stdout,/passed/);
});
