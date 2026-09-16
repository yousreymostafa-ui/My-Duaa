/* My-Duaa v20 — Option 6 gradient header + note card action polish */
(function(){
  const style=document.createElement('style');
  style.id='v20-gradient-header';
  style.textContent=`
    /* Reduce the dead space below the iPhone/browser status area */
    .app{padding-top:env(safe-area-inset-top)!important}

    /* Option 6 — soft gradient top */
    .v17-top{
      margin-top:0!important;
      margin-bottom:14px!important;
      padding:4px 12px 14px!important;
      border-radius:0 0 32px 32px!important;
      background:
        radial-gradient(circle at 14% 18%,color-mix(in srgb,var(--gold) 18%,transparent),transparent 24%),
        radial-gradient(circle at 88% 24%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 28%),
        linear-gradient(145deg,color-mix(in srgb,var(--surface) 91%,#f0d3a7 9%),color-mix(in srgb,var(--bg) 83%,var(--gold) 17%))!important;
      box-shadow:0 10px 28px color-mix(in srgb,var(--text) 5%,transparent);
    }
    .v17-top:before{
      background:
        radial-gradient(circle at 12% 18%,color-mix(in srgb,var(--gold) 16%,transparent),transparent 22%),
        radial-gradient(circle at 86% 16%,color-mix(in srgb,var(--surface) 58%,transparent),transparent 24%)!important;
      opacity:.9;
    }
    .v17-top:after{
      height:126px!important;
      bottom:72px!important;
      opacity:.13!important;
      background-position:center bottom!important;
      background-size:cover!important;
    }
    .v17-brand{padding-top:0!important}
    .v17-brand .brand-row{gap:1px!important}
    .v17-brand .brand-logo{
      width:50px!important;
      height:58px!important;
      margin:0 auto!important;
    }
    .v17-brand h1{
      font-size:38px!important;
      line-height:1!important;
      letter-spacing:-.8px!important;
    }
    .v17-brand .count{
      margin-top:5px!important;
      font-size:15px!important;
    }
    .v17-brand .tagline{
      margin:10px 0 2px!important;
      font-size:15px!important;
      line-height:1.45!important;
    }
    .v17-actions{
      margin:12px -12px -14px!important;
      padding:12px 8px 11px!important;
      gap:4px!important;
      border-top:1px solid color-mix(in srgb,var(--gold) 20%,var(--line))!important;
      border-radius:0 0 32px 32px;
      background:color-mix(in srgb,var(--surface) 88%,transparent);
      backdrop-filter:blur(12px);
      -webkit-backdrop-filter:blur(12px);
    }
    .v17-action{gap:5px!important}
    .v17-action .icon,.v17-action .small-tool{
      width:49px!important;
      height:49px!important;
      box-shadow:0 6px 16px color-mix(in srgb,var(--text) 6%,transparent)!important;
    }
    .v17-action .icon svg,.v17-action .small-tool svg{width:22px!important;height:22px!important}
    .v17-label{font-size:10px!important;font-weight:780!important}
    .v17-search-wrap{margin:23px auto 0!important}

    /* Standalone notes: move edit/delete actions to the bottom of the card */
    .note-card{padding:16px 17px 13px!important}
    .note-card-title{padding-left:0!important}
    .note-card-actions{
      position:static!important;
      width:100%!important;
      margin-top:13px!important;
      padding-top:10px!important;
      border-top:1px solid var(--line)!important;
      display:flex!important;
      justify-content:flex-start!important;
      gap:6px!important;
      direction:ltr!important;
    }

    @media(max-width:520px){
      .v17-top{padding:2px 8px 12px!important;border-radius:0 0 28px 28px!important}
      .v17-top:after{height:112px!important;bottom:68px!important}
      .v17-brand .brand-logo{width:46px!important;height:54px!important}
      .v17-brand h1{font-size:36px!important}
      .v17-brand .count{font-size:14px!important}
      .v17-brand .tagline{font-size:14px!important;margin-top:9px!important}
      .v17-actions{margin:10px -8px -12px!important;padding:11px 5px 10px!important;border-radius:0 0 28px 28px!important}
      .v17-action .icon,.v17-action .small-tool{width:46px!important;height:46px!important}
      .v17-label{font-size:9.5px!important}
      .v17-search-wrap{margin-top:21px!important}
    }
    @media(max-width:370px){
      .v17-brand h1{font-size:34px!important}
      .v17-action .icon,.v17-action .small-tool{width:43px!important;height:43px!important}
      .v17-label{font-size:9px!important}
    }
  `;
  document.head.appendChild(style);
})();
