/* My Duaa dashboard v26 */
(function(){
  if(window.__myDuaaDashboardV26)return;
  window.__myDuaaDashboardV26=true;

  var root=document.documentElement;
  var body=document.body;
  var app=document.querySelector('.app');
  var duaaScreen=document.querySelector('#duaaScreen');
  var linksScreen=document.querySelector('#linksScreen');
  var notesScreen=document.querySelector('#notesScreen');
  if(!app||!duaaScreen)return;

  root.classList.add('v26-ui');
  body.classList.add('v26-ui-body');

  var PKEY='my_duaa_v26_prayer_settings';
  var TKEY='my_duaa_v26_tasbeeh';
  var defaultPrayer={lat:30.0444,lon:31.2357,place:'القاهرة',method:'egypt',madhab:'shafi'};
  var prayer=Object.assign({},defaultPrayer);
  var tasbeeh={phrase:'الحمد لله',count:0,goal:100,haptic:true};
  try{prayer=Object.assign(prayer,JSON.parse(localStorage.getItem(PKEY)||'{}'))}catch(e){}
  try{tasbeeh=Object.assign(tasbeeh,JSON.parse(localStorage.getItem(TKEY)||'{}'))}catch(e){}
  function savePrayer(){localStorage.setItem(PKEY,JSON.stringify(prayer))}
  function saveTasbeeh(){localStorage.setItem(TKEY,JSON.stringify(tasbeeh))}

  var gear='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 13.2v-2.4l-2-.7a6.5 6.5 0 0 0-.8-1.8l.9-1.9-1.7-1.7-1.9.9a6.5 6.5 0 0 0-1.8-.8l-.7-2H9l-.7 2a6.5 6.5 0 0 0-1.8.8l-1.9-.9-1.7 1.7.9 1.9a6.5 6.5 0 0 0-.8 1.8l-2 .7v2.4l2 .7a6.5 6.5 0 0 0 .8 1.8l-.9 1.9 1.7 1.7 1.9-.9a6.5 6.5 0 0 0 1.8.8l.7 2h2.4l.7-2a6.5 6.5 0 0 0 1.8-.8l1.9.9 1.7-1.7-.9-1.9a6.5 6.5 0 0 0 .8-1.8l2-.7Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  var prayerIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20v-8.5c0-3.1 2.1-5.4 5-6.2V3.5h2v1.8c2.9.8 5 3.1 5 6.2V20M8.5 12h7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  var duaaIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.8 19.5c-1.7-2.1-2.8-4.6-2.8-7 0-1.4.7-2.3 1.7-2.3.9 0 1.4.6 1.6 1.7l.3 1.4V7.1c0-1.1.6-1.8 1.5-1.8s1.5.7 1.5 1.8v5.2-6c0-1.1.6-1.8 1.5-1.8s1.5.7 1.5 1.8v6-4.6c0-1.1.6-1.8 1.5-1.8s1.5.7 1.5 1.8v6.6c0 2-.7 3.7-2.1 5.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var tasbeehIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="1.4" fill="currentColor"/><circle cx="16.5" cy="5.5" r="1.4" fill="currentColor"/><circle cx="19.5" cy="9" r="1.4" fill="currentColor"/><circle cx="19.5" cy="13.5" r="1.4" fill="currentColor"/><circle cx="16.5" cy="17" r="1.4" fill="currentColor"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor"/><circle cx="7.5" cy="17" r="1.4" fill="currentColor"/><circle cx="4.5" cy="13.5" r="1.4" fill="currentColor"/><circle cx="4.5" cy="9" r="1.4" fill="currentColor"/><circle cx="7.5" cy="5.5" r="1.4" fill="currentColor"/><path d="M12 20v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var notesIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h9.5L19 7v13.5H6zM15.5 3.5V7H19M9 11h7M9 15h7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  var shell=document.createElement('section');
  shell.className='v26-shell';
  shell.innerHTML=
    '<header class="v26-header">'+
      '<div class="v26-brand"><img src="logo.svg" alt=""><strong>أدعيتي</strong></div>'+
      '<button class="v26-icon-btn" id="v26Settings" aria-label="الإعدادات">'+gear+'</button>'+
    '</header>'+
    '<section class="v26-prayer-banner" id="v26PrayerBanner" role="button" tabindex="0" aria-label="عرض مواقيت الصلاة">'+
      '<div class="v26-banner-copy">'+
        '<span>الصلاة القادمة</span>'+
        '<strong id="v26NextPrayer">—</strong>'+
        '<b id="v26Countdown">--:--:--</b>'+
        '<small id="v26NextTime">—</small>'+
      '</div>'+
      '<div class="v26-mosque-art" aria-hidden="true">'+
        '<svg viewBox="0 0 220 130"><circle cx="168" cy="37" r="28" fill="rgba(239,209,145,.50)"/><path d="M0 111h220v19H0zM38 111V77h25v34M157 111V64h28v47M89 111V88h43v23M99 88c0-14 23-14 23 0M49 77c0-12 15-18 15-28 0 10 15 16 15 28M168 64c0-14 16-22 16-33 0 11 16 19 16 33" fill="rgba(246,235,204,.30)"/><path d="M10 108c28-25 55-20 75-3 32-29 75-25 125 3" fill="none" stroke="rgba(246,235,204,.18)" stroke-width="5"/></svg>'+
      '</div>'+
      '<button class="v26-banner-action" id="v26PrayerOpen">عرض المواقيت</button>'+
    '</section>'+
    '<nav class="v26-nav" aria-label="أقسام التطبيق">'+
      '<button data-v26-screen="prayer">'+prayerIcon+'<span>الصلاة</span></button>'+
      '<button data-v26-screen="duaa">'+duaaIcon+'<span>الأدعية</span></button>'+
      '<button data-v26-screen="tasbeeh">'+tasbeehIcon+'<span>التسبيح</span></button>'+
      '<button data-v26-screen="notes">'+notesIcon+'<span>الملاحظات</span></button>'+
    '</nav>';
  app.prepend(shell);

  var prayerScreen=document.createElement('section');
  prayerScreen.id='v26PrayerScreen';
  prayerScreen.className='screen v26-content-screen';
  prayerScreen.innerHTML=
    '<div class="v26-section-head"><div><span>اليوم</span><h2>مواقيت الصلاة</h2></div><button class="v26-mini-btn" id="v26PrayerSettings">إعدادات</button></div>'+
    '<div class="v26-prayer-meta"><strong id="v26Place">'+prayer.place+'</strong><span id="v26PrayerMethodLabel">الهيئة المصرية العامة للمساحة</span></div>'+
    '<div class="v26-prayer-list" id="v26PrayerList"></div>'+
    '<button class="v26-location-btn" id="v26UseLocation">استخدام موقعي الحالي</button>';
  app.appendChild(prayerScreen);

  var tasbeehScreen=document.createElement('section');
  tasbeehScreen.id='v26TasbeehScreen';
  tasbeehScreen.className='screen v26-content-screen';
  tasbeehScreen.innerHTML=
    '<div class="v26-section-head"><div><span>ذكر الله</span><h2>التسبيح</h2></div><button class="v26-mini-btn" id="v26AddPhrase">ذكر جديد</button></div>'+
    '<div class="v26-tasbeeh-card">'+
      '<div class="v26-tasbeeh-ring" id="v26TasbeehRing"><div class="v26-tasbeeh-center">'+
        '<button class="v26-phrase" id="v26PhraseButton"><span id="v26Phrase">'+tasbeeh.phrase+'</span><small>تغيير الذكر</small></button>'+
        '<strong id="v26Count">'+tasbeeh.count+'</strong><span id="v26Goal">من '+tasbeeh.goal+'</span>'+
      '</div></div>'+
      '<button class="v26-count-btn" id="v26CountButton" aria-label="اضغط للعد">'+tasbeehIcon+'<span>اضغط للعد</span></button>'+
      '<div class="v26-phrase-chips" id="v26PhraseChips">'+
        '<button data-phrase="الحمد لله">الحمد لله</button>'+
        '<button data-phrase="الله أكبر">الله أكبر</button>'+
        '<button data-phrase="سبحان الله">سبحان الله</button>'+
        '<button data-phrase="لا حول ولا قوة إلا بالله">لا حول ولا قوة إلا بالله</button>'+
      '</div>'+
      '<div class="v26-tasbeeh-controls">'+
        '<button id="v26Reset">إعادة الصفر</button>'+
        '<button id="v26GoalButton">الهدف <b>'+tasbeeh.goal+'</b></button>'+
        '<button id="v26Haptic" class="'+(tasbeeh.haptic?'active':'')+'">الاهتزاز <b>'+(tasbeeh.haptic?'مفعّل':'متوقف')+'</b></button>'+
      '</div>'+
    '</div>';
  app.appendChild(tasbeehScreen);

  var oldDuaaTools=duaaScreen.querySelector('.duaa-tools');
  var searchBox=duaaScreen.querySelector('#duaaSearchBox');
  var duaaCompact=document.createElement('div');
  duaaCompact.className='v26-section-head v26-duaa-head';
  duaaCompact.innerHTML=
    '<div><span>مكتبتي</span><h2>الأدعية</h2></div>'+
    '<div class="v26-head-actions">'+
      '<button class="v26-round-action" id="v26SearchDuaa" aria-label="بحث"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8"/></svg></button>'+
      '<button class="v26-round-action" id="v26AddDuaa" aria-label="إضافة دعاء">＋</button>'+
    '</div>';
  var list=duaaScreen.querySelector('#list');
  if(list){
    duaaScreen.insertBefore(duaaCompact,list);
    if(searchBox){duaaCompact.insertAdjacentElement('afterend',searchBox);searchBox.classList.add('v26-search-box')}
  }
  if(oldDuaaTools)oldDuaaTools.classList.add('v26-hidden-source');

  if(notesScreen){
    var notesTools=document.createElement('div');
    notesTools.className='v26-section-head v26-notes-head';
    notesTools.innerHTML='<div><span>مساحتي</span><h2>الملاحظات</h2></div><button class="v26-round-action" id="v26AddNote" aria-label="إضافة ملاحظة">＋</button>';
    notesScreen.prepend(notesTools);
    var oldNotesHead=notesScreen.querySelector('.notes-head');
    if(oldNotesHead)oldNotesHead.classList.add('v26-hidden-source');
  }

  var prayerOverlay=document.createElement('div');
  prayerOverlay.className='overlay';
  prayerOverlay.id='v26PrayerOverlay';
  prayerOverlay.innerHTML=
    '<section class="sheet v26-sheet"><div class="handle"></div><div class="sheet-head"><h2>إعدادات الصلاة</h2><button class="close" id="v26PrayerClose">×</button></div>'+
      '<label class="v26-field-label">طريقة الحساب<select id="v26Method"><option value="egypt">الهيئة المصرية العامة للمساحة</option><option value="mwl">رابطة العالم الإسلامي</option><option value="umm">أم القرى</option></select></label>'+
      '<label class="v26-field-label">حساب العصر<select id="v26Madhab"><option value="shafi">الشافعي</option><option value="hanafi">الحنفي</option></select></label>'+
      '<button class="primary" id="v26LocationFromSettings">تحديث الموقع الحالي</button>'+
      '<div class="hint">يتم حساب المواقيت داخل التطبيق دون الحاجة إلى خدمة خارجية.</div>'+
    '</section>';
  body.appendChild(prayerOverlay);

  var tasOverlay=document.createElement('div');
  tasOverlay.className='overlay';
  tasOverlay.id='v26TasOverlay';
  tasOverlay.innerHTML=
    '<section class="sheet v26-sheet"><div class="handle"></div><div class="sheet-head"><h2 id="v26TasTitle">إضافة ذكر</h2><button class="close" id="v26TasClose">×</button></div>'+
      '<input class="field" id="v26PhraseInput" placeholder="اكتب الذكر">'+
      '<label class="v26-field-label">العدد المستهدف<input class="field" id="v26GoalInput" type="number" min="1" max="9999" inputmode="numeric"></label>'+
      '<div class="form-actions"><button class="primary" id="v26TasSave">حفظ</button><button class="secondary" id="v26TasCancel">إلغاء</button></div>'+
    '</section>';
  body.appendChild(tasOverlay);

  try{
    var fill=document.querySelector('#imageFitSeg [data-fit="fill"]');
    var contain=document.querySelector('#imageFitSeg [data-fit="contain"]');
    var cover=document.querySelector('#imageFitSeg [data-fit="cover"]');
    if(fill)fill.textContent='تمديد';
    if(contain)contain.textContent='ملاءمة';
    if(cover)cover.textContent='قص من المنتصف';
  }catch(e){}

  function rad(d){return d*Math.PI/180}
  function deg(r){return r*180/Math.PI}
  function normMin(m){return ((m%1440)+1440)%1440}
  function dayOfYear(d){
    var start=new Date(d.getFullYear(),0,0);
    return Math.floor((d-start)/86400000);
  }
  function solarData(date){
    var n=dayOfYear(date);
    var g=2*Math.PI/365*(n-1);
    var eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g));
    var dec=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);
    return {eq:eq,dec:dec};
  }
  function hourAngle(lat,dec,alt){
    var v=(Math.sin(rad(alt))-Math.sin(rad(lat))*Math.sin(dec))/(Math.cos(rad(lat))*Math.cos(dec));
    return deg(Math.acos(Math.min(1,Math.max(-1,v))));
  }
  function prayerTimesFor(date){
    var sd=solarData(date);
    var tz=-date.getTimezoneOffset()/60;
    var noon=720-4*prayer.lon-sd.eq+tz*60;
    var cfg=prayer.method==='mwl'?{fajr:18,isha:17}:prayer.method==='umm'?{fajr:18.5,isha:null}:{fajr:19.5,isha:17.5};
    var fajr=normMin(noon-hourAngle(prayer.lat,sd.dec,-cfg.fajr)*4);
    var sunrise=normMin(noon-hourAngle(prayer.lat,sd.dec,-.833)*4);
    var sunset=normMin(noon+hourAngle(prayer.lat,sd.dec,-.833)*4);
    var latDec=Math.abs(rad(prayer.lat)-sd.dec);
    var factor=prayer.madhab==='hanafi'?2:1;
    var asrAlt=-deg(Math.atan(1/(factor+Math.tan(latDec))));
    var asr=normMin(noon+hourAngle(prayer.lat,sd.dec,asrAlt)*4);
    var isha=cfg.isha==null?normMin(sunset+90):normMin(noon+hourAngle(prayer.lat,sd.dec,-cfg.isha)*4);
    return {fajr:fajr,sunrise:sunrise,dhuhr:normMin(noon),asr:asr,maghrib:sunset,isha:isha};
  }

  var pNames={fajr:'الفجر',sunrise:'الشروق',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
  var prayerKeys=['fajr','dhuhr','asr','maghrib','isha'];
  var listKeys=['fajr','sunrise','dhuhr','asr','maghrib','isha'];
  var methodNames={egypt:'الهيئة المصرية العامة للمساحة',mwl:'رابطة العالم الإسلامي',umm:'أم القرى'};

  function minuteDate(base,m){
    var d=new Date(base.getFullYear(),base.getMonth(),base.getDate(),0,0,0,0);
    d.setMinutes(Math.round(m));
    return d;
  }
  function fmtTime(d){
    return new Intl.DateTimeFormat('ar-EG',{hour:'2-digit',minute:'2-digit',hour12:true}).format(d);
  }
  function nextPrayer(now){
    now=now||new Date();
    var today=prayerTimesFor(now);
    for(var i=0;i<prayerKeys.length;i++){
      var k=prayerKeys[i];
      var at=minuteDate(now,today[k]);
      if(at>now)return {key:k,at:at,times:today};
    }
    var tomorrow=new Date(now);
    tomorrow.setDate(tomorrow.getDate()+1);
    var t=prayerTimesFor(tomorrow);
    return {key:'fajr',at:minuteDate(tomorrow,t.fajr),times:today};
  }

  function renderPrayer(){
    var now=new Date();
    var times=prayerTimesFor(now);
    var next=nextPrayer(now);
    document.querySelector('#v26NextPrayer').textContent=pNames[next.key];
    document.querySelector('#v26NextTime').textContent='موعدها '+fmtTime(next.at);
    document.querySelector('#v26Place').textContent=prayer.place||'الموقع الحالي';
    document.querySelector('#v26PrayerMethodLabel').textContent=methodNames[prayer.method]||methodNames.egypt;
    document.querySelector('#v26Method').value=prayer.method||'egypt';
    document.querySelector('#v26Madhab').value=prayer.madhab||'shafi';
    var host=document.querySelector('#v26PrayerList');
    var out='';
    for(var i=0;i<listKeys.length;i++){
      var k=listKeys[i];
      var d=minuteDate(now,times[k]);
      var active=k===next.key;
      out+='<article class="v26-prayer-row '+(active?'active':'')+'"><div><strong>'+pNames[k]+'</strong><span>'+(k==='sunrise'?'وقت الشروق':active?'الصلاة القادمة':'')+'</span></div><time>'+fmtTime(d)+'</time></article>';
    }
    host.innerHTML=out;
    updateCountdown();
  }
  function updateCountdown(){
    var next=nextPrayer(new Date());
    var sec=Math.max(0,Math.floor((next.at-Date.now())/1000));
    var h=String(Math.floor(sec/3600)).padStart(2,'0');
    sec%=3600;
    var m=String(Math.floor(sec/60)).padStart(2,'0');
    var s=String(sec%60).padStart(2,'0');
    var el=document.querySelector('#v26Countdown');
    if(el)el.textContent=h+':'+m+':'+s;
  }
  function requestLocation(){
    if(!navigator.geolocation){toast('تحديد الموقع غير متاح على هذا الجهاز');return}
    toast('جارٍ تحديد الموقع…');
    navigator.geolocation.getCurrentPosition(function(pos){
      prayer.lat=pos.coords.latitude;
      prayer.lon=pos.coords.longitude;
      prayer.place='موقعي الحالي';
      savePrayer();
      renderPrayer();
      toast('تم تحديث مواقيت الصلاة');
    },function(){
      toast('تعذر الوصول إلى الموقع. تم الاحتفاظ بالموقع الحالي.');
    },{enableHighAccuracy:false,timeout:10000,maximumAge:3600000});
  }

  var screens={duaa:duaaScreen,prayer:prayerScreen,tasbeeh:tasbeehScreen,notes:notesScreen};
  function showV26(name){
    if(!screens[name])name='duaa';
    var all=[duaaScreen,linksScreen,notesScreen,prayerScreen,tasbeehScreen];
    for(var i=0;i<all.length;i++)if(all[i])all[i].classList.remove('active');
    screens[name].classList.add('active');
    var nav=document.querySelectorAll('.v26-nav [data-v26-screen]');
    for(var j=0;j<nav.length;j++)nav[j].classList.toggle('active',nav[j].dataset.v26Screen===name);
    if(name==='prayer')renderPrayer();
    if(name==='tasbeeh')renderTasbeeh();
    window.scrollTo({top:0,behavior:'instant'});
  }

  var navButtons=document.querySelectorAll('.v26-nav [data-v26-screen]');
  for(var n=0;n<navButtons.length;n++){
    navButtons[n].addEventListener('click',function(){showV26(this.dataset.v26Screen)});
  }
  document.querySelector('#v26PrayerOpen').onclick=function(e){e.stopPropagation();showV26('prayer')};
  document.querySelector('#v26PrayerBanner').onclick=function(){showV26('prayer')};
  document.querySelector('#v26PrayerBanner').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showV26('prayer')}};
  document.querySelector('#v26Settings').onclick=function(){var x=document.querySelector('#settingsOverlay');if(x)x.classList.add('show')};
  document.querySelector('#v26SearchDuaa').onclick=function(){var b=document.querySelector('#duaaSearchToggle');if(b)b.click()};
  document.querySelector('#v26AddDuaa').onclick=function(){openEditor()};
  var addNote=document.querySelector('#v26AddNote');
  if(addNote)addNote.onclick=function(){var b=document.querySelector('#quickAddNote');if(b)b.click()};

  document.querySelector('#v26PrayerSettings').onclick=function(){prayerOverlay.classList.add('show')};
  document.querySelector('#v26PrayerClose').onclick=function(){prayerOverlay.classList.remove('show')};
  prayerOverlay.onclick=function(e){if(e.target===prayerOverlay)prayerOverlay.classList.remove('show')};
  document.querySelector('#v26UseLocation').onclick=requestLocation;
  document.querySelector('#v26LocationFromSettings').onclick=requestLocation;
  document.querySelector('#v26Method').onchange=function(e){prayer.method=e.target.value;savePrayer();renderPrayer()};
  document.querySelector('#v26Madhab').onchange=function(e){prayer.madhab=e.target.value;savePrayer();renderPrayer()};

  function renderTasbeeh(){
    document.querySelector('#v26Phrase').textContent=tasbeeh.phrase;
    document.querySelector('#v26Count').textContent=tasbeeh.count;
    document.querySelector('#v26Goal').textContent='من '+tasbeeh.goal;
    document.querySelector('#v26GoalButton b').textContent=tasbeeh.goal;
    document.querySelector('#v26Haptic').classList.toggle('active',!!tasbeeh.haptic);
    document.querySelector('#v26Haptic b').textContent=tasbeeh.haptic?'مفعّل':'متوقف';
    var pct=Math.min(100,(tasbeeh.count%tasbeeh.goal)/tasbeeh.goal*100);
    document.querySelector('#v26TasbeehRing').style.setProperty('--v26-progress',pct+'%');
    var buttons=document.querySelectorAll('#v26PhraseChips [data-phrase]');
    for(var i=0;i<buttons.length;i++)buttons[i].classList.toggle('active',buttons[i].dataset.phrase===tasbeeh.phrase);
  }
  function haptic(){
    if(!tasbeeh.haptic)return;
    try{if(navigator.vibrate)navigator.vibrate(18)}catch(e){}
    try{
      var hp=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Haptics;
      if(hp&&hp.impact)hp.impact({style:'LIGHT'});
    }catch(e){}
  }
  function incrementTasbeeh(){
    tasbeeh.count++;
    saveTasbeeh();
    renderTasbeeh();
    haptic();
    var btn=document.querySelector('#v26CountButton');
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    btn.classList.add('pulse');
  }
  document.querySelector('#v26CountButton').onclick=incrementTasbeeh;
  document.querySelector('#v26TasbeehRing').onclick=incrementTasbeeh;
  document.querySelector('#v26Reset').onclick=function(){tasbeeh.count=0;saveTasbeeh();renderTasbeeh();toast('تمت إعادة العداد')};
  document.querySelector('#v26Haptic').onclick=function(){tasbeeh.haptic=!tasbeeh.haptic;saveTasbeeh();renderTasbeeh();haptic()};
  var phraseButtons=document.querySelectorAll('#v26PhraseChips [data-phrase]');
  for(var p=0;p<phraseButtons.length;p++){
    phraseButtons[p].onclick=function(){tasbeeh.phrase=this.dataset.phrase;tasbeeh.count=0;saveTasbeeh();renderTasbeeh()};
  }
  function openTasEditor(mode){
    mode=mode||'phrase';
    document.querySelector('#v26TasTitle').textContent=mode==='goal'?'تحديد الهدف':'إضافة ذكر';
    document.querySelector('#v26PhraseInput').hidden=mode==='goal';
    document.querySelector('#v26PhraseInput').value=tasbeeh.phrase;
    document.querySelector('#v26GoalInput').value=tasbeeh.goal;
    tasOverlay.dataset.mode=mode;
    tasOverlay.classList.add('show');
  }
  document.querySelector('#v26AddPhrase').onclick=function(){openTasEditor('phrase')};
  document.querySelector('#v26PhraseButton').onclick=function(e){e.stopPropagation();openTasEditor('phrase')};
  document.querySelector('#v26GoalButton').onclick=function(){openTasEditor('goal')};
  document.querySelector('#v26TasClose').onclick=function(){tasOverlay.classList.remove('show')};
  document.querySelector('#v26TasCancel').onclick=function(){tasOverlay.classList.remove('show')};
  tasOverlay.onclick=function(e){if(e.target===tasOverlay)tasOverlay.classList.remove('show')};
  document.querySelector('#v26TasSave').onclick=function(){
    var g=parseInt(document.querySelector('#v26GoalInput').value||tasbeeh.goal,10);
    tasbeeh.goal=Math.max(1,Math.min(9999,g));
    if(tasOverlay.dataset.mode!=='goal'){
      var phrase=document.querySelector('#v26PhraseInput').value.trim();
      if(phrase)tasbeeh.phrase=phrase;
      tasbeeh.count=0;
    }
    saveTasbeeh();
    renderTasbeeh();
    tasOverlay.classList.remove('show');
  };

  var oldHeader=duaaScreen.querySelector('.header');
  var oldHero=duaaScreen.querySelector('.hero');
  var oldAdd=duaaScreen.querySelector('.add');
  var v17=document.querySelector('.v17-top');
  var rel=document.querySelector('.release-top');
  if(oldHeader)oldHeader.classList.add('v26-hidden-source');
  if(oldHero)oldHero.classList.add('v26-hidden-source');
  if(oldAdd)oldAdd.classList.add('v26-hidden-source');
  if(v17)v17.classList.add('v26-hidden-source');
  if(rel)rel.classList.add('v26-hidden-source');
  if(notesScreen){
    var notesAdd=notesScreen.querySelector('.add');
    if(notesAdd)notesAdd.classList.add('v26-hidden-source');
  }

  renderPrayer();
  renderTasbeeh();
  showV26('duaa');
  setInterval(updateCountdown,1000);
})();