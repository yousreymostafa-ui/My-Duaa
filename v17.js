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
