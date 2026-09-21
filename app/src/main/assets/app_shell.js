(function(){
  'use strict';
  const TOKEN='mahindra_secure_token_v1', USER='mahindra_secure_user_v1', MODE='mahindra_user_role_v2';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getUser=()=>{try{return JSON.parse(localStorage.getItem(USER)||'null')}catch(e){return null}};
  const role=()=>String(getUser()?.role||'').toUpperCase();
  const name=()=>getUser()?.name||'';
  const hideOld=()=>{['home','screen','topIntro','languagePanel'].forEach(id=>document.getElementById(id)?.classList.add('hide'));document.getElementById('modeOverlay')?.remove();};
  const app=document.body;
  const oldSecureAdmin=window.secureAdmin, oldSecureMechanic=window.secureMechanic, oldProblem=window.problem, oldAbout=window.about, oldShow=window.show;

  const css=`
  <style id="ma-fast-ai-style">
  body{background:#f5f7fa!important;color:#17202a!important}
  #maApp{min-height:100vh;background:#f5f7fa;font-family:Arial,sans-serif}
  .ma-bar{position:fixed;top:0;left:0;right:0;height:64px;background:#b71c1c;color:#fff;z-index:100000;display:flex;align-items:center;padding:0 14px;box-sizing:border-box;box-shadow:0 2px 10px #0003}
  .ma-bar .ma-icon{width:42px;height:42px;border:0;border-radius:11px;background:#fff1;color:#fff;font-size:23px;font-weight:900;display:flex;align-items:center;justify-content:center}
  .ma-title{flex:1;padding:0 12px;font-weight:900;font-size:17px;letter-spacing:.3px;line-height:1.05}.ma-title small{display:block;font-size:11px;opacity:.82;margin-top:4px}
  .ma-main{padding:82px 16px 30px;max-width:760px;margin:auto;box-sizing:border-box}
  .ma-hero{background:#fff;border-radius:18px;padding:20px;box-shadow:0 2px 12px #0001;margin-bottom:14px}.ma-brand{font-size:25px;font-weight:900}.ma-sub{margin-top:5px;color:#667085;font-size:14px}.ma-role{display:inline-flex;margin-top:14px;padding:7px 11px;border-radius:999px;background:#17202a;color:#fff;font-size:12px;font-weight:900}
  .ma-section{font-size:14px;font-weight:900;color:#667085;text-transform:uppercase;letter-spacing:.8px;margin:18px 2px 9px}
  .ma-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.ma-card{border:0;background:#fff;border-radius:16px;padding:18px 14px;text-align:left;box-shadow:0 2px 10px #0001;min-height:104px;font-size:15px;font-weight:900;color:#17202a}.ma-card b{display:block;font-size:28px;margin-bottom:9px}.ma-card span{display:block}.ma-card small{display:block;color:#667085;font-weight:600;margin-top:5px;line-height:1.25}
  .ma-primary{background:#b71c1c!important;color:#fff!important}
  .ma-drawer{position:fixed;inset:0;z-index:100010;background:#0006;display:none}.ma-drawer.open{display:block}.ma-sheet{position:absolute;top:0;right:0;width:min(88vw,370px);height:100%;background:#fff;padding:20px;box-sizing:border-box;box-shadow:-8px 0 25px #0003}.ma-sheet-head{display:flex;align-items:center;gap:10px;padding-bottom:16px;border-bottom:1px solid #e6e8ec}.ma-sheet-head strong{flex:1}.ma-menu-btn{width:100%;border:0;background:#f4f5f7;margin-top:9px;padding:15px;border-radius:12px;text-align:left;font-size:15px;font-weight:800;color:#17202a}.ma-menu-btn.danger{background:#fff0f0;color:#b71c1c}
  .ma-backbar{position:fixed;top:64px;left:0;right:0;height:48px;background:#fff;border-bottom:1px solid #e5e7eb;z-index:99990;display:flex;align-items:center;padding:0 14px;box-sizing:border-box}.ma-backbar button{border:0;background:transparent;font-size:14px;font-weight:900;color:#17202a;padding:9px}.ma-backbar .home{margin-left:auto;color:#b71c1c}
  .auth-card{max-width:420px!important;border-radius:22px!important;box-shadow:0 8px 30px #0002!important}
  @media(max-width:420px){.ma-grid{grid-template-columns:1fr}.ma-card{min-height:88px}.ma-main{padding-left:13px;padding-right:13px}}
  </style>`;
  document.head.insertAdjacentHTML('beforeend',css);

  function logout(){localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);sessionStorage.removeItem('ma_fast_boot_v1');location.reload();}
  window.maLogout=logout;
  function closeDrawer(){document.getElementById('maDrawer')?.classList.remove('open')}
  function menu(){document.getElementById('maDrawer')?.classList.add('open')}
  function runAction(fn){closeDrawer();setTimeout(fn,40)}
  function oldDriverCard(label){
    hideOld();const home=document.getElementById('home');
    if(!home||typeof window.renderHome!=='function')return;
    window.renderHome();const cards=[...home.querySelectorAll('.card')];
    const card=cards.find(c=>(c.innerText||'').toLowerCase().includes(label.toLowerCase()));
    if(card){card.click();return} if(label==='vehicle'&&oldProblem)oldProblem();
  }
  function dashboard(){
    hideOld();document.getElementById('secureAuth')?.remove();
    let root=document.getElementById('maApp');if(root)root.remove();
    root=document.createElement('div');root.id='maApp';
    const r=role(),u=getUser(),isAdmin=r==='ADMIN',isMech=r==='MECHANIC';
    const cards=isAdmin?[
      ['👥','User Management','Create, activate and manage accounts',()=>oldSecureAdmin&&oldSecureAdmin()],
      ['📋','Daily Work','View mechanic work records',()=>oldSecureAdmin&&oldSecureAdmin()],
      ['📚','Mahindra Data','Open the supplied BSVI source library',()=>oldAbout&&oldAbout()],
      ['🧭','App Help','See how each role uses the app',()=>help()]
    ]:isMech?[
      ['🔧','Daily Work','Record vehicle work and save centrally',()=>oldSecureMechanic&&oldSecureMechanic()],
      ['📚','Mahindra Data','Open the supplied BSVI source library',()=>oldAbout&&oldAbout()],
      ['🧭','App Help','Simple step-by-step mechanic help',()=>help()]
    ]:[
      ['📷','Vehicle Problem','Take a photo + speak the problem',()=>oldProblem&&oldProblem()],
      ['🚨','Warning Lights','What to do when a warning lamp appears',()=>oldDriverCard('warning')],
      ['♻️','DPF Regeneration','Follow the supplied DPF guidance',()=>oldDriverCard('dpf')],
      ['🔧','Daily Check','Before driving checklist',()=>oldDriverCard('daily')],
      ['💧','AdBlue / DEF','Basic operating guidance',()=>oldDriverCard('adblue')],
      ['🛑','Driver Safety','Safety guidance',()=>oldDriverCard('safety')],
      ['📚','Mahindra Data','Open the supplied BSVI source library',()=>oldAbout&&oldAbout()],
      ['🧭','App Help','Get help at every step',()=>help()]
    ];
    root.innerHTML=`<div class="ma-bar"><button class="ma-icon" aria-label="menu" onclick="maOpenMenu()">☰</button><div class="ma-title">MAHINDRA BSVI DRIVER GUIDE AI<small>Secure operational assistant</small></div><button class="ma-icon" aria-label="logout" onclick="maLogout()">⎋</button></div><main class="ma-main"><section class="ma-hero"><div class="ma-brand">Welcome, ${esc(u?.name||'User')}</div><div class="ma-sub">Your role controls the tools shown below.</div><div class="ma-role">🔐 ${esc(r||'USER')}</div></section><div class="ma-section">Quick actions</div><section class="ma-grid" id="maCards"></section></main><div id="maDrawer" class="ma-drawer" onclick="if(event.target===this)maCloseMenu()"><aside class="ma-sheet"><div class="ma-sheet-head"><strong>MENU<br><small style="color:#667085">${esc(r)} • ${esc(u?.name||'')}</small></strong><button class="ma-icon" style="background:#17202a" onclick="maCloseMenu()">×</button></div><button class="ma-menu-btn" onclick="maDashboard()">⌂ Dashboard</button><div id="maMenuItems"></div><button class="ma-menu-btn" onclick="maOpenHelp()">🧭 App Help</button><button class="ma-menu-btn danger" onclick="maLogout()">⎋ Log out</button></aside></div>`;
    app.appendChild(root);
    const box=root.querySelector('#maCards');cards.forEach((c,i)=>{const b=document.createElement('button');b.className='ma-card'+(i===0?' ma-primary':'');b.innerHTML=`<b>${c[0]}</b><span>${esc(c[1])}</span><small>${esc(c[2])}</small>`;b.onclick=c[3];box.appendChild(b)});
    const mi=root.querySelector('#maMenuItems');cards.forEach(c=>{const b=document.createElement('button');b.className='ma-menu-btn';b.textContent=c[0]+'  '+c[1];b.onclick=c[3];mi.appendChild(b)});
  }
  function help(){
    hideOld();const r=role();
    const title=r==='ADMIN'?'ADMIN — what you can do':r==='MECHANIC'?'MECHANIC — what you can do':'DRIVER — what you can do';
    const items=r==='ADMIN'?['Manage Driver and Mechanic accounts','Activate / disable users','Change roles','View Daily Work records','Export records','Open Mahindra source material']:r==='MECHANIC'?['Open Daily Work','Enter vehicle number','Speak what work was completed','Save centrally','Refresh records from the central sheet','Open Mahindra source material']:['Report a vehicle problem','Take a photo directly with the phone camera','Speak in Hindi, Kannada or English','Open warning-light guidance','Open DPF guidance','Open the supplied Mahindra source library'];
    showContent(title,items.map((x,i)=>`<div style="background:#fff;padding:15px;border-radius:13px;margin:9px 0;box-shadow:0 1px 7px #0001"><b>${i+1}. ${esc(x)}</b></div>`).join(''));
  }
  function showContent(title,html){
    hideOld();document.getElementById('secureAuth')?.remove();let root=document.getElementById('maApp');if(root)root.remove();
    root=document.createElement('div');root.id='maApp';root.innerHTML=`<div class="ma-bar"><button class="ma-icon" onclick="maBack()">‹</button><div class="ma-title">${esc(title)}<small>${esc(role())} • ${esc(name())}</small></div><button class="ma-icon" onclick="maDashboard()">⌂</button></div><main class="ma-main" style="padding-top:126px"><div>${html}</div></main>`;app.appendChild(root);
  }
  window.maOpenMenu=menu;window.maCloseMenu=closeDrawer;window.maDashboard=dashboard;window.maOpenHelp=()=>runAction(help);window.maBack=()=>dashboard();

  window.show=function(title,body,buttons){
    closeDrawer();if(oldShow)oldShow(title,body,buttons);
    const s=document.getElementById('screen');if(!s)return;
    s.querySelectorAll('.page-nav').forEach(x=>x.remove());const old=document.getElementById('maBackBar');if(old)old.remove();
    const bar=document.createElement('div');bar.id='maBackBar';bar.className='ma-backbar';bar.innerHTML=`<button onclick="maBack()">‹ Back</button><strong style="font-size:14px">${esc(title||'')}</strong><button class="home" onclick="maDashboard()">⌂ Home</button>`;
    app.appendChild(bar);document.getElementById('maApp')?.remove();s.classList.remove('hide');s.style.paddingTop='126px';
  };

  window.finalHome=dashboard;window.uxHome=dashboard;
  window.secureAdmin=function(){if(oldSecureAdmin){showContent('ADMIN DASHBOARD','<div class="notice">Opening secure administration…</div>');setTimeout(oldSecureAdmin,20)}};
  window.secureMechanic=function(){if(oldSecureMechanic){showContent('MECHANIC DAILY WORK','<div class="notice">Opening secure mechanic tools…</div>');setTimeout(oldSecureMechanic,20)}};
  window.routeAfterLogin=function(){dashboard()};

  window.driverCamera=function(){
    const st=document.getElementById('driverPhotoStatus')||document.getElementById('photoStatus');if(st)st.textContent='📷 Opening camera…';
    if(window.AndroidBridge&&AndroidBridge.captureDriverPhoto){AndroidBridge.captureDriverPhoto();return}
    const input=document.getElementById('driverCameraInput')||document.getElementById('problemCamera');if(input)input.click();
  };
  window.openProblemCamera=window.driverCamera;
  window.nativeCameraResult=function(ok){const st=document.getElementById('driverPhotoStatus')||document.getElementById('photoStatus');if(st)st.textContent=ok?'✅ Photo captured. Now speak or type the problem.':'❌ Camera was not completed. Tap Take Photo again.'};

  if(!sessionStorage.getItem('ma_fast_boot_v1')){
    sessionStorage.setItem('ma_fast_boot_v1','1');localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);
    setTimeout(()=>location.reload(),30);return;
  }
  hideOld();
  setTimeout(()=>{if(!localStorage.getItem(TOKEN)||!localStorage.getItem(USER)){window.scrollTo(0,0)}else dashboard()},80);
})();