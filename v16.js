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
