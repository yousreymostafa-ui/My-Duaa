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
