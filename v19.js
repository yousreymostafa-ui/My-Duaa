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
