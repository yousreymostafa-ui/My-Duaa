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
