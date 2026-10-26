import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const results=[];
for(const folder of fs.readdirSync('Programs').sort()) {
  const base=path.resolve('Programs',folder);
  const backend=fs.existsSync(path.join(base,'server/server.js'))?path.join(base,'server'):base;
  if(!fs.existsSync(path.join(backend,'server.js')))continue;
  let listener,mongoose,model,savedId;
  try {
    const {app}=await import(pathToFileURL(path.join(backend,'server.js')));
    listener=app.listen(0,'127.0.0.1');
    await new Promise(resolve=>listener.once('listening',resolve));
    const origin='http://127.0.0.1:'+listener.address().port;
    async function request(url,method='GET',body) {
      const response=await fetch(origin+url,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
      return {status:response.status,data:await response.json()};
    }
    if(fs.existsSync(path.join(backend,'node_modules/mongoose/index.js'))) {
      mongoose=(await import(pathToFileURL(path.join(backend,'node_modules/mongoose/index.js')))).default;
      model=Object.values(mongoose.models)[0];
      const code=fs.readFileSync(path.join(backend,'server.js'),'utf8');
      const endpoint=code.match(/app.post\('([^']+)'/)[1];
      const allowed=JSON.parse(code.match(/const allowed=(\[[^;]+\]);/)[1]);
      const sample=Object.fromEntries(allowed.map(key=>[key,key==='email'?'check-'+Date.now()+'@example.com':key==='mobile'?'9876543210':['price','salary'].includes(key)?100:key==='quantity'?2:key==='available'?'Available':key==='bookId'?'TEST-'+Date.now():'Verification '+key]));
      assert.equal((await request(endpoint,'POST',{})).status,400);
      const created=await request(endpoint,'POST',sample);
      assert.equal(created.status,201,JSON.stringify(created.data));savedId=created.data._id;
      assert.ok(await model.findById(savedId));
      if([20,22,25].some(n=>folder.startsWith('Q'+n+'_'))) {
        const listed=await request(endpoint);assert.equal(listed.status,200);assert.ok(listed.data.some(item=>item._id===savedId));
      }
      if(folder.startsWith('Q22')||folder.startsWith('Q25')) {
        const updated=await request(endpoint+'/'+savedId,'PUT',{...sample,...(folder.startsWith('Q25')?{available:'Issued'}:{course:'Updated Course'})});assert.equal(updated.status,200);
        assert.equal((await request(endpoint+'/'+savedId,'DELETE')).status,200);savedId=null;
      }
    } else if(folder.startsWith('Q23')) {
      assert.equal((await request('/api/products')).status,200);
      assert.equal((await request('/api/cart/summary','POST',{items:[{id:1,quantity:2}]})).data.total,1998);
    } else {
      const collection=JSON.parse(fs.readFileSync(path.join(base,'postman_collection.json')));
      const first=collection.item[0].request;
      const endpoint=new URL(first.url).pathname;
      const sample=JSON.parse(first.body.raw);
      assert.equal((await request(endpoint,'POST',{})).status,400);
      const created=await request(endpoint,'POST',sample);assert.equal(created.status,201);
      if(folder.startsWith('Q19')) {assert.equal((await request(endpoint,'POST',sample)).status,409);assert.ok(!JSON.stringify(created.data).includes(sample.password));}
      else {
        assert.equal((await request(endpoint)).status,200);
        const id=created.data.id;
        if(['Q17','Q18'].some(prefix=>folder.startsWith(prefix)))assert.equal((await request(endpoint+'/'+id,'PUT',sample)).status,200);
        if(['Q16','Q17','Q18'].some(prefix=>folder.startsWith(prefix)))assert.equal((await request(endpoint+'/'+id,'DELETE')).status,200);
      }
    }
    results.push({program:folder,result:'PASS'});console.log(folder+': PASS');
  }catch(error){results.push({program:folder,result:'FAIL',message:error.message});console.error(folder+': '+error.message);}
  finally {
    if(model&&savedId)await model.deleteOne({_id:savedId});
    if(listener)await new Promise(resolve=>listener.close(resolve));
    if(mongoose)await mongoose.disconnect();
  }
}
fs.writeFileSync('runtime-results.json',JSON.stringify(results,null,2));
if(results.some(result=>result.result==='FAIL'))process.exitCode=1;
