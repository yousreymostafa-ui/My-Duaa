/* My Duaa v27 — Option 2 */
(function(){
  if(window.__myDuaaV27)return;
  window.__myDuaaV27=true;

  var root=document.documentElement, body=document.body, app=document.querySelector('.app');
  var duaaScreen=document.querySelector('#duaaScreen');
  var notesScreen=document.querySelector('#notesScreen');
  var linksScreen=document.querySelector('#linksScreen');
  if(!app||!duaaScreen)return;

  root.classList.add('v27-ui');

  var PKEY='my_duaa_v27_prayer';
  var TKEY='my_duaa_v27_tasbeeh';
  var prayer={lat:30.0444,lon:31.2357,place:'القاهرة',method:'egypt',madhab:'shafi'};
  var tasbeeh={phrase:'سبحان الله',count:33,goal:100,haptic:true,total:132};
  try{Object.assign(prayer,JSON.parse(localStorage.getItem(PKEY)||'{}'))}catch(e){}
  try{Object.assign(tasbeeh,JSON.parse(localStorage.getItem(TKEY)||'{}'))}catch(e){}
  function savePrayer(){localStorage.setItem(PKEY,JSON.stringify(prayer))}
  function saveTasbeeh(){localStorage.setItem(TKEY,JSON.stringify(tasbeeh))}

  var icons={
    prayer:'<svg viewBox="0 0 24 24"><path d="M4 20h16M6 20v-8c0-3 2.3-5.4 5-6.1V4h2v1.9c2.7.7 5 3.1 5 6.1v8M9 12h6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    duaa:'<svg viewBox="0 0 24 24"><path d="M8.7 19.5c-1.7-2.2-2.7-4.7-2.7-7.1 0-1.3.7-2.2 1.6-2.2.9 0 1.4.6 1.6 1.7l.3 1.4V7c0-1 .6-1.7 1.5-1.7s1.5.7 1.5 1.7v5.2-5.9c0-1 .6-1.7 1.5-1.7s1.5.7 1.5 1.7v5.9-4.5c0-1 .6-1.7 1.5-1.7s1.5.7 1.5 1.7v6.6c0 2-.7 3.8-2.1 5.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    tasbeeh:'<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="1.3" fill="currentColor"/><circle cx="16.5" cy="5.5" r="1.3" fill="currentColor"/><circle cx="19.5" cy="9" r="1.3" fill="currentColor"/><circle cx="19.5" cy="13.5" r="1.3" fill="currentColor"/><circle cx="16.5" cy="17" r="1.3" fill="currentColor"/><circle cx="12" cy="18.5" r="1.3" fill="currentColor"/><circle cx="7.5" cy="17" r="1.3" fill="currentColor"/><circle cx="4.5" cy="13.5" r="1.3" fill="currentColor"/><circle cx="4.5" cy="9" r="1.3" fill="currentColor"/><circle cx="7.5" cy="5.5" r="1.3" fill="currentColor"/></svg>',
    notes:'<svg viewBox="0 0 24 24"><path d="M6 3.5h9.5L19 7v13.5H6zM15.5 3.5V7H19M9 11h7M9 15h7" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    settings:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M19.5 13.2v-2.4l-2-.7a6.8 6.8 0 0 0-.8-1.8l.9-1.9-1.7-1.7-1.9.9a6.8 6.8 0 0 0-1.8-.8l-.7-2H9l-.7 2a6.8 6.8 0 0 0-1.8.8l-1.9-.9-1.7 1.7.9 1.9a6.8 6.8 0 0 0-.8 1.8l-2 .7v2.4l2 .7a6.8 6.8 0 0 0 .8 1.8l-.9 1.9 1.7 1.7 1.9-.9a6.8 6.8 0 0 0 1.8.8l.7 2h2.4l.7-2a6.8 6.8 0 0 0 1.8-.8l1.9.9 1.7-1.7-.9-1.9a6.8 6.8 0 0 0 .8-1.8l2-.7Z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8"/></svg>',
    back:'<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var home=document.createElement('section');
  home.className='screen v27-screen';
  home.id='v27Home';
  home.innerHTML=
    '<header class="v27-home-head">'+
      '<button class="v27-circle" id="v27Settings" aria-label="الإعدادات">'+icons.settings+'</button>'+
      '<div class="v27-brand"><img src="logo.svg" alt=""><strong>أدعيتي</strong><span>كل دعاء هو باب أمل مفتوح</span></div>'+
      '<button class="v27-circle" id="v27Bell" aria-label="التنبيهات">◌</button>'+
    '</header>'+
    '<section class="v27-next" id="v27NextCard">'+
      '<div class="v27-next-art"></div>'+
      '<div class="v27-next-copy"><span>الصلاة القادمة</span><strong id="v27NextName">—</strong><b id="v27Countdown">--:--:--</b><small id="v27NextClock">—</small></div>'+
      '<button class="v27-next-arrow" aria-label="عرض المواقيت">'+icons.back+'</button>'+
    '</section>'+
    '<div class="v27-home-grid">'+
      '<button data-go="prayer"><span class="v27-tile-icon">'+icons.prayer+'</span><strong>الصلاة</strong><small>مواقيت اليوم</small><i>'+icons.back+'</i></button>'+
      '<button data-go="duaa"><span class="v27-tile-icon">'+icons.duaa+'</span><strong>الأدعية</strong><small>مكتبة الأدعية</small><i>'+icons.back+'</i></button>'+
      '<button data-go="tasbeeh"><span class="v27-tile-icon">'+icons.tasbeeh+'</span><strong>التسبيح</strong><small>عداد الأذكار</small><i>'+icons.back+'</i></button>'+
      '<button data-go="notes"><span class="v27-tile-icon">'+icons.notes+'</span><strong>الملاحظات</strong><small>ملاحظاتك الخاصة</small><i>'+icons.back+'</i></button>'+
    '</div>'+
    '<div class="v27-home-verse"><span>﴿</span><p>وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ</p><span>﴾</span></div>';
  app.prepend(home);

  var prayerScreen=document.createElement('section');
  prayerScreen.className='screen v27-screen';
  prayerScreen.id='v27Prayer';
  prayerScreen.innerHTML=
    '<header class="v27-subhead"><button class="v27-circle" data-home>'+icons.back+'</button><h1>مواقيت الصلاة</h1><button class="v27-circle" id="v27PrayerSettings">'+icons.settings+'</button></header>'+
    '<div class="v27-date-row"><span id="v27Place">'+prayer.place+'</span><small id="v27Date"></small></div>'+
    '<section class="v27-prayer-hero">'+
      '<div class="v27-arch-art"></div>'+
      '<span>الصلاة القادمة</span><strong id="v27PrayerHeroName">—</strong><b id="v27PrayerHeroCountdown">--:--:--</b><small id="v27PrayerHeroClock">—</small>'+
    '</section>'+
    '<div class="v27-prayer-list" id="v27PrayerList"></div>'+
    '<div class="v27-prayer-foot"><div><span>شروق الشمس</span><strong id="v27Sunrise">—</strong></div><div><span>منتصف الليل</span><strong id="v27Midnight">—</strong></div></div>'+
    '<button class="v27-wide-btn" id="v27UseLocation">استخدام موقعي الحالي</button>';
  app.appendChild(prayerScreen);

  var tasbeehScreen=document.createElement('section');
  tasbeehScreen.className='screen v27-screen';
  tasbeehScreen.id='v27Tasbeeh';
  tasbeehScreen.innerHTML=
    '<header class="v27-subhead"><button class="v27-circle" data-home>'+icons.back+'</button><h1>التسبيح</h1><button class="v27-circle" id="v27TasSettings">'+icons.settings+'</button></header>'+
    '<div class="v27-tas-panel">'+
      '<div class="v27-tas-ring" id="v27TasRing"><div><strong id="v27TasCount">'+tasbeeh.count+'</strong><span id="v27TasGoal">من '+tasbeeh.goal+'</span></div></div>'+
      '<div class="v27-phrase-switch"><button id="v27PrevPhrase">'+icons.back+'</button><strong id="v27TasPhrase">'+tasbeeh.phrase+'</strong><button id="v27NextPhrase">'+icons.back+'</button></div>'+
      '<button class="v27-count-main" id="v27CountMain">＋</button>'+
      '<div class="v27-tas-meta"><button id="v27Reset">إعادة التعيين</button><button id="v27Target">الهدف <b>'+tasbeeh.goal+'</b></button><button id="v27Haptic">الاهتزاز <b>'+(tasbeeh.haptic?'مفعّل':'متوقف')+'</b></button></div>'+
      '<div class="v27-common-title">أذكار شائعة</div>'+
      '<div class="v27-common" id="v27Common"><button data-phrase="سبحان الله">سبحان الله</button><button data-phrase="الحمد لله">الحمد لله</button><button data-phrase="الله أكبر">الله أكبر</button><button data-phrase="لا إله إلا الله">لا إله إلا الله</button></div>'+
      '<button class="v27-wide-btn" id="v27CustomPhrase">إضافة ذكر مخصص ＋</button>'+
    '</div>';
  app.appendChild(tasbeehScreen);

  var prayerOverlay=document.createElement('div');
  prayerOverlay.className='overlay';
  prayerOverlay.id='v27PrayerOverlay';
  prayerOverlay.innerHTML='<section class="sheet v27-sheet"><div class="handle"></div><div class="sheet-head"><h2>إعدادات الصلاة</h2><button class="close" id="v27PrayerClose">×</button></div><label>طريقة الحساب<select id="v27Method"><option value="egypt">الهيئة المصرية العامة للمساحة</option><option value="mwl">رابطة العالم الإسلامي</option><option value="umm">أم القرى</option></select></label><label>حساب العصر<select id="v27Madhab"><option value="shafi">الشافعي</option><option value="hanafi">الحنفي</option></select></label><button class="primary" id="v27LocationSettings">تحديث الموقع الحالي</button></section>';
  body.appendChild(prayerOverlay);

  var tasOverlay=document.createElement('div');
  tasOverlay.className='overlay';
  tasOverlay.id='v27TasOverlay';
  tasOverlay.innerHTML='<section class="sheet v27-sheet"><div class="handle"></div><div class="sheet-head"><h2 id="v27TasModalTitle">إضافة ذكر</h2><button class="close" id="v27TasClose">×</button></div><input class="field" id="v27PhraseInput" placeholder="اكتب الذكر"><label>العدد المستهدف<input class="field" id="v27GoalInput" type="number" min="1" max="9999" inputmode="numeric"></label><div class="form-actions"><button class="primary" id="v27TasSave">حفظ</button><button class="secondary" id="v27TasCancel">إلغاء</button></div></section>';
  body.appendChild(tasOverlay);

  var oldHeader=duaaScreen.querySelector('.header');
  var oldHero=duaaScreen.querySelector('.hero');
  var oldTools=duaaScreen.querySelector('.duaa-tools');
  var oldAdd=duaaScreen.querySelector('.add');
  if(oldHeader)oldHeader.classList.add('v27-hide');
  if(oldHero)oldHero.classList.add('v27-hide');
  if(oldTools)oldTools.classList.add('v27-hide');
  if(oldAdd)oldAdd.classList.add('v27-hide');

  var duaaHead=document.createElement('header');
  duaaHead.className='v27-subhead v27-duaa-head';
  duaaHead.innerHTML='<button class="v27-circle" data-home>'+icons.back+'</button><h1>الأدعية</h1><div class="v27-head-tools"><button class="v27-circle" id="v27DuaaSearch">'+icons.search+'</button><button class="v27-circle" id="v27DuaaAdd">＋</button></div>';
  duaaScreen.prepend(duaaHead);

  var chips=document.createElement('div');
  chips.className='v27-chips';
  chips.innerHTML='<button class="active">الكل</button><button>المأثورة</button><button>من القرآن</button><button>الحياة اليومية</button><button>المفضلة</button>';
  duaaHead.insertAdjacentElement('afterend',chips);

  var searchBox=duaaScreen.querySelector('#duaaSearchBox');
  if(searchBox){chips.insertAdjacentElement('afterend',searchBox);searchBox.classList.add('v27-search')}

  if(notesScreen){
    var nhead=notesScreen.querySelector('.notes-head');
    if(nhead)nhead.classList.add('v27-hide');
    var nadd=notesScreen.querySelector('.add');
    if(nadd)nadd.classList.add('v27-hide');
    var notesHead=document.createElement('header');
    notesHead.className='v27-subhead';
    notesHead.innerHTML='<button class="v27-circle" data-home>'+icons.back+'</button><h1>الملاحظات</h1><button class="v27-circle" id="v27AddNote">＋</button>';
    notesScreen.prepend(notesHead);
  }

  var legacyTop=document.querySelector('.v17-top');
  if(legacyTop)legacyTop.classList.add('v27-hide');
  var releaseTop=document.querySelector('.release-top');
  if(releaseTop)releaseTop.classList.add('v27-hide');

  function rad(d){return d*Math.PI/180}
  function deg(r){return r*180/Math.PI}
  function norm(m){return ((m%1440)+1440)%1440}
  function dayOfYear(d){var s=new Date(d.getFullYear(),0,0);return Math.floor((d-s)/86400000)}
  function solar(date){
    var n=dayOfYear(date),g=2*Math.PI/365*(n-1);
    return {eq:229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g)),dec:.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g)};
  }
  function ha(lat,dec,alt){var v=(Math.sin(rad(alt))-Math.sin(rad(lat))*Math.sin(dec))/(Math.cos(rad(lat))*Math.cos(dec));return deg(Math.acos(Math.min(1,Math.max(-1,v))))}
  function prayerTimes(date){
    var s=solar(date),tz=-date.getTimezoneOffset()/60,noon=720-4*prayer.lon-s.eq+tz*60;
    var cfg=prayer.method==='mwl'?{f:18,i:17}:prayer.method==='umm'?{f:18.5,i:null}:{f:19.5,i:17.5};
    var sunrise=norm(noon-ha(prayer.lat,s.dec,-.833)*4),sunset=norm(noon+ha(prayer.lat,s.dec,-.833)*4);
    var ld=Math.abs(rad(prayer.lat)-s.dec),fac=prayer.madhab==='hanafi'?2:1,asrAlt=-deg(Math.atan(1/(fac+Math.tan(ld))));
    return {fajr:norm(noon-ha(prayer.lat,s.dec,-cfg.f)*4),sunrise:sunrise,dhuhr:norm(noon),asr:norm(noon+ha(prayer.lat,s.dec,asrAlt)*4),maghrib:sunset,isha:cfg.i===null?norm(sunset+90):norm(noon+ha(prayer.lat,s.dec,-cfg.i)*4)};
  }
  var names={fajr:'الفجر',sunrise:'الشروق',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
  var keys=['fajr','dhuhr','asr','maghrib','isha'];
  function minuteDate(base,m){var d=new Date(base.getFullYear(),base.getMonth(),base.getDate(),0,0,0);d.setMinutes(Math.round(m));return d}
  function fmt(d){return new Intl.DateTimeFormat('ar-EG',{hour:'2-digit',minute:'2-digit',hour12:true}).format(d)}
  function next(now){
    now=now||new Date();var t=prayerTimes(now);
    for(var i=0;i<keys.length;i++){var at=minuteDate(now,t[keys[i]]);if(at>now)return {key:keys[i],at:at,times:t}}
    var tom=new Date(now);tom.setDate(tom.getDate()+1);var tt=prayerTimes(tom);return {key:'fajr',at:minuteDate(tom,tt.fajr),times:t};
  }
  function countdownText(){
    var n=next(new Date()),sec=Math.max(0,Math.floor((n.at-Date.now())/1000)),h=Math.floor(sec/3600);sec%=3600;var m=Math.floor(sec/60),s=sec%60;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  function renderPrayer(){
    var now=new Date(),n=next(now),t=prayerTimes(now),cd=countdownText();
    document.querySelector('#v27NextName').textContent=names[n.key];
    document.querySelector('#v27NextClock').textContent=fmt(n.at);
    document.querySelector('#v27Countdown').textContent=cd;
    document.querySelector('#v27PrayerHeroName').textContent=names[n.key];
    document.querySelector('#v27PrayerHeroClock').textContent=fmt(n.at);
    document.querySelector('#v27PrayerHeroCountdown').textContent=cd;
    document.querySelector('#v27Place').textContent=prayer.place;
    document.querySelector('#v27Date').textContent=new Intl.DateTimeFormat('ar-EG',{weekday:'long',day:'numeric',month:'long'}).format(now);
    document.querySelector('#v27Method').value=prayer.method;
    document.querySelector('#v27Madhab').value=prayer.madhab;
    var order=['fajr','sunrise','dhuhr','asr','maghrib','isha'],out='';
    for(var i=0;i<order.length;i++){
      var k=order[i],active=k===n.key;
      out+='<article class="v27-prayer-row '+(active?'active':'')+'"><span class="v27-prayer-dot"></span><strong>'+names[k]+'</strong><time>'+fmt(minuteDate(now,t[k]))+'</time></article>';
    }
    document.querySelector('#v27PrayerList').innerHTML=out;
    document.querySelector('#v27Sunrise').textContent=fmt(minuteDate(now,t.sunrise));
    document.querySelector('#v27Midnight').textContent=fmt(minuteDate(now,norm((t.maghrib+t.fajr+1440)/2)));
  }
  function refreshCountdown(){
    var n=next(new Date()),cd=countdownText();
    var a=document.querySelector('#v27Countdown'),b=document.querySelector('#v27PrayerHeroCountdown');
    if(a)a.textContent=cd;if(b)b.textContent=cd;
    if(a&&document.querySelector('#v27NextName').textContent!==names[n.key])renderPrayer();
  }
  function useLocation(){
    if(!navigator.geolocation){toast('تحديد الموقع غير متاح');return}
    toast('جارٍ تحديد الموقع…');
    navigator.geolocation.getCurrentPosition(function(p){prayer.lat=p.coords.latitude;prayer.lon=p.coords.longitude;prayer.place='موقعي الحالي';savePrayer();renderPrayer();toast('تم تحديث الموقع')},function(){toast('تعذر الوصول إلى الموقع')},{timeout:10000,maximumAge:3600000});
  }

  var phrases=['سبحان الله','الحمد لله','الله أكبر','لا إله إلا الله','لا حول ولا قوة إلا بالله'];
  function phraseIndex(){var i=phrases.indexOf(tasbeeh.phrase);return i<0?0:i}
  function renderTas(){
    document.querySelector('#v27TasCount').textContent=tasbeeh.count;
    document.querySelector('#v27TasGoal').textContent='من '+tasbeeh.goal;
    document.querySelector('#v27TasPhrase').textContent=tasbeeh.phrase;
    document.querySelector('#v27Target b').textContent=tasbeeh.goal;
    document.querySelector('#v27Haptic b').textContent=tasbeeh.haptic?'مفعّل':'متوقف';
    var pct=Math.min(100,(tasbeeh.count%tasbeeh.goal)/tasbeeh.goal*100);
    document.querySelector('#v27TasRing').style.setProperty('--p',pct+'%');
    var common=document.querySelectorAll('#v27Common [data-phrase]');
    for(var i=0;i<common.length;i++)common[i].classList.toggle('active',common[i].dataset.phrase===tasbeeh.phrase);
  }
  function doHaptic(){
    if(!tasbeeh.haptic)return;
    try{if(navigator.vibrate)navigator.vibrate(18)}catch(e){}
    try{var h=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Haptics;if(h&&h.impact)h.impact({style:'LIGHT'})}catch(e){}
  }
  function count(){tasbeeh.count++;tasbeeh.total++;saveTasbeeh();renderTas();doHaptic();var b=document.querySelector('#v27CountMain');b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse')}
  function setPhrase(p){tasbeeh.phrase=p;tasbeeh.count=0;if(phrases.indexOf(p)<0)phrases.unshift(p);saveTasbeeh();renderTas()}

  var screenMap={home:home,prayer:prayerScreen,duaa:duaaScreen,tasbeeh:tasbeehScreen,notes:notesScreen};
  function show(name){
    var all=[home,prayerScreen,duaaScreen,tasbeehScreen,notesScreen,linksScreen];
    for(var i=0;i<all.length;i++)if(all[i])all[i].classList.remove('active');
    (screenMap[name]||home).classList.add('active');
    if(name==='prayer')renderPrayer();
    if(name==='tasbeeh')renderTas();
    window.scrollTo({top:0,behavior:'instant'});
  }

  var go=document.querySelectorAll('[data-go]');
  for(var i=0;i<go.length;i++)go[i].onclick=function(){show(this.dataset.go)};
  var homes=document.querySelectorAll('[data-home]');
  for(var j=0;j<homes.length;j++)homes[j].onclick=function(){show('home')};
  document.querySelector('#v27NextCard').onclick=function(){show('prayer')};
  document.querySelector('#v27Settings').onclick=function(){var x=document.querySelector('#settingsOverlay');if(x)x.classList.add('show')};
  document.querySelector('#v27DuaaSearch').onclick=function(){var b=document.querySelector('#duaaSearchToggle');if(b)b.click()};
  document.querySelector('#v27DuaaAdd').onclick=function(){openEditor()};
  if(document.querySelector('#v27AddNote'))document.querySelector('#v27AddNote').onclick=function(){var b=document.querySelector('#quickAddNote');if(b)b.click()};

  document.querySelector('#v27PrayerSettings').onclick=function(){prayerOverlay.classList.add('show')};
  document.querySelector('#v27PrayerClose').onclick=function(){prayerOverlay.classList.remove('show')};
  document.querySelector('#v27UseLocation').onclick=useLocation;
  document.querySelector('#v27LocationSettings').onclick=useLocation;
  document.querySelector('#v27Method').onchange=function(e){prayer.method=e.target.value;savePrayer();renderPrayer()};
  document.querySelector('#v27Madhab').onchange=function(e){prayer.madhab=e.target.value;savePrayer();renderPrayer()};
  prayerOverlay.onclick=function(e){if(e.target===prayerOverlay)prayerOverlay.classList.remove('show')};

  document.querySelector('#v27CountMain').onclick=count;
  document.querySelector('#v27TasRing').onclick=count;
  document.querySelector('#v27Reset').onclick=function(){tasbeeh.count=0;saveTasbeeh();renderTas();toast('تمت إعادة العداد')};
  document.querySelector('#v27Haptic').onclick=function(){tasbeeh.haptic=!tasbeeh.haptic;saveTasbeeh();renderTas();doHaptic()};
  document.querySelector('#v27PrevPhrase').onclick=function(){var i=phraseIndex();setPhrase(phrases[(i-1+phrases.length)%phrases.length])};
  document.querySelector('#v27NextPhrase').onclick=function(){var i=phraseIndex();setPhrase(phrases[(i+1)%phrases.length])};
  var cp=document.querySelectorAll('#v27Common [data-phrase]');
  for(var k=0;k<cp.length;k++)cp[k].onclick=function(){setPhrase(this.dataset.phrase)};
  function openTas(mode){
    tasOverlay.dataset.mode=mode;
    document.querySelector('#v27TasModalTitle').textContent=mode==='goal'?'تحديد الهدف':'إضافة ذكر';
    document.querySelector('#v27PhraseInput').hidden=mode==='goal';
    document.querySelector('#v27PhraseInput').value=tasbeeh.phrase;
    document.querySelector('#v27GoalInput').value=tasbeeh.goal;
    tasOverlay.classList.add('show');
  }
  document.querySelector('#v27Target').onclick=function(){openTas('goal')};
  document.querySelector('#v27CustomPhrase').onclick=function(){openTas('phrase')};
  document.querySelector('#v27TasSettings').onclick=function(){openTas('goal')};
  document.querySelector('#v27TasClose').onclick=document.querySelector('#v27TasCancel').onclick=function(){tasOverlay.classList.remove('show')};
  document.querySelector('#v27TasSave').onclick=function(){
    var g=parseInt(document.querySelector('#v27GoalInput').value||tasbeeh.goal,10);
    tasbeeh.goal=Math.max(1,Math.min(9999,g||100));
    if(tasOverlay.dataset.mode!=='goal'){var p=document.querySelector('#v27PhraseInput').value.trim();if(p)setPhrase(p)}
    saveTasbeeh();renderTas();tasOverlay.classList.remove('show');
  };
  tasOverlay.onclick=function(e){if(e.target===tasOverlay)tasOverlay.classList.remove('show')};

  renderPrayer();
  renderTas();
  show('home');
  setInterval(refreshCountdown,1000);
})();