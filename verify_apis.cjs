// Dependency-free checks of the actual in-memory route handlers.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
for (const directory of fs.readdirSync('Programs').filter(name => /^Q(15|16|17|18|19|23)_/.test(name))) {
  const base = path.join('Programs', directory);
  const sourcePath = path.join(base, directory.startsWith('Q23') ? 'server/server.js' : 'server.js');
  const routes = new Map();
  const fake = { use() {}, ...Object.fromEntries(['get','post','put','delete'].map(method => [method, (url, handler) => routes.set(method+' '+url,handler)])) };
  const express = () => fake;
  express.json = () => () => {};
  let source = fs.readFileSync(sourcePath,'utf8')
    .replace("import express from 'express';", '')
    .replace("import {scryptSync,randomBytes} from 'node:crypto';", "const {scryptSync,randomBytes}=require('node:crypto');")
    .replace("import {pathToFileURL} from 'node:url';", '')
    .replace('export {app};','')
    .replace(/^if\(process.argv\[1\].*$/m,'');
  new Function('express','require',source)(express,require);
  function call(method,url,body={},id='1') {
    const response={code:200,status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
    assert.ok(routes.has(method+' '+url),method+' '+url);
    routes.get(method+' '+url)({body,params:{id}},response);
    return response;
  }
  if(directory.startsWith('Q23')) {
    assert.equal(call('get','/api/products').data.length,3);
    assert.equal(call('post','/api/cart/summary',{items:[{id:1,quantity:2}]}).data.total,1998);
    assert.equal(call('post','/api/cart/summary',{items:[{id:1,quantity:0}]}).code,400);
  } else {
    const collection=JSON.parse(fs.readFileSync(path.join(base,'postman_collection.json'),'utf8'));
    const first=collection.item[0].request;
    const url=new URL(first.url).pathname;
    const sample=JSON.parse(first.body.raw);
    assert.equal(call('post',url,{}).code,400);
    const created=call('post',url,sample);
    assert.equal(created.code,201);
    if(directory.startsWith('Q19')) {
      assert.equal(call('post',url,sample).code,409);
      assert.ok(!JSON.stringify(created.data).includes(sample.password));
    } else {
      assert.ok(call('get',url).data.length>=1);
      for(const item of collection.item.slice(1)) {
        const method=item.request.method.toLowerCase();
        if(method==='put') assert.equal(call(method,url+'/:id',sample).code,200);
        if(method==='delete') {
          assert.equal(call(method,url+'/:id').code,200);
          assert.equal(call(method,url+'/:id').code,404);
        }
      }
    }
  }
  console.log(directory+': handler checks passed');
}
