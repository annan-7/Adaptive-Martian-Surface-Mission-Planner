
const byId=id=>document.getElementById(id);let startedAt=null;let sessionId=null;let participantWindow=null;let activeSession=null;const phases=[];
byId('launch').onclick=()=>{
 try {
  const url=new URL(byId('origin').value);
  if(!['http:','https:'].includes(url.protocol))throw new Error('Use an HTTP or HTTPS participant origin.');
  for(const field of ['condition','role','variant','time'])url.searchParams.set(field,byId(field).value);
  sessionId=crypto.randomUUID();
  url.searchParams.set('session',sessionId);
  url.searchParams.set('participant',byId('participant').value.slice(0,80));
  url.searchParams.set('facilitatorOrigin',location.origin);
  participantWindow=window.open(url.href,'_blank');
  if(!participantWindow)throw new Error('Popup blocked. Allow this local console to open the participant window.');
  startedAt=new Date().toISOString();
  activeSession={sessionId,startedAt,origin:url.origin,participant:byId('participant').value.slice(0,80),condition:byId('condition').value,role:byId('role').value,variant:byId('variant').value};
  phases.length=0;phases.push({at:startedAt,time:Number(byId('time').value)});
  byId('status').textContent='Session opened. Record real observations only.';
 }catch(error){byId('status').textContent=error.message}
};
byId('advance').onclick=()=>{
 if(!participantWindow||participantWindow.closed||!activeSession){byId('status').textContent='Open a participant session first.';return}
 const time=Number(byId('time').value);
 participantWindow.postMessage({type:'mars-compass:set-time',sessionId,time},activeSession.origin);
 phases.push({at:new Date().toISOString(),time});
 byId('status').textContent='Time command sent. Confirm the participant clock before continuing; no acknowledgment is inferred.';
};
document.querySelector('details').ontoggle=async e=>{if(e.target.open){try{const key=await fetch('./key.json').then(r=>r.json());byId('key').textContent=Object.entries(key).map(([k,v])=>k+'\n'+v).join('\n\n')}catch{byId('key').textContent='Serve facilitator directory with Python HTTP server; see README.'}}};
byId('export').onclick=()=>{
 const record={schemaVersion:'0.3',type:'real-user-entered-facilitator-record',...activeSession,exportedAt:new Date().toISOString(),phases,notes:byId('notes').value};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));a.download='mars-compass-facilitator.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);byId('status').textContent='Record exported. No automatic correctness or human outcome was inferred.';
};
