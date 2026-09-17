/* My-Duaa v23 — next prayer timing */
(function(){
  if(window.__myDuaaPrayerV23)return;
  window.__myDuaaPrayerV23=true;

  const LOCATION_KEY='my_duaa_prayer_location_v1';
  const CACHE_KEY='my_duaa_prayer_cache_v1';
  const DEFAULT_LOCATION={lat:30.0444,lon:31.2357,label:'القاهرة'};
  const METHOD=5; // Egyptian General Authority of Survey
  const PRAYERS=[
    ['Fajr','الفجر'],
    ['Dhuhr','الظهر'],
    ['Asr','العصر'],
    ['Maghrib','المغرب'],
    ['Isha','العشاء']
  ];
  let currentLocation=loadLocation();
  let nextPrayer=null;
  let countdownTimer=null;

  function loadLocation(){
    try{
      const v=JSON.parse(localStorage.getItem(LOCATION_KEY)||'null');
      if(v&&Number.isFinite(v.lat)&&Number.isFinite(v.lon))return v;
    }catch{}
    return DEFAULT_LOCATION;
  }
  function saveLocation(loc){
    currentLocation=loc;
    try{localStorage.setItem(LOCATION_KEY,JSON.stringify(loc))}catch{}
  }
  function pad(n){return String(n).padStart(2,'0')}
  function dateKey(d){return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`}
  function cleanTime(v=''){return String(v).match(/\d{1,2}:\d{2}/)?.[0]||''}
  function timeToDate(base,time){
    const [h,m]=cleanTime(time).split(':').map(Number);
    const d=new Date(base);d.setHours(h,m,0,0);return d;
  }
  function formatClock(d){
    try{return new Intl.DateTimeFormat('ar-EG',{hour:'numeric',minute:'2-digit',hour12:true}).format(d)}catch{return `${pad(d.getHours())}:${pad(d.getMinutes())}`}
  }
  function cacheId(loc,date){return `${date}|${loc.lat.toFixed(3)}|${loc.lon.toFixed(3)}|${METHOD}`}
  function readCache(id){
    try{const all=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');return all[id]||null}catch{return null}
  }
  function writeCache(id,data){
    try{
      const all=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');
      all[id]={savedAt:Date.now(),data};
      const entries=Object.entries(all).sort((a,b)=>(b[1]?.savedAt||0)-(a[1]?.savedAt||0)).slice(0,8);
      localStorage.setItem(CACHE_KEY,JSON.stringify(Object.fromEntries(entries)));
    }catch{}
  }
  async function getTimings(loc,day){
    const date=dateKey(day),id=cacheId(loc,date),cached=readCache(id);
    if(cached?.data)return cached.data;
    const url=`https://api.aladhan.com/v1/timings/${date}?latitude=${encodeURIComponent(loc.lat)}&longitude=${encodeURIComponent(loc.lon)}&method=${METHOD}`;
    const res=await fetch(url,{cache:'no-store'});
    if(!res.ok)throw new Error('prayer fetch failed');
    const json=await res.json();
    const timings=json?.data?.timings;
    if(!timings)throw new Error('no timings');
    const data={timings,timezone:json?.data?.meta?.timezone||''};
    writeCache(id,data);return data;
  }
  async function calculateNext(){
    const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const data=await getTimings(currentLocation,today);
    for(const [key,label] of PRAYERS){
      const at=timeToDate(today,data.timings[key]);
      if(at>now)return {key,label,at,location:currentLocation.label||'موقعي'};
    }
    const tomorrow=new Date(today);tomorrow.setDate(tomorrow.getDate()+1);
    const tomorrowData=await getTimings(currentLocation,tomorrow);
    const at=timeToDate(tomorrow,tomorrowData.timings.Fajr);
    return {key:'Fajr',label:'الفجر',at,location:currentLocation.label||'موقعي'};
  }
  function countdownText(target){
    const ms=target-Date.now();
    if(ms<=0)return 'حان وقت الصلاة';
    const total=Math.ceil(ms/60000),h=Math.floor(total/60),m=total%60;
    if(h>0)return `متبقي ${h} س ${m?`و ${m} د`:''}`;
    return `متبقي ${m} دقيقة`;
  }
  function render(){
    const card=document.querySelector('#v23PrayerCard');if(!card)return;
    const name=card.querySelector('#v23PrayerName'),time=card.querySelector('#v23PrayerTime'),count=card.querySelector('#v23PrayerCountdown'),loc=card.querySelector('#v23PrayerLocation');
    if(!nextPrayer){name.textContent='جاري حساب الصلاة القادمة';time.textContent='';count.textContent='';loc.textContent=currentLocation.label||'القاهرة';return}
    name.textContent=nextPrayer.label;
    time.textContent=formatClock(nextPrayer.at);
    count.textContent=countdownText(nextPrayer.at);
    loc.textContent=nextPrayer.location;
  }
  async function refresh(){
    try{nextPrayer=null;render();nextPrayer=await calculateNext();render();}
    catch{
      const card=document.querySelector('#v23PrayerCard');if(!card)return;
      card.querySelector('#v23PrayerName').textContent='تعذر تحديث مواقيت الصلاة';
      card.querySelector('#v23PrayerTime').textContent='';
      card.querySelector('#v23PrayerCountdown').textContent='تحقق من الاتصال وحاول مرة أخرى';
    }
  }
  function useMyLocation(){
    const btn=document.querySelector('#v23PrayerLocate');
    if(!navigator.geolocation){if(typeof toast==='function')toast('تحديد الموقع غير مدعوم');return}
    btn?.classList.add('loading');
    navigator.geolocation.getCurrentPosition(pos=>{
      saveLocation({lat:pos.coords.latitude,lon:pos.coords.longitude,label:'موقعي'});
      btn?.classList.remove('loading');
      if(typeof toast==='function')toast('تم تحديث الموقع');
      refresh();
    },()=>{
      btn?.classList.remove('loading');
      if(typeof toast==='function')toast('تعذر الوصول للموقع');
    },{enableHighAccuracy:false,timeout:9000,maximumAge:3600000});
  }
  function installStyle(){
    if(document.querySelector('#v23-prayer-style'))return;
    const style=document.createElement('style');style.id='v23-prayer-style';style.textContent=`
      .v23-prayer-card{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;margin:2px 4px 14px;padding:12px 13px;border:1px solid rgba(183,164,128,.18);border-radius:23px;background:rgba(255,253,248,.92);box-shadow:0 8px 22px rgba(73,61,40,.07);direction:rtl;text-align:right}
      .v23-prayer-icon{width:42px;height:42px;border-radius:15px;display:grid;place-items:center;background:#f4ecdb;color:#a98d55;border:1px solid rgba(169,141,85,.14);font-size:21px;flex:0 0 auto}
      .v23-prayer-copy{min-width:0;display:grid;gap:2px}
      .v23-prayer-kicker{font-size:10px;font-weight:800;color:#9c8559}
      .v23-prayer-line{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}
      .v23-prayer-name{font-size:17px;font-weight:900;color:#314035}
      .v23-prayer-time{font-size:16px;font-weight:850;color:#667760;direction:rtl}
      .v23-prayer-meta{display:flex;align-items:center;gap:6px;min-width:0;color:#8b8376;font-size:10px;line-height:1.4}
      .v23-prayer-dot{width:3px;height:3px;border-radius:50%;background:#c9b895;flex:0 0 auto}
      .v23-prayer-location{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}
      .v23-prayer-locate{width:38px;height:38px;border-radius:13px;border:1px solid rgba(183,164,128,.20);background:#fffdfa;color:#667760;display:grid;place-items:center;padding:0;box-shadow:none}
      .v23-prayer-locate svg{width:18px;height:18px}
      .v23-prayer-locate.loading{opacity:.5;pointer-events:none}
      html[data-design="night"] .v23-prayer-card,html[data-design="darkgold"] .v23-prayer-card{background:color-mix(in srgb,var(--surface) 94%,transparent);border-color:var(--line)}
      html[data-design="night"] .v23-prayer-name,html[data-design="darkgold"] .v23-prayer-name{color:var(--text)}
      @media(max-width:520px){.v23-prayer-card{margin:0 3px 12px;padding:11px 11px;gap:10px;border-radius:20px}.v23-prayer-icon{width:39px;height:39px;border-radius:13px}.v23-prayer-name{font-size:16px}.v23-prayer-time{font-size:15px}.v23-prayer-locate{width:36px;height:36px}}
    `;document.head.appendChild(style);
  }
  function mount(){
    if(document.querySelector('#v23PrayerCard'))return true;
    const top=document.querySelector('.v17-top'),list=document.querySelector('#list');
    if(!top||!list)return false;
    installStyle();
    const card=document.createElement('section');card.id='v23PrayerCard';card.className='v23-prayer-card';
    card.innerHTML=`<div class="v23-prayer-icon" aria-hidden="true">☾</div><div class="v23-prayer-copy"><div class="v23-prayer-kicker">الصلاة القادمة</div><div class="v23-prayer-line"><strong class="v23-prayer-name" id="v23PrayerName">جاري الحساب</strong><span class="v23-prayer-time" id="v23PrayerTime"></span></div><div class="v23-prayer-meta"><span id="v23PrayerCountdown"></span><i class="v23-prayer-dot"></i><span class="v23-prayer-location" id="v23PrayerLocation"></span></div></div><button class="v23-prayer-locate" id="v23PrayerLocate" type="button" aria-label="استخدم موقعي" title="استخدم موقعي"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button>`;
    top.insertAdjacentElement('afterend',card);
    card.querySelector('#v23PrayerLocate').onclick=useMyLocation;
    refresh();
    clearInterval(countdownTimer);countdownTimer=setInterval(()=>{
      if(nextPrayer&&nextPrayer.at<=new Date()){refresh();return}
      render();
    },30000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&nextPrayer&&Date.now()>nextPrayer.at.getTime())refresh()});
    return true;
  }
  if(!mount()){
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),10000);
  }
})();
