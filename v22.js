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
      /* Clear only My-Duaa data; never touch unrelated browser storage. */
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
