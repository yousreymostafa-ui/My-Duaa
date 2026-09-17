/* My-Duaa v22 — full local backup + restore */
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
      a.href=url;a.download=`My-Duaa-Backup-${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}.json`;
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
      const existing=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(PREFIX))existing.push(k)}
      existing.forEach(k=>localStorage.removeItem(k));
      keys.forEach(k=>{const v=parsed.data[k];if(typeof v==='string')localStorage.setItem(k,v)});
      alert('تم استعادة النسخة الاحتياطية بنجاح. سيتم إعادة تحميل التطبيق الآن.');
      location.reload();
    }catch(e){alert('ملف النسخة الاحتياطية غير صالح أو تالف.')}
  }
  function installUI(){
    if($q('#v22BackupSection'))return;
    const settingsSheet=$q('#settingsOverlay .settings-sheet');
    if(!settingsSheet)return;
    const section=document.createElement('section');section.id='v22BackupSection';section.className='v22-backup-section';
    section.innerHTML=`<div class="v22-backup-title">النسخ الاحتياطي</div><div class="v22-backup-desc">احفظ الأدعية والصور والملاحظات والروابط والإعدادات في ملف واحد، أو استعد نسخة سابقة.</div><div class="v22-backup-actions"><button type="button" class="secondary v22-backup-btn" id="v22ExportBackup">تصدير نسخة احتياطية</button><button type="button" class="secondary v22-backup-btn" id="v22ImportBackup">استعادة نسخة</button></div><input id="v22RestoreFile" type="file" accept="application/json,.json" hidden>`;
    settingsSheet.appendChild(section);
    $q('#v22ExportBackup').onclick=exportBackup;$q('#v22ImportBackup').onclick=chooseRestore;
    $q('#v22RestoreFile').onchange=e=>restoreFile(e.target.files?.[0]);
    const style=document.createElement('style');style.textContent=`.v22-backup-section{margin:14px 0 4px;padding:15px;border:1px solid var(--line);border-radius:20px;background:var(--surface2);text-align:right}.v22-backup-title{font-size:15px;font-weight:850;color:var(--text);margin-bottom:4px}.v22-backup-desc{font-size:12px;line-height:1.65;color:var(--muted);margin-bottom:11px}.v22-backup-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v22-backup-btn{min-height:44px;font-size:12px;padding:8px!important}@media(max-width:370px){.v22-backup-actions{grid-template-columns:1fr}}`;document.head.appendChild(style);
  }
  installUI();
})();

/* My-Duaa v23 — approved artwork header, rendered as a real image */
(function(){
  if(window.__myDuaaArtworkHeaderV23)return;
  window.__myDuaaArtworkHeaderV23=true;

  const installStyle=()=>{
    if(document.querySelector('#v23-artwork-header-style'))return;
    const style=document.createElement('style');
    style.id='v23-artwork-header-style';
    style.textContent=`
      .v17-top.v23-art-header{
        position:relative!important;
        overflow:visible!important;
        margin:0 0 14px!important;
        padding:0 0 9px!important;
        border-radius:0!important;
        background:transparent!important;
        box-shadow:none!important;
        isolation:isolate!important;
      }
      .v17-top.v23-art-header:before,.v17-top.v23-art-header:after{display:none!important}
      .v17-top.v23-art-header .v17-brand{display:none!important}
      .v23-banner-wrap{
        position:relative;
        z-index:1;
        margin:0 -8px;
        overflow:hidden;
        border-radius:0 0 30px 30px;
        background:#f6f0e4;
        box-shadow:0 10px 28px rgba(67,56,36,.08);
      }
      .v23-banner{
        display:block;
        width:100%;
        height:auto;
        aspect-ratio:3/1;
        object-fit:cover;
        object-position:center center;
        background:#f6f0e4;
      }
      .v23-dua-count{
        position:absolute;
        top:12px;
        left:12px;
        z-index:2;
        min-height:28px;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:5px 10px;
        border:1px solid rgba(171,145,91,.20);
        border-radius:999px;
        background:rgba(255,253,247,.82);
        color:#6f654f;
        box-shadow:0 5px 14px rgba(67,56,36,.06);
        -webkit-backdrop-filter:blur(10px);
        backdrop-filter:blur(10px);
        font-size:11px;
        font-weight:800;
        white-space:nowrap;
      }
      .v23-art-header .v17-actions{
        position:relative!important;
        z-index:5!important;
        margin:-15px 4px 0!important;
        padding:10px 5px 9px!important;
        gap:2px!important;
        border:1px solid rgba(183,164,128,.18)!important;
        border-radius:24px!important;
        background:rgba(255,253,248,.94)!important;
        box-shadow:0 12px 26px rgba(73,61,40,.10)!important;
        -webkit-backdrop-filter:blur(16px)!important;
        backdrop-filter:blur(16px)!important;
      }
      .v23-art-header .v17-action{gap:4px!important}
      .v23-art-header .v17-action .icon,.v23-art-header .v17-action .small-tool{
        width:46px!important;
        height:46px!important;
        box-shadow:0 5px 13px rgba(70,59,39,.07)!important;
      }
      .v23-art-header .v17-action .icon svg,.v23-art-header .v17-action .small-tool svg{width:21px!important;height:21px!important}
      .v23-art-header .v17-label{font-size:9px!important;line-height:1.1!important}
      .v23-art-header .v17-search-wrap{margin:10px 5px 0!important;width:calc(100% - 10px)!important}
      .v23-art-header.v23-banner-failed{padding:8px 8px 10px!important;background:linear-gradient(180deg,#fbf8f0,#f5efe2)!important;border-radius:0 0 28px 28px!important}
      .v23-art-header.v23-banner-failed .v23-banner-wrap{display:none!important}
      .v23-art-header.v23-banner-failed .v17-brand{display:grid!important;padding:4px 0 8px!important}
      @media(max-width:520px){
        .v23-banner-wrap{margin:0 -8px;border-radius:0 0 25px 25px}
        .v23-banner{aspect-ratio:2.15/1;object-fit:cover;object-position:center center}
        .v23-dua-count{top:10px;left:10px;min-height:26px;padding:4px 9px;font-size:10px}
        .v23-art-header .v17-actions{margin:-14px 3px 0!important;padding:9px 3px 8px!important;border-radius:22px!important}
        .v23-art-header .v17-action .icon,.v23-art-header .v17-action .small-tool{width:44px!important;height:44px!important}
        .v23-art-header .v17-label{font-size:8.8px!important}
      }
      @media(max-width:380px){
        .v23-banner{aspect-ratio:2/1}
        .v23-art-header .v17-action .icon,.v23-art-header .v17-action .small-tool{width:41px!important;height:41px!important}
        .v23-art-header .v17-label{font-size:8.2px!important}
      }
    `;
    document.head.appendChild(style);
  };

  const mount=()=>{
    const top=document.querySelector('.v17-top');
    if(!top)return false;
    installStyle();
    top.classList.add('v23-art-header');
    let wrap=top.querySelector('.v23-banner-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='v23-banner-wrap';
      const img=document.createElement('img');
      img.className='v23-banner';
      img.src='./duaa-header.jpg?v=23';
      img.alt='أدعيتي — كل دعاء هو باب أمل مفتوح';
      img.loading='eager';
      img.decoding='async';
      img.addEventListener('load',()=>top.classList.remove('v23-banner-failed'));
      img.addEventListener('error',()=>top.classList.add('v23-banner-failed'));
      const count=document.createElement('div');
      count.className='v23-dua-count';
      count.setAttribute('aria-live','polite');
      wrap.append(img,count);
      top.insertBefore(wrap,top.firstChild);
    }
    const source=document.querySelector('#count');
    const target=top.querySelector('.v23-dua-count');
    const sync=()=>{if(target&&source)target.textContent=source.textContent||''};
    sync();
    if(source&&!source.__v23Observed){
      source.__v23Observed=true;
      new MutationObserver(sync).observe(source,{childList:true,characterData:true,subtree:true});
    }
    return true;
  };

  if(!mount()){
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),6000);
  }
})();
