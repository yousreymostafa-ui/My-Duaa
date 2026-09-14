const DKEY='my_duaa_items_v1',SKEY='my_duaa_settings_v1';
const defaults={design:'classic',showTitles:true,fontSize:24,lineHeight:1.8,weight:'500',radius:28,padX:22,padY:24,gap:14};
const seed=[
  {id:uid(),title:'دعاء طلب الرزق',text:'اللهم ارزقني رزقًا حلالًا طيبًا، وبارك لي فيه، واكفني بفضلك عمّن سواك.',ref:'',icon:'leaf',shape:'wide',image:''},
  {id:uid(),title:'دعاء الطمأنينة',text:'اللهم اطمئن قلبي، وأزل عني كل هم وحزن، واجعلني في كنفك ورعايتك دائمًا.',ref:'',icon:'heart',shape:'wide',image:''},
  {id:uid(),title:'دعاء المغفرة',text:'رب اغفر لي ذنوبي كلها، دقها وجلها، أولها وآخرها، وما علمت منها وما لم أعلم.',ref:'',icon:'dome',shape:'wide',image:''}
];
let raw=load(DKEY,seed);
let duas=raw.map((d,i)=>({id:d.id||uid(),title:d.title||'',text:d.text||'',ref:d.ref||'',icon:d.icon||['leaf','heart','dome'][i%3],shape:d.shape==='square'?'square':'wide',image:d.image||''}));
let old=load(SKEY,{});
const legacyDesign=old.design||(old.theme==='dark'?'night':old.theme==='light'||old.theme==='system'?'classic':'classic');
let settings={...defaults,...old,design:legacyDesign,showTitles:old.showTitles??true,fontSize:old.fontSize??old.size??24,lineHeight:old.lineHeight??old.line??1.8,weight:String(old.weight??'500'),radius:old.radius??28,padX:old.padX??old.padding??22,padY:old.padY??old.padding??24,gap:old.gap??14};
let editingId=null,actionId=null,editorShape='wide',editorImage='';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

function injectV13Styles(){
  if(document.getElementById('v13-card-fixes'))return;
  const s=document.createElement('style');
  s.id='v13-card-fixes';
  s.textContent=`
    .card.square .dua{font-size:var(--fs)!important;line-height:var(--lh)!important;overflow:auto;flex:1;display:flex;align-items:center}
    .card.image-only{padding:0;overflow:hidden;position:relative}
    .card.wide.image-only .card-image{width:100%;height:auto;aspect-ratio:16/10;min-height:0;margin:0;border:0;border-radius:inherit;object-fit:cover}
    .card.square.image-only{padding:0;aspect-ratio:1/1}
    .card.square.image-only .card-image{width:100%;height:100%;min-height:0;margin:0;border:0;border-radius:inherit;object-fit:cover}
    .card.image-only .card-actions{position:absolute;left:10px;bottom:10px;margin:0;padding:7px 9px;border-radius:999px;background:rgba(0,0,0,.42);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:2}
    .card.image-only .action{color:#fff}
    .card.image-only .action-sep{background:rgba(255,255,255,.35)}
    @media(max-width:520px){.card.square .dua{font-size:var(--fs)!important;line-height:var(--lh)!important}}
  `;
  document.head.appendChild(s);
}

function setupEditorMessaging(){
  const hint=document.querySelector('#editorOverlay .hint');
  if(hint)hint.textContent='العنوان والنص اختياريان عند إضافة صورة. يمكن أن تكون البطاقة صورة فقط.';
  const area=$('#duaInput');
  if(area)area.placeholder='نص الدعاء — اختياري إذا أضفت صورة';
}

function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function load(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch{return f}}
function persist(){localStorage.setItem(DKEY,JSON.stringify(duas))}
function persistSettings(){localStorage.setItem(SKEY,JSON.stringify(settings))}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function badge(t){if(t==='heart')return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/></svg>';if(t==='dome')return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 19h16v2H4zM6 18v-5.5c0-3.3 2.3-5.7 5-6.3V4.7a1 1 0 1 1 2 0v1.5c2.7.6 5 3 5 6.3V18H6Z"/></svg>';return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 14c0-5 4-8 11-8 0 7-3 11-8 11-2 0-3-.7-3-3Z"/><path d="M7 17c1-3 4-6 8-8"/></svg>'}
const copySvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="7" width="11" height="13" rx="2"/><path d="M5 16H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const moreSvg='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>';

function apply(){const r=document.documentElement;r.dataset.design=settings.design;r.classList.toggle('titles-off',!settings.showTitles);r.style.setProperty('--fs',settings.fontSize+'px');r.style.setProperty('--lh',settings.lineHeight);r.style.setProperty('--fw',settings.weight);r.style.setProperty('--radius',settings.radius+'px');r.style.setProperty('--px',settings.padX+'px');r.style.setProperty('--py',settings.padY+'px');r.style.setProperty('--gap',settings.gap+'px');$('#themeColor').content=['night','darkgold'].includes(settings.design)?'#0b151a':'#f6f1e9';sync();render()}

function render(){
  const n=duas.length;
  $('#count').textContent=n===1?'دعاء واحد':n+' أدعية';
  $('#list').innerHTML=duas.map(d=>{
    const hasText=!!String(d.text||'').trim();
    const showTitle=settings.showTitles&&!!d.title;
    const pureImage=!!d.image&&!hasText&&!showTitle&&!d.ref;
    const classes=`card ${d.shape==='square'?'square':'wide'}${showTitle?'':' no-title'}${pureImage?' image-only':''}`;
    const image=d.image?`<img class="card-image" src="${d.image}" alt="">`:'';
    const title=showTitle?`<div class="card-head"><div class="title-wrap"><div class="card-badge">${badge(d.icon)}</div><div class="card-title">${esc(d.title)}</div></div></div>`:'';
    const text=hasText?`<p class="dua">${esc(d.text)}</p>`:'';
    const ref=d.ref?`<div class="ref">${esc(d.ref)}</div>`:'';
    const copy=hasText?`<div class="action-sep"></div><button class="action" data-action="copy" aria-label="نسخ الدعاء">${copySvg}</button>`:'';
    return `<article class="${classes}" data-id="${d.id}">${image}${title}${text}${ref}<div class="card-actions"><button class="action action-more" data-action="menu" aria-label="خيارات الدعاء">${moreSvg}</button>${copy}</div></article>`;
  }).join('');
  $$('.card[data-id]').forEach(c=>c.onclick=async e=>{
    const a=e.target.closest('[data-action]')?.dataset.action;if(!a)return;e.stopPropagation();
    const id=c.dataset.id;
    if(a==='copy'){
      const d=duas.find(x=>x.id===id);
      if(!d?.text)return;
      try{await navigator.clipboard.writeText((settings.showTitles&&d.title?d.title+'\n':'')+d.text)}catch{}
      toast('تم النسخ');
    }else if(a==='menu')openActions(id);
  });
  renderPreview();
}

function renderPreview(){const p=$('#preview');if(!p)return;const showTitle=settings.showTitles;p.innerHTML=`<article class="card${showTitle?'':' no-title'}">${showTitle?`<div class="card-head"><div class="title-wrap"><div class="card-badge">${badge('leaf')}</div><div class="card-title">دعاء طلب الرزق</div></div></div>`:''}<p class="dua">اللهم ارزقني رزقًا حلالًا طيبًا، وبارك لي فيه، واكفني بفضلك عمّن سواك.</p><div class="card-actions"><button class="action action-more">${moreSvg}</button><div class="action-sep"></div><button class="action">${copySvg}</button></div></article>`}
function sync(){if(!$('#titleSwitch'))return;$('#titleSwitch').classList.toggle('on',settings.showTitles);[['fontRange','fontVal',settings.fontSize,'px'],['lineRange','lineVal',settings.lineHeight,''],['radiusRange','radiusVal',settings.radius,'px'],['padXRange','padXVal',settings.padX,'px'],['padYRange','padYVal',settings.padY,'px'],['gapRange','gapVal',settings.gap,'px']].forEach(([a,b,v,s])=>{const el=$('#'+a);if(el)el.value=v;const out=$('#'+b);if(out)out.textContent=(a==='lineRange'?Number(v).toFixed(2):v)+s});$$('#weightSeg .seg').forEach(x=>x.classList.toggle('active',x.dataset.value===String(settings.weight)));$$('#themeGallery .theme-option').forEach(x=>x.classList.toggle('active',x.dataset.themeValue===settings.design));renderPreview()}
function set(k,v){settings[k]=v;persistSettings();apply()}
function setEditorShape(shape){editorShape=shape==='square'?'square':'wide';$$('#cardShapeSeg .shape-choice').forEach(x=>x.classList.toggle('active',x.dataset.value===editorShape))}
function showEditorImage(data){editorImage=data||'';$('#imagePreview').hidden=!editorImage;$('#imageEmpty').hidden=!!editorImage;$('#removeImageBtn').hidden=!editorImage;if(editorImage)$('#imagePreview').src=editorImage;else $('#imagePreview').removeAttribute('src')}
function openEditor(id=null){editingId=id;const d=id?duas.find(x=>x.id===id):null;$('#editorTitle').textContent=d?'تعديل الدعاء':'إضافة دعاء';$('#titleInput').value=d?.title||'';$('#duaInput').value=d?.text||'';$('#refInput').value=d?.ref||'';setEditorShape(d?.shape||'wide');showEditorImage(d?.image||'');$('#editorOverlay').classList.add('show');setTimeout(()=>{if(d?.text||!d?.image)$('#duaInput').focus();else $('#imageDrop').focus()},80)}
function closeEditor(){editingId=null;editorImage='';$('#editorOverlay').classList.remove('show')}
function saveEditor(){const text=$('#duaInput').value.trim();if(!text&&!editorImage)return toast('أضف نص الدعاء أو صورة');const data={title:$('#titleInput').value.trim(),text,ref:$('#refInput').value.trim(),shape:editorShape,image:editorImage};if(editingId){const d=duas.find(x=>x.id===editingId);Object.assign(d,data)}else duas.push({id:uid(),icon:['leaf','heart','dome'][duas.length%3],...data});persist();closeEditor();render()}
function openActions(id){actionId=id;const d=duas.find(x=>x.id===id);$('#actionToggleShape').textContent=d?.shape==='square'?'تحويل إلى مستطيل':'تحويل إلى مربع';$('#actionOverlay').classList.add('show')}
function closeActions(){actionId=null;$('#actionOverlay').classList.remove('show')}
function moveBy(id,dir){const i=duas.findIndex(x=>x.id===id),j=i+dir;if(i<0||j<0||j>=duas.length)return;[duas[i],duas[j]]=[duas[j],duas[i]];persist();render();renderReorder()}
function moveEdge(id,toStart){const i=duas.findIndex(x=>x.id===id);if(i<0)return;const [d]=duas.splice(i,1);if(toStart)duas.unshift(d);else duas.push(d);persist();render();renderReorder()}
function toggleShape(id){const d=duas.find(x=>x.id===id);if(!d)return;d.shape=d.shape==='square'?'wide':'square';persist();render();toast(d.shape==='square'?'تم تحويل البطاقة إلى مربع':'تم تحويل البطاقة إلى مستطيل')}
function del(){duas=duas.filter(x=>x.id!==actionId);persist();closeActions();render()}
function renderReorder(){const box=$('#reorderList');if(!box)return;box.innerHTML=duas.map((d,i)=>`<div class="reorder-item" data-id="${d.id}"><div class="reorder-num">${i+1}</div><div class="reorder-text"><div class="reorder-title">${esc(d.title||'بدون عنوان')}</div><div class="reorder-dua">${esc(d.text||(d.image?'بطاقة صورة':'بدون نص'))}</div></div><div class="reorder-buttons"><button class="order-btn" data-order="top" title="الأول">⇤</button><button class="order-btn" data-order="up" title="أعلى">↑</button><button class="order-btn" data-order="down" title="أسفل">↓</button><button class="order-btn" data-order="bottom" title="الأخير">⇥</button></div></div>`).join('');$$('.reorder-item').forEach(row=>row.onclick=e=>{const act=e.target.closest('[data-order]')?.dataset.order;if(!act)return;const id=row.dataset.id;if(act==='up')moveBy(id,-1);if(act==='down')moveBy(id,1);if(act==='top')moveEdge(id,true);if(act==='bottom')moveEdge(id,false)})}
function openReorder(){renderReorder();$('#reorderOverlay').classList.add('show')}
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>x.classList.remove('show'),1300)}
async function imageFileToDataURL(file){if(!file||!file.type.startsWith('image/'))return null;const raw=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});return compressImage(raw)}
function compressImage(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>{const max=1200,scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.82))};img.onerror=()=>resolve(src);img.src=src})}
async function handleImageFile(file){const data=await imageFileToDataURL(file);if(data)showEditorImage(data)}
async function pasteImageFromClipboard(){try{if(!navigator.clipboard?.read)throw new Error('unsupported');const items=await navigator.clipboard.read();for(const item of items){const type=item.types.find(t=>t.startsWith('image/'));if(type){const blob=await item.getType(type);await handleImageFile(new File([blob],'pasted-image',{type}));return toast('تم لصق الصورة')}}toast('لا توجد صورة في الحافظة')}catch{toast('اضغط داخل مساحة الصورة ثم الصق الصورة')}}

$('#addBtn').onclick=()=>openEditor();$('#quickAddBtn').onclick=()=>openEditor();$('#settingsBtn').onclick=()=>{$('#settingsOverlay').classList.add('show');sync()};$('#reorderBtn').onclick=openReorder;
$('#closeEditor').onclick=$('#cancelEditor').onclick=closeEditor;$('#saveBtn').onclick=saveEditor;$('#closeSettings').onclick=()=>$('#settingsOverlay').classList.remove('show');$('#resetBtn').onclick=()=>{settings={...defaults};persistSettings();apply()};$('#titleSwitch').onclick=()=>set('showTitles',!settings.showTitles);
[['fontRange','fontSize'],['lineRange','lineHeight'],['radiusRange','radius'],['padXRange','padX'],['padYRange','padY'],['gapRange','gap']].forEach(([id,k])=>$('#'+id).oninput=e=>set(k,+e.target.value));$$('#weightSeg .seg').forEach(x=>x.onclick=()=>set('weight',x.dataset.value));$$('#themeGallery .theme-option').forEach(x=>x.onclick=()=>set('design',x.dataset.themeValue));$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===t));$$('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===t.dataset.tab))});
$$('#cardShapeSeg .shape-choice').forEach(x=>x.onclick=()=>setEditorShape(x.dataset.value));$('#chooseImageBtn').onclick=()=>$('#imageFile').click();$('#imageFile').onchange=e=>handleImageFile(e.target.files?.[0]);$('#pasteImageBtn').onclick=pasteImageFromClipboard;$('#removeImageBtn').onclick=()=>showEditorImage('');$('#imageDrop').onclick=()=>$('#imageFile').click();$('#imageDrop').addEventListener('paste',async e=>{for(const item of e.clipboardData?.items||[]){if(item.type.startsWith('image/')){e.preventDefault();await handleImageFile(item.getAsFile());toast('تم لصق الصورة');break}}});document.addEventListener('paste',async e=>{if(!$('#editorOverlay').classList.contains('show'))return;for(const item of e.clipboardData?.items||[]){if(item.type.startsWith('image/')){e.preventDefault();await handleImageFile(item.getAsFile());toast('تم لصق الصورة');break}}});
$('#actionEdit').onclick=()=>{const id=actionId;closeActions();openEditor(id)};$('#actionToggleShape').onclick=()=>{const id=actionId;closeActions();toggleShape(id)};$('#actionUp').onclick=()=>{const id=actionId;closeActions();moveBy(id,-1)};$('#actionDown').onclick=()=>{const id=actionId;closeActions();moveBy(id,1)};$('#actionTop').onclick=()=>{const id=actionId;closeActions();moveEdge(id,true)};$('#actionBottom').onclick=()=>{const id=actionId;closeActions();moveEdge(id,false)};$('#actionDelete').onclick=del;$('#actionClose').onclick=closeActions;
$('#reorderClose').onclick=$('#reorderDone').onclick=()=>$('#reorderOverlay').classList.remove('show');[['editorOverlay',closeEditor],['settingsOverlay',()=>$('#settingsOverlay').classList.remove('show')],['actionOverlay',closeActions],['reorderOverlay',()=>$('#reorderOverlay').classList.remove('show')]].forEach(([id,fn])=>$('#'+id).onclick=e=>{if(e.target.id===id)fn()});

injectV13Styles();
setupEditorMessaging();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
apply();
