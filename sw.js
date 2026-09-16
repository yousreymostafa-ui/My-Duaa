const CACHE='my-duaa-v20';
const ASSETS=['./','./index.html','./styles.css','./app.js','./v16.js','./v17.js','./v18.js','./v19.js','./v20.js','./manifest.json','./logo.svg','./app-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));const wins=await self.clients.matchAll({type:'window'});await Promise.all(wins.map(c=>c.navigate(c.url).catch(()=>null)))} )()));
async function combinedApp(req){
  const cache=await caches.open(CACHE);
  let base,p16,p17,p18,p19,p20;
  try{base=await fetch(req,{cache:'no-store'})}catch{base=await cache.match('./app.js')}
  try{p16=await fetch('./v16.js',{cache:'no-store'})}catch{p16=await cache.match('./v16.js')}
  try{p17=await fetch('./v17.js',{cache:'no-store'})}catch{p17=await cache.match('./v17.js')}
  try{p18=await fetch('./v18.js',{cache:'no-store'})}catch{p18=await cache.match('./v18.js')}
  try{p19=await fetch('./v19.js',{cache:'no-store'})}catch{p19=await cache.match('./v19.js')}
  try{p20=await fetch('./v20.js',{cache:'no-store'})}catch{p20=await cache.match('./v20.js')}
  if(!base)return new Response('',{status:503});
  const baseText=await base.text();
  const p16Text=p16?await p16.text():'';
  const p17Text=p17?await p17.text():'';
  const p18Text=p18?await p18.text():'';
  const p19Text=p19?await p19.text():'';
  const p20Text=p20?await p20.text():'';
  return new Response(baseText+'\n'+p16Text+'\n'+p17Text+'\n'+p18Text+'\n'+p19Text+'\n'+p20Text,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}});
}
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/app.js')){e.respondWith(combinedApp(e.request));return}
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res})))
});
