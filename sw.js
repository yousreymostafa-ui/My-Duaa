const CACHE='my-duaa-v7';
const ASSETS=['./','./index.html','./manifest.json'];

const PATCH_STYLE=`<style id="my-duaa-v7-patch">
html:not([data-theme="dark"]){--card:#fffdfa;--card-alt:#fffdfa}
html:not([data-theme="dark"]) .dua-card,
html:not([data-theme="dark"]) .dua-card.alt,
html:not([data-theme="dark"]) .dua-card.style-soft,
html:not([data-theme="dark"]) .dua-card.style-glass{background:#fffdfa!important;backdrop-filter:none!important}
</style>`;

const PATCH_SCRIPT=`<script id="my-duaa-v7-script">
(()=>{
  const applyPatch=()=>{
    const size=document.getElementById('sizeRange');
    const line=document.getElementById('lineRange');
    if(size){size.min='12';size.max='40';size.step='1'}
    if(line){line.min='1.05';line.max='2.5';line.step='0.05'}
    try{
      settings.alternate=false;
      persistSettings();
      applyVisualSettings();
    }catch(e){}
    const alt=document.getElementById('alternateSwitch');
    if(alt){const box=alt.closest('.control');if(box)box.style.display='none'}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyPatch,{once:true});
  else applyPatch();
})();
<\/script>`;

async function patchHtml(response){
  const type=response.headers.get('content-type')||'';
  if(!type.includes('text/html'))return response;
  let html=await response.text();
  if(!html.includes('my-duaa-v7-patch'))html=html.replace('</head>',PATCH_STYLE+'</head>');
  if(!html.includes('my-duaa-v7-script'))html=html.replace('</body>',PATCH_SCRIPT+'</body>');
  const headers=new Headers(response.headers);
  headers.set('content-type','text/html; charset=utf-8');
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>e.waitUntil((async()=>{
  await self.clients.claim();
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  const windows=await self.clients.matchAll({type:'window'});
  await Promise.all(windows.map(c=>c.navigate(c.url).catch(()=>{})));
})()));

self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const r=await fetch(e.request);
        const raw=r.clone();
        caches.open(CACHE).then(c=>c.put('./index.html',raw)).catch(()=>{});
        return await patchHtml(r);
      }catch{
        const cached=await caches.match('./index.html');
        return cached?patchHtml(cached):Response.error();
      }
    })());
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const c=res.clone();
    caches.open(CACHE).then(x=>x.put(e.request,c)).catch(()=>{});
    return res;
  })));
});