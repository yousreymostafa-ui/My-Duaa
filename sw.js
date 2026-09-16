const CACHE='my-duaa-v22';
const ASSETS=['./','./index.html','./styles.css','./app.js','./v16.js','./v17.js','./v18.js','./v19.js','./v20.js','./v21.js','./v22.js','./manifest.json','./logo.svg','./app-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));const wins=await self.clients.matchAll({type:'window'});await Promise.all(wins.map(c=>c.navigate(c.url).catch(()=>null)))} )()));
async function combinedApp(req){
  const cache=await caches.open(CACHE);
  const files=['./v16.js','./v17.js','./v18.js','./v19.js','./v20.js','./v21.js','./v22.js'];
  let base;try{base=await fetch(req,{cache:'no-store'})}catch{base=await cache.match('./app.js')}
  if(!base)return new Response('',{status:503});
  const chunks=[await base.text()];
  for(const file of files){let r;try{r=await fetch(file,{cache:'no-store'})}catch{r=await cache.match(file)}if(r)chunks.push(await r.text())}
  return new Response(chunks.join('\n'),{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}});
}
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/app.js')){e.respondWith(combinedApp(e.request));return}
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res})))
});