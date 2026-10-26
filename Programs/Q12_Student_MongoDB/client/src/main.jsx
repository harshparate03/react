import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
const fields = ["name", "email", "mobile", "course", "city"];
const labels = {name:'Student Name', email:'Email', mobile:'Mobile Number', course:'Course', city:'City', department:'Department', salary:'Salary', bookId:'Book ID',bookName:'Book Name',authorName:'Author Name',publication:'Publication',price:'Price',category:'Category',quantity:'Quantity',rating:'Rating',comments:'Comments',address:'Address',available:'Availability Status'};
const empty = Object.fromEntries(fields.map(key=>[key,key==='available'?'Available':'']));
async function request(path, options) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
function App(){
 const [form,setForm]=useState({...empty}), [records,setRecords]=useState([]), [message,setMessage]=useState(''), [editing,setEditing]=useState(null), [busy,setBusy]=useState(false);
 const endpoint = "/api/students";
 const load=async()=>{try{setRecords(await request(endpoint));}catch(error){setMessage(error.message);}};
 useEffect(()=>{if(false) load();},[]);
 async function submit(event){
  event.preventDefault();
  if(fields.some(key=>!String(form[key]).trim())){setMessage('Please fill in every field.');return;}
  setBusy(true);setMessage('');
  try {
   let saved={...form,id:crypto.randomUUID()};
   if(endpoint) saved=await request(endpoint+(editing?'/'+editing:''),{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
   if(false) await load(); else setRecords(previous=>[...previous,saved]);
   setMessage('Details saved successfully.');setEditing(null);
   if(true) setForm({...empty});
  }catch(error){setMessage(error.message);}finally{setBusy(false);}
 }
 async function remove(record){try{if(endpoint) await request(endpoint+'/'+record._id,{method:'DELETE'});setRecords(previous=>previous.filter(item=>item!==record));setMessage('Record removed.');}catch(error){setMessage(error.message);}}
 async function availability(record){try{await request(endpoint+'/'+record._id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...record,available:record.available==='Available'?'Issued':'Available'})});await load();setMessage('Availability updated.');}catch(error){setMessage(error.message);}}
 return <main><h1>Student MongoDB</h1><form onSubmit={submit}>
 {fields.map(key=><label key={key}>{labels[key]}{key==='available'?<select value={form[key]} onChange={event=>setForm({...form,[key]:event.target.value})}><option>Available</option><option>Issued</option></select>:<input required name={key} value={form[key]} type={key==='email'?'email':['price','salary','quantity','rating'].includes(key)?'number':key==='mobile'?'tel':'text'} min={['price','salary'].includes(key)?'0.01':'1'} max={key==='rating'?'5':undefined} step={['price','salary'].includes(key)?'0.01':'1'} pattern={key==='mobile'?'[0-9]{10}':key==='email'?undefined:'.*\\S.*'} title={key==='mobile'?'Enter exactly 10 digits':'Enter a non-blank value'} onChange={event=>setForm({...form,[key]:event.target.value})}/>}</label>)}
 <div><button disabled={busy}>{busy?'Saving...':editing?'Update':'Submit'}</button><button type="button" onClick={()=>{setForm({...empty});setEditing(null);setMessage('');}}>Clear Form</button></div></form>
 {message&&<p className="message" role="status">{message}</p>}
 {records.length>0&&<table><thead><tr>{fields.map(key=><th key={key}>{labels[key]}</th>)}{false&&<th>Actions</th>}</tr></thead><tbody>{records.map(record=><tr key={record._id||record.id}>{fields.map(key=><td key={key}>{String(record[key])}</td>)}{false&&<td>{false&&<button onClick={()=>{setForm(Object.fromEntries(fields.map(key=>[key,record[key]])));setEditing(record._id);}}>Edit</button>}{false&&<button onClick={()=>availability(record)}>Toggle availability</button>}<button onClick={()=>remove(record)}>Remove</button></td>}</tr>)}</tbody></table>}
 </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
