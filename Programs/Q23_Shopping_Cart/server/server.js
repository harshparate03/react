import express from 'express';
const app=express();
app.use(express.json({limit:'100kb'}));
app.use((req,res,next)=>{if(['POST','PUT'].includes(req.method)&&(!req.body||typeof req.body!=='object'||Array.isArray(req.body)))return res.status(400).json({message:'Send a JSON object'});next();});
const text=value=>typeof value==='string' && value.trim().length>0;
const email=value=>text(value)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const wrap=handler=>(req,res,next)=>Promise.resolve(handler(req,res,next)).catch(next);
const products=[{id:1,name:'Keyboard',price:999},{id:2,name:'Mouse',price:499},{id:3,name:'Monitor',price:9999}];
app.get('/api/products',(req,res)=>res.json(products));
app.post('/api/cart/summary',(req,res)=>{
 if(!Array.isArray(req.body.items)||req.body.items.some(item=>!item||!Number.isInteger(item.quantity)||item.quantity<1||!products.some(product=>product.id===item.id)))return res.status(400).json({message:'Invalid cart items'});
 const ids=req.body.items.map(item=>item.id);if(new Set(ids).size!==ids.length)return res.status(400).json({message:'Duplicate cart items'});
 const items=req.body.items.map(item=>{const product=products.find(product=>product.id===item.id);return {...product,quantity:item.quantity,subtotal:product.price*item.quantity};});
 res.json({items,total:items.reduce((sum,item)=>sum+item.subtotal,0)});
});import {pathToFileURL} from 'node:url';
app.use((req,res)=>res.status(404).json({message:'Endpoint not found'}));
app.use((error,req,res,next)=>{
 const status=error.type==='entity.parse.failed'?400:error.code===11000?409:['ValidationError','CastError'].includes(error.name)?400:500;
 res.status(status).json({message:status===500?'Server operation failed. Check the database connection.':error.code===11000?'A record with this unique value already exists.':error.message});
});
export {app};
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) app.listen(process.env.PORT||3000,()=>console.log('API running on port '+(process.env.PORT||3000)));
