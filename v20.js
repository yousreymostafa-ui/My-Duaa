/* My-Duaa v20 — move standalone note actions to bottom */
(function(){
  const style=document.createElement('style');
  style.id='v20-note-actions-bottom';
  style.textContent=`
    .note-card{padding:16px 17px 58px!important}
    .note-card-title{padding-left:0!important}
    .note-card-actions{top:auto!important;bottom:12px!important;left:14px!important;right:auto!important}
  `;
  document.head.appendChild(style);
})();
