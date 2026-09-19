const DKEY='my_duaa_items_v1', SKEY='my_duaa_settings_v1', LKEY='my_duaa_links_v1';
const defaults={design:'classic',showTitles:true,imageMenuOnTap:true,fontSize:24,lineHeight:1.8,weight:'500',radius:28,padX:22,padY:24,gap:14};
const seed=[{id:uid(),title:'دعاء طلب الرزق',text:'اللهم ارزقني رزقًا حلالًا طيبًا، وبارك لي فيه، واكفني بفضلك عمّن سواك.',ref:'',icon:'leaf',shape:'wide',image:'',imageFit:'cover'},{id:uid(),title:'دعاء الطمأنينة',text:'اللهم اطمئن قلبي، وأزل عني كل هم وحزن، واجعلني في كنفك ورعايتك دائمًا.',ref:'',icon:'heart',shape:'wide',image:'',imageFit:'cover'},{id:uid(),title:'دعاء المغفرة',text:'رب اغفر لي ذنوبي كلها، دقها وجلها، أولها وآخرها، وما علمت منها وما لم أعلم.',ref:'',icon:'dome',shape:'wide',image:'',imageFit:'cover'}];
let raw=load(DKEY,seed);
let duas=raw.map((d,i)=>({id:d.id||uid(),title:d.title||'',text:d.text||'',ref:d.ref||'',icon:d.icon||['leaf','heart','dome'][i%3],shape:d.shape==='square'?'square':'wide',image:d.image||'',imageFit:['fill','contain','cover'].includes(d.imageFit)?d.imageFit:'cover'}));
let old=load(SKEY,{});const legacyDesign=old.design||(old.theme==='dark'?'night':'classic');
let settings={...defaults,...old,design:legacyDesign,showTitles:old.showTitles??true,imageMenuOnTap:old.imageMenuOnTap??true,fontSize:old.fontSize??old.size??24,lineHeight:old.lineHeight??old.line??1.8,weight:String(old.weight??'500'),radius:old.radius??28,padX:old.padX??old.padding??22,padY:old.padY??old.padding??24,gap:old.gap??14};
let links=load(LKEY,[]).map(x=>({id:x.id||uid(),url:x.url||'',title:x.title||'',thumb:x.thumb||''}));
let editingId=null,actionId=null,editorShape='wide',editorImage='',editorImageFit='cover';let editingLinkId=null,linkActionId=null,linkEditorImage='';let readerItems=[],readerIndex=0;let duaaQuery='',linksQuery='';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function load(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch{return f}}
function persist(){localStorage.setItem(DKEY,JSON.stringify(duas))}function persistSettings(){localStorage.setItem(SKEY,JSON.stringify(settings))}function persistLinks(){localStorage.setItem(LKEY,JSON.stringify(links))}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function normalizeArabic(s=''){return String(s).toLowerCase().replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/ـ/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ة/g,'ه').trim()}
function badge(t){if(t==='heart')return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/></svg>';if(t==='dome')return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 19h16v2H4zM6 18v-5.5c0-3.3 2.3-5.7 5-6.3V4.7a1 1 0 1 1 2 0v1.5c2.7.6 5 3 5 6.3V18H6Z"/></svg>';return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 14c0-5 4-8 11-8 0 7-3 11-8 11-2 0-3-.7-3-3Z"/><path d="M7 17c1-3 4-6 8-8"/></svg>'}
const copySvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="7" width="11" height="13" rx="2"/><path d="M5 16H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',moreSvg='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>';
function apply(){const r=document.documentElement;r.dataset.design=settings.design;r.classList.toggle('titles-off',!settings.showTitles);r.style.setProperty('--fs',settings.fontSize+'px');r.style.setProperty('--lh',settings.lineHeight);r.style.setProperty('--fw',settings.weight);r.style.setProperty('--radius',settings.radius+'px');r.style.setProperty('--px',settings.padX+'px');r.style.setProperty('--py',settings.padY+'px');r.style.setProperty('--gap',settings.gap+'px');$('#themeColor').content=['night','darkgold'].includes(settings.design)?'#0b151a':'#f6f1e9';syncSettingsUI();render();renderLinks()}
function setSetting(k,v){settings[k]=v;persistSettings();apply()}
function filteredDuas(){const q=normalizeArabic(duaaQuery);if(!q)return duas;return duas.filter(d=>normalizeArabic(`${d.title} ${d.text} ${d.ref}`).includes(q))}
function cardMarkup(d){const showTitle=settings.showTitles&&!!d.title,imageOnly=!!d.image&&!d.text&&!showTitle&&!d.ref,hideMenu=imageOnly&&settings.imageMenuOnTap;return `<article class="card ${d.shape==='square'?'square':'wide'}${showTitle?'':' no-title'}${imageOnly?' image-only':''}${hideMenu?' hide-image-menu':''} fit-${d.imageFit}" data-id="${d.id}">${d.image?`<div class="card-image-wrap"><img class="card-image" src="${d.image}" alt=""></div>`:''}${showTitle?`<div class="card-head"><div class="title-wrap"><div class="card-badge">${badge(d.icon)}</div><div class="card-title">${esc(d.title)}</div></div></div>`:''}${d.text?`<p class="dua readable" data-reader-id="${d.id}">${esc(d.text)}</p>`:''}${d.ref?`<div class="ref">${esc(d.ref)}</div>`:''}<div class="card-actions"><button class="action action-more" data-action="menu" aria-label="خيارات الدعاء">${moreSvg}</button>${d.text?`<div class="action-sep"></div><button class="action" data-action="copy" aria-label="نسخ الدعاء">${copySvg}</button>`:''}</div></article>`}
function groupedDuaMarkup(items){let out='',i=0;while(i<items.length){const d=items[i];if(d.shape==='square'){const group=[d];if(items[i+1]?.shape==='square'){group.push(items[i+1]);i+=1}out+=`<div class="square-row${group.length===1?' single':''}">${group.map(cardMarkup).join('')}</div>`}else out+=cardMarkup(d);i+=1}return out}
function render(){const n=duas.length;$('#count').textContent=n===1?'دعاء واحد':n+' أدعية';const items=filteredDuas();$('#list').innerHTML=groupedDuaMarkup(items);$('#duaaEmpty').hidden=items.length>0;if(!items.length){$('#duaaEmpty').querySelector('strong').textContent=duaaQuery?'لا توجد نتائج':'لا توجد أدعية بعد';$('#duaaEmpty').querySelector('span').textContent=duaaQuery?'جرّب كلمة أخرى.':'أضف أول دعاء من زر الإضافة.'}$$('.card[data-id]').forEach(card=>card.addEventListener('click',async e=>{const action=e.target.closest('[data-action]')?.dataset.action,id=card.dataset.id;if(action){e.stopPropagation();if(action==='copy'){const d=duas.find(x=>x.id===id);if(!d)return;try{await navigator.clipboard.writeText((settings.showTitles&&d.title?d.title+'\n':'')+d.text)}catch{}toast('تم النسخ')}else if(action==='menu')openActions(id);return}const rt=e.target.closest('[data-reader-id]');if(rt){openReader(rt.dataset.readerId);return}if(card.classList.contains('image-only')&&settings.imageMenuOnTap)card.classList.toggle('actions-visible')}));renderPreview()}
function renderPreview(){const p=$('#preview');if(!p)return;const showTitle=settings.showTitles;p.innerHTML=`<article class="card${showTitle?'':' no-title'}">${showTitle?`<div class="card-head"><div class="title-wrap"><div class="card-badge">${badge('leaf')}</div><div class="card-title">دعاء طلب الرزق</div></div></div>`:''}<p class="dua">اللهم ارزقني رزقًا حلالًا طيبًا، وبارك لي فيه، واكفني بفضلك عمّن سواك.</p><div class="card-actions"><button class="action action-more">${moreSvg}</button><div class="action-sep"></div><button class="action">${copySvg}</button></div></article>`}
function toggleSearch(box,input){box.hidden=!box.hidden;if(!box.hidden)setTimeout(()=>input.focus(),30)}
$('#duaaSearchToggle').onclick=()=>toggleSearch($('#duaaSearchBox'),$('#duaaSearchInput'));$('#duaaSearchInput').oninput=e=>{duaaQuery=e.target.value;render()};$('#duaaSearchClear').onclick=()=>{$('#duaaSearchInput').value='';duaaQuery='';render();$('#duaaSearchInput').focus()};$('#linksSearchToggle').onclick=()=>toggleSearch($('#linksSearchBox'),$('#linksSearchInput'));$('#linksSearchInput').oninput=e=>{linksQuery=e.target.value;renderLinks()};$('#linksSearchClear').onclick=()=>{$('#linksSearchInput').value='';linksQuery='';renderLinks();$('#linksSearchInput').focus()};
function setEditorShape(shape){editorShape=shape==='square'?'square':'wide';$$('#cardShapeSeg .shape-choice').forEach(x=>x.classList.toggle('active',x.dataset.value===editorShape))}
function setEditorFit(fit){editorImageFit=['fill','contain','cover'].includes(fit)?fit:'cover';$$('#imageFitSeg .seg').forEach(x=>x.classList.toggle('active',x.dataset.fit===editorImageFit));if($('#imagePreview'))$('#imagePreview').style.objectFit=editorImageFit==='cover'?'cover':editorImageFit}
function showEditorImage(data){editorImage=data||'';$('#imagePreview').hidden=!editorImage;$('#imageEmpty').hidden=!!editorImage;$('#removeImageBtn').hidden=!editorImage;if(editorImage)$('#imagePreview').src=editorImage;else $('#imagePreview').removeAttribute('src');setEditorFit(editorImageFit)}
function openEditor(id=null){editingId=id;const d=id?duas.find(x=>x.id===id):null;$('#editorTitle').textContent=d?'تعديل الدعاء':'إضافة دعاء';$('#titleInput').value=d?.title||'';$('#duaInput').value=d?.text||'';$('#refInput').value=d?.ref||'';setEditorShape(d?.shape||'wide');editorImageFit=d?.imageFit||'cover';showEditorImage(d?.image||'');$('#editorOverlay').classList.add('show');setTimeout(()=>$('#duaInput').focus(),80)}
function closeEditor(){editingId=null;editorImage='';editorImageFit='cover';$('#editorOverlay').classList.remove('show')}
function saveEditor(){const text=$('#duaInput').value.trim(),title=$('#titleInput').value.trim(),ref=$('#refInput').value.trim();if(!text&&!editorImage)return toast('أضف نص الدعاء أو صورة');const data={title,text,ref,shape:editorShape,image:editorImage,imageFit:editorImageFit};if(editingId){const d=duas.find(x=>x.id===editingId);if(d)Object.assign(d,data)}else duas.push({id:uid(),icon:['leaf','heart','dome'][duas.length%3],...data});persist();closeEditor();render()}
function openActions(id){actionId=id;const d=duas.find(x=>x.id===id);$('#actionToggleShape').textContent=d?.shape==='square'?'تحويل إلى مستطيل':'تحويل إلى مربع';$('#actionOverlay').classList.add('show')}function closeActions(){actionId=null;$('#actionOverlay').classList.remove('show')}
function moveBy(id,dir){const i=duas.findIndex(x=>x.id===id),j=i+dir;if(i<0||j<0||j>=duas.length)return;[duas[i],duas[j]]=[duas[j],duas[i]];persist();render();renderReorder()}
function moveEdge(id,toStart){const i=duas.findIndex(x=>x.id===id);if(i<0)return;const[d]=duas.splice(i,1);if(toStart)duas.unshift(d);else duas.push(d);persist();render();renderReorder()}
function toggleShape(id){const d=duas.find(x=>x.id===id);if(!d)return;d.shape=d.shape==='square'?'wide':'square';persist();render();toast(d.shape==='square'?'تم تحويل البطاقة إلى مربع':'تم تحويل البطاقة إلى مستطيل')}
function deleteDua(){duas=duas.filter(x=>x.id!==actionId);persist();closeActions();render()}
function renderReorder(){const box=$('#reorderList');if(!box)return;box.innerHTML=duas.map((d,i)=>`<div class="reorder-item" data-id="${d.id}"><button class="drag-handle" type="button" aria-label="اسحب لإعادة الترتيب">⠿</button><div class="reorder-text"><div class="reorder-title">${esc(d.title||'بدون عنوان')}</div><div class="reorder-dua">${esc(d.text||'بطاقة صورة')}</div></div><div class="reorder-buttons"><button class="order-btn" data-order="top" title="الأول">⇤</button><button class="order-btn" data-order="up" title="أعلى">↑</button><button class="order-btn" data-order="down" title="أسفل">↓</button><button class="order-btn" data-order="bottom" title="الأخير">⇥</button></div></div>`).join('');$$('.reorder-item').forEach(row=>{row.onclick=e=>{const act=e.target.closest('[data-order]')?.dataset.order;if(!act)return;const id=row.dataset.id;if(act==='up')moveBy(id,-1);if(act==='down')moveBy(id,1);if(act==='top')moveEdge(id,true);if(act==='bottom')moveEdge(id,false)};bindLongPressDrag(row)})}
function persistOrderFromDOM(){const ids=$$('#reorderList .reorder-item').map(x=>x.dataset.id),map=new Map(duas.map(d=>[d.id,d]));duas=ids.map(id=>map.get(id)).filter(Boolean);persist();render()}
function bindLongPressDrag(row){let timer=null,dragging=false,startY=0,pointerId=null;const cancel=()=>{if(timer){clearTimeout(timer);timer=null}};row.addEventListener('pointerdown',e=>{if(e.target.closest('[data-order]'))return;startY=e.clientY;pointerId=e.pointerId;timer=setTimeout(()=>{dragging=true;row.classList.add('dragging');try{row.setPointerCapture(pointerId)}catch{}if(navigator.vibrate)navigator.vibrate(18)},300)});row.addEventListener('pointermove',e=>{if(!dragging){if(Math.abs(e.clientY-startY)>8)cancel();return}e.preventDefault();const list=$('#reorderList'),others=[...list.querySelectorAll('.reorder-item:not(.dragging)')];let before=null;for(const el of others){const r=el.getBoundingClientRect();if(e.clientY<r.top+r.height/2){before=el;break}}if(before)list.insertBefore(row,before);else list.appendChild(row)});const finish=()=>{cancel();if(dragging){dragging=false;row.classList.remove('dragging');try{row.releasePointerCapture(pointerId)}catch{}persistOrderFromDOM()}};row.addEventListener('pointerup',finish);row.addEventListener('pointercancel',finish);row.addEventListener('pointerleave',()=>{if(!dragging)cancel()});row.oncontextmenu=e=>e.preventDefault()}
function openReorder(){renderReorder();$('#settingsOverlay').classList.remove('show');$('#reorderOverlay').classList.add('show')}
function readableDuas(){const current=filteredDuas().filter(d=>d.text);return current.length?current:duas.filter(d=>d.text)}
function openReader(id){readerItems=readableDuas();readerIndex=Math.max(0,readerItems.findIndex(d=>d.id===id));if(!readerItems.length)return;updateReader();$('#reader').classList.add('show');$('#reader').setAttribute('aria-hidden','false');document.body.classList.add('reader-open')}
function closeReader(){$('#reader').classList.remove('show');$('#reader').setAttribute('aria-hidden','true');document.body.classList.remove('reader-open')}
function updateReader(){const d=readerItems[readerIndex];if(!d)return;$('#readerCount').textContent=`${readerIndex+1} / ${readerItems.length}`;$('#readerTitle').textContent=settings.showTitles?d.title:'';$('#readerText').textContent=d.text||'';$('#readerRef').textContent=d.ref||'';const img=$('#readerImage');img.hidden=!d.image;if(d.image){img.src=d.image;img.style.objectFit=d.imageFit==='cover'?'contain':d.imageFit}}
function readerStep(dir){if(!readerItems.length)return;readerIndex=(readerIndex+dir+readerItems.length)%readerItems.length;updateReader()}
let readerStartX=0,readerStartY=0;$('#readerStage').addEventListener('touchstart',e=>{const t=e.changedTouches[0];readerStartX=t.clientX;readerStartY=t.clientY},{passive:true});$('#readerStage').addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-readerStartX,dy=t.clientY-readerStartY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2)readerStep(dx<0?1:-1)},{passive:true});let pointerStart=null;$('#readerStage').addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')pointerStart=e.clientX});$('#readerStage').addEventListener('pointerup',e=>{if(pointerStart===null)return;const dx=e.clientX-pointerStart;pointerStart=null;if(Math.abs(dx)>70)readerStep(dx<0?1:-1)});
async function imageFileToDataURL(file){if(!file||!file.type.startsWith('image/'))return null;const raw=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});return compressImage(raw)}
function compressImage(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>{const max=1400,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.84))};img.onerror=()=>resolve(src);img.src=src})}
async function handleImageFile(file){const data=await imageFileToDataURL(file);if(data)showEditorImage(data)}
async function pasteImageFromClipboard(target='duaa'){try{if(!navigator.clipboard?.read)throw new Error('unsupported');const items=await navigator.clipboard.read();for(const item of items){const type=item.types.find(t=>t.startsWith('image/'));if(type){const blob=await item.getType(type),data=await imageFileToDataURL(new File([blob],'pasted-image',{type}));if(data){if(target==='link')showLinkEditorImage(data);else showEditorImage(data);toast('تم لصق الصورة');return}}}toast('لا توجد صورة في الحافظة')}catch{toast('انسخ صورة ثم استخدم زر لصق صورة')}}
function showScreen(name){$('#duaaScreen').classList.toggle('active',name==='duaa');$('#linksScreen').classList.toggle('active',name==='links');window.scrollTo({top:0,behavior:'instant'});if(name==='links')renderLinks()}
function normalizeUrl(url){let s=(url||'').trim();if(!/^https?:\/\//i.test(s))s='https://'+s;try{return new URL(s).href}catch{return ''}}
function domainOf(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return url}}
function filteredLinks(){const q=normalizeArabic(linksQuery);if(!q)return links;return links.filter(l=>normalizeArabic(`${l.title} ${domainOf(l.url)} ${l.url}`).includes(q))}
function autoThumbUrl(url){return `https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent(url)}`}
function renderLinks(){const n=links.length;$('#linksCount').textContent=n===1?'رابط واحد':n+' روابط';const items=filteredLinks();$('#linksEmpty').hidden=items.length>0;if(!items.length){$('#linksEmpty').querySelector('strong').textContent=linksQuery?'لا توجد نتائج':'لا توجد روابط بعد';$('#linksEmpty').querySelector('span').textContent=linksQuery?'جرّب كلمة أخرى.':'أضف رابطًا أو الصقه من الحافظة.'}$('#linksList').innerHTML=items.map(l=>{const src=l.thumb||autoThumbUrl(l.url),auto=!l.thumb;return `<article class="link-card" data-link-id="${l.id}"><img class="link-thumb${auto?' contain':''}" src="${esc(src)}" alt=""><div class="link-body"><div class="link-title">${esc(l.title||domainOf(l.url))}</div><div class="link-domain">${esc(domainOf(l.url))}</div></div><button class="link-menu" data-link-action="menu" aria-label="خيارات الرابط">…</button></article>`}).join('');$$('.link-thumb').forEach(img=>img.onerror=()=>{const card=img.closest('.link-card'),l=links.find(x=>x.id===card?.dataset.linkId),fallback=document.createElement('div');fallback.className='link-thumb fallback';fallback.textContent=(l?.title||domainOf(l?.url||'')||'ر').trim().charAt(0).toUpperCase();fallback.style.display='grid';fallback.style.placeItems='center';fallback.style.fontSize='28px';fallback.style.fontWeight='800';fallback.style.color='var(--accent)';img.replaceWith(fallback)});$$('.link-card').forEach(card=>bindLinkCard(card))}
function bindLinkCard(card){let timer=null,longPressed=false,startX=0,startY=0;card.addEventListener('pointerdown',e=>{if(e.target.closest('[data-link-action]'))return;longPressed=false;startX=e.clientX;startY=e.clientY;timer=setTimeout(()=>{longPressed=true;card.classList.add('long-press');openLinkActions(card.dataset.linkId);setTimeout(()=>card.classList.remove('long-press'),180);if(navigator.vibrate)navigator.vibrate(15)},480)});card.addEventListener('pointermove',e=>{if(timer&&(Math.abs(e.clientX-startX)>9||Math.abs(e.clientY-startY)>9)){clearTimeout(timer);timer=null}});card.addEventListener('pointerup',()=>{if(timer){clearTimeout(timer);timer=null}});card.addEventListener('pointercancel',()=>{if(timer){clearTimeout(timer);timer=null}});card.oncontextmenu=e=>e.preventDefault();card.addEventListener('click',e=>{const act=e.target.closest('[data-link-action]')?.dataset.linkAction;if(act){e.stopPropagation();openLinkActions(card.dataset.linkId);return}if(longPressed){longPressed=false;return}const l=links.find(x=>x.id===card.dataset.linkId);if(l)window.open(l.url,'_blank','noopener')})}
function showLinkEditorImage(data){linkEditorImage=data||'';$('#linkImagePreview').hidden=!linkEditorImage;$('#linkImageEmpty').hidden=!!linkEditorImage;$('#removeLinkImageBtn').hidden=!linkEditorImage;if(linkEditorImage)$('#linkImagePreview').src=linkEditorImage;else $('#linkImagePreview').removeAttribute('src')}
function openLinkEditor(id=null,prefillUrl=''){editingLinkId=id;const l=id?links.find(x=>x.id===id):null;$('#linkEditorTitle').textContent=l?'تعديل الرابط':'إضافة رابط';$('#linkUrlInput').value=l?.url||prefillUrl||'';$('#linkTitleInput').value=l?.title||'';$('#linkThumbUrlInput').value=l?.thumb&&/^https?:/i.test(l.thumb)?l.thumb:'';showLinkEditorImage(l?.thumb&&!/^https?:/i.test(l.thumb)?l.thumb:'');$('#linkEditorOverlay').classList.add('show');setTimeout(()=>$('#linkUrlInput').focus(),80)}
function closeLinkEditor(){editingLinkId=null;linkEditorImage='';$('#linkEditorOverlay').classList.remove('show')}
function saveLink(){const url=normalizeUrl($('#linkUrlInput').value);if(!url)return toast('أدخل رابطًا صحيحًا');const title=$('#linkTitleInput').value.trim(),thumbUrl=$('#linkThumbUrlInput').value.trim(),thumb=linkEditorImage||(normalizeUrl(thumbUrl)||''),data={url,title,thumb};if(editingLinkId){const l=links.find(x=>x.id===editingLinkId);if(l)Object.assign(l,data)}else links.push({id:uid(),...data});persistLinks();closeLinkEditor();renderLinks()}
function openLinkActions(id){linkActionId=id;$('#linkActionOverlay').classList.add('show')}function closeLinkActions(){linkActionId=null;$('#linkActionOverlay').classList.remove('show')}function deleteLink(){links=links.filter(x=>x.id!==linkActionId);persistLinks();closeLinkActions();renderLinks()}
async function pasteLink(){try{const text=await navigator.clipboard.readText(),url=normalizeUrl(text);if(!url)return toast('لا يوجد رابط صالح في الحافظة');openLinkEditor(null,url)}catch{toast('تعذّر قراءة الحافظة')}}
function syncSettingsUI(){if(!$('#titleSwitch'))return;$('#titleSwitch').classList.toggle('on',settings.showTitles);$('#imageMenuSwitch').classList.toggle('on',settings.imageMenuOnTap);[['fontRange','fontVal',settings.fontSize,'px'],['lineRange','lineVal',settings.lineHeight,''],['radiusRange','radiusVal',settings.radius,'px'],['padXRange','padXVal',settings.padX,'px'],['padYRange','padYVal',settings.padY,'px'],['gapRange','gapVal',settings.gap,'px']].forEach(([a,b,v,s])=>{const el=$('#'+a);if(el)el.value=v;const out=$('#'+b);if(out)out.textContent=(a==='lineRange'?Number(v).toFixed(2):v)+s});$$('#weightSeg .seg').forEach(x=>x.classList.toggle('active',x.dataset.value===String(settings.weight)));$$('#themeGallery .theme-option').forEach(x=>x.classList.toggle('active',x.dataset.themeValue===settings.design));renderPreview()}
$('#addBtn').onclick=()=>openEditor();$('#quickAddBtn').onclick=()=>openEditor();$('#settingsBtn').onclick=()=>{$('#settingsOverlay').classList.add('show');syncSettingsUI()};$('#linksBtn').onclick=()=>showScreen('links');$('#backToDuaaBtn').onclick=()=>showScreen('duaa');$('#closeEditor').onclick=$('#cancelEditor').onclick=closeEditor;$('#saveBtn').onclick=saveEditor;$$('#cardShapeSeg .shape-choice').forEach(x=>x.onclick=()=>setEditorShape(x.dataset.value));$$('#imageFitSeg .seg').forEach(x=>x.onclick=()=>setEditorFit(x.dataset.fit));$('#chooseImageBtn').onclick=()=>$('#imageFile').click();$('#imageFile').onchange=e=>handleImageFile(e.target.files?.[0]);$('#pasteImageBtn').onclick=()=>pasteImageFromClipboard('duaa');$('#removeImageBtn').onclick=()=>showEditorImage('');$('#imageDrop').onclick=()=>$('#imageFile').click();$('#closeSettings').onclick=()=>$('#settingsOverlay').classList.remove('show');$('#resetBtn').onclick=()=>{settings={...defaults};persistSettings();apply()};$('#titleSwitch').onclick=()=>setSetting('showTitles',!settings.showTitles);$('#imageMenuSwitch').onclick=()=>setSetting('imageMenuOnTap',!settings.imageMenuOnTap);$('#openReorderBtn').onclick=openReorder;[['fontRange','fontSize'],['lineRange','lineHeight'],['radiusRange','radius'],['padXRange','padX'],['padYRange','padY'],['gapRange','gap']].forEach(([id,k])=>$('#'+id).oninput=e=>setSetting(k,+e.target.value));$$('#weightSeg .seg').forEach(x=>x.onclick=()=>setSetting('weight',x.dataset.value));$$('#themeGallery .theme-option').forEach(x=>x.onclick=()=>setSetting('design',x.dataset.themeValue));$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===t));$$('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===t.dataset.tab))});$('#actionEdit').onclick=()=>{const id=actionId;closeActions();openEditor(id)};$('#actionToggleShape').onclick=()=>{const id=actionId;closeActions();toggleShape(id)};$('#actionUp').onclick=()=>{const id=actionId;closeActions();moveBy(id,-1)};$('#actionDown').onclick=()=>{const id=actionId;closeActions();moveBy(id,1)};$('#actionTop').onclick=()=>{const id=actionId;closeActions();moveEdge(id,true)};$('#actionBottom').onclick=()=>{const id=actionId;closeActions();moveEdge(id,false)};$('#actionDelete').onclick=deleteDua;$('#actionClose').onclick=closeActions;$('#reorderClose').onclick=$('#reorderDone').onclick=()=>$('#reorderOverlay').classList.remove('show');$('#quickAddLinkBtn').onclick=$('#addLinkBtn').onclick=()=>openLinkEditor();$('#pasteLinkBtn').onclick=pasteLink;$('#closeLinkEditor').onclick=$('#cancelLinkEditor').onclick=closeLinkEditor;$('#saveLinkBtn').onclick=saveLink;$('#chooseLinkImageBtn').onclick=()=>$('#linkImageFile').click();$('#linkImageFile').onchange=async e=>{const data=await imageFileToDataURL(e.target.files?.[0]);if(data)showLinkEditorImage(data)};$('#pasteLinkImageBtn').onclick=()=>pasteImageFromClipboard('link');$('#removeLinkImageBtn').onclick=()=>showLinkEditorImage('');$('#linkImageDrop').onclick=()=>$('#linkImageFile').click();$('#linkActionOpen').onclick=()=>{const l=links.find(x=>x.id===linkActionId);if(l)window.open(l.url,'_blank','noopener');closeLinkActions()};$('#linkActionEdit').onclick=()=>{const id=linkActionId;closeLinkActions();openLinkEditor(id)};$('#linkActionDelete').onclick=deleteLink;$('#linkActionClose').onclick=closeLinkActions;$('#readerClose').onclick=closeReader;document.addEventListener('keydown',e=>{if($('#reader').classList.contains('show')){if(e.key==='Escape')closeReader();if(e.key==='ArrowLeft')readerStep(1);if(e.key==='ArrowRight')readerStep(-1)}});$('#imageDrop').addEventListener('paste',async e=>{for(const item of e.clipboardData?.items||[]){if(item.type.startsWith('image/')){e.preventDefault();await handleImageFile(item.getAsFile());toast('تم لصق الصورة');break}}});$('#linkImageDrop').addEventListener('paste',async e=>{for(const item of e.clipboardData?.items||[]){if(item.type.startsWith('image/')){e.preventDefault();const data=await imageFileToDataURL(item.getAsFile());if(data)showLinkEditorImage(data);toast('تم لصق الصورة');break}}});[['editorOverlay',closeEditor],['linkEditorOverlay',closeLinkEditor],['settingsOverlay',()=>$('#settingsOverlay').classList.remove('show')],['actionOverlay',closeActions],['linkActionOverlay',closeLinkActions],['reorderOverlay',()=>$('#reorderOverlay').classList.remove('show')]].forEach(([id,fn])=>$('#'+id).onclick=e=>{if(e.target.id===id)fn()});
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>x.classList.remove('show'),1300)}
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));apply();

/* My-Duaa v16 layout + media reader patch */

/* Preserve the new half-width shape across reloads. */
try{
  duas=raw.map((d,i)=>({
    id:d.id||uid(),title:d.title||'',text:d.text||'',ref:d.ref||'',
    icon:d.icon||['leaf','heart','dome'][i%3],
    shape:d.shape==='square'?'square':(d.shape==='half'?'half':'wide'),
    image:d.image||'',imageFit:['fill','contain','cover'].includes(d.imageFit)?d.imageFit:'cover'
  }));
}catch{}

function cardMarkup(d){
  const showTitle=settings.showTitles&&!!d.title;
  const imageOnly=!!d.image&&!d.text&&!showTitle&&!d.ref;
  const hideMenu=imageOnly&&settings.imageMenuOnTap;
  const shapeClass=d.shape==='square'?'square':(d.shape==='half'?'half':'wide');
  return `<article class="card ${shapeClass}${showTitle?'':' no-title'}${imageOnly?' image-only':''}${hideMenu?' hide-image-menu':''} fit-${d.imageFit}" data-id="${d.id}" data-reader-id="${d.id}">
    ${d.image?`<div class="card-image-wrap reader-trigger"><img class="card-image" src="${d.image}" alt=""></div>`:''}
    ${showTitle?`<div class="card-head"><div class="title-wrap"><div class="card-badge">${badge(d.icon)}</div><div class="card-title">${esc(d.title)}</div></div></div>`:''}
    ${d.text?`<p class="dua readable reader-trigger">${esc(d.text)}</p>`:''}
    ${d.ref?`<div class="ref">${esc(d.ref)}</div>`:''}
    <div class="card-actions"><button class="action action-more" data-action="menu" aria-label="خيارات الدعاء">${moreSvg}</button>${d.text?`<div class="action-sep"></div><button class="action" data-action="copy" aria-label="نسخ الدعاء">${copySvg}</button>`:''}</div>
  </article>`;
}
function v16HalfWidth(d){return d.shape==='square'||d.shape==='half'}
function groupedDuaMarkup(items){
  let out='',i=0;
  while(i<items.length){
    const d=items[i];
    if(v16HalfWidth(d)){
      const pair=[d];
      if(items[i+1]&&v16HalfWidth(items[i+1])){pair.push(items[i+1]);i++}
      out+=`<div class="compact-row${pair.length===1?' single':''}">${pair.map(cardMarkup).join('')}</div>`;
    }else out+=cardMarkup(d);
    i++;
  }
  return out;
}
function render(){
  const n=duas.length;$('#count').textContent=n===1?'دعاء واحد':n+' أدعية';
  const items=filteredDuas();$('#list').innerHTML=groupedDuaMarkup(items);$('#duaaEmpty').hidden=items.length>0;
  if(!items.length){$('#duaaEmpty').querySelector('strong').textContent=duaaQuery?'لا توجد نتائج':'لا توجد أدعية بعد';$('#duaaEmpty').querySelector('span').textContent=duaaQuery?'جرّب كلمة أخرى.':'أضف أول دعاء من زر الإضافة.'}
  $$('.card[data-id]').forEach(card=>{
    card.addEventListener('click',async e=>{
      const action=e.target.closest('[data-action]')?.dataset.action,id=card.dataset.id;
      if(action){e.stopPropagation();if(action==='copy'){const d=duas.find(x=>x.id===id);if(!d)return;try{await navigator.clipboard.writeText((settings.showTitles&&d.title?d.title+'\n':'')+d.text)}catch{}toast('تم النسخ')}else if(action==='menu')openActions(id);return}
      if(e.target.closest('.reader-trigger')||card.classList.contains('image-only')){openReader(id);return}
    });
    if(card.classList.contains('image-only')&&settings.imageMenuOnTap){
      let timer=null,held=false;
      const clear=()=>{clearTimeout(timer);timer=null};
      card.addEventListener('pointerdown',e=>{if(e.target.closest('[data-action]'))return;held=false;clear();timer=setTimeout(()=>{held=true;card.classList.toggle('actions-visible');navigator.vibrate?.(12)},520)});
      card.addEventListener('pointerup',clear);card.addEventListener('pointercancel',clear);card.addEventListener('pointerleave',clear);
      card.addEventListener('click',e=>{if(held){e.preventDefault();e.stopImmediatePropagation();held=false}},true);
    }
  });
  renderPreview();
}
function setEditorShape(shape){
  editorShape=['wide','square','half'].includes(shape)?shape:'wide';
  $$('#cardShapeSeg .shape-choice').forEach(x=>x.classList.toggle('active',x.dataset.value===editorShape));
}
function v16NextShape(shape){return shape==='wide'?'square':shape==='square'?'half':'wide'}
function v16ShapeName(shape){return shape==='square'?'مربع':shape==='half'?'نصف مستطيل':'مستطيل'}
function openActions(id){
  actionId=id;const d=duas.find(x=>x.id===id),next=v16NextShape(d?.shape||'wide');
  $('#actionToggleShape').textContent='الشكل التالي: '+v16ShapeName(next);$('#actionOverlay').classList.add('show');
}
function toggleShape(id){
  const d=duas.find(x=>x.id===id);if(!d)return;d.shape=v16NextShape(d.shape||'wide');persist();render();toast('تم تغيير البطاقة إلى '+v16ShapeName(d.shape));
}
function readableDuas(){
  const current=filteredDuas().filter(d=>d.text||d.image);
  return current.length?current:duas.filter(d=>d.text||d.image);
}
function updateReader(){
  const d=readerItems[readerIndex];if(!d)return;
  $('#readerCount').textContent=`${readerIndex+1} / ${readerItems.length}`;
  $('#readerTitle').textContent=settings.showTitles?d.title:'';
  const text=$('#readerText');text.textContent=d.text||'';text.hidden=!d.text;
  $('#readerRef').textContent=d.ref||'';
  const img=$('#readerImage');img.hidden=!d.image;if(d.image){img.src=d.image;img.style.objectFit=d.imageFit||'cover'}
  document.querySelector('.reader-card')?.classList.toggle('image-only-reader',!!d.image&&!d.text);
}

(function v16Init(){
  const shapeSeg=$('#cardShapeSeg');
  if(shapeSeg&&!shapeSeg.querySelector('[data-value="half"]')){
    const b=document.createElement('button');b.className='shape-choice';b.dataset.value='half';
    b.innerHTML='<span class="shape-preview half-rectangle"></span><strong>نصف مستطيل</strong><small>نصف العرض · ارتفاع تلقائي</small>';
    b.onclick=()=>setEditorShape('half');shapeSeg.appendChild(b);
  }
  const style=document.createElement('style');style.id='v16-layout';style.textContent=`
    .square-row{display:none!important}
    .compact-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--gap);direction:rtl;align-items:start}
    .compact-row.single .card{grid-column:1/2}
    .card{height:auto;align-self:start}
    .card.wide{height:auto}
    .card.half{height:auto;display:flex;flex-direction:column}
    .card.square .dua,.card.half .dua{font-size:var(--fs)!important;line-height:var(--lh)!important;font-weight:var(--fw)!important}
    .card.half .card-head{margin-bottom:6px}.card.half .card-badge{width:34px;height:34px}.card.half .card-badge svg{width:17px;height:17px}.card.half .card-title{font-size:12px}.card.half .ref{font-size:10px;margin-top:4px}.card.half .card-actions{margin-top:6px}
    .card.half .card-image-wrap{height:120px;margin-bottom:8px;border-radius:16px}
    .card.image-only.half{min-height:0;height:auto;aspect-ratio:4/3}
    .shape-options{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
    .shape-preview.half-rectangle{width:28px;height:38px}
    .reader-text[hidden]{display:none!important}
    .reader-image{max-height:55vh}
    .reader-card.image-only-reader{padding:14px;min-height:68vh}
    .reader-card.image-only-reader .reader-image{max-height:72vh;height:100%;margin:0}
    @media(max-width:520px){.shape-choice{min-height:88px;padding:7px 4px}.shape-choice strong{font-size:12px}.shape-choice small{font-size:9px}}
  `;document.head.appendChild(style);
  apply();
})();


/* My-Duaa v17 — Option 5 centered header */
(function(){
  const screen=document.querySelector('#duaaScreen');
  const oldHeader=screen?.querySelector('.header');
  const tools=screen?.querySelector('.duaa-tools');
  const hero=screen?.querySelector('.hero');
  if(!screen||!oldHeader||!tools)return;

  const brand=oldHeader.querySelector('.brand');
  const settings=document.querySelector('#settingsBtn');
  const links=document.querySelector('#linksBtn');
  const add=document.querySelector('#quickAddBtn');
  const search=document.querySelector('#duaaSearchToggle');
  const searchBox=document.querySelector('#duaaSearchBox');
  if(!brand||!settings||!links||!add||!search||!searchBox)return;

  const style=document.createElement('style');
  style.id='v17-option5-style';
  style.textContent=`
    .v17-top{position:relative;overflow:hidden;margin:0 0 18px;border-radius:0 0 34px 34px;padding:20px 12px 18px;background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 86%,var(--bg)),color-mix(in srgb,var(--bg) 78%,var(--surface)));isolation:isolate}
    .v17-top:before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(circle at 76% 26%,color-mix(in srgb,var(--gold) 14%,transparent),transparent 24%),radial-gradient(circle at 16% 20%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 26%)}
    .v17-top:after{content:"";position:absolute;z-index:-1;left:0;right:0;bottom:92px;height:150px;opacity:.10;background-repeat:no-repeat;background-position:center bottom;background-size:cover;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 220'%3E%3Cg fill='%23a98c59'%3E%3Cpath d='M0 205h900v15H0z'/%3E%3Cpath d='M315 205v-70c0-46 32-78 78-92 46 14 78 46 78 92v70h-28v-64c0-28-20-52-50-63-30 11-50 35-50 63v64z'/%3E%3Cpath d='M362 205v-36h62v36z'/%3E%3Cpath d='M540 205v-95h34v95zM552 110V48h10v62zM557 48c-8-12-9-23 0-34 9 11 8 22 0 34z'/%3E%3Cpath d='M224 205v-72h28v72zM234 133V82h8v51zM238 82c-7-10-7-19 0-28 7 9 7 18 0 28z'/%3E%3Cpath d='M92 205c12-42 29-68 51-78-9 27-9 52 0 78h-18c-5-20-5-39 0-57-9 14-16 33-20 57zM807 205c-10-38-25-62-45-73 8 25 8 49 0 73h17c4-18 4-36 0-53 8 13 14 31 18 53z'/%3E%3Ccircle cx='690' cy='80' r='23' opacity='.45'/%3E%3C/g%3E%3C/svg%3E")}
    .v17-brand{display:grid;place-items:center;text-align:center;position:relative;z-index:2}
    .v17-brand .brand-row{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
    .v17-brand .brand-logo{width:64px;height:76px;object-fit:contain;margin:0 auto 1px;filter:drop-shadow(0 5px 12px color-mix(in srgb,var(--gold) 13%,transparent))}
    .v17-brand h1{font-size:43px;line-height:1.05;margin:0;color:color-mix(in srgb,var(--text) 86%,var(--accent));letter-spacing:-1.1px}
    .v17-brand .count{font-size:17px;margin-top:6px;color:var(--gold)}
    .v17-brand .tagline{margin:14px 0 4px;font-size:17px;color:color-mix(in srgb,var(--text) 63%,var(--muted));text-align:center}
    .v17-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:17px;padding-top:16px;border-top:1px solid color-mix(in srgb,var(--gold) 24%,var(--line));position:relative;z-index:3}
    .v17-action{display:grid;place-items:center;gap:7px;min-width:0}
    .v17-action .icon,.v17-action .small-tool{width:58px;height:58px;border-radius:50%;border:1px solid color-mix(in srgb,var(--line) 78%,transparent);background:color-mix(in srgb,var(--surface) 88%,transparent);color:var(--text);display:grid;place-items:center;box-shadow:0 8px 20px color-mix(in srgb,var(--text) 7%,transparent);font-size:22px;padding:0}
    .v17-action .icon svg,.v17-action .small-tool svg{width:25px;height:25px}
    .v17-action.add-action .icon{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 9px 22px color-mix(in srgb,var(--accent) 24%,transparent);font-size:31px;font-weight:300}
    .v17-label{font-size:12px;font-weight:750;color:color-mix(in srgb,var(--text) 78%,var(--muted));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    .v17-action.add-action .v17-label{color:var(--accent);font-weight:850}
    .v17-search-wrap{position:relative;z-index:4;margin:13px auto 0;width:min(560px,100%)}
    .v17-search-wrap[hidden]{display:none!important}
    .v17-search-wrap.search-box{display:flex;width:min(560px,100%);padding:5px;border:1px solid var(--line);border-radius:18px;background:color-mix(in srgb,var(--surface) 92%,transparent);box-shadow:0 7px 20px color-mix(in srgb,var(--text) 6%,transparent)}
    .v17-search-wrap input{min-width:0;width:100%;height:42px;border:0;background:transparent;color:var(--text);outline:0;padding:0 12px;text-align:right}
    .v17-search-wrap .search-clear{width:40px;height:40px;border:0;border-radius:12px;background:var(--surface2);color:var(--muted);font-size:22px}
    #duaaScreen>.hero,#duaaScreen>.duaa-tools,#duaaScreen>.header{display:none!important}
    @media(max-width:520px){
      .v17-top{margin-left:-2px;margin-right:-2px;padding:17px 8px 15px;border-radius:0 0 29px 29px}
      .v17-top:after{height:125px;bottom:86px}
      .v17-brand .brand-logo{width:57px;height:68px}
      .v17-brand h1{font-size:39px}
      .v17-brand .count{font-size:15px}
      .v17-brand .tagline{font-size:15px;margin-top:12px}
      .v17-actions{gap:3px;margin-top:14px;padding-top:14px}
      .v17-action .icon,.v17-action .small-tool{width:52px;height:52px}
      .v17-label{font-size:11px}
    }
    @media(max-width:370px){
      .v17-action .icon,.v17-action .small-tool{width:48px;height:48px}
      .v17-label{font-size:10px}
      .v17-brand h1{font-size:36px}
    }
  `;
  document.head.appendChild(style);

  const top=document.createElement('section');
  top.className='v17-top';

  brand.classList.add('v17-brand');
  top.appendChild(brand);

  const actions=document.createElement('div');
  actions.className='v17-actions';
  const specs=[
    [add,'إضافة','add-action'],
    [links,'روابطي',''],
    [search,'بحث',''],
    [settings,'إعدادات النص','']
  ];
  specs.forEach(([button,label,extra])=>{
    const wrap=document.createElement('div');
    wrap.className='v17-action '+extra;
    wrap.appendChild(button);
    const text=document.createElement('span');
    text.className='v17-label';
    text.textContent=label;
    wrap.appendChild(text);
    actions.appendChild(wrap);
  });
  top.appendChild(actions);
  searchBox.classList.add('v17-search-wrap');
  top.appendChild(searchBox);

  const list=screen.querySelector('#list');
  screen.insertBefore(top,list);
  oldHeader.remove();
  tools.remove();
  hero?.remove();
})();


/* My-Duaa v18 — private notes per Duaa */

/* Preserve notes on existing items without changing anything shown on home cards. */
try{
  const sourceById=new Map((raw||[]).map(x=>[x.id,x]));
  duas=duas.map((d,i)=>({
    ...d,
    notes:d.notes??sourceById.get(d.id)?.notes??raw?.[i]?.notes??''
  }));
}catch{}

function openEditor(id=null){
  editingId=id;
  const d=id?duas.find(x=>x.id===id):null;
  $('#editorTitle').textContent=d?'تعديل الدعاء':'إضافة دعاء';
  $('#titleInput').value=d?.title||'';
  $('#duaInput').value=d?.text||'';
  $('#refInput').value=d?.ref||'';
  if($('#notesInput'))$('#notesInput').value=d?.notes||'';
  setEditorShape(d?.shape||'wide');
  editorImageFit=d?.imageFit||'cover';
  showEditorImage(d?.image||'');
  $('#editorOverlay').classList.add('show');
  setTimeout(()=>$('#duaInput').focus(),80);
}

function saveEditor(){
  const text=$('#duaInput').value.trim();
  const title=$('#titleInput').value.trim();
  const ref=$('#refInput').value.trim();
  const notes=$('#notesInput')?.value.trim()||'';
  if(!text&&!editorImage)return toast('أضف نص الدعاء أو صورة');
  const data={title,text,ref,notes,shape:editorShape,image:editorImage,imageFit:editorImageFit};
  if(editingId){
    const d=duas.find(x=>x.id===editingId);
    if(d)Object.assign(d,data);
  }else{
    duas.push({id:uid(),icon:['leaf','heart','dome'][duas.length%3],...data});
  }
  persist();closeEditor();render();
}

function updateReader(){
  const d=readerItems[readerIndex];if(!d)return;
  $('#readerCount').textContent=`${readerIndex+1} / ${readerItems.length}`;
  $('#readerTitle').textContent=settings.showTitles?d.title:'';
  const text=$('#readerText');text.textContent=d.text||'';text.hidden=!d.text;
  $('#readerRef').textContent=d.ref||'';
  const img=$('#readerImage');img.hidden=!d.image;if(d.image){img.src=d.image;img.style.objectFit=d.imageFit||'cover'}
  document.querySelector('.reader-card')?.classList.toggle('image-only-reader',!!d.image&&!d.text);
  const wrap=$('#readerNotesWrap'),body=$('#readerNotes');
  if(wrap&&body){body.textContent=d.notes||'';wrap.hidden=!d.notes}
}

(function v18Init(){
  const ref=$('#refInput');
  if(ref&&!$('#notesInput')){
    const section=document.createElement('div');
    section.className='editor-section v18-notes-section';
    section.innerHTML=`
      <div class="section-title">ملاحظات <span class="optional">خاصة · لا تظهر في الصفحة الرئيسية</span></div>
      <textarea class="notes-editor" id="notesInput" placeholder="اكتب أي ملاحظات خاصة بهذا الدعاء…"></textarea>
    `;
    ref.insertAdjacentElement('afterend',section);
  }

  const readerRef=$('#readerRef');
  if(readerRef&&!$('#readerNotesWrap')){
    const wrap=document.createElement('section');
    wrap.id='readerNotesWrap';
    wrap.className='reader-notes-wrap';
    wrap.hidden=true;
    wrap.innerHTML='<div class="reader-notes-label">ملاحظات</div><div class="reader-notes" id="readerNotes"></div>';
    readerRef.insertAdjacentElement('afterend',wrap);
  }

  const style=document.createElement('style');
  style.id='v18-notes-style';
  style.textContent=`
    .v18-notes-section{margin-top:10px}
    .notes-editor{width:100%;min-height:112px;resize:vertical;border-radius:18px;border:1px solid var(--line);background:var(--surface2);color:var(--text);padding:14px 15px;outline:none;font-size:15px;line-height:1.7;text-align:right;direction:rtl}
    .notes-editor:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}
    .reader-notes-wrap{width:100%;margin-top:18px;padding:14px 15px;border:1px solid color-mix(in srgb,var(--gold) 30%,var(--line));border-radius:18px;background:color-mix(in srgb,var(--gold) 6%,var(--surface2));text-align:right;direction:rtl}
    .reader-notes-wrap[hidden]{display:none!important}
    .reader-notes-label{font-size:12px;font-weight:850;color:var(--gold);margin-bottom:7px}
    .reader-notes{font-size:15px;line-height:1.75;color:color-mix(in srgb,var(--text) 78%,var(--muted));white-space:pre-wrap}
  `;
  document.head.appendChild(style);

  /* Ensure existing items gain the notes property in memory. */
  duas=duas.map(d=>({...d,notes:d.notes||''}));
})();


/* My-Duaa v19 — standalone Notes section */
(function(){
  const NKEY='my_duaa_standalone_notes_v1';
  const loadNotes=()=>{try{return JSON.parse(localStorage.getItem(NKEY)||'[]')}catch{return []}};
  const saveNotes=()=>localStorage.setItem(NKEY,JSON.stringify(notes));
  const makeId=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
  const html=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  let notes=loadNotes().map(n=>({id:n.id||makeId(),title:n.title||'',body:n.body||'',updatedAt:n.updatedAt||Date.now()}));
  let editingNoteId=null;

  const app=document.querySelector('.app');
  const duaaScreen=document.querySelector('#duaaScreen');
  const linksScreen=document.querySelector('#linksScreen');
  const actions=document.querySelector('.v17-actions');
  if(!app||!duaaScreen||!actions)return;

  const style=document.createElement('style');
  style.id='v19-notes-style';
  style.textContent=`
    .v17-actions{grid-template-columns:repeat(5,minmax(0,1fr))!important}
    .v19-notes-action .icon{color:var(--gold)}
    .notes-screen{padding-bottom:10px}
    .notes-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 5px 16px}
    .notes-head-title{display:flex;align-items:center;gap:11px}
    .notes-head-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:color-mix(in srgb,var(--gold) 10%,var(--surface));border:1px solid color-mix(in srgb,var(--gold) 24%,var(--line));color:var(--gold)}
    .notes-head-icon svg{width:24px;height:24px}
    .notes-head h1{margin:0;font-size:31px;color:color-mix(in srgb,var(--text) 86%,var(--accent))}
    .notes-count{color:var(--muted);font-size:13px;margin-top:3px}
    .notes-head-actions{display:flex;gap:8px;direction:ltr}
    .notes-list{display:grid;gap:11px}
    .note-card{background:var(--surface);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow);padding:16px 17px;text-align:right;direction:rtl;position:relative}
    .note-card-title{font-size:16px;font-weight:850;color:var(--gold);margin:0 0 7px;padding-left:72px}
    .note-card-body{font-size:15px;line-height:1.75;color:var(--text);white-space:pre-wrap;overflow-wrap:anywhere}
    .note-card-actions{position:absolute;left:11px;top:10px;display:flex;gap:4px;direction:ltr}
    .note-mini{width:34px;height:34px;border:0;border-radius:11px;background:var(--surface2);color:var(--muted);display:grid;place-items:center}
    .note-mini svg{width:17px;height:17px}
    .note-mini.delete{color:#b45d56}
    .notes-empty{padding:85px 20px;text-align:center;color:var(--muted);display:grid;gap:8px;place-items:center}
    .notes-empty[hidden]{display:none!important}
    .notes-empty svg{width:42px;height:42px;color:var(--gold)}
    .notes-empty strong{font-size:18px;color:var(--text)}
    .note-editor-text{width:100%;min-height:220px;resize:vertical;border-radius:18px;border:1px solid var(--line);background:var(--surface2);color:var(--text);padding:15px;outline:none;font-size:16px;line-height:1.8;text-align:right;direction:rtl;margin-top:9px}
    .note-editor-text:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}
    @media(max-width:520px){
      .v17-actions{gap:2px!important}
      .v17-action .icon,.v17-action .small-tool{width:47px!important;height:47px!important}
      .v17-action .icon svg,.v17-action .small-tool svg{width:22px!important;height:22px!important}
      .v17-label{font-size:9.5px!important}
      .notes-head h1{font-size:28px}
    }
    @media(max-width:370px){
      .v17-action .icon,.v17-action .small-tool{width:43px!important;height:43px!important}
      .v17-label{font-size:9px!important}
    }
  `;
  document.head.appendChild(style);

  const notesBtn=document.createElement('button');
  notesBtn.className='icon';
  notesBtn.id='notesBtn';
  notesBtn.setAttribute('aria-label','ملاحظات');
  notesBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15.5 3.5V7H19M9 11h7M9 15h7"/></svg>';
  const notesAction=document.createElement('div');
  notesAction.className='v17-action v19-notes-action';
  notesAction.appendChild(notesBtn);
  const notesLabel=document.createElement('span');
  notesLabel.className='v17-label';
  notesLabel.textContent='ملاحظات';
  notesAction.appendChild(notesLabel);
  const searchWrap=[...actions.children].find(x=>x.textContent.includes('بحث'));
  if(searchWrap)actions.insertBefore(notesAction,searchWrap);else actions.appendChild(notesAction);

  const notesScreen=document.createElement('section');
  notesScreen.className='screen notes-screen';
  notesScreen.id='notesScreen';
  notesScreen.innerHTML=`
    <header class="notes-head">
      <div class="notes-head-title">
        <div class="notes-head-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15.5 3.5V7H19M9 11h7M9 15h7"/></svg></div>
        <div><h1>ملاحظاتي</h1><div class="notes-count" id="notesCount"></div></div>
      </div>
      <div class="notes-head-actions">
        <button class="icon" id="backFromNotes" aria-label="العودة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M19 12H5m0 0 6-6m-6 6 6 6"/></svg></button>
        <button class="icon" id="quickAddNote" aria-label="إضافة ملاحظة">＋</button>
      </div>
    </header>
    <section class="notes-list" id="notesList"></section>
    <div class="notes-empty" id="notesEmpty" hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15.5 3.5V7H19M9 11h7M9 15h5"/></svg>
      <strong>لا توجد ملاحظات بعد</strong><span>أضف أي فكرة أو تذكير تريد الاحتفاظ به.</span>
    </div>
    <button class="add" id="addNoteBtn">إضافة ملاحظة ＋</button>`;
  app.appendChild(notesScreen);

  const overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.id='noteEditorOverlay';
  overlay.innerHTML=`<section class="sheet editor-sheet"><div class="handle"></div><div class="sheet-head"><h2 id="noteEditorTitle">إضافة ملاحظة</h2><button class="close" id="closeNoteEditor">×</button></div><input class="field" id="noteTitleInput" placeholder="عنوان اختياري"><textarea class="note-editor-text" id="noteBodyInput" placeholder="اكتب ملاحظتك هنا…"></textarea><div class="form-actions"><button class="primary" id="saveNoteBtn">حفظ</button><button class="secondary" id="cancelNoteEditor">إلغاء</button></div></section>`;
  document.body.appendChild(overlay);

  function renderNotes(){
    const list=document.querySelector('#notesList'),empty=document.querySelector('#notesEmpty'),count=document.querySelector('#notesCount');
    if(!list)return;
    count.textContent=notes.length===1?'ملاحظة واحدة':notes.length+' ملاحظات';
    empty.hidden=notes.length>0;
    list.innerHTML=notes.map(n=>`<article class="note-card" data-note-id="${n.id}"><div class="note-card-actions"><button class="note-mini" data-note-action="edit" aria-label="تعديل"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/></svg></button><button class="note-mini delete" data-note-action="delete" aria-label="حذف"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13"/></svg></button></div>${n.title?`<div class="note-card-title">${html(n.title)}</div>`:''}<div class="note-card-body">${html(n.body)}</div></article>`).join('');
    list.querySelectorAll('.note-card').forEach(card=>card.addEventListener('click',e=>{
      const act=e.target.closest('[data-note-action]')?.dataset.noteAction,id=card.dataset.noteId;
      if(act==='delete'){e.stopPropagation();notes=notes.filter(n=>n.id!==id);saveNotes();renderNotes();return}
      openNoteEditor(id);
    }));
  }

  function showNotes(){
    duaaScreen.classList.remove('active');linksScreen?.classList.remove('active');notesScreen.classList.add('active');renderNotes();window.scrollTo({top:0,behavior:'instant'});
  }
  function hideNotes(){notesScreen.classList.remove('active');duaaScreen.classList.add('active');window.scrollTo({top:0,behavior:'instant'})}
  function openNoteEditor(id=null){
    editingNoteId=id;const n=id?notes.find(x=>x.id===id):null;
    document.querySelector('#noteEditorTitle').textContent=n?'تعديل الملاحظة':'إضافة ملاحظة';
    document.querySelector('#noteTitleInput').value=n?.title||'';
    document.querySelector('#noteBodyInput').value=n?.body||'';
    overlay.classList.add('show');setTimeout(()=>document.querySelector('#noteBodyInput').focus(),60);
  }
  function closeNoteEditor(){editingNoteId=null;overlay.classList.remove('show')}
  function saveNote(){
    const title=document.querySelector('#noteTitleInput').value.trim(),body=document.querySelector('#noteBodyInput').value.trim();
    if(!body){if(typeof toast==='function')toast('اكتب الملاحظة أولًا');return}
    if(editingNoteId){const n=notes.find(x=>x.id===editingNoteId);if(n)Object.assign(n,{title,body,updatedAt:Date.now()})}
    else notes.unshift({id:makeId(),title,body,updatedAt:Date.now()});
    saveNotes();closeNoteEditor();renderNotes();
  }

  notesBtn.onclick=showNotes;
  notesScreen.querySelector('#backFromNotes').onclick=hideNotes;
  notesScreen.querySelector('#quickAddNote').onclick=()=>openNoteEditor();
  notesScreen.querySelector('#addNoteBtn').onclick=()=>openNoteEditor();
  overlay.querySelector('#closeNoteEditor').onclick=closeNoteEditor;
  overlay.querySelector('#cancelNoteEditor').onclick=closeNoteEditor;
  overlay.querySelector('#saveNoteBtn').onclick=saveNote;
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeNoteEditor()});
  renderNotes();
})();


/* My-Duaa v20 — Option 6 gradient header + note card action polish */
(function(){
  const style=document.createElement('style');
  style.id='v20-gradient-header';
  style.textContent=`
    /* Reduce the dead space below the iPhone/browser status area */
    .app{padding-top:env(safe-area-inset-top)!important}

    /* Option 6 — soft gradient top */
    .v17-top{
      margin-top:0!important;
      margin-bottom:14px!important;
      padding:4px 12px 14px!important;
      border-radius:0 0 32px 32px!important;
      background:
        radial-gradient(circle at 14% 18%,color-mix(in srgb,var(--gold) 18%,transparent),transparent 24%),
        radial-gradient(circle at 88% 24%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 28%),
        linear-gradient(145deg,color-mix(in srgb,var(--surface) 91%,#f0d3a7 9%),color-mix(in srgb,var(--bg) 83%,var(--gold) 17%))!important;
      box-shadow:0 10px 28px color-mix(in srgb,var(--text) 5%,transparent);
    }
    .v17-top:before{
      background:
        radial-gradient(circle at 12% 18%,color-mix(in srgb,var(--gold) 16%,transparent),transparent 22%),
        radial-gradient(circle at 86% 16%,color-mix(in srgb,var(--surface) 58%,transparent),transparent 24%)!important;
      opacity:.9;
    }
    .v17-top:after{
      height:126px!important;
      bottom:72px!important;
      opacity:.13!important;
      background-position:center bottom!important;
      background-size:cover!important;
    }
    .v17-brand{padding-top:0!important}
    .v17-brand .brand-row{gap:1px!important}
    .v17-brand .brand-logo{
      width:50px!important;
      height:58px!important;
      margin:0 auto!important;
    }
    .v17-brand h1{
      font-size:38px!important;
      line-height:1!important;
      letter-spacing:-.8px!important;
    }
    .v17-brand .count{
      margin-top:5px!important;
      font-size:15px!important;
    }
    .v17-brand .tagline{
      margin:10px 0 2px!important;
      font-size:15px!important;
      line-height:1.45!important;
    }
    .v17-actions{
      margin:12px -12px -14px!important;
      padding:12px 8px 11px!important;
      gap:4px!important;
      border-top:1px solid color-mix(in srgb,var(--gold) 20%,var(--line))!important;
      border-radius:0 0 32px 32px;
      background:color-mix(in srgb,var(--surface) 88%,transparent);
      backdrop-filter:blur(12px);
      -webkit-backdrop-filter:blur(12px);
    }
    .v17-action{gap:5px!important}
    .v17-action .icon,.v17-action .small-tool{
      width:49px!important;
      height:49px!important;
      box-shadow:0 6px 16px color-mix(in srgb,var(--text) 6%,transparent)!important;
    }
    .v17-action .icon svg,.v17-action .small-tool svg{width:22px!important;height:22px!important}
    .v17-label{font-size:10px!important;font-weight:780!important}
    .v17-search-wrap{margin:23px auto 0!important}

    /* Standalone notes: move edit/delete actions to the bottom of the card */
    .note-card{padding:16px 17px 13px!important}
    .note-card-title{padding-left:0!important}
    .note-card-actions{
      position:static!important;
      width:100%!important;
      margin-top:13px!important;
      padding-top:10px!important;
      border-top:1px solid var(--line)!important;
      display:flex!important;
      justify-content:flex-start!important;
      gap:6px!important;
      direction:ltr!important;
    }

    @media(max-width:520px){
      .v17-top{padding:2px 8px 12px!important;border-radius:0 0 28px 28px!important}
      .v17-top:after{height:112px!important;bottom:68px!important}
      .v17-brand .brand-logo{width:46px!important;height:54px!important}
      .v17-brand h1{font-size:36px!important}
      .v17-brand .count{font-size:14px!important}
      .v17-brand .tagline{font-size:14px!important;margin-top:9px!important}
      .v17-actions{margin:10px -8px -12px!important;padding:11px 5px 10px!important;border-radius:0 0 28px 28px!important}
      .v17-action .icon,.v17-action .small-tool{width:46px!important;height:46px!important}
      .v17-label{font-size:9.5px!important}
      .v17-search-wrap{margin-top:21px!important}
    }
    @media(max-width:370px){
      .v17-brand h1{font-size:34px!important}
      .v17-action .icon,.v17-action .small-tool{width:43px!important;height:43px!important}
      .v17-label{font-size:9px!important}
    }
  `;
  document.head.appendChild(style);
})();


/* My-Duaa v21 — selected calm arch design + per-card colors + first/last insertion */

/* Recover the new per-card property from persisted data, because older compatibility
   layers intentionally only mapped the fields they knew about. */
try{
  const persistedById=new Map((raw||[]).map(x=>[x.id,x]));
  duas=duas.map((d,i)=>({
    ...d,
    cardColor:d.cardColor||persistedById.get(d.id)?.cardColor||raw?.[i]?.cardColor||'default'
  }));
}catch{}

let editorCardColor='default';
let editorInsertPosition='last';

function v21SetCardColor(value){
  editorCardColor=['default','sage','sand','blush','blue','lavender'].includes(value)?value:'default';
  document.querySelectorAll('#cardColorPalette .v21-color-choice').forEach(btn=>{
    const active=btn.dataset.color===editorCardColor;
    btn.classList.toggle('active',active);
    btn.setAttribute('aria-pressed',active?'true':'false');
  });
}
function v21SetInsertPosition(value){
  editorInsertPosition=value==='first'?'first':'last';
  document.querySelectorAll('#insertPositionSeg .v21-position-choice').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.position===editorInsertPosition);
  });
}

/* Final card renderer for v21. It retains the v16 image/swipe behavior and adds
   a saved color class to each card. */
function cardMarkup(d){
  const showTitle=settings.showTitles&&!!d.title;
  const imageOnly=!!d.image&&!d.text&&!showTitle&&!d.ref;
  const hideMenu=imageOnly&&settings.imageMenuOnTap;
  const shapeClass=d.shape==='square'?'square':(d.shape==='half'?'half':'wide');
  const color=['sage','sand','blush','blue','lavender'].includes(d.cardColor)?d.cardColor:'default';
  return `<article class="card ${shapeClass} card-color-${color}${showTitle?'':' no-title'}${imageOnly?' image-only':''}${hideMenu?' hide-image-menu':''} fit-${d.imageFit}" data-id="${d.id}" data-reader-id="${d.id}">
    ${d.image?`<div class="card-image-wrap reader-trigger"><img class="card-image" src="${d.image}" alt=""></div>`:''}
    ${showTitle?`<div class="card-head"><div class="title-wrap"><div class="card-badge">${badge(d.icon)}</div><div class="card-title">${esc(d.title)}</div></div></div>`:''}
    ${d.text?`<p class="dua readable reader-trigger">${esc(d.text)}</p>`:''}
    ${d.ref?`<div class="ref">${esc(d.ref)}</div>`:''}
    <div class="card-actions"><button class="action action-more" data-action="menu" aria-label="خيارات الدعاء">${moreSvg}</button>${d.text?`<div class="action-sep"></div><button class="action" data-action="copy" aria-label="نسخ الدعاء">${copySvg}</button>`:''}</div>
  </article>`;
}

/* v18-compatible editor, extended with card color and insertion position. */
function openEditor(id=null){
  editingId=id;
  const d=id?duas.find(x=>x.id===id):null;
  $('#editorTitle').textContent=d?'تعديل الدعاء':'إضافة دعاء';
  $('#titleInput').value=d?.title||'';
  $('#duaInput').value=d?.text||'';
  $('#refInput').value=d?.ref||'';
  if($('#notesInput'))$('#notesInput').value=d?.notes||'';
  setEditorShape(d?.shape||'wide');
  editorImageFit=d?.imageFit||'cover';
  showEditorImage(d?.image||'');
  v21SetCardColor(d?.cardColor||'default');
  v21SetInsertPosition('last');
  const pos=document.querySelector('#v21InsertSection');
  if(pos)pos.hidden=!!d;
  $('#editorOverlay').classList.add('show');
  setTimeout(()=>$('#duaInput').focus(),80);
}

function saveEditor(){
  const text=$('#duaInput').value.trim();
  const title=$('#titleInput').value.trim();
  const ref=$('#refInput').value.trim();
  const notes=$('#notesInput')?.value.trim()||'';
  if(!text&&!editorImage)return toast('أضف نص الدعاء أو صورة');
  const data={title,text,ref,notes,shape:editorShape,image:editorImage,imageFit:editorImageFit,cardColor:editorCardColor};
  if(editingId){
    const d=duas.find(x=>x.id===editingId);
    if(d)Object.assign(d,data);
  }else{
    const item={id:uid(),icon:['leaf','heart','dome'][duas.length%3],...data};
    if(editorInsertPosition==='first')duas.unshift(item);else duas.push(item);
  }
  persist();closeEditor();render();
}

(function v21Init(){
  /* Add editor controls only once. */
  const shapeSection=document.querySelector('#cardShapeSeg')?.closest('.editor-section');
  if(shapeSection&&!document.querySelector('#v21CardColorSection')){
    const colorSection=document.createElement('div');
    colorSection.id='v21CardColorSection';
    colorSection.className='editor-section v21-card-color-section';
    colorSection.innerHTML=`
      <div class="section-title">لون البطاقة <span class="optional">اختياري</span></div>
      <div class="v21-color-palette" id="cardColorPalette">
        <button type="button" class="v21-color-choice active" data-color="default" aria-label="افتراضي"><span class="v21-swatch sw-default"></span><small>افتراضي</small></button>
        <button type="button" class="v21-color-choice" data-color="sage" aria-label="أخضر هادئ"><span class="v21-swatch sw-sage"></span><small>أخضر</small></button>
        <button type="button" class="v21-color-choice" data-color="sand" aria-label="رملي"><span class="v21-swatch sw-sand"></span><small>رملي</small></button>
        <button type="button" class="v21-color-choice" data-color="blush" aria-label="وردي هادئ"><span class="v21-swatch sw-blush"></span><small>وردي</small></button>
        <button type="button" class="v21-color-choice" data-color="blue" aria-label="أزرق هادئ"><span class="v21-swatch sw-blue"></span><small>أزرق</small></button>
        <button type="button" class="v21-color-choice" data-color="lavender" aria-label="بنفسجي هادئ"><span class="v21-swatch sw-lavender"></span><small>بنفسجي</small></button>
      </div>`;
    shapeSection.insertAdjacentElement('afterend',colorSection);
    colorSection.querySelectorAll('[data-color]').forEach(btn=>btn.addEventListener('click',()=>v21SetCardColor(btn.dataset.color)));

    const insertSection=document.createElement('div');
    insertSection.id='v21InsertSection';
    insertSection.className='editor-section';
    insertSection.innerHTML=`
      <div class="section-title">مكان الدعاء الجديد</div>
      <div class="v21-position-seg" id="insertPositionSeg">
        <button type="button" class="v21-position-choice" data-position="first"><strong>الأول</strong><small>يظهر أعلى القائمة</small></button>
        <button type="button" class="v21-position-choice active" data-position="last"><strong>الأخير</strong><small>يظهر أسفل القائمة</small></button>
      </div>`;
    colorSection.insertAdjacentElement('afterend',insertSection);
    insertSection.querySelectorAll('[data-position]').forEach(btn=>btn.addEventListener('click',()=>v21SetInsertPosition(btn.dataset.position)));
  }

  const style=document.createElement('style');
  style.id='v21-selected-design';
  style.textContent=`
    /* ---------- Selected home design ---------- */
    :root{--v21-cream:#faf7ef;--v21-gold:#af9255;--v21-green:#556b58}
    body{background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 93%,#ede4d5),var(--bg))}
    .app{max-width:760px}
    .v17-top{
      overflow:visible!important;
      position:relative!important;
      margin:0 0 18px!important;
      padding:10px 10px 0!important;
      border-radius:0!important;
      background:
        radial-gradient(circle at 50% 4%,rgba(255,255,255,.95),rgba(255,255,255,.30) 30%,transparent 56%),
        linear-gradient(180deg,#fbf8f0 0%,#f5efe2 100%)!important;
      box-shadow:none!important;
      isolation:isolate;
    }
    .v17-top:before{
      content:""!important;
      position:absolute!important;
      z-index:-2!important;
      inset:0!important;
      opacity:.72!important;
      background:
        linear-gradient(90deg,transparent 0 8%,rgba(174,146,84,.05) 8% 9%,transparent 9% 91%,rgba(174,146,84,.05) 91% 92%,transparent 92%),
        radial-gradient(ellipse at 50% 18%,rgba(255,255,255,.9),transparent 44%)!important;
    }
    .v17-top:after{
      content:""!important;
      position:absolute!important;
      z-index:-1!important;
      left:0!important;right:0!important;bottom:118px!important;
      height:220px!important;
      opacity:.105!important;
      background-position:center bottom!important;
      background-size:cover!important;
      background-repeat:no-repeat!important;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 290'%3E%3Cg fill='%23ad9158'%3E%3Cpath d='M0 279h900v11H0z'/%3E%3Cpath d='M260 279v-65c0-58 37-101 91-119 54 18 91 61 91 119v65h-24v-58c0-42-25-75-67-91-42 16-67 49-67 91v58z'/%3E%3Cpath d='M327 279v-52h48v52z'/%3E%3Cpath d='M535 279v-114h32v114zM546 165V84h10v81zM551 84c-9-13-9-25 0-37 9 12 9 24 0 37z'/%3E%3Cpath d='M176 279v-94h29v94zM186 185v-61h9v61zM190 124c-8-11-8-22 0-32 8 10 8 21 0 32z'/%3E%3Cpath d='M90 279c11-48 27-79 51-93-9 31-9 62 0 93h-18c-4-22-4-43 1-64-10 17-17 38-20 64zM814 279c-11-48-27-79-51-93 9 31 9 62 0 93h18c4-22 4-43-1-64 10 17 17 38 20 64z'/%3E%3C/g%3E%3C/svg%3E")!important;
    }
    .v17-brand{padding:2px 0 9px!important}
    .v17-brand .brand-row{gap:0!important}
    .v17-brand .brand-logo{width:58px!important;height:68px!important;margin:0 auto 4px!important;filter:drop-shadow(0 5px 12px rgba(175,146,85,.12))!important}
    .v17-brand h1{font-size:44px!important;line-height:.98!important;color:#314035!important;letter-spacing:-1.1px!important}
    .v17-brand .count{font-size:17px!important;color:var(--v21-gold)!important;margin-top:8px!important}
    .v17-brand .tagline{font-size:16px!important;color:color-mix(in srgb,var(--text) 70%,#746b5c)!important;margin:13px 0 5px!important;line-height:1.55!important}
    .v17-brand:before{
      content:"";position:absolute;left:50%;top:0;transform:translateX(-50%);width:min(480px,88vw);height:215px;z-index:-1;
      border:1px solid rgba(174,146,84,.06);border-bottom:0;border-radius:52% 52% 0 0/70% 70% 0 0;
    }
    .v17-actions{
      position:relative!important;
      z-index:4!important;
      grid-template-columns:repeat(5,minmax(0,1fr))!important;
      margin:13px -2px 0!important;
      padding:14px 8px 12px!important;
      gap:4px!important;
      border:1px solid rgba(183,164,128,.16)!important;
      border-radius:30px!important;
      background:rgba(255,253,248,.92)!important;
      box-shadow:0 12px 28px rgba(73,61,40,.09)!important;
      backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;
    }
    .v17-action{gap:6px!important}
    .v17-action .icon,.v17-action .small-tool{
      width:54px!important;height:54px!important;border-radius:50%!important;
      border:1px solid rgba(184,160,112,.24)!important;background:#fffdf9!important;color:#272822!important;
      box-shadow:0 7px 17px rgba(70,59,39,.08)!important;
    }
    .v17-action .icon svg,.v17-action .small-tool svg{width:24px!important;height:24px!important}
    .v17-action.add-action .icon{background:#667760!important;border-color:#667760!important;color:#fff!important;box-shadow:0 9px 20px rgba(71,94,68,.22)!important}
    .v17-label{font-size:10px!important;font-weight:760!important;color:#423f36!important}
    .v17-action.add-action .v17-label{color:#607058!important}
    .v17-search-wrap{margin:12px 5px 0!important;width:calc(100% - 10px)!important}

    /* ---------- Cards ---------- */
    #list{gap:12px!important}
    .card{
      border:1px solid rgba(177,160,128,.15)!important;
      background:#fffdfa!important;
      box-shadow:0 8px 22px rgba(67,56,36,.07)!important;
    }
    .card.wide{border-radius:30px!important}
    .card.square,.card.half{border-radius:27px!important}
    .card-title{color:#aa8d52!important;font-weight:800!important}
    .card-badge{background:#f7f0df!important;color:#a88b50!important;border:1px solid rgba(170,141,80,.14)!important}
    .card-actions{color:#89877f!important}
    .action{color:#8e8b82!important}
    .action-sep{background:#e9e1d2!important}
    .compact-row{gap:12px!important}

    /* Per-card selected colors remain deliberately subtle, preserving readability. */
    .card.card-color-sage{background:#f1f5ee!important;border-color:#dce7d8!important}
    .card.card-color-sand{background:#f8f0e2!important;border-color:#eadcc5!important}
    .card.card-color-blush{background:#f9eff0!important;border-color:#ecdadd!important}
    .card.card-color-blue{background:#eef4f6!important;border-color:#d9e5e9!important}
    .card.card-color-lavender{background:#f3eff7!important;border-color:#e2dbea!important}
    .card.card-color-sage .card-badge{background:#e5ede1!important;color:#63775c!important}
    .card.card-color-sand .card-badge{background:#f0e1c6!important;color:#9c7840!important}
    .card.card-color-blush .card-badge{background:#f1dfe2!important;color:#9b666e!important}
    .card.card-color-blue .card-badge{background:#dfeaec!important;color:#627e86!important}
    .card.card-color-lavender .card-badge{background:#e6dfed!important;color:#776889!important}

    /* ---------- Editor color + insertion controls ---------- */
    .v21-color-palette{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;margin-top:8px}
    .v21-color-choice{border:1px solid var(--line);background:var(--surface2);border-radius:16px;padding:8px 4px 7px;display:grid;place-items:center;gap:5px;color:var(--muted);min-width:0}
    .v21-color-choice.active{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 12%,transparent);color:var(--text)}
    .v21-color-choice small{font-size:9px;white-space:nowrap}
    .v21-swatch{width:27px;height:27px;border-radius:50%;border:2px solid rgba(255,255,255,.92);box-shadow:0 0 0 1px rgba(76,68,52,.12)}
    .sw-default{background:#fffdfa}.sw-sage{background:#e7efe3}.sw-sand{background:#f2e3cc}.sw-blush{background:#f2dfe2}.sw-blue{background:#deeaee}.sw-lavender{background:#e8e0ef}
    .v21-position-seg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
    .v21-position-choice{border:1px solid var(--line);border-radius:16px;background:var(--surface2);padding:10px 8px;display:grid;gap:3px;color:var(--text)}
    .v21-position-choice strong{font-size:14px}.v21-position-choice small{font-size:10px;color:var(--muted)}
    .v21-position-choice.active{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,var(--surface));box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 10%,transparent)}
    #v21InsertSection[hidden]{display:none!important}

    @media(max-width:520px){
      .v17-top{padding:7px 6px 0!important;margin-bottom:15px!important}
      .v17-top:after{height:185px!important;bottom:111px!important}
      .v17-brand .brand-logo{width:53px!important;height:62px!important}
      .v17-brand h1{font-size:41px!important}
      .v17-brand .count{font-size:16px!important;margin-top:7px!important}
      .v17-brand .tagline{font-size:15px!important;margin-top:11px!important}
      .v17-brand:before{height:190px!important}
      .v17-actions{margin-top:11px!important;padding:12px 4px 10px!important;border-radius:27px!important;gap:1px!important}
      .v17-action .icon,.v17-action .small-tool{width:48px!important;height:48px!important}
      .v17-label{font-size:9px!important}
      .v21-color-palette{grid-template-columns:repeat(3,1fr)}
      .v21-color-choice{grid-template-columns:auto 1fr;justify-items:start;padding:7px 9px}.v21-color-choice small{font-size:10px}
    }
    @media(max-width:380px){
      .v17-action .icon,.v17-action .small-tool{width:44px!important;height:44px!important}
      .v17-label{font-size:8.5px!important}
      .v17-brand h1{font-size:38px!important}
    }
  `;
  document.head.appendChild(style);

  /* Persist recovered color values immediately so a later reload no longer needs migration. */
  try{persist()}catch{}
  try{render()}catch{}
})();


/* My-Duaa v22 — backup/restore + crisp artwork header */
(function(){
  const PREFIX='my_duaa_';
  const BACKUP_VERSION=1;
  const $q=s=>document.querySelector(s);

  function collect(){
    const data={};
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k&&k.startsWith(PREFIX))data[k]=localStorage.getItem(k);
    }
    return {app:'My-Duaa',version:BACKUP_VERSION,createdAt:new Date().toISOString(),data};
  }
  function exportBackup(){
    try{
      const backup=collect();
      const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      const d=new Date(),pad=n=>String(n).padStart(2,'0');
      a.href=url;
      a.download=`My-Duaa-Backup-${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}.json`;
      document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
      if(typeof toast==='function')toast('تم إنشاء النسخة الاحتياطية');
    }catch(e){if(typeof toast==='function')toast('تعذر إنشاء النسخة الاحتياطية')}
  }
  function chooseRestore(){const input=$q('#v22RestoreFile');if(input){input.value='';input.click()}}
  async function restoreFile(file){
    if(!file)return;
    try{
      const parsed=JSON.parse(await file.text());
      if(parsed?.app!=='My-Duaa'||!parsed.data||typeof parsed.data!=='object')throw new Error('invalid');
      const keys=Object.keys(parsed.data).filter(k=>k.startsWith(PREFIX));
      if(!keys.length)throw new Error('empty');
      if(!confirm('سيتم استبدال بيانات أدعيتي الحالية بالنسخة الاحتياطية. هل تريد المتابعة؟'))return;
      const existing=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);if(k&&k.startsWith(PREFIX))existing.push(k);
      }
      existing.forEach(k=>localStorage.removeItem(k));
      keys.forEach(k=>{const v=parsed.data[k];if(typeof v==='string')localStorage.setItem(k,v)});
      alert('تم استعادة النسخة الاحتياطية بنجاح. سيتم إعادة تحميل التطبيق الآن.');
      location.reload();
    }catch(e){alert('ملف النسخة الاحتياطية غير صالح أو تالف.')}
  }
  function installBackupUI(){
    if($q('#v22BackupSection'))return;
    const settingsSheet=$q('#settingsOverlay .settings-sheet');
    if(!settingsSheet)return;
    const section=document.createElement('section');
    section.id='v22BackupSection';section.className='v22-backup-section';
    section.innerHTML=`<div class="v22-backup-title">النسخ الاحتياطي</div><div class="v22-backup-desc">احفظ الأدعية والصور والملاحظات والروابط والإعدادات في ملف واحد، أو استعد نسخة سابقة.</div><div class="v22-backup-actions"><button type="button" class="secondary v22-backup-btn" id="v22ExportBackup">تصدير نسخة احتياطية</button><button type="button" class="secondary v22-backup-btn" id="v22ImportBackup">استعادة نسخة</button></div><input id="v22RestoreFile" type="file" accept="application/json,.json" hidden>`;
    settingsSheet.appendChild(section);
    $q('#v22ExportBackup').onclick=exportBackup;
    $q('#v22ImportBackup').onclick=chooseRestore;
    $q('#v22RestoreFile').onchange=e=>restoreFile(e.target.files?.[0]);
    if(!document.querySelector('#v22-backup-style')){
      const style=document.createElement('style');style.id='v22-backup-style';
      style.textContent=`.v22-backup-section{margin:14px 0 4px;padding:15px;border:1px solid var(--line);border-radius:20px;background:var(--surface2);text-align:right}.v22-backup-title{font-size:15px;font-weight:850;color:var(--text);margin-bottom:4px}.v22-backup-desc{font-size:12px;line-height:1.65;color:var(--muted);margin-bottom:11px}.v22-backup-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v22-backup-btn{min-height:44px;font-size:12px;padding:8px!important}@media(max-width:370px){.v22-backup-actions{grid-template-columns:1fr}}`;
      document.head.appendChild(style);
    }
  }
  installBackupUI();
})();


/* My-Duaa clean release — consolidated UI, vector header and performance pass */
(function(){
  try{
    ['v17-option5-style','v20-gradient-header','v21-selected-design','v25-artwork-header-style','v23-artwork-header-style'].forEach(id=>document.getElementById(id)?.remove());
    localStorage.removeItem('my_duaa_prayer_location_v1');
    localStorage.removeItem('my_duaa_prayer_cache_v1');
  }catch{}

  const darkThemes=new Set(['night','darkgold','midnightblue']);
  const baseApply=apply;
  apply=function(){
    baseApply();
    const meta=document.querySelector('#themeColor');
    if(meta)meta.content=darkThemes.has(settings.design)?'#091521':'#f6f1e9';
  };

  try{
    const previousCardMarkup=cardMarkup;
    cardMarkup=function(d){
      return previousCardMarkup(d).replace('<img class="card-image"','<img loading="lazy" decoding="async" class="card-image"');
    };
  }catch{}

  function mountReleaseHeader(){
    const top=document.querySelector('.v17-top');
    if(!top)return false;
    top.classList.add('release-top');
    top.querySelector('.v23-banner-wrap')?.remove();
    top.querySelector('.v25-banner-wrap')?.remove();
    let banner=top.querySelector('.release-banner');
    if(!banner){
      banner=document.createElement('section');
      banner.className='release-banner';
      banner.setAttribute('aria-label','أدعيتي');
      banner.innerHTML='<svg class="release-scene" viewBox="0 0 1200 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+
        '<defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".10"/><stop offset="1" stop-color="currentColor" stop-opacity=".02"/></linearGradient></defs>'+
        '<path class="release-arch" d="M0 380V250C120 245 150 152 250 152h50C350 74 430 28 600 0c170 28 250 74 300 152h50c100 0 130 93 250 98v130Z"/>'+
        '<path class="release-haze" d="M0 310c115-48 183-36 250 1 88-72 185-78 274-14 85-70 187-66 266 5 87-43 171-48 250 6 51-30 103-25 160-2v74H0Z"/>'+
        '<g class="release-mosques">'+
        '<path d="M120 320v-88h28v88m-9-88v-54h-10v54m5-54c-8-12-8-23 0-34 8 11 8 22 0 34Z"/>'+
        '<path d="M245 320v-105h34v105m-17-105c-28-29-28-58 0-86 28 28 28 57 0 86Z"/>'+
        '<path d="M860 320v-88h28v88m-9-88v-54h-10v54m5-54c-8-12-8-23 0-34 8 11 8 22 0 34Z"/>'+
        '<path d="M980 320v-105h34v105m-17-105c-28-29-28-58 0-86 28 28 28 57 0 86Z"/>'+
        '<path d="M70 320h108M214 320h96M820 320h110M952 320h100"/>'+
        '</g>'+
        '<g class="release-birds"><path d="M188 112q12-12 24 0q12-12 24 0"/><path d="M1015 105q12-12 24 0q12-12 24 0"/><path d="M1090 145q8-8 16 0q8-8 16 0"/></g>'+
        '</svg>'+
        '<div class="release-brand"><img src="./logo.svg" alt=""><h1>أدعيتي</h1><div class="release-rule"><span></span><i></i><span></span></div><p>كل دعاء هو باب أمل مفتوح ..</p></div>'+
        '<div class="release-count" aria-live="polite"></div>';
      top.insertBefore(banner,top.firstChild);
    }
    const source=document.querySelector('#count');
    const target=banner.querySelector('.release-count');
    const sync=()=>{if(source&&target)target.textContent=source.textContent||''};
    sync();
    if(source&&!source.__releaseCountObserver){
      source.__releaseCountObserver=true;
      new MutationObserver(sync).observe(source,{childList:true,characterData:true,subtree:true});
    }
    return true;
  }

  if(!mountReleaseHeader()){
    const obs=new MutationObserver(()=>{if(mountReleaseHeader())obs.disconnect()});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>obs.disconnect(),5000);
  }

  function autoGrow(el){
    if(!el)return;
    el.style.height='auto';
    el.style.height=Math.min(Math.max(el.scrollHeight,120),420)+'px';
  }
  document.addEventListener('input',e=>{
    if(e.target?.matches?.('#duaInput,#notesInput,#noteBodyInput'))autoGrow(e.target);
  },{passive:true});
  ['duaInput','notesInput','noteBodyInput'].forEach(id=>autoGrow(document.getElementById(id)));

  try{apply()}catch{}
})();


/* Clean editor structure + toolbar alignment */
(function releaseEditorR2(){
  function wrapField(el,label,optional){
    if(!el||el.closest('.release-input-block'))return;
    const block=document.createElement('label');
    block.className='release-input-block';
    const head=document.createElement('span');
    head.className='release-input-label';
    head.innerHTML='<strong>'+label+'</strong>'+(optional?'<small>اختياري</small>':'');
    el.parentNode.insertBefore(block,el);
    block.append(head,el);
    el.removeAttribute('style');
  }
  const sheet=document.querySelector('#editorOverlay .editor-sheet');
  if(sheet){
    const title=document.querySelector('#titleInput');
    const dua=document.querySelector('#duaInput');
    const ref=document.querySelector('#refInput');
    let group=sheet.querySelector('.release-edit-content');
    if(!group){
      group=document.createElement('div');
      group.className='release-edit-content';
      const hint=sheet.querySelector('.hint');
      (hint||sheet.querySelector('.sheet-head'))?.insertAdjacentElement('afterend',group);
    }
    [title,dua,ref].forEach(el=>{if(el&&!el.closest('.release-edit-content'))group.appendChild(el)});
    wrapField(title,'العنوان',true);
    wrapField(dua,'نص الدعاء',false);
    wrapField(ref,'المرجع',true);
    sheet.querySelector('#cardShapeSeg')?.closest('.editor-section')?.classList.add('release-appearance-section');
    sheet.querySelector('#v21CardColorSection')?.classList.add('release-color-section');
    sheet.querySelector('#v21InsertSection')?.classList.add('release-position-section');
    sheet.querySelector('#imageDrop')?.closest('.editor-section')?.classList.add('release-image-section');
    sheet.querySelector('#notesInput')?.closest('.editor-section')?.classList.add('release-notes-section');
  }
})();


/* Optional Islamic theme packs — preserve current theme unless user selects one */
(function islamicThemePackR3(){
  const islamic=new Set(['mosqueclassic','ottomanblue','kaabanight','greendome']);
  const dark=new Set(['night','darkgold','midnightblue','kaabanight']);
  const previousApply=apply;
  apply=function(){
    previousApply();
    const root=document.documentElement;
    root.classList.toggle('is-islamic-theme',islamic.has(settings.design));
    const meta=document.querySelector('#themeColor');
    if(meta){
      const colors={
        mosqueclassic:'#f5efe2',
        ottomanblue:'#0e3e58',
        kaabanight:'#070908',
        greendome:'#e8efe4'
      };
      meta.content=colors[settings.design]||(dark.has(settings.design)?'#091521':'#f6f1e9');
    }
  };
  try{apply()}catch{}
})();


/* Complete UI themes — optional only; current theme remains untouched */
(function fullUiThemesR4(){
  const fullUi=new Set(['mihrablight','quranpage','fajrsky','mamluk']);
  const previousApply=apply;
  apply=function(){
    previousApply();
    const root=document.documentElement;
    root.classList.toggle('is-full-ui-theme',fullUi.has(settings.design));
    const colors={
      mihrablight:'#f4f0e6',
      quranpage:'#e8d8ae',
      fajrsky:'#dfeaf7',
      mamluk:'#082b29'
    };
    if(fullUi.has(settings.design)){
      const meta=document.querySelector('#themeColor');
      if(meta)meta.content=colors[settings.design];
    }
  };
  try{apply()}catch{}
})();
