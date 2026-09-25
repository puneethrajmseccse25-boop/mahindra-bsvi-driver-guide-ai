(function(){
  'use strict';
  const TOKEN='mahindra_secure_token_v1', USER='mahindra_secure_user_v1', MODE='mahindra_user_role_v2';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getUser=()=>{try{return JSON.parse(localStorage.getItem(USER)||'null')}catch(e){return null}};
  const role=()=>{const r=String(getUser()?.role||'').toUpperCase();return r==='USER'?'DRIVER':r;};
  const name=()=>getUser()?.name||'';
  const hideOld=()=>{['home','screen','topIntro','languagePanel'].forEach(id=>document.getElementById(id)?.classList.add('hide'));document.getElementById('modeOverlay')?.remove();};
  const app=document.body;
  const LANG_KEY='mahindra_app_language_v1';
  const LANGS={en:'English',kn:'ಕನ್ನಡ',hi:'हिन्दी'};
  const getLang=()=>localStorage.getItem(LANG_KEY)||'en';
  const setLang=(v)=>{localStorage.setItem(LANG_KEY,['en','kn','hi'].includes(v)?v:'en');dashboard();};
  const tr={
    en:{dashboard:'Dashboard',menu:'MENU',home:'Home',back:'Back',logout:'Log out',help:'App Help',language:'Language',driver:'Driver',mechanic:'Mechanic',admin:'Administrator',daily:'DAILY WORK UPDATE',records:'MY WORK RECORDS',warning:'WARNING LIGHTS',dpf:'DPF REGENERATION',dailyCheck:'DAILY CHECK',adblue:'ADBLUE / DEF',safety:'DRIVER SAFETY',vehicle:'VEHICLE PROBLEM',data:'MAHINDRA DATA',voice:'VOICE UPDATE',save:'SAVE DAILY UPDATE',export:'DOWNLOAD DATA',allRecords:'ALL MECHANIC RECORDS',yourRecords:'YOUR RECORDS',read:'READ STEPS',video:'REAL VIDEO',openYoutube:'OPEN VIDEO ON YOUTUBE',noRecords:'No records yet.',loading:'Loading…',name:'Name',mobile:'Mobile',role:'Role',status:'Status',work:'Work completed',vehicleNo:'Vehicle number',problem:'Problem / warning text'},
    kn:{dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',menu:'ಮೆನು',home:'ಹೋಮ್',back:'ಹಿಂದೆ',logout:'ಲಾಗ್ ಔಟ್',help:'ಆಪ್ ಸಹಾಯ',language:'ಭಾಷೆ',driver:'ಚಾಲಕ',mechanic:'ಮೆಕಾನಿಕ್',admin:'ನಿರ್ವಾಹಕರು',daily:'ದಿನನಿತ್ಯದ ಕೆಲಸದ ಅಪ್‌ಡೇಟ್',records:'ನನ್ನ ಕೆಲಸದ ದಾಖಲೆಗಳು',warning:'ವಾರ್ನಿಂಗ್ ಲೈಟ್‌ಗಳು',dpf:'DPF ರಿಜೆನರೇಷನ್',dailyCheck:'ದಿನನಿತ್ಯದ ತಪಾಸಣೆ',adblue:'ADBLUE / DEF',safety:'ಚಾಲಕ ಸುರಕ್ಷತೆ',vehicle:'ವಾಹನದ ಸಮಸ್ಯೆ',data:'ಮಹೀಂದ್ರಾ ಡೇಟಾ',voice:'ಧ್ವನಿ ಅಪ್‌ಡೇಟ್',save:'ದಿನನಿತ್ಯದ ಅಪ್‌ಡೇಟ್ ಉಳಿಸಿ',export:'ಡೇಟಾ ಡೌನ್‌ಲೋಡ್',allRecords:'ಎಲ್ಲಾ ಮೆಕಾನಿಕ್ ದಾಖಲೆಗಳು',yourRecords:'ನನ್ನ ದಾಖಲೆಗಳು',read:'ಹಂತಗಳನ್ನು ಕೇಳಿ',video:'ನೈಜ ವೀಡಿಯೋ',openYoutube:'ಯೂಟ್ಯೂಬ್‌ನಲ್ಲಿ ವೀಡಿಯೋ ತೆರೆಯಿರಿ',noRecords:'ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ.',loading:'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',name:'ಹೆಸರು',mobile:'ಮೊಬೈಲ್',role:'ಪಾತ್ರ',status:'ಸ್ಥಿತಿ',work:'ಮಾಡಿದ ಕೆಲಸ',vehicleNo:'ವಾಹನ ಸಂಖ್ಯೆ',problem:'ಸಮಸ್ಯೆ / ವಾರ್ನಿಂಗ್'},
    hi:{dashboard:'डैशबोर्ड',menu:'मेनू',home:'होम',back:'वापस',logout:'लॉग आउट',help:'ऐप सहायता',language:'भाषा',driver:'ड्राइवर',mechanic:'मैकेनिक',admin:'एडमिनिस्ट्रेटर',daily:'दैनिक काम अपडेट',records:'मेरे काम के रिकॉर्ड',warning:'वार्निंग लाइट',dpf:'DPF रीजेनेरेशन',dailyCheck:'दैनिक जांच',adblue:'ADBLUE / DEF',safety:'ड्राइवर सुरक्षा',vehicle:'वाहन की समस्या',data:'महिंद्रा डेटा',voice:'वॉइस अपडेट',save:'दैनिक अपडेट सेव करें',export:'डेटा डाउनलोड',allRecords:'सभी मैकेनिक रिकॉर्ड',yourRecords:'मेरे रिकॉर्ड',read:'स्टेप्स सुनें',video:'असली वीडियो',openYoutube:'यूट्यूब पर वीडियो खोलें',noRecords:'कोई रिकॉर्ड नहीं है।',loading:'लोड हो रहा है…',name:'नाम',mobile:'मोबाइल',role:'भूमिका',status:'स्थिति',work:'किया गया काम',vehicleNo:'वाहन नंबर',problem:'समस्या / वार्निंग'}
  };
  const L=()=>tr[getLang()]||tr.en;
  window.maSetLanguage=setLang;
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
    .ma-guide-list{display:block}.ma-guide-item{background:#fff;border:1px solid #e3e7ed;border-radius:18px;margin:12px 0;padding:14px;box-shadow:0 3px 12px #0000000a;display:grid;grid-template-columns:74px 1fr;gap:12px;align-items:center}.ma-truck-icon{width:68px;height:68px;border-radius:16px;background:#b71c1c;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:34px;box-shadow:0 3px 8px #0002}.ma-truck-icon small{font-size:7px;font-weight:900;letter-spacing:.4px;margin-top:2px}.ma-guide-copy{min-width:0}.ma-guide-number{font-size:12px;color:#b71c1c;font-weight:900}.ma-guide-title{font-size:19px;line-height:1.2;font-weight:900;color:#17202a;margin-top:2px}.ma-guide-detail{font-size:14px;color:#667085;margin-top:5px;line-height:1.25}.ma-guide-video{grid-column:1/-1;width:100%;border:0;border-radius:14px;background:#b71c1c;color:#fff;min-height:62px;font-size:17px;font-weight:900;line-height:1.1}.ma-guide-video small{font-size:11px;font-weight:800;opacity:.95}@media(max-width:420px){.ma-guide-item{grid-template-columns:66px 1fr;padding:12px}.ma-truck-icon{width:62px;height:62px;font-size:30px}.ma-guide-title{font-size:17px}.ma-guide-video{min-height:58px}}</style>`;
  document.head.insertAdjacentHTML('beforeend',css);
  /* MA-ROBUST-LOGIN-NAV-v1 */
  const robustCss='<style id="ma-robust-login-nav">.ma-backbar{padding-top:env(safe-area-inset-top,0px);height:calc(48px + env(safe-area-inset-top,0px));}.ma-main{padding-top:calc(82px + env(safe-area-inset-top,0px));}.page-nav{position:sticky!important;top:0!important;left:auto!important;right:auto!important;width:100%!important;box-sizing:border-box!important;margin:0 0 14px!important;padding:8px 0!important;z-index:50!important;background:#fff!important}.page-nav button{min-height:52px!important;width:calc(50% - 6px)!important}.page-nav .nav-back{order:1!important}.page-nav .nav-home{order:2!important}#screen{padding-top:0!important}.auth-card input{font-family:Arial,sans-serif}</style>';document.head.insertAdjacentHTML('beforeend',robustCss);

  function logout(){localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);sessionStorage.removeItem('ma_fast_boot_v1');location.reload();}
  window.maLogout=logout;
  function closeDrawer(){document.getElementById('maDrawer')?.classList.remove('open')}
  function menu(){document.getElementById('maDrawer')?.classList.add('open')}
  function runAction(fn){closeDrawer();setTimeout(fn,40)}
  function openRealVideo(label){
    const key=String(label||'').toLowerCase();
    const title=key==='warning'?'WARNING LIGHTS VIDEO':key==='dpf'?'DPF REGENERATION VIDEO':key==='daily'?'DAILY DRIVER CHECK VIDEO':key==='adblue'?'ADBLUE / DEF VIDEO':'DRIVER SAFETY VIDEO';
    // Never embed YouTube inside the WebView: that is what caused the Error 153 page.
    // Open a real YouTube destination externally instead.
    const urls={
      dpf:'https://www.youtube.com/watch?v=pXiapftMySk',
      warning:'https://www.youtube.com/@mahindratrucksbuses/videos',
      daily:'https://www.youtube.com/@mahindratrucksbuses/videos',
      adblue:'https://www.youtube.com/@mahindratrucksbuses/videos',
      safety:'https://www.youtube.com/@mahindratrucksbuses/videos'
    };
    const url=urls[key]||urls.daily;
    page(title,'<section class="ma-hero"><div class="ma-brand">▶ REAL YOUTUBE VIDEO</div><div class="ma-sub">YouTube opens directly. No embedded player and no Error 153 screen.</div><button class="ma-card ma-primary" style="width:100%;margin-top:18px;min-height:90px;font-size:20px" onclick="openRealYoutube(\''+esc(url).replace(/'/g,'&#39;')+'\')">▶ OPEN VIDEO ON YOUTUBE</button><div class="status-note" style="margin-top:12px">After returning from YouTube, this app page remains available with Back and Home.</div></section>');
  }
  function openRealYoutube(url){
    try{
      if(window.AndroidBridge&&AndroidBridge.openExternalUrl){AndroidBridge.openExternalUrl(url);return;}
      window.open(url,'_blank');
    }catch(e){location.href=url;}
  }
  function oldDriverCard(label){openRealVideo(label);}

  const apiQueue=[];let apiBusy=false;
  function apiRequest(action,payload,done){
    apiQueue.push({action:action,payload:payload||{},done:done});
    pumpApiQueue();
  }
  function pumpApiQueue(){
    if(apiBusy||!apiQueue.length)return;
    apiBusy=true;
    const job=apiQueue.shift(),action=job.action,payload=job.payload,done=job.done;
    const req=Object.assign({action:action,token:localStorage.getItem(TOKEN)||''},payload||{});
    let attempt=0,finished=false;
    const retryable=new Set(['list_work','list_users','list_problems','list_reports']);
    const finish=(res)=>{
      if(finished)return;
      finished=true;
      window.appHttpResult=null;
      if(res&&res.ok){
        if(done)done(res);
      }else if(retryable.has(action)&&attempt<3){
        setTimeout(()=>{finished=false;run();},800);
        return;
      }else{
        if(done)done(res||{ok:false,error:'Empty backend response.'});
      }
      apiBusy=false;
      setTimeout(pumpApiQueue,30);
    };
    const run=()=>{
      if(finished)return;
      attempt++;
      window.appHttpResult=function(raw){finish(normalizeLoginResponse(raw));};
      try{
        if(!window.AndroidBridge||!AndroidBridge.cloudRequest){finish({ok:false,error:'Android network bridge is unavailable.'});return;}
        AndroidBridge.cloudRequest('POST',AndroidBridge.getSharedApiUrl(),JSON.stringify(req));
      }catch(e){finish({ok:false,error:String(e.message||e)});return;}
      setTimeout(()=>{
        if(finished)return;
        if(retryable.has(action)&&attempt<3){
          window.appHttpResult=null;
          setTimeout(run,800);
        }else{
          finish({ok:false,error:'Backend request timed out. Please try again.'});
        }
      },65000);
    };
    run();
  }

  function roleLabel(r){r=String(r||'').toUpperCase();return r==='USER'?'DRIVER':r;}
  function roleName(r){r=roleLabel(r);return r==='ADMIN'?'Administrator':r==='MECHANIC'?'Mechanic':'Driver';}

  function dashboard(){
    hideOld();document.getElementById('secureAuth')?.remove();document.getElementById('maLogin')?.remove();
    let root=document.getElementById('maApp');if(root)root.remove();root=document.createElement('div');root.id='maApp';
    const u=getUser()||{},r=roleLabel(u.role),admin=r==='ADMIN',mech=r==='MECHANIC';
    root.innerHTML='<div class="ma-bar"><button class="ma-icon" onclick="maOpenMenu()">☰</button><div class="ma-title">DRIVERS/MECH AI<small>'+esc(roleName(r))+' • '+esc(u.name||'')+'</small></div><button class="ma-icon" onclick="maLogout()">⎋</button></div><main class="ma-main"><section class="ma-hero"><div class="ma-brand">Welcome, '+esc(u.name||'User')+'</div><div class="ma-sub">Secure role-based dashboard</div><div class="ma-role">🔐 '+esc(r)+' • '+esc(roleName(r))+'</div></section><div class="ma-section">'+(admin?'ADMINISTRATION':mech?'MECHANIC WORK':'DRIVER GUIDE')+'</div><section class="ma-grid" id="maCards"></section></main><div id="maDrawer" class="ma-drawer" onclick="if(event.target===this)maCloseMenu()"><aside class="ma-sheet"><div class="ma-sheet-head"><strong>MENU<br><small style="color:#667085">'+esc(r)+' • '+esc(u.name||'')+'</small></strong><button class="ma-icon" style="background:#17202a" onclick="maCloseMenu()">×</button></div><button class="ma-menu-btn" onclick="maDashboard()">⌂ '+L().dashboard+'</button><div id="maMenuItems"></div><div class="ma-section" style="margin-top:16px">🌐 '+L().language+'</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px"><button class="ma-menu-btn" onclick="maSetLanguage(&quot;en&quot;)">English</button><button class="ma-menu-btn" onclick="maSetLanguage(&quot;kn&quot;)">ಕನ್ನಡ</button><button class="ma-menu-btn" onclick="maSetLanguage(&quot;hi&quot;)">हिन्दी</button></div><button class="ma-menu-btn" onclick="maOpenHelp()">🧭 '+L().help+'</button><button class="ma-menu-btn danger" onclick="maLogout()">⎋ '+L().logout+'</button></aside></div>';
    app.appendChild(root);
    let cards;
    if(admin) cards=[['👥','MANAGE USERS','Add drivers, mechanics and admins • status • role • password',adminUsers],['👨‍🔧','MECHANIC DAILY UPDATES','View all mechanic work from the central DailyWork sheet',adminWork],['📝','PROBLEM REPORTS','View driver vehicle problem reports',adminProblems],['📚','MAHINDRA DATA','Open supplied BSVI source library',()=>oldAbout&&oldAbout()]];
    else if(mech) cards=[['➕','DAILY WORK UPDATE','Vehicle + work completed + voice • save centrally',mechanicUpdate],['📋','MY WORK RECORDS','View your central daily updates',mechanicRecords],['📚','MAHINDRA DATA','Open supplied BSVI source library',()=>oldAbout&&oldAbout()]];
    else cards=[['📷',L().vehicle,'Photo / voice / text • exact documented solution',()=>window.exactProblem()],['🚨',L().warning,'Every documented warning-light item + video',()=>driverGuide('warning')],['♻️',L().dpf,'Every documented regeneration step + video',()=>driverGuide('dpf')],['🔧',L().dailyCheck,'Every documented before-driving check + video',()=>driverGuide('daily')],['💧',L().adblue,'Every documented AdBlue step + video',()=>driverGuide('adblue')],['🛑',L().safety,'Every documented safety point + video',()=>driverGuide('safety')],['📚',L().data,'Open supplied BSVI source library',()=>oldAbout&&oldAbout()]];
    const box=root.querySelector('#maCards'),mi=root.querySelector('#maMenuItems');
    cards.forEach((c,i)=>{const el=document.createElement('button');el.className='ma-card'+(i===0?' ma-primary':'');el.innerHTML='<b>'+c[0]+'</b><span>'+esc(c[1])+'</span><small>'+esc(c[2])+'</small>';el.onclick=c[3];box.appendChild(el);const m=document.createElement('button');m.className='ma-menu-btn';m.textContent=c[0]+'  '+c[1];m.onclick=c[3];mi.appendChild(m);});
  }

  function normalizeLoginResponse(raw){
    const candidates=[];
    const seen=new Set();
    const add=(v,depth)=>{
      if(depth>6||v==null)return;
      if(typeof v==='string'){
        const t=v.trim();
        if(!t)return;
        try{add(JSON.parse(t),depth+1)}catch(e){}
        return;
      }
      if(typeof v!=='object'||seen.has(v))return;
      seen.add(v);candidates.push(v);
      ['body','result','data','response'].forEach(k=>{if(v[k]!=null)add(v[k],depth+1)});
    };
    add(raw,0);
    // Prefer the actual nested application payload over the Apps Script/proxy wrapper.
    // Login responses contain token+user; list endpoints contain users/records.
    for(const v of candidates){
      if(v && v.token && v.user && typeof v.user==='object') return v;
    }
    for(const v of candidates){
      if(v && Array.isArray(v.users)) return v;
    }
    for(const v of candidates){
      if(v && Array.isArray(v.records)) return v;
    }
    for(const v of candidates){
      if(v && (Object.prototype.hasOwnProperty.call(v,'recordId') || Object.prototype.hasOwnProperty.call(v,'reportId'))) return v;
    }
    for(const v of candidates){
      if(v && v.ok===true && v.user && typeof v.user==='object') return v;
    }
    for(const v of candidates){
      if(v && v.ok===false) return v;
    }
    for(const v of candidates){
      if(v && v.error && !v.token) return v;
    }
    for(const v of candidates){
      if(v && v.ok===true && !v.body && !v.result && !v.data && !v.response) return v;
    }
    return candidates[0]||{ok:false,error:'Backend response could not be read.'};
  }

  function finishLoginUser(res, root, btn, err){
    if(!res || !res.ok){err.textContent=(res&&res.error)||'Mobile number or password is incorrect.';btn.disabled=false;btn.textContent='🔐 LOGIN';return;}
    const token=String(res.token||'');
    const suppliedUser=(res.user&&typeof res.user==='object')?res.user:null;
    if(suppliedUser && suppliedUser.role){
      localStorage.setItem(TOKEN,token);localStorage.setItem(USER,JSON.stringify(suppliedUser));localStorage.setItem(MODE,roleLabel(suppliedUser.role).toLowerCase());root.remove();dashboard();return;
    }
    if(!token){err.textContent='Login response did not contain a secure session. Please try again.';btn.disabled=false;btn.textContent='🔐 LOGIN';return;}
    // Some Apps Script/proxy responses can wrap the login body and omit user at the first layer.
    // Resolve the authenticated account through the protected /me endpoint before showing any dashboard.
    const previous=window.appHttpResult;
    let done=false;
    window.appHttpResult=function(raw){
      if(done)return;done=true;window.appHttpResult=previous;
      const me=normalizeLoginResponse(raw);
      if(me&&me.ok&&me.user&&me.user.role){
        localStorage.setItem(TOKEN,token);localStorage.setItem(USER,JSON.stringify(me.user));localStorage.setItem(MODE,roleLabel(me.user.role).toLowerCase());root.remove();dashboard();
      }else{
        localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);
        err.textContent=(me&&me.error)||'Login succeeded but the account role could not be read.';btn.disabled=false;btn.textContent='🔐 LOGIN';
      }
    };
    try{AndroidBridge.cloudRequest('POST',AndroidBridge.getSharedApiUrl(),JSON.stringify({action:'me',token:token}));}
    catch(e){window.appHttpResult=previous;err.textContent=e.message||String(e);btn.disabled=false;btn.textContent='🔐 LOGIN';}
  }

  function renderLogin(message){
    hideOld();document.getElementById('maApp')?.remove();document.getElementById('secureAuth')?.remove();
    let root=document.getElementById('maLogin');if(root)root.remove();
    root=document.createElement('div');root.id='maLogin';
    root.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#f7f8fb;overflow:auto;font-family:Arial,sans-serif;color:#10264b';
    root.innerHTML='<style>'+
      '#maLogin *{box-sizing:border-box}'+
      '.bt-top{background:linear-gradient(180deg,#ffe600 0%,#ffd900 72%,#ffffff 100%);padding:26px 22px 44px;text-align:center;position:relative;overflow:hidden}'+
      '.bt-logo{width:min(760px,96%);height:auto;display:block;margin:0 auto 8px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.18))}'+
      '.bt-brand{font-weight:800;font-size:clamp(17px,4vw,26px);color:#123a76;letter-spacing:.2px}'+
      '.bt-tag{font-size:clamp(14px,3.2vw,19px);font-weight:700;color:#17376d;margin-top:8px}'+
      '.bt-slogan{font-size:clamp(24px,6vw,42px);font-weight:800;font-style:italic;color:#163d7b;margin:22px auto 0;max-width:700px;line-height:1.08}'+
      '.bt-road{height:72px;margin:20px -22px -44px;background:linear-gradient(160deg,transparent 40%,#d32f2f 41%,#d32f2f 44%,#fff 45%,#fff 48%,#6b7280 49%,#4b5563 100%);opacity:.75}'+
      '.bt-card{width:min(720px,calc(100% - 28px));margin:-2px auto 0;background:#fff;border-radius:28px;padding:30px 24px 24px;box-shadow:0 12px 38px rgba(16,38,75,.13);position:relative}'+
      '.bt-title{text-align:center;font-size:clamp(31px,7vw,48px);margin:0 0 6px;color:#102b5c;font-weight:800}'+
      '.bt-sub{text-align:center;color:#667085;font-size:clamp(16px,4vw,21px);margin:0 0 25px}'+
      '.bt-label{display:block;font-size:16px;font-weight:800;color:#344054;margin:0 0 8px}'+
      '.bt-inputwrap{position:relative;margin-bottom:17px}'+
      '.bt-input{width:100%;height:62px;border:2px solid #d8dee8;border-radius:16px;padding:8px 16px 8px 54px;font-size:21px;color:#10264b;background:#fff;outline:none}'+
      '.bt-input:focus{border-color:#d32f2f;box-shadow:0 0 0 4px rgba(211,47,47,.1)}'+
      '.bt-icon{position:absolute;left:17px;top:18px;font-size:23px;color:#667085}'+
      '.bt-eye{position:absolute;right:10px;top:7px;height:48px;width:48px;border:0;background:transparent;font-size:23px;color:#667085}'+
      '.bt-login{width:100%;height:64px;border:0;border-radius:16px;background:linear-gradient(90deg,#d91c1c,#b71c1c);color:#fff;font-size:22px;font-weight:800;box-shadow:0 8px 18px rgba(183,28,28,.22)}'+
      '.bt-login:disabled{opacity:.65}'+
      '.bt-error{color:#b42318;font-weight:700;font-size:15px;min-height:23px;margin-top:12px;text-align:center}'+
      '.bt-note{text-align:center;color:#667085;font-size:14px;line-height:1.45;margin-top:14px}'+
      '.bt-features{width:min(720px,calc(100% - 28px));margin:25px auto 18px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}'+
      '.bt-feature{background:#fff;border-radius:18px;padding:15px 8px;text-align:center;box-shadow:0 5px 18px rgba(16,38,75,.08);font-weight:800;font-size:13px;color:#142b54}'+
      '.bt-feature b{display:flex;width:50px;height:50px;margin:0 auto 9px;border-radius:15px;align-items:center;justify-content:center;font-size:24px}'+
      '.bt-f1 b{background:#fde2e2;color:#c62828}.bt-f2 b{background:#e1efff;color:#1976d2}.bt-f3 b{background:#e5f6ea;color:#087443}.bt-f4 b{background:#ffeadc;color:#e65100}'+
      '.bt-footer{background:linear-gradient(180deg,#fff0f0,#ffe6e6);padding:24px 20px 30px;text-align:center;margin-top:15px;color:#b71c1c;font-weight:800}'+
      '.bt-footer small{display:block;color:#667085;font-weight:500;margin-top:5px}'+
      '@media(max-width:520px){.bt-logo{width:min(330px,86vw);height:auto;aspect-ratio:1/1;object-fit:contain;border-radius:22px;display:block;margin:0 auto;box-shadow:0 6px 18px #0002}.bt-card{padding:24px 17px 22px}.bt-features{grid-template-columns:repeat(2,1fr)}.bt-top{padding-top:12px}.bt-slogan{margin-top:14px}}'+
      '</style>'+
      '<header class="bt-top">'+
        '<img class="bt-logo" src="data:image/webp;base64,vnb1LBOS9ZBV9Emv8dYvPf6h3eyLsF1AjdQU4G94BzdBGvnjWsx/LhVtmwApvQyF54RmynI0C+M9F1Db1q4yVa8amF9tURS0xw5fEzy94M4CaUyNXKZ/LRyX8wb7hSnHzJyrbEfszzOdYsf9NtjgpDm9IH50jrEMo2FyzqjEOAKBt+UXmJ414zaZU8MmPThnUOQY6bGK9PYSNTXYRy7GpFHx2yq3yhxmZHySHvLjZrOdpQ2TBPl8n6N3Dfu1QIogML29JAKU40KYLkW4Ucou1uLyMgd5S5PEGi8phTOqYvDNmPXZUFfOMn1yXQGFKqXKIl9cvTXEcSYpfwM9MfeIepmvn1xqPg7Vl8JH2t25Bi7WcwXOAE5KgbTDmcS58Ti5Or+HjdN/mxk6UVx/npiQMK7hbU/fW65zzh4MXO92v1aTLeK8vZwEnXQ4Gwk7/Il1v+6gkzMbQf8iLWoxz0lXHAaMLXKNpufQFejjMcmo9Zo6facc0zbPG3+z1NazUp8Of4S7cUcsHea9IKHJftMghAgRHlw9cczmw5kTajT/cp11W3RB4u2vWeMLHDwuihrnj6YOZmBmvjjzl/w5dDxskfjAtsoDGAX5OVWpYeYLZ5CBtQw2z1Ab5BSY4+TEofHNwIPVIx0BeDj8jI1lEXDmSUngTs7eEmYhN6K1G7lSkssxkSBaV+3OD+4EQ6ZfgSP5hebr6/w/VYBcNWH0xk07h03bsNBILFrz5ykks2FWww7lb6gBmv2SpYmF2Va1s4g7fmZpRiC/qMu6rErz34DWUlsV2imBo3MTWhZROJ/T9MTV/unw7ZnBVI6Sejf+tDviVbtwDBE6qVZG+BKtc6Are/4xv+PnAOpbZ8HYrsZmYc5En9+6gWnWYWNB3HR+h2lzKy7PeYnZi4Ndr6YVU9MUW94DNhTYLqv56rU3BScR7iCcjlhty1qhFbkJIaBI3QXYVWg7EI33NY+uGVMpEREVoI63gzXoINutK3hQcheKipiNX4veqmQxlnNe8o8va6v9k5zgYT1Tag2g06QcYu0V4CU1K1MRsijPC6ZGMzMPZv7kvP15WRx059nPxuVwECyhOPbAy/jxRD8V195vpCMLHAwe3FYife2dL8J94vuoHQk3wDLjeYLfkd0RNUWADeTXbpghEjkp6DpDCeeIfRXDNMFuqMCvTXpeB0km7gsG5dBnsMg3gOzwFfvVL86Uz2Vy4Warx+jCTNwOkbMzWB+GGEheuN4dibUHVGUfDZFDO6zjOnqWWcnh5+4LvDb42RwignFPGma9+ohbsiel4xs7ZH1E+WpZ55p98qmA4d+B3CZe4835uYzRaxOre2AtY+X8N7G2uEAWyJbO2WZgd0trnFcMWaLCDgclrSNJD7joHy4plzUOMHR+Y6AmQfXAhI+UlfU1ouB2hMaokdN9pIunSb6BQg3vB9Gjftx6qxr+vqH4SVRd7MxJaKUKhxa81/0jWtmcSHLxxI4OYEr9PFdU6cJIYaYh0GXS4uuH9MiCQC2MbgTFiPLB/UnBffMR8jpwFjA2PGjJZrbpuiUkggJwp/Xxy5dHQrUw06BPh2M54XApE/nurauzGxrVVZHflsSN3grbsFojVgaASh5bNn1bs+MO++ef4WmEAT6B8v8DOlt/zGSEEb6g/NyYghnTZZGHk2FyBiZvw9+z3HByEHNaqfM6jfsJlzwE03MX0oyY9k3UeipMHK7/Nrc8TIeieA7YwiLZgRYvkQ980JyCndMtsPYlSktXmHmjQzIrjBOyN/DmVQFxCTeEI9R7lC5O9ZGMvZD77j8NUTnJ0Jv/5btmAwfBRxbLHc5NpEvSB3B2ox11iZpw/cYUuI3JdRfsASGP4DiBEN4f4ifSe9PGw/ihUXSSC6Y/PH/M0BxmHkzVi7cWrqvwzKpIc+Jy+Q7BMGFGU8vlm/Un0C3vFYQCx0e/16cCEwj53s4I4FuS+I+mCEv5S6bYAci1tQImAuXDLPxuy7FNVxPs7Z08cojcJ4ZZrR253HYV6vSy2APaICQfNER0/oiaJeOqpM4U3RzDZlvfmvrN6udBluSkcCr25AWXNHEd7Z7neW58wObyjUB9423KwqohHYQtHYPsD6tw2GcLAnaPYpMBhdCnuQ2fdpz+nuLzceN45Y6fubpkQSyyB2Apy5PjXDsANDs8sp/9a6/7FKCqgB85uVtMrE1HqDAuZXLE+wUzVeu3jJWLuyh2T2qyjY7B7r/QGsht0DhTjIRMGPSpHNzMOrUHaoxdrvMn3gSpsj9IVpPnHontVgNI6V5aQUA6Fsx3RbwzRkM7W93VKtvu4U/N/UnMMaB71JQCmRZdQk33Ve9G+PQ1sBWAAFLCjwJRjiwFdcFMDe95CGLZ1dyFP/Ic3ayebr0G7xWR+yES/neB5Sm/S3x9u1pJ5yBtHFMQQcNSnC29Fd00k/msEKUkUimioD8MuLpnyzvslxOWAuW+/XeN/72+6jvWywsnrdJOWsz3PGarUaxAN4ENeSRwlFEd8uWVHpaX3i7biltMz1PYjhaqhY67l1hHNDZr+h709Maq1tBSKBi7KGvTSqVCLPr58ws1m+vkpODPW5olU7Duec/q5mlOWqxEUioFTtGR8r8OHJBJHGkeFyvtqSjddQT8r6/WlUeyvtKcFgKiXByZGB6sj5V8oBxiA9a2zDZmquBp5nUZZXT5XObBCkeV6+HT1SkrEB18dIqDQJRWyfF7JhSOzuDpbNTurBPCfitj0X/xOSHuyGebK3pJIdr0byg1JrgppAklGK8KQ9PZgTn12tt1rUxWiXFKmCieqkG0+zLcYiGNGmvfX/Yrhm221voZ9rwbbuRgUJItmaRZ2kxUkmrcXn12SAb8KJP69whSi9FsVXIZfzUm22GovuwgZH5s7mhy1uOmapTTdwsJiLAEJx8S605pg57/SMfVDKQk7ygQ42uUe//HRJXhVaynaWBDmnKcY8OIO7mh0TAc1X2qC3ljLidqxqpDc61ok0GPicZctwrD6rXacHbXfDeouYEJP5y05fvdJO69H6jHHDFbu0gMg/acA8cxXOkqP+fI//5wSw4tNgTWLa6bD9/kEEg3RT2rKDFrhLWLA9snB7e0SIyA9LuO8d468X8xDqC1Lj6dQh1DSyoTGuD5EiynvRUPkCjL0Y0/+lJHwzJDMhYJyQ7xlVhX18FHnJdA/hyc3iEkbxN+vAsxWRgtb9ul00lePZbkuYzTyj/cvcOLAuGl0MUUfZk0MkypBF+yqh/rIniKcZ33EvKbABZxdxUdZEFzaX+0AkQYVtcsVBShV1vyfGc4PP3qjKo0kObqE8iFJpL7zELzp2HhRv5qyA8IM6o5H6zpkIJefue46Y6o7Yk3yeR6oNC/wH9XxW9IrZWhtUu5e1Gs8kF/Ypdq4+KuX1XdrZVeVB/R8zwdWziLSceCUDIBWLGdCp8KsVoYTWfGB3T/KfZ/Rec42PS9pjqq6bGJWNJ0Xj3WPUWqIeKLa+jv0CA4sVjXc6ashLkPqQwKSCo1u+62bfmiFLSHsWCxFKIFfK2zjvUr0jA/kGsQII/K8o7IgqoWBC1v/hwhZOx+YDcutmRn+ooBbgcMpu/ZeBqScXLwn6Vu4ZC6WBVEyqJZYovd85mAMr0w9FYC3IAolHqCJPvODYrXMsHr3saVedlevm02PyBuFokeLv5ZRrINSIVT+8D6Mc/V3s7FvYyMu0t9X+OSFFCT3Gvp5hhVciuGFsedvgxGJOrmLU9FVvK1vkGiHB0tnuxOqgsocZTCDONmsdulY72nRuDNa5rDuu8EeEqUZr/YEbPzy4ppcIuzR3g5dQiw2y+AQ0fHD2UCIjZxKqKS5XZz0Y/d5Wq3Fblfuc5uvoJYVGd/csYLJaGwz1IRItjVE0dp1MT/Dz5H/HDdxzm2+NGOmJ1Eo99g6OPLo4tiR/XScCiUjRYr0lHxHvznMUtXtqryGZAMQhONYvf5uFM06DTnCOKxNco5E9+gEir0qPtPQM8N3r/S3hGAXSp+QbWArO9JL+9LB5fkHV3LDdzSTT448qI+DjFX1RAaEVTCQ/hdrfGak98EiD229qLzEp7rMuWDbWPxVD9kHFc0T5Szc7a71aTVqu+pB2BNDaSNZeTgSXWKDSUZ0L5Ob9NlJQeXz6HyM9p4NpsSGuNYrvi6JHFZ1dmA80t9/rIVVGEaweXAG8d4H1bDCWrATIO71vQPsQMNEEDbUdpRkMdvNKiGeVjN9OCHJhJ1+RHOt04XrtrMg8YNEay0I3sKCjfxs/HsAfp/nng+decJsWBvUmVtxqper6+Hj6ARUxSsJ6ZVby795olN9fYCeu2DOvwuuKjq2FnqBBmZKMTN8wMx2G97Mho9qKfB3nK6lGIS8qAS3/Rqs0pe1zsSSMgUNT9ic07rwa1zNLeDC3h3n0c2ky7TbWuhBuUONk+Z7fs3xSWgAKyn1zqAyYLdo/23uK3pmdyVMfhhNSzvnQUYVd+EBRM24ulUppHOOnw1jNnIqmaKdDiwQgF0KyduQiqUAOF4YGFC/Xhk/Us3OiWVtZaf8wIKroYy1RXbGq9xjdFJKOgOnVg+vMz+plMl7AZsvwMwOu7s61XIc5mWQhlZZk5JLiIJ2Jfbdf7W8zMYBbD01dQUDuxLiJ2NtN4epCzDp8U7DEqCVUUlt+Gc/aojajVeW/MPkOsqS6t1Mewg+f6wnz6M1ACMnNWdIP+EBI5DcEaurJ35AIka7tW3ag92fEQ91qQl8+rzs2l2vrTnvlrhL8ffaxYwQfnPxfD/9dl4Y82FideHzjDLlz6zd31rqC+iHZrCfttKDZSv7Vw83XPUqkrkO57CpE0c7i8PKyErf0uaoFfjk41n31pP9DdXARH57h0gLijIAnQ5KRZgeST1cPtC4IX9Xk3JGI5ooUX5xU4AaVQG5G7BP4inZmJKIm9hVhxWlZ4uRS5ieieauCww6bHoM9Tc6uzXBvAeYsp/Oc0hkOXqIAPA3SB/fFL9OmxY7Lmu1ilOmgvyqHL/bHJm9FkHc55k3s+nDqopeA8E2mTKU2W/+AH90br+pa5MV4gx5h3oCcwYBkO0rG5d3omldwxxVkq5FlZiaCge3C7PezfLZLzC8ktdF0zrMxmwoMywyhmTO51WQIf8TFRIE0UyuZxOZ9ueFTiZ4ZWkpsJMrbOIWF12s0j5k33ulLLrRKGqrHDbt1MowDauPRYQxRq2J0aLvoNkFZwKbvhkgwoB03PSCYzQofr1A2XZKDO6yOdpfsL264t0Bfnw2XGv15A8Hf8thCxpEhE0xWxzpcVqjyGONdvn0wN//7P8bMa9XrBJkNs/sDZI+nWooqevESvm8lTUmtXvMC6HAnTk7u626O+qply5j8y7esliMwFjtQqw/uJirN+TLLDYQWKvI0eqzH5C8CzTcvfAENpDgo2suybkECCeH+vbDpN9yIzjgoP+7wwukVvseVfo3+IEPhJIvxKHeDUt8okWftJhuGm46fE/dJrgp8Q5ItCSmIxLk4cd/24VBfHwRSprFYtHTFAyfhWHKmzhJE5vgnMH+RAjKmRN5qna0lRIc+mS4GiKfBbs02Kr+f/qpNPTCBdyN6GrBft2R7NHgM7pOvwUvoFwf1adVFT0nsy5Q2bftectvuNOV9JTdsvXh2GmPhIiPOWEPBqYwO+EZTkv0X0EvWeho7p7PooO6ypQqcFFTEkFK5geVIxFk4k6or8sC9KN8sjWJ7wIEfnDrWxPOgcGCaXQhOTzl9rW+zlGBYtB2zRON09tOqNJL1D4/Njwie0SihRV494t/y+xs+/xw0v0d6mdMqpyfnIh04xEjw1x6ZYtzyJGt9Tm80BAKtZf1uLwLcieEcs6Fvd3PqEsN5ABvxWivZ6CtpAX1EBv4H3VcoKmqnMrayRuf9H/PIUn+gXLx0OFRDv02mG57Kg1lkQpbPpdHWQ72kI8JevNrgBH1bBLm+A/CvEAdLnLMi6rRysFTGnOjKg0q4bT2hxpjN6cVxZOLWaxAncaXPEfs4zqJn10RDKxHz8t2DRk6JRAtfyPvb8XyOdnkPvbVa3VQBMOaQ159cHhvMUIs4gwTO8EmUg3s2+qggpTWqI/QzT28n0j6+b18FYA8BOr3UizRs69HPD6myrOtBhSF6u9hxkh7ffEWBf+1iOTxmodIHeVzkzAcMeQ8klwHDtHXid425C8JoptA5iQ4rW0BIuPboZWrWyZ4YvauGvCNVgZAM4u/qDVSGvS4fbMVL0dZol32sklukZBwfAkg7OtiKhUoFAhLFZ6uyKRmeeN/wSbz0gKGcDnNo3rhqMmzbOPRiE683nSSEmy4X2ap3jZz7NmSDaWSb+9kHbfUYja6q8ngSXY9i5qwJ/ZHQXf60utOMs9Z6cr0M4l6YWzryRgjs3z1hOA8oORxe35ffmz5MVFmmy2y1f1efYxVAPf+wcn9Y9HD6+p1wBd0giKanctAiSZ/Mg0e5RsvR3V7KcPAtPmZ0uJWx2yZDzO88OeRg04i+t/4baDIJ0jfwyoi/Z7Y7izUAzgYW84FYRpsWvVBs/GEv9MuqMPR07KyvblKpA/mhqu949skBwDWkt86KatxNK/kCLszuGBOiP9gCW3C6w9UvA8PKmiiylUgp5rPJDJ1SrQgdpzjiTs4DHABirJ3L0jOb/Tb+pfB5zCjDc5k5/2plTDwYEeAMVVlMYKnXMbyaMhnSC2CQdNzU5Uyia4vIIxpD2IgObrAAk9wgAySxKNlxj6EzoVpxzIAXZmPT9tw1PmUdGWWfYN6seYtYErqlAZexQbTOI9phw3NfbFtIZyorLhzCAljk70wvp3V1JFmPS6zfSZWMus1wvsvPT725PYTMc31Oe5y/2RwH28S0c1IZtA9xE49rGoUl81nKqWM1hXVUioPrPE8vaBmEe2NnRTcO6jieL4wkDxo40b5bkvTLN2Q0+DCAJPTjf8LD9KCAJJshMnjEw78Tmw2xCMbRSITpRkQYTF6t+78i+V+hqfhGLVjzddlkMIXQpdqdG+1kvzZEilS/7cmtalbVbGObnuxzlfSENubjo5/MTZ4Cp3YlQ9gKPtI1D1k+vKxdH2yDwwvhIXI1H1/YMJlsBpVX+XzG31Yf2S907uosnRCEPO8z5LjAruTr4WKIAh8uHJ0gY9vszaJ0LJ6sQWjSc0nIUOJ9koU/zZbQperlEfyUi7vVi01sEwF8+RvjqSctfxjGbm7CDLn0tBxpfXfcrM1PPi18DUU1SYDGnDby1MNQpvRr2ulne6u0fvV7o4jvMKTeIA+TxnMptZFF/i7U20SCDeXtQe9FSGl7FYAovcxagONdnYDjD6Y/WQaXaZlMPz4TkxB0EvZ1ayhmmtDZ5x4ywmFzRFd/0ukEqRaM6N4YxALtaL0xDajop8nfSsaVzojMxdiluOVku8UCySwxSWTgTG1lP+BAxyAqMm31OfmsTxvO63d9IfrZlL2rhrRevz/6+yybJsT1UHlC5r3Upb23jRnW8vruccR7ylr1YS8WEZsTs1MaK077rann1iLlHP66SKwtTI5BNxwcWE/4h9FuGlHYyBVZ5F25KJ5+7a8bIb9xXz93D2Su7+pa8JKcgk4HHtB2FTHyLPBnVP2XLTSWH08ilh8owwCkoqtbnzc/XvM564D/G48zjtvOCsEDW3KTQdlQczwpgd+7W9BVlqbH1t0Vy1Y1S+1GMZsTBSVO3PCNCRFcd1q6NwTPcIohFYQ2CzdzRydOpn98RV73Rw4sHei+/BrvTRwE0f1wD7plKRwumr0tP3+hfJZv6J6VGwT4fqpYvnIhGqGU4oY3yLzEwFSNs9OoicAlnDNKK7I/6jL74oAwrw1zI/m/fTZoiu6TTAQ/6ptuI4koV7IkfXwRuYPloHTcxN0q08fKQwKePErXU1bGTemqPIl43z2tJy22A9nF4GOytXXH1+SGOkPDFSeWGoCagy6yu3min+3VtMEJtZyPMnNZUSC5n9QycUIoGlKnaaomGU6CMgDfT3YRfemGf6kocdEKk06bU4RSJDL2Ik1Xs16FA7lTwS6tL4m6UW0ILkV6aFlS6yZHx4yp7P60DHOBQOw148hDrWgyIq1wxf6x5ubh4A/nQLX86bm8j1p5Zv1CZjZ8kqmPf2g6Z4ASqf/5WnpYefmvjjDp2Mp4/a/RURDm2Exki/OwFc8S7suafnmB0lAJamnnF+En+JhbLHcVYjagZ3SBDfwa4+OUTOxAcQNUEBU6Dc0zTomkjAqHpzRVrLzoK3tUOEl1KR0eVBzLqZdVB+/Tbu8vpJQBrY5g1EunmwAGuHqeo/SATKnC5QjCLg1tiLjzDTFhULbe4PQVHkvYXmKSH6uKw3aA1mlEqmm+/DsKjmVv0BBmmmvFWyqq+hTA9iiz4+8WGfbWclNOou2gXCicCWxn+8hhuERzmO7Fmh7wGirAm3ovF/rOLu2RllGF22eenicp+lHq2feWDuARrF9i9Q9pLYCSDPuy6RxkGGV6QLMHRQKR50PqdPDrfKTuaS8ixIKDY1U70vbF5JkgDbqVZgk0A2GQFVLxBRU2Bok9ALzVLbT/3bsMoWoZd27KgwfDOt7DLajGbf7SaSstk9ZqpqsLndXTeyb8Xpacx138vbv/a2ceEzyTuLi5NLcItrViALdNLDechvVB2XxCw8bb6yMCFkoZTlxZ4JIDOsGB0DPM2wO2gHpoWcGWE/jyBLwSt3sdaXm822rYTlCjSfxz9zuW1RVQIFfSV2qeOTyVUxm+85Lait7CCA6RxQtYTgh1ome4ki9uvAkBgsk2JETdtvfEmO51dWCeQCR5GtAog8r5v4/KD6hz4Feh61/I8aVRnMEt6SHo6osFTBZCderCtvpKU1/IPKDaCqzhxLIJQG8DC9f5Ge6nj8zFYdZhhKMnE1lBsw+pOtv6a/7B4ZcLlh+KqsB8bmofkmUkt6legSF41pZvNpbM3dtdj87AdNDlt6lm5MLBQ3PPSPRnS9uzcBYGEbbPJXSUxoVyaKCj/CE+5MwnWtl8sbbWJzygR1fZW5Mw1z1iKE+G3zlCnweup2v3LGbAi8AAMOPtC/jYLrWUrH1pLFsHl1MIIXC83geB3BQ03Jy4Mb5EOfP+NyXstfYUBgNwNbYnqdvaJq9K2aXYl+i5v9q2Y4hL5bWPB5OF4plHEZei5uqfH3A9h2ldcCtTO9nOR5jKB6dYrsgDVU13rBJC5QqRuj4ToTjjjUdxxGns+ABeupcOIPJnvo3K+GRJFEa2AvzqSPOspk5x8yaFYBJTo36jfF2Y1vv+8G+Y1SVD7B7gxNJZiuURhdRlx31KUgiVCncUv0Gsmc2SYnQvUHV2z+jFfqEE7O8bx/+NvmCK1gtOqlXsqxVeRpLadTG9iiLeDZuinFuz0pjuAQX3sVrUnLH5NOcSfBqw9IuWNqrLXqj4HTei/xeJS2I7YQVSBZSQuO4gp44KzbfwJ0p5uL/ckqBMG+joGh0S05bcOlbiredvtDNmHfcC2dpM8e1wrLio5YNOcf1IIx8He6aVdkit7xCsQU4GsMouUpDv+AS6rd5KLeKxQ6efqryUDyQbpAiVwDI4aYtsY9LwBA7DQFxA1v7tQ4zoxXwK1xIl/nKsk6pwJpzx01EtGozmh+jGF59AmVojOI6fMh3eryn9lew69in5Njc7YJYBKashhb4yJxEJ3w5wceKKp64Dbd8O0ukenEVg1Y1mK/R8m2iQQk90YA//OqC4v6vpoT+w3QPLdRkJcB8TYcE+Pt5Bs0FLysu/caYBK+HpJhgFUfDW3kJdNFEdSpm1pZXVST7GOuR651jBPfLkXwSdq7a8VjkVFTU8TCARsGEt/s2Qt/nJpT88rer/8m0LN5nrAY+CEbtv9ymnnZQruM3YBW/lrKS+lsEkfiyC0in5cdCa1WENRmufPPUhaSdft/9dMO/D+Syl+22CENXdSTGVs9utZ7XfRIgmbnCIIhDBNLU96Ujl7yKeRlHooFF8c65Om37FOeVQKxp/1PXn6cGhhGy5MvNHtzyWUQWHZU840QuyxZ8aZRq03W7sE+1Jb86eEyvpJUZ4dsF5fmkBkKozOvtrUNt+9zxM2vlx8x9yoYmtWkRXEt9aPKOJXcjOOIT3haEW6dN0G1Y4YFhtidF6T9YP9Vu0kR+HMvWaTyEcu/HSIX5pO1Lz/e/+LdT5M8ZYTDOjMx/ybhHPQ82LlTP/Hu8Pg9ZMs3PDJ0tjbc5y8YBL+wuCUmIhDfy8PdrJlJ/Ui5GrI9huvhYh0/q0K9k9g24qneji/DcJ0p2OR+BDCwKZ1tI0JLIKzoJAnUvFyrGBHpLmHZSQx/4yM00TOxOBxV/hlA3ovxWeoUv4ED4eKxs6VERxka1YOfwY9Mgd2xt2X+5R+1MzHS/UYnuuloM4cHqK4dHaeFoXVDl7VezN2ZNi5qr8htS9I52mRFA7auMPWcHrDR1cxtBrPRObA6laNcl6uk4QlvZBrukP4F0cqMXvSwSVJk/l6doTNWmrv0B/md/xvEUO7a+dKwhcLy4gxjFT497k/twN9L3J5XqBuoU757k+gvtHc1njzqzu0HVmD8yvVmymtAALZu9O0XL1NLL5UtKHD4d/Zbf1Qzz8SrZ+5Zc4iP7kHpyAe7uomVem5n8bbMyosp7K/u5lWuboLWYkFUF0CphW0FsjTHVfprAfml0WKpc0+w4eh/ZSEjiDAC/612+o2nXP7QPGTyIgAYHQiCjupwzpZbAMuNK1ICPo1mpRq8nbBcsLznb18ufrUVur9AXoScpuuipRW730kFNifHjCQWW40auaerUNsiu1qL+ofQSHfP7iAucly+9QTv0rBGHMXdYdJ+2Zcj8hZY/TP6Q7Xu5km1YMwnV6y4GD3C7aXpYFlvBq4oSDELZmnmSwTLhol0+6yB5CF0GBUVEAvcoq+XtSD5Ni33z7TedzCxzSUCgkegZRGWU/brxG3AhZv6uviO1U4HDHMO9u5AfQ7tLzxTNtsQZv6lfrgU8B6wNKOr3hMgsPCMP5aH80O0aNHHzKZyBABYVePBMpf+hJNdHLYGCCpTui56fxX7YMPxaO/BCEBgw3SWXRXQFWh8fnz9lWYzXiZ2HJeNEW/54n/oULeohZkIqshifp0E/sOsaxLfiOG6Ck9rWkystmBHDpR+/SPSnTxanK2mGMCqaEilgTZEWdO8Z3tyxOq6XmgnBgZF44zf2tOnqkyPyuGKiOpSkK2EI+qWclKT/Krbf6FUqBwsYkbfFoL9bSkNoxXuL+urklVeyXr+1Di/djFLAtz/Ccmgf2arcbKFfFMIPFKqDkIRu4NoA1rMeMAsq0vd8AoxKPb44jxmXe+UZgEv3uG5DpUKWgmd0vVWlFAzLE/+7r9T2moJ8uTYxUQyulX7IV8qZGg3PPrGnxBhrRmnHx2ejSkTCUyxdJRXzbP+JrT36UxcaimqoYjEDNAgiMtLTTFvIHaXIHm8XjZybIw0tr7HYVMlFkzEfGQdQ/OWCbt9mLClUOyhl0p7wDs4df3D+w2YDftyAHKFO9YyE6CFZeqAPOajt1kU6uIltiwzfTg3Rr+LCGIViffYKevcupaheQTWdGa5hQYLpSG5jxaaB8v4/swHOaM0rp4Zw5uPcLcdOq7VzcyKGnUqmn//Lh8qwKOPnBr6gos+asTPO5dTdoIvDOxfzZkk8hWdnduiG/4G8EFX1YBUJd4x5X5c+0/58+DrpqrCEVcoPWmdtpS5eVeUC8LDqLJeLyTBoROZEAfNnOD+kEz/p6Ijr5NGF2d0uNOfd6VXPQFAIWWbTcOH3BwMtbS/i5vRKPnyrkJShoaozhyGxcetxLI4Jru+C36Yp7Ifoe7JVWmhO5QAUVV2t4HsSBN7arGKjhYGQW6kWm7K+Wttixd45EKPtWg0u09oalkibxeGu4aATU/f7tRr2lMkUX/Wd2d/u1oZ0aIJVFIn1qaLdhi2W6UIHfUPAB4rFY6OC69/ephovNwozGgCb8ndt3/IbcsPC9tQZdbmnaaAQgNyFtTQRYEH7gxfIVaBztXSYVZYWDeOFRaXGmvVo0t68L0QmZYRxlvvUlafsBfc34opX+oEtPUnGctaEEcFoNYfAqRB1c1t66XjhLw/aTxN+K/Yp5ZGXkiBVxMU9BcuFAppdONUDLGWk1j/l71nooN+iYLL34JuApgMSeYrGvnmouLgdmQbRcPonaesoDMbVunh9S03r23jR2h/6/SzWNL6H5+Lnth5jTI7AmH4fTrerlivX8HFruWz4XFiYrhlMfaXkgoQZmZDdWbMchVsQjLGu6PdgtLCJcohokJCn+FUAFkkrjTU8sPhUiKY1bihLT7KWYqaOkXiqZsLUG0CgPZx/FnqwMeO8svA8mOZb94egSoJxglpS1yTa2biZO/MjlMNxe4IrAn/6kCLwXF+lFHuGjO45H/Dc7xYBZczrBm5fxA5xRk3PuJ6EJCOKjJluWD7LkCc3aWpfogcQJka3XLMk/iUOfiTKvypH8YtdgoIFlP2LSU7KoDJJqoLCi8fGKL7YTmLiSpzTGQ7XZ1aN/ugS1NqVmMhn2YLC0O/fI6Kn4lb6EaSj8YHK5+l44XxSTL2/7xdJWQwHWm4rjyzsicTF4yA4fbV43OIVgyDXRUeWaajTI8HcBCpYdTFzxs4giWEduv+PIkCdVH/3wP+f27dDw1ebTzbNvEFrCTKfmOQJAtm6hCDUYVz5AX4IFJlxYfsEkvOzwoz/jZgDIUO80JMgN57/+kOyiKqvC23wa0K4+P8HiKff6/w50mGVi7+BrtsU7SD+fwGEROljZoFR0fD/Z4e0Swapt02IQc47OO5N45/MshQkvsZ6Ov7QOqK3wqlp6+pcXl96oLEdW5M6/1embP8Ti59e7BgbxnRGFGB1D4yoz9po7wDQjyzfQQkFuORKbEgjOELXgZ1K+ByQneUBww9fr0eH5PaTw0PvFnyK1PB2zef8V+IwdY7qfY/C4pXrgIL8zh15EwJj8TM7peqvVlvckrt3QobniFlR9Iw2czxUdi16fbI+HhYcoHzj93gCITZXHnP8QU386DBV9FyXjIN+IVR+s0LruULFv/iNFA88QOc5paBi3DnY6iL8SEoMJZx/JbIDuk132hhp/LGTpASVh8NaULfTJaYbjIEo63eT7kFAPTgmdOKW1adbi+7EgiYO+agW7G4zUs+CEFziFqfGs8UWTeBJzymYiBw57gznvFnOZ7K7LFjnsPvDf48/iyju2mqloMATvzXOhCHpf+idu8ofeDfhzco+XQ9h7SpxlEzSbu5TnMWwIL1Gk3SkX6XYAvDWNzPEaJLHVVBKhLpqIK9X7e4SKBByaJabw4NmjAdKshT/8Yqzq1NS+6/Gy6j3AvMSRvtEH1lFsDfiSoiJO8ZEsaeTItlT5h0yZvNHozBh16t35TVAfi40ykEJimz7RNO0LSC2zq/b8UZfy/jc0rR/SvzkCp7jaj3bZy+0G3zB/kpF9WDZmI0mQik+pO8EUbb4jz++1aBTvqvUMXm80yyR9/LU2i7fwWa0RfgeYtnANVQwKVSiSzF8JDkK+IvPS1PrcBkXiuC8AktITdU+ViQ/Q3MKefsfHeBPOLlb60k361qril3LDMnc3UxWtZThtHI5rVi1pygOwHtjWgW77+6vw9tQaQQOZHaBr2GxUQsKoC9nL2UORRcefwzmvo42aML+SdOodfHPoW+FYKhTQeoRyUeIB311TmWPsIfarT6jmSitf9DB2hsJw0fmVKtwIgAYRd8R1Ybqfm6BEKnfzxkUF9KIlajcaqgLnwOdv2u6nDZKJGaPRHBqxe1cnxlSD7CvtpKJv4wgzSi6jakTG7GkwP7nDQeGF1no63BHigOUrVc1KI8/dP87Y4Kf9uQBp8zZl7v72t0pY6qyMT8KEje9sL0P7NarQcv/2GyNjzFzfZ4my5ptLJHQT7zgGyCuudEtNs1fhBc6bKHi3PRgb0gYn3nPrRyIoxj5UY+Ken8cB7vZTddzwFMZvqRLGUzYWLYjBTb0r+V5fooH9Hd2bZK23K99QIn8QBEtrfuChkjUM0bTv51sv+Ct/6/BfgUUX9TYL7mgBupdrahzpRgyZknsJ51TIrT3i9u6PHY5LisQKGmKkUjpWwBA9bqyL9zJEL1RTppk4fWqMta73pEHCMdMhIMAnrwyD2+DOtsZn4+5619a9BQdL1wVsTyvW6pRRbg7dfMPATf2zqz8LbTmU973SwO4WIY16jA9QRhg1XEZUvYkpcsaiC34Ti4MlTeemdeuJn07z5HusS1RBmbJ5nkyKccz5jopZHc/zDop3+4v4izD/kb5aiPtxJ9EM8N7aDeZvr3RTHdcH9lh/qiJD/sGj8xR6B/HyRP5Jtbpr93z3Y3M+YuCrhW/N/WAw8YoJLSNV0iMLKNH1yXz6+0dbQAYNYprSPOpk6ygh1F7ak+2+wUVDyQI/o8mCQv1ShtGtC9WfG/4AI4+t5+IOr5qpLzcXDVG4yV+AKvwzCjKg2aEGVj1BJKt/cIJ175erGhuAGJbIzo4jQUW0DQi4v+GlmeH7YeMhRUcK0Jg5uxvl6aoVyeim++C7dRK9g/N7k7ZzQGGM3N8DPjpJ4OwWAN7NZyuVuU/zkJHXS+lriMMdL0wObnx9CiWJKH1e8b4aTa2UigbJpx35755wPJw6GcuNKSSi/yfItn4yvOgwVbclgSqvXCuWHumHpYZt1Ggw1bS6Ktrk441MMtM1pneBd2DwNUdMpiqNN6Yoco8b4wfUcRs759+xJxt2y8kr4AmboMpRve15+axtpipkADJsxafKN4WDcsFXj9t0Y2kKEFSBHSf+ETh7qnKYFYDZuDs8pb1t+GlhKkT7fVfLlfLwe+s6yjhtLQQi9JC+eLr+T3kj3/DF2V3Jr0gNzak/+BizNlsd5VxYl0hdRW7AFxmG7Mj/+ptxeX1vFv+3wTef8zBhaiH+kFPJjr83cK+JaoHqwXdS6pGVW9LBux/4cHW6rI8CwgjqskkL7eWljdu+p1ALNrAtuxnTGBI83009PZnAdjPsqio+kiaH3BmToVW9fcc1TVsm7U9cdb+jtELlWD9A/qhVpiB0saIpN9Ehaw4OBCaXoCGAayZ7hjJ4TFvSnA+MM6d9cWEP7tG2aL2xdxGJY/6RYbXaKcGSVzMLR5tSvH+PrgPpgmnlHDKLWhPQ1AZLOht1APtBmlTRW3sLMsJ0ybFc3mm9n4+9LH8WgR8VfxEJX7axoRW923dcKbDakFsSLXIuSB7B6DokfunpIOABIhpefzON/3PBQscmM7uu+rHUpWQ44QUKn6furHpnjy60LPuFZDOW4ppRywCE0QzGFNX2GYBABpAungb6RyyBitFyDgjiEXz40npd2rQO2CgDWl6gzsfDqz7hpPOwzyp8JfoPG1j7NkqML1UNJgXOSWqxuduFL3l7FiRJFHF153txICLpMD5TRIqhTg/Vvv/0Udbn4f28wrIWDpL5lkWAHiQHfw1cJfGHLZqbtoI+DuKlpcC+MD0zakzGE7UfatWZCtT26UADHuA67XidPyFpr++BSMq/HfkA3OrheRNQCxuxbKrRgL+aRg9OdVqjDKob7OeF+xvRR5IN8gC/xPmWwBfjEpL186CiJbrez3/4GMdAdEs2SwoGkQlr9CCka8rtVhBtVWOp8CnbeKDzNyeYnuA6zyryAy1SEL3gy+/Mgy65Fx4/ECZCbUWtuhj6hEc8F+xk+75wYQyl4hd0aFssSvc62za95IQIzhid4RxQJbPs95w5+eRuOiRXtHCFcod+WOlLYTo0z1IDsjjMrE3+3/UKAIARSrbsFQhr0w4Tv1gCuxVRHvIZ+nkBuBQmzZu6gyP/lah1VfWEWu9UStl0LahJnrSW2PoHfPf5R5uYpHYFlvR01S5sZwqjNurf+XRVNwHgRimeHsqE1F5aP9jWq9EBxnKwuPb7Y5gSEBqaVxlfRz7fMG3GHQBx9UeXJ+WChjj4MbGbtEV4jV9Oz1Di1/lN5uc6EzuePHcUP7KyN7/Lcs/+eP6naN9fzf9xdBQ3L7SkqxGfsjoMXT8SVGhahHlX/kR1ox9O2xu5IjcXX1DAlGikWruyCUgD44kCXDaVHxj65LxcJGVGP2jEYx3CrFm44B5wZpmI686LiBzs6ieDT57BlgxRo0wrjgMhg0fThRlT1KBmlCm+I4X9nZDeCjSvBHJN/6C13x3lTg5aCjxoJ/1uF1NNkVScs8Dl6TgzeK/5qDrB6Zl3FRFpKKUpQbvqZ0B+KdBcaxFVuAJXT9NQsrfq3n4tcsTxRrEZALQ9vRW3KQQcyooQYRXG9yFLfgJOl+EEEYzurzN2MHcnW7/kzUlAqYBoSu/9bge7/KO28T7hMNIOPyUXVkFulDy2fEdOZWrhx9nNOdzqy5hpUSiS73HbkvYMITHI+P0460qQpl2mKd+RSzx/R8mNN7tI/GqQU3NKdi2MBBLpeRtSKElWTLSTJubZICVRM7EZdLNDskIJHGXvXpvwiagFX6GOg18/7RQfisJ3JCms5h3DjEfYInOLVuhST7J+stWtdjYCLM9bqpproDZkQbmWC4BCIGIhXuYPaIAqP7N6Xg62U2Qm4+uDaw30lFY/tLVlZoVHxx6BxFB0MNpZ575V7Hem3qV0hnfIsyVtYlrC5twvh9tU+shT1OwMPI38clLBlQ9idMllrIDYMOO9xGQV7Uys6AGNp66XcKAG01TiHWqxbdlWNU/jUNo0J0OZuSexFCPnNFEH9KIs6zEMlYLJpvB6v7y7gUkgbV2QnEwLn6P1q2l/VX4E2w7hgJLnG/mAf30l4bCA2CdTpQRUKTfwpXJC0zYAggk9yzue5+NqMxkdg3/0a1/QRPIzqmi+1MhmmmL029DILK/lbPkEtPmTtwPDVyVWiT/YrYBltyefTZFVN0hMEWHcov4rteMeaTASNRINkq6bgDPYcz1f32WSJvDsL5Gjj0QSHf9CXGZnTtjk5eGXpaL/QrWBz0Zt41k6jprAQm5PWylv6FCze6dWW5CZV/C03kgj0P2W1FPAMxZig93Kh+8yhGvv3Y+IVkZSxv1HRqCndeuMd5Rmg+4voenKJWtoxcZuSJ/OJZMj3eZfGBdtEX8ZhhUAIUyK7RLTp1OvyVsR3ttWNJEa8tIN5FtgH1BA1/DbpTj90Xq9A1kBRML0nZZJWVzgIY1G0w1/63KsSajYENjlJfS3eMIo9jRI6wkEYPHmKwDNT/mxLghddJMKUnzRmiMHhWdpU2C2ibrQ0qgCZSZ3fqt1+YGfKZsONqX5G7ksXoJFitHBqTSkxnq31WJBoQnEgG+lJ3eVsh6PxlYG31b6JG3135qt9hCWcPzWuVOnh2YP5Ad0Y913/XwNFZZ3zcWX+gaACWbMmqib6pJeoFGclDwq6hsMchxEbE9xCQ6EJY/BRZoptPIV2EGovR46FL7AUqMq5gGaab65bbvsAlyBHZUtxDgQbn+ajiO5mHndaOLyccGZFeK9Y91jQtfFmSTb9m/w7eo/rWzsEg+FtimGoFL0i3D0epoFcGKg/+BHp/6546726nw0gPyI5wOuVm2HlzWpwrvoK9RkEZduOutbHw5JH/shNXDsButLQXqO8GLK50+Vhw7+bFqjztHwWODpnz6yAhpi5UCJfkgcG/05uqzItrvF6hMcxF7W4K/dk4JohByJC/pmrpWpxlvRvXoyXGLydguYntPFslQPPM3IVxjZFeo4/E1LYz+1Eba6RUZI8+flzKtzOiTpOp7wtvmuUw3V4MUep9SAw5x2ltEHz4cA4NhhlJafV2aJX9QuifBrrfxcMITCi/XXybmT0Z6otQKvXvwtD7Afefe2voBYTFrH+PU3YIViFHxHPlGJS52/Ux2bpwqIu0qzwKBrRAklAImnGDGUDXnM8KsSLL40WCEBsdSQ4vErsZYqC9ZpgGF7REj4ZjUM54Atq4hfsP3UshTyd4uwJU3+Keg0SRrQ9m2ED4CRkrA2qv9Fa5wNPfthL+OXvJasj6wx5Bgnc2MBrHnCvQBPXAMms9fY3Q1YOMGpyX9IlxyOY55YcsrO7hHEndCq64vOnCppag5iWe4jWgMfuOU6LP6xdJWnmqjx4sLlasH7e9DEDH8BN20EEfMOST0eDVlyCKkSfjhdX51ewQnSV7ca6A00rCCWBmV4oqz+IevkYOnhM2PM22NX4pfMyCMTar7onlWDu7OYd2JWg877mB6S75iDZpvDEiyy2x+IWpQ01Kb414HMb+TWprRoTefjVwa3qMJfkc7+/thRBVpYqjuXC50QrJ8MyB/pdJlgClSe6AWOz2brP3+GdRshMDr4pczKXdUVFydWpuWSWiX0VPUKvMp0DJ8Wp5OQUgVC6V5hSz/FuQAkTBC1g8vvMFx2S2K+MwaP2bIWp0grVnJg9YT/lr1DK0+htXbMYEI0Km+p4+1TPiWIRFhX+fvieIuzVZEORFJic4KaXmQGRHMt6QaF9gDTMvbdI5HeYgygoHOqcrJXHhVnWm7LP8uBALXIrvTWxt2UkYn/B0TleW5RRRbWWgxo8rNXbAtSphLrUc4U8FGZl+YQN5Tn9riQLseXftxn33QYL4889ap6ctLlwf/+41H/qDfMLQk4c3muX7jRadueE4HzQ9RtigMdVs9KM+aJqBRPIh7O4N+XovUn+u+vhhzSs/ZqLvF9OD9oRNTFr811v59NphNdnF9sn8F/NT1lbtB5QMEYnEX97xNaDWidslecEkzOxIOcuUNsSyQ4iNKqUL7fMABpUjxjv5AVhbb9braxaVfxA7ImqnggrLnbuuSN2e6Un+/IuDWYb/BcU+oDpqN9jrxJEbCtQ1Rem6O9rv+Rv/A58peu6oJhHmGUxJj7zqlV25XOyBamnL6r1sdFWZn/g6xqGbkvD14RNF5wMkX3diQq5UEp/gmKAmClIiglwml3lGNNNnoueREhdiw7+T2WgLE9tePgyxg/jrjqhZoeHxKSxFD7b7PiQobl9rcypKOLGY5DGg73ECQyuHrzkfq8P8q1scUrTbHX00hvUxPBZcXWCR9ecGTpdw2/zz97S6gx6SAEgCu2J0LSw2T/Pil5NPuN2s4xFDv0Wm/xQ9MAkS1OIvfhZGrGgxltDve6s8lVh8hLnbnilafXQnUswPnTBG5qV3PHpfgdGcYWL/quhsfWdCE1yMvtMyRJoddItu37w+TbQ43Jq+A4zKAZHpbrx4KCZ0PIh6K3GeQ4JXcjGttMFPiakDPhDJ+Z34mg00o3LXUXtEsQuJwtVaTLAWRVMt+65Y4+lAD5gD2HgM3pjkz+53D4MdjvB1DR2L2sWAwsMXUyuZEXShKO7FW2JMYU4AyT7UtC95uOr2X/IP/Ceyu/IYqPe3QSAruzvXBuIiRtYEmzoPj53awldlVAzWSpr2doaxW5deMMQcQD3hQqp8lFsJcbDo2tU/HRqA6QJ4RHuz7pjVIAlc63z/Xu22KaQ6ImCHQJ60GK8SJjDdvp0vOEPD4WAvY4cwrN06WkCRcW7Q6IkdS1tP+C35gfPtcGy6q2WMsW2bOwmULAM5SnylpurfK57Te2yXvoLvEsE7pA4RIx8v3lu9oT1ibixHTLQdEwRDe8UuzzPKToUwL859R+vy1nXwx8eR6fNOJXTcI2Wt5eo7TT0/W5Rvnbzbf/L91QjZ0ajblrS+BEV4AaKBVKXX6lwnLKVEZZUDP1bsD7KMn/fuP+pZF4GJApQxvTIj6Jb/Rgt7eN7VGzkY81/C4WF5TCxXzSEwAAwQaL2dXJrMHTIyLE5T6O8b1AyatKYPBHkJwgzd694mafQ8k550xCkBQ94a3oWmHE9Z1Trd+cJGdj+I86ace5tM89WWsNCeT4iC1GimASCnNmkviUJ11rDKPf71Cvu+HCWpqCjogiWMH1xcpLvXPYXCZjBCSKu444/uAlHyjVRHOcD+NZ0rzYwv9103yXbdeqir3o47tt+crJDRRcs+IpMeoypHtLGymx1OkhEo4P6wa3ScSgQqEc3vNR6s4cpvAQnjeaagplcAzORh7yE5srFU6E3nG6Urszop+eaIVAUt2lYAAqBRXV8iRgA" alt="Drivers/Mech AI">'+
        '<div class="bt-brand">DRIVERS/MECH AI</div>'+
        '<div class="bt-tag">Driver & Mechanic AI • Kannada • English • Hindi</div>'+
        '<div class="bt-slogan">Safe Drives<br>Stronger Tomorrows</div>'+
        '<div class="bt-road"></div>'+
      '</header>'+
      '<section class="bt-card">'+
        '<h1 class="bt-title">Welcome Back</h1>'+
        '<p class="bt-sub">Login to access your dashboard</p>'+
        '<label class="bt-label">Mobile Number</label>'+
        '<div class="bt-inputwrap"><span class="bt-icon">📱</span><input id="maLoginMobile" class="bt-input" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile number"></div>'+
        '<label class="bt-label">Password</label>'+
        '<div class="bt-inputwrap"><span class="bt-icon">🔒</span><input id="maLoginPass" class="bt-input" name="password" autocomplete="current-password" autocapitalize="none" spellcheck="false" type="password" maxlength="64" placeholder="Enter password"><button id="maPassToggle" class="bt-eye" type="button" aria-label="Show password">👁️</button></div>'+
        '<button id="maLoginBtn" class="bt-login" type="button">↪ &nbsp; Login</button>'+
        '<div id="maLoginErr" class="bt-error">'+esc(message||'')+'</div>'+
        '<div class="bt-note">Mobile number is your username. Your password remains separate and protected.</div>'+
      '</section>'+
      '<section class="bt-features">'+
        '<div class="bt-feature bt-f1"><b>📷</b>Photo<br>Support</div>'+
        '<div class="bt-feature bt-f2"><b>🎙️</b>Voice<br>Guidance</div>'+
        '<div class="bt-feature bt-f3"><b>Aಅ</b>Kannada<br>&amp; Hindi</div>'+
        '<div class="bt-feature bt-f4"><b>🛡️</b>Reliable<br>Support</div>'+
      '</section>'+
      '<footer class="bt-footer">🚛 BALAJI TRANSPORTS<small>People Move • Businesses Grow • Together</small><small>Version 1.0.0</small></footer>';
    document.body.appendChild(root);
    const passInput=root.querySelector('#maLoginPass'), passToggle=root.querySelector('#maPassToggle');
    passToggle.onclick=()=>{const show=passInput.type==='password';passInput.type=show?'text':'password';passToggle.textContent=show?'🙈':'👁️';passToggle.setAttribute('aria-label',show?'Hide password':'Show password');};
    root.querySelector('#maLoginBtn').onclick=function(){
      const mobile=root.querySelector('#maLoginMobile').value.replace(/\D/g,''),pass=passInput.value,err=root.querySelector('#maLoginErr'),btn=root.querySelector('#maLoginBtn');
      if(!/^\d{10}$/.test(mobile)||!pass){err.textContent='Enter the 10-digit mobile number and password.';return;}
      btn.disabled=true;btn.textContent='⏳ LOGGING IN...';err.textContent='';
      const previousHttp=window.appHttpResult;
      let finished=false;
      const finish=(res)=>{if(finished)return;finished=true;window.appHttpResult=previousHttp;finishLoginUser(res,root,btn,err);};
      window.appHttpResult=function(raw){finish(normalizeLoginResponse(raw));};
      try{
        AndroidBridge.cloudRequest('POST',AndroidBridge.getSharedApiUrl(),JSON.stringify({action:'login',username:mobile,password:pass}));
      }catch(e){finish({ok:false,error:e.message||String(e)});}
      setTimeout(()=>{if(!finished){finished=true;window.appHttpResult=previousHttp;err.textContent='Login request timed out. Please try again.';btn.disabled=false;btn.textContent='↪  Login';}},70000);
    };
  }
  window.showLogin=renderLogin;

  function page(title,html){
    hideOld();document.getElementById('maLogin')?.remove();document.getElementById('maApp')?.remove();
    const root=document.createElement('div');root.id='maApp';root.innerHTML='<div class="ma-bar"><button class="ma-icon" onclick="maDashboard()">‹</button><div class="ma-title">'+esc(title)+'<small>'+esc(roleLabel(getUser()?.role))+' • '+esc(name())+'</small></div><button class="ma-icon" onclick="maDashboard()">⌂</button></div><main class="ma-main">'+html+'</main>';app.appendChild(root);
  }

  function adminUsers(){
    page('MANAGE USERS','<section class="ma-hero"><div class="ma-brand">👥 Add User</div><div class="ma-sub">Mobile number is the login username.</div><div style="display:grid;gap:10px;margin-top:15px"><input id="auName" placeholder="Name" style="padding:14px;border:1px solid #d0d5dd;border-radius:10px"><input id="auMobile" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" style="padding:14px;border:1px solid #d0d5dd;border-radius:10px"><select id="auRole" style="padding:14px;border:1px solid #d0d5dd;border-radius:10px"><option>DRIVER</option><option>MECHANIC</option><option>ADMIN</option></select><select id="auStatus" style="padding:14px;border:1px solid #d0d5dd;border-radius:10px"><option>ACTIVE</option><option>DISABLED</option></select><input id="auPass" type="password" placeholder="Password (optional; blank = last 4)" style="padding:14px;border:1px solid #d0d5dd;border-radius:10px"><button class="ma-card ma-primary" style="width:100%" onclick="addManagedUser()">➕ CREATE USER</button><div id="auMsg" class="status-note"></div></div></section><section class="ma-hero"><div class="ma-brand">Current Users</div><div id="userList">Loading…</div></section>');loadUsers();
  }
  function loadUsers(){apiRequest('list_users',{},r=>{const box=document.getElementById('userList');if(!box)return;if(!r.ok){box.innerHTML='❌ '+esc(r.error||'Could not load users.');return;}box.innerHTML='';(r.users||[]).forEach(u=>{const d=document.createElement('div');d.style.cssText='border:1px solid #e5e7eb;border-radius:14px;padding:13px;margin:9px 0';d.innerHTML='<b>'+esc(u.name)+'</b><div style="color:#667085">'+esc(u.mobile)+' • '+esc(roleLabel(u.role))+' • '+esc(u.status)+'</div><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:9px"><select id="role_'+u.id+'" style="padding:8px"><option '+(roleLabel(u.role)==='DRIVER'?'selected':'')+'>DRIVER</option><option '+(u.role==='MECHANIC'?'selected':'')+'>MECHANIC</option><option '+(u.role==='ADMIN'?'selected':'')+'>ADMIN</option></select><select id="status_'+u.id+'" style="padding:8px"><option '+(u.status==='ACTIVE'?'selected':'')+'>ACTIVE</option><option '+(u.status!=='ACTIVE'?'selected':'')+'>DISABLED</option></select><button onclick="changeManagedRole(\''+u.id+'\')">Role</button><button onclick="changeManagedStatus(\''+u.id+'\')">Status</button><button onclick="resetManagedPassword(\''+u.id+'\')">Password</button></div>';box.appendChild(d);});});}
  function addManagedUser(){const msg=document.getElementById('auMsg'),n=document.getElementById('auName').value.trim(),m=document.getElementById('auMobile').value.replace(/\D/g,''),r=document.getElementById('auRole').value,s=document.getElementById('auStatus').value,p=document.getElementById('auPass').value;if(!n||!/^[0-9]{10}$/.test(m)){msg.textContent='Enter name and 10-digit mobile.';return;}msg.textContent='⏳ Creating user…';apiRequest('add_user',{name:n,mobile:m,role:r,password:p,status:s},res=>{if(!res||!res.ok){msg.textContent='❌ '+((res&&res.error)||'Could not create user.');return;}msg.textContent='✅ User created successfully.';document.getElementById('auName').value='';document.getElementById('auMobile').value='';document.getElementById('auPass').value='';loadUsers();});}
  function changeManagedRole(id){const r=document.getElementById('role_'+id).value;apiRequest('set_user_role',{userId:id,role:r},res=>{alert(res.ok?'Role updated.':(res.error||'Failed.'));loadUsers();});}
  function changeManagedStatus(id){const s=document.getElementById('status_'+id).value;apiRequest('set_user_status',{userId:id,status:s},res=>{alert(res.ok?'Status updated.':(res.error||'Failed.'));loadUsers();});}
  function resetManagedPassword(id){const p=prompt('Enter new password (minimum 8 characters):');if(!p)return;apiRequest('set_user_password',{userId:id,password:p},res=>alert(res.ok?'Password updated.':(res.error||'Failed.')));}
  function formatWorkDate(date,createdAt){
    const raw=createdAt||date||'';
    let d=new Date(raw);
    if(isNaN(d.getTime()) && date){d=new Date(String(date).slice(0,10)+'T00:00:00+05:30');}
    if(isNaN(d.getTime())) return String(date||raw||'');
    const parts=new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'}).formatToParts(d);
    const get=k=>parts.find(x=>x.type===k)?.value||'';
    return get('day')+' '+get('month')+' '+get('year')+' • '+get('hour')+':'+get('minute')+' '+get('dayPeriod');
  }
  function workRecords(admin){
    window.__maWorkRecords=[];
    page(admin?L().allRecords:L().yourRecords,'<section class="ma-hero"><div class="ma-brand">🚛 '+(admin?L().allRecords:L().yourRecords)+'</div><div class="ma-sub">Central DailyWork records</div>'+(admin?'<button class="ma-card ma-primary" style="width:100%;margin-top:12px" onclick="exportMechanicData()">⬇️ '+L().export+'</button>':'')+'<div id="workList" style="margin-top:12px">'+L().loading+'</div></section>');
    apiRequest('list_work',{},r=>{
      const box=document.getElementById('workList');if(!box)return;
      if(!r.ok){box.innerHTML='<div class="status-note" style="border-left:5px solid #b71c1c">❌ '+esc(r.error||'Could not load records.')+'<br><button class="ma-card" style="margin-top:10px;width:100%" onclick="workRecords('+(admin?'true':'false')+')">↻ RETRY</button></div>';return;}
      const records=Array.isArray(r.records)?r.records:[];window.__maWorkRecords=records;
      if(!records.length){
        box.innerHTML='<div class="status-note" style="border-left:5px solid #b71c1c"><b>'+L().noRecords+'</b><br><small>Central DailyWork returned no rows. Tap refresh to check again.</small><br><button class="ma-card ma-primary" style="width:100%;margin-top:10px" onclick="workRecords('+(admin?'true':'false')+')">↻ REFRESH RECORDS</button></div>';
        return;
      }
      box.innerHTML='';
      records.forEach(x=>{
        const d=document.createElement('div');
        d.style.cssText='background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px;margin:10px 0;box-shadow:0 2px 8px #0000000a';
        d.innerHTML='<div style="font-size:15px;color:#667085;font-weight:900">📅 '+esc(formatWorkDate(x.date,x.createdAt))+'</div><div style="font-size:22px;font-weight:900;margin-top:9px;color:#17202a">🚛 '+esc(x.vehicleNumber||'—')+'</div><div style="font-size:15px;color:#667085;font-weight:800;margin-top:6px">'+esc(x.userName||'')+'</div><div style="font-size:17px;line-height:1.45;margin-top:7px;white-space:pre-wrap">'+esc(x.workCompleted||'')+'</div>';
        box.appendChild(d);
      });
    });
  }
  function exportMechanicData(){
    const records=Array.isArray(window.__maWorkRecords)?window.__maWorkRecords:[];
    if(!records.length){alert('Load the records first, then tap DOWNLOAD DATA.');return;}
    const lines=['Date,Time,Vehicle Number,User Name,Work Completed'];
    records.forEach(x=>{const dt=formatWorkDate(x.date,x.createdAt).replace(/,/g,'');lines.push([dt,x.vehicleNumber||'',x.userName||'',x.workCompleted||''].map(v=>csvSafe(v)).join(','));});
    const csv=lines.join('\r\n');
    if(window.AndroidBridge?.saveTextFile)AndroidBridge.saveTextFile('Drivers_Mech_AI_DailyWork.csv',csv);
    else{const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='Drivers_Mech_AI_DailyWork.csv';a.click();}
  }
  function csvSafe(v){return '"'+String(v??'').replace(/"/g,'""')+'"';}
  function adminWork(){workRecords(true)} function mechanicRecords(){workRecords(false)}
  function mechanicUpdate(){const u=getUser()||{};page(L().daily,'<section class="ma-hero"><div class="ma-brand">➕ '+L().daily+'</div><div class="ma-sub">'+L().mechanic+': '+esc(u.name||'')+'</div><div style="display:grid;gap:12px;margin-top:15px"><input id="mwVehicle" placeholder="'+L().vehicleNo+'" style="padding:15px;border:1px solid #d0d5dd;border-radius:10px;font-size:18px"><textarea id="mwWork" rows="7" placeholder="'+L().work+'" style="padding:15px;border:1px solid #d0d5dd;border-radius:10px;font-size:18px"><\/textarea><button class="ma-card" onclick="speakMechanicWork()">🎤 '+L().voice+'</button><button class="ma-card ma-primary" onclick="saveMechanicWork()">💾 '+L().save+'</button><div id="mwMsg" class="status-note"></div></div></section>');}
  function speakMechanicWork(){const st=document.getElementById('mwMsg');if(st)st.textContent='🎤 Listening…';window.nativeSpeechResult=function(text){const el=document.getElementById('mwWork');if(el)el.value=text||'';if(st)st.textContent=text?'✅ Voice captured.':'⚠️ No voice text captured.';window.nativeSpeechResult=null;};AndroidBridge.startSpeech(getLang()==='kn'?'kn-IN':getLang()==='hi'?'hi-IN':'en-IN');}
  function saveMechanicWork(){const v=document.getElementById('mwVehicle').value.trim(),w=document.getElementById('mwWork').value.trim(),msg=document.getElementById('mwMsg');if(!v||!w){msg.textContent=L().vehicleNo+' + '+L().work+' required.';return;}apiRequest('save_work',{date:new Date().toISOString().slice(0,10),vehicleNumber:v,workCompleted:w},r=>{msg.textContent=r.ok?'✅ Daily update saved centrally.':'❌ '+(r.error||'Save failed.');});}
  const DRIVER_GUIDES={
warning:[['🌡️','High Engine Temperature','Temperature warning'],['🛢️','Low Oil Pressure','Oil pressure warning'],['💨','Low Air Pressure','Air pressure warning'],['🔋','Battery Not Charging','Charging warning'],['🧰','Air Filter Clogged / Choked','Air filter warning'],['🅿️','Parking Brake Engaged','Parking brake'],['⚙️','Check Engine / MIL','Engine / MIL warning'],['💧','Low DEF / AdBlue Level','DEF / AdBlue'],['⛽','Water In Fuel','Fuel warning'],['🔬','NOx Malfunction','NOx system warning'],['🛑','STOP / Caution','Stop / caution warning']],
dpf:[['📍','Park in a safe open area.','Safe location'],['🅿️','Apply hand brake and use wheel chokes.','Secure vehicle'],['N','Keep the vehicle in neutral.','Neutral gear'],['⚙️','PTO must be disengaged.','PTO OFF'],['🛑','Exhaust brake must be OFF.','Exhaust brake OFF'],['🦶','Do not operate the accelerator.','No accelerator'],['🚫','Inhibit switch must be OFF.','Inhibit OFF'],['♻️','Press the DPF regeneration switch for about 5 seconds and release.','Start regeneration'],['🔥','Exhaust / ATS parts become very hot. Keep away from hot parts.','Heat warning']],
daily:[['🛢️','Engine oil level','Check before driving'],['💧','Radiator coolant level','Check before driving'],['🧴','Clutch oil level','Check before driving'],['🪑','Seat / steering adjustment','Driver position'],['🔒','Seat belt','Safety'],['🅿️','Parking brake','Safety'],['💡','All lights working','Electrical check'],['🎛️','All controls working','Control check'],['📟','Instrument cluster readiness','Cluster check'],['🛞','Tyres: pressure, damage, cuts and wear','Tyre check']],
adblue:[['🧼','Keep the filler area clean.','Filling precaution'],['🚫','Prevent dust or mud contamination.','Contamination prevention'],['🧴','Use the dedicated filling arrangement.','Correct filling'],['💧','Put only AdBlue into the AdBlue tank.','Correct fluid only'],['⬆️','Do not overfill.','Avoid overfilling'],['🛠️','If a warning or fault remains, contact authorized service.','Service action']],
safety:[['📵','Do not use a mobile phone while driving.','No phone while driving'],['🔒','Wear the seat belt.','Seat belt'],['🚦','Follow traffic rules and speed limits.','Traffic safety'],['😴','Do not drive when tired.','Rest before driving'],['↔️','Maintain a safe distance.','Safe distance'],['🔍','Inspect the vehicle before driving.','Pre-drive inspection'],['👨‍🔧','Repair work should be carried out by authorized persons.','Authorized repair']]};
  const DRIVER_GUIDE_TITLES={en:{warning:'WARNING LIGHTS',dpf:'DPF REGENERATION',daily:'DAILY DRIVER CHECK',adblue:'ADBLUE / DEF GUIDE',safety:'DRIVER SAFETY'},kn:{warning:'ವಾರ್ನಿಂಗ್ ಲೈಟ್‌ಗಳು',dpf:'DPF ರಿಜೆನರೇಷನ್',daily:'ದಿನನಿತ್ಯದ ಚಾಲಕ ತಪಾಸಣೆ',adblue:'ADBLUE / DEF ಮಾರ್ಗದರ್ಶಿ',safety:'ಚಾಲಕ ಸುರಕ್ಷತೆ'},hi:{warning:'वार्निंग लाइट',dpf:'DPF रीजेनेरेशन',daily:'दैनिक ड्राइवर जांच',adblue:'ADBLUE / DEF गाइड',safety:'ड्राइवर सुरक्षा'}};
  const DRIVER_TRANSLATIONS={
warning:{kn:['ಎಂಜಿನ್ ತಾಪಮಾನ ಹೆಚ್ಚು','ಆಯಿಲ್ ಪ್ರೆಶರ್ ಕಡಿಮೆ','ಏರ್ ಪ್ರೆಶರ್ ಕಡಿಮೆ','ಬ್ಯಾಟರಿ ಚಾರ್ಜ್ ಆಗುತ್ತಿಲ್ಲ','ಏರ್ ಫಿಲ್ಟರ್ ಕ್ಲಾಗ್','ಪಾರ್ಕಿಂಗ್ ಬ್ರೇಕ್','ಚೆಕ್ ಎಂಜಿನ್ / MIL','DEF / AdBlue ಮಟ್ಟ ಕಡಿಮೆ','ಇಂಧನದಲ್ಲಿ ನೀರು','NOx ದೋಷ','STOP / ಎಚ್ಚರಿಕೆ'],hi:['इंजन तापमान अधिक','ऑयल प्रेशर कम','एयर प्रेशर कम','बैटरी चार्ज नहीं हो रही','एयर फिल्टर चोक','पार्किंग ब्रेक','चेक इंजन / MIL','DEF / AdBlue स्तर कम','ईंधन में पानी','NOx खराबी','STOP / सावधानी']},
dpf:{kn:['ಸುರಕ್ಷಿತ ತೆರೆದ ಸ್ಥಳದಲ್ಲಿ ಪಾರ್ಕ್ ಮಾಡಿ','ಹ್ಯಾಂಡ್ ಬ್ರೇಕ್ ಹಾಕಿ ಮತ್ತು ವೀಲ್ ಚಾಕ್ ಬಳಸಿ','ವಾಹನವನ್ನು ನ್ಯೂಟ್ರಲ್‌ನಲ್ಲಿ ಇಡಿ','PTO disengage ಮಾಡಿ','ಎಕ್ಸಾಸ್ಟ್ ಬ್ರೇಕ್ OFF ಮಾಡಿ','ಆಕ್ಸಿಲರೇಟರ್ ಬಳಸಬೇಡಿ','Inhibit switch OFF ಇರಲಿ','DPF regeneration switch ಅನ್ನು ಸುಮಾರು 5 ಸೆಕೆಂಡ್ ಒತ್ತಿ ಬಿಡಿ'],hi:['सुरक्षित खुले स्थान में पार्क करें','हैंड ब्रेक लगाएं और व्हील चॉक लगाएं','वाहन को न्यूट्रल में रखें','PTO बंद रखें','एग्जॉस्ट ब्रेक OFF रखें','एक्सेलेरेटर न चलाएं','Inhibit switch OFF रखें','DPF regeneration switch को लगभग 5 सेकंड दबाकर छोड़ें']},
daily:{kn:['ಎಂಜಿನ್ ಆಯಿಲ್ ಮಟ್ಟ','ರೇಡಿಯೇಟರ್ ಕೂಲಂಟ್ ಮಟ್ಟ','ಕ್ಲಚ್ ಆಯಿಲ್ ಮಟ್ಟ','ಸೀಟ್ / ಸ್ಟೀರಿಂಗ್ ಹೊಂದಾಣಿಕೆ','ಸೀಟ್ ಬೆಲ್ಟ್','ಪಾರ್ಕಿಂಗ್ ಬ್ರೇಕ್','ಎಲ್ಲಾ ಲೈಟ್‌ಗಳು ಕೆಲಸ ಮಾಡುತ್ತಿವೆಯೇ','ಎಲ್ಲಾ ಕಂಟ್ರೋಲ್‌ಗಳು ಕೆಲಸ ಮಾಡುತ್ತಿವೆಯೇ','ಇನ್‌ಸ್ಟ್ರುಮೆಂಟ್ ಕ್ಲಸ್ಟರ್ ಸಿದ್ಧತೆ','ಟೈರ್ ಒತ್ತಡ, ಹಾನಿ, ಕಟ್ ಮತ್ತು ವೇರ್'],hi:['इंजन ऑयल स्तर','रेडिएटर कूलेंट स्तर','क्लच ऑयल स्तर','सीट / स्टीयरिंग एडजस्टमेंट','सीट बेल्ट','पार्किंग ब्रेक','सभी लाइट काम कर रही हैं','सभी कंट्रोल काम कर रहे हैं','इंस्ट्रूमेंट क्लस्टर तैयार है','टायर: प्रेशर, नुकसान, कट और घिसाव']},
adblue:{kn:['ಫಿಲ್ಲರ್ ಪ್ರದೇಶ ಸ್ವಚ್ಛವಾಗಿರಲಿ','ಧೂಳು ಅಥವಾ ಮಣ್ಣು ಒಳಗೆ ಹೋಗದಂತೆ ನೋಡಿ','Dedicated filling arrangement ಬಳಸಿ','AdBlue tank ಗೆ AdBlue ಹೊರತು ಬೇರೆ ಯಾವುದನ್ನೂ ಹಾಕಬೇಡಿ','Overfill ಮಾಡಬೇಡಿ','Warning ಅಥವಾ fault ಉಳಿದರೆ authorized service ಸಂಪರ್ಕಿಸಿ'],hi:['फिलर क्षेत्र साफ रखें','धूल या मिट्टी को अंदर जाने से रोकें','Dedicated filling arrangement इस्तेमाल करें','AdBlue टैंक में AdBlue के अलावा कुछ न डालें','ओवरफिल न करें','वार्निंग या फॉल्ट रहे तो authorized service से संपर्क करें']},
safety:{kn:['ಚಾಲನೆ ಮಾಡುವಾಗ ಮೊಬೈಲ್ ಬಳಸಬೇಡಿ','ಸೀಟ್ ಬೆಲ್ಟ್ ಧರಿಸಿ','ಟ್ರಾಫಿಕ್ ನಿಯಮ ಮತ್ತು ವೇಗ ಮಿತಿ ಪಾಲಿಸಿ','ದಣಿದಾಗ ಚಾಲನೆ ಮಾಡಬೇಡಿ','ಸುರಕ್ಷಿತ ಅಂತರ ಇಡಿ','ಚಾಲನೆಗೆ ಮೊದಲು ವಾಹನ ಪರಿಶೀಲಿಸಿ','Repair ಕೆಲಸವನ್ನು authorized persons ಮೂಲಕ ಮಾಡಿಸಿ'],hi:['ड्राइविंग के दौरान मोबाइल न इस्तेमाल करें','सीट बेल्ट पहनें','ट्रैफिक नियम और स्पीड लिमिट मानें','थके होने पर ड्राइव न करें','सुरक्षित दूरी रखें','ड्राइविंग से पहले वाहन जांचें','Repair काम authorized persons से कराएं']}};
  function driverGuide(type){
    const lang=getLang(),items=DRIVER_GUIDES[type]||[],trn=DRIVER_TRANSLATIONS[type]||{};
    const titles=DRIVER_GUIDE_TITLES[lang]||DRIVER_GUIDE_TITLES.en;
    const html=items.map((x,i)=>{
      const title=lang==='en'?x[1]:(trn[lang]?.[i]||x[1]);
      const detail=lang==='en'?x[2]:(trn[lang]?.[i]||x[2]);
      const q=encodeURIComponent('Mahindra BS6 BSVI truck '+x[1]+' driver training '+(lang==='kn'?'Kannada':lang==='hi'?'Hindi':'English'));
      const url='https://www.youtube.com/results?search_query='+q;
      return '<div class="ma-guide-item">'+
        '<div class="ma-truck-icon">🚛<small>MAHINDRA BS6</small></div>'+
        '<div class="ma-guide-copy"><div class="ma-guide-number">'+(i+1)+'</div><div class="ma-guide-title">'+esc(title)+'</div><div class="ma-guide-detail">'+esc(detail)+'</div></div>'+
        '<button class="ma-guide-video" onclick="openRealYoutube(\''+esc(url).replace(/'/g,'&#39;')+'\')">▶ REAL VIDEO<br><small>ACTION + INSTRUCTION</small></button>'+
      '</div>';
    }).join('');
    const intros={
      en:type==='dpf'?'⚠️ Follow the supplied Mahindra BSVI/BS6 procedure. Exhaust / ATS parts become very hot during regeneration. Keep away from flammable material.':type==='warning'?'⚠️ Select the exact warning item and open its matching training-video search. Do not guess a repair.':'📚 Every item below follows the supplied Mahindra driver-training guide.',
      kn:type==='dpf'?'⚠️ ನೀಡಿರುವ Mahindra BSVI/BS6 ವಿಧಾನವನ್ನು ಅನುಸರಿಸಿ. Regeneration ಸಮಯದಲ್ಲಿ Exhaust / ATS parts ತುಂಬಾ ಬಿಸಿಯಾಗುತ್ತವೆ.':'📚 ಕೆಳಗಿನ ಪ್ರತಿಯೊಂದು item ನೀಡಿರುವ Mahindra driver-training guide ಆಧಾರಿತವಾಗಿದೆ.',
      hi:type==='dpf'?'⚠️ दिए गए Mahindra BSVI/BS6 तरीके का पालन करें। Regeneration के दौरान Exhaust / ATS parts बहुत गर्म होते हैं।':'📚 नीचे दिए गए सभी items दिए गए Mahindra driver-training guide पर आधारित हैं।'
    };
    page(titles[type],'<section class="ma-hero"><div class="ma-brand">🚛 '+esc(titles[type])+'</div><div class="ma-sub">'+esc(intros[lang])+'</div><button class="ma-card" style="width:100%;margin-top:12px" onclick="readDriverGuide(\''+type+'\')">🔊 '+esc(L().read)+'</button></section><section class="ma-guide-list">'+html+'</section>');
  }
  function readDriverGuide(type){const root=document.querySelector('#maApp .ma-main');if(!root)return;const text=[...root.querySelectorAll('.ma-card')].map(x=>x.innerText).join('. ');if(window.AndroidBridge?.speakText)AndroidBridge.speakText(text,getLang()==='kn'?'kn-IN':getLang()==='hi'?'hi-IN':'en-IN');}
  function adminProblems(){page('PROBLEM REPORTS','<section class="ma-hero"><div class="ma-brand">📝 Driver Problem Reports</div><div id="problemList">Loading…</div></section>');apiRequest('list_problems',{},r=>{const box=document.getElementById('problemList');if(!box)return;if(!r.ok){box.innerHTML='❌ '+esc(r.error||'Could not load reports.');return;}if(!(r.records||[]).length){box.innerHTML='<div class="status-note">No reports yet.</div>';return;}box.innerHTML='';r.records.forEach(x=>{const d=document.createElement('div');d.style.cssText='border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:9px 0';d.innerHTML='<b>'+esc(x.date)+' '+esc(x.time)+' • '+esc(x.vehicleNumber||'No vehicle')+'</b><div>'+esc(x.userName)+' • '+esc(roleLabel(x.role))+'</div><div style="margin-top:7px;white-space:pre-wrap">'+esc(x.problem||x.photoText)+'</div>';box.appendChild(d);});});}

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
  window.openRealYoutube=openRealYoutube;
  window.openRealVideo=openRealVideo;
  window.secureAdmin=function(){dashboard()};
  window.secureMechanic=function(){dashboard()};
  window.routeAfterLogin=function(){dashboard()};

  function meaningfulTokens(s){
    const stop=new Set(['the','and','for','with','from','this','that','your','you','please','give','solution','solve','what','how','my','as','photo','uploaded','image','problem','vehicle','truck','tell','show','find','need','want','is','are','was','were','to','of','in','on','a','an','or','by','do','does','can','will','me','it','at','be','now','received','screen']);
    return String(s||'').toLowerCase().replace(/[^a-z0-9\\u0900-\\u097f\\u0c80-\\u0cff\\s]/g,' ').split(/\\s+/).filter(t=>t.length>=3&&!stop.has(t));
  }
  function exactKBSearch(query){
    const kb=Array.isArray(window.mahindraKB)?window.mahindraKB:[]; const q=String(query||'').trim(); const qt=meaningfulTokens(q);
    if(!qt.length||!kb.length)return []; const qLower=q.toLowerCase();
    return kb.map(r=>{const txt=String(r.text||'');const hay=(txt+' '+String(r.source||'')+' '+String(r.file||'')).toLowerCase();let score=0,matched=0;
      qt.forEach(t=>{if(hay.includes(t)){matched++;score+=t.length>=7?3:2;}});
      if(qLower.length>=8&&hay.includes(qLower))score+=12; return {...r,score,matched};
    }).filter(r=>r.matched>=2&&r.score>=4).sort((a,b)=>b.score-a.score).slice(0,3);
  }
  function documentedPoints(text){
    const raw=String(text||'').trim(); const numbered=raw.split(/(?=\\b\\d+[.)]\\s)/).map(x=>x.trim()).filter(Boolean);
    if(numbered.length>=2)return numbered.slice(0,30); return raw.split(/\\n+/).map(x=>x.trim()).filter(Boolean).slice(0,30);
  }
  function renderExactSolution(query,fromPhoto){
    const hits=exactKBSearch(query); let body='<div class="notice"><b>📷 '+(fromPhoto?'PHOTO PROBLEM RECEIVED':'PROBLEM RECEIVED')+'</b><div style="margin-top:8px;font-size:17px;line-height:1.45">'+esc(query)+'</div></div>';
    if(!hits.length){body+='<div class="notice" style="border-left:6px solid #b71c1c"><b>❌ NO EXACT DOCUMENTED SOLUTION FOUND</b><br><br>Do not use a generic/default repair procedure. Retake a clear photo of the warning/message/component, or speak the exact problem.</div><button class="primary" onclick="exactProblem()">📷 TAKE CLEAR PHOTO AGAIN</button><button class="secondary" onclick="focusProblemText()">🎤 SPEAK / EDIT PROBLEM</button>';showContent('EXACT VEHICLE SOLUTION',body);return;}
    body+='<div class="notice" style="border-left:6px solid #1b5e20"><b>✅ EXACT DOCUMENTED INFORMATION</b><br>This answer is taken only from the supplied Mahindra BSVI source material. No default steps are added.</div>';
    hits.forEach((h,idx)=>{body+='<div class="ma-hero" style="margin-top:12px"><div class="ma-brand">'+(idx===0?'EXACT MATCH':'RELATED DOCUMENTED MATCH')+'</div><div class="ma-sub">📚 '+esc(h.source)+(h.page?' • Page / Slide '+esc(h.page):'')+'</div></div>';const pts=documentedPoints(h.text);pts.forEach((p,i)=>{body+='<div class="ma-card" style="margin:8px 0;display:block;min-height:0"><span style="font-size:16px;line-height:1.55;white-space:pre-wrap">'+esc(p)+'</span></div>';});});
    body+='<div id="exactReadStatus" class="status-note">🔊 Tap READ EXACT SOLUTION to hear only the documented text.</div><button class="primary" onclick="readExactSolution()">🔊 READ EXACT SOLUTION</button>';showContent('EXACT VEHICLE SOLUTION',body);
  }
  window.focusProblemText=function(){setTimeout(()=>document.getElementById('driverProblemText')?.focus(),50)};
  window.findExactSolution=function(){renderExactSolution((document.getElementById('driverProblemText')?.value||'').trim(),false)};
  window.readExactSolution=function(){const st=document.getElementById('exactReadStatus');if(!st)return;const text=[...document.querySelectorAll('.ma-card span')].map(x=>x.textContent).join('. ');st.textContent='🔊 '+text;try{if(window.AndroidBridge?.speakText)AndroidBridge.speakText(text,'en-IN');else if(window.speechSynthesis){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-IN';speechSynthesis.speak(u)}}catch(e){}};
  window.nativePhotoTextResult=function(text){const clean=String(text||'').trim();const el=document.getElementById('driverProblemText');const st=document.getElementById('driverPhotoStatus');if(el&&clean)el.value=clean;if(st)st.textContent=clean?'🔎 Photo text detected. Finding the exact documented solution…':'⚠️ No readable text found. Take a clearer photo of the warning/message.';if(clean)setTimeout(()=>renderExactSolution(clean,true),120);};
  window.exactProblem=function(){
    hideOld();let root=document.getElementById('maApp');if(root)root.remove();root=document.createElement('div');root.id='maApp';
    root.innerHTML='<div class="ma-bar"><button class="ma-icon" onclick="maDashboard()">‹</button><div class="ma-title">VEHICLE PROBLEM<small>'+esc(roleLabel(getUser()?.role))+' • '+esc(name())+'</small></div><button class="ma-icon" onclick="maDashboard()">⌂</button></div><main class="ma-main"><section class="ma-hero"><div class="ma-brand">📷 Vehicle Problem Report</div><div class="ma-sub">Photo text is matched only against the supplied Mahindra BSVI source library.</div></section><div class="ma-card" style="display:block"><label style="font-weight:900">Vehicle Number (optional)</label><input id="driverVehicleNumber" placeholder="Vehicle number" style="width:100%;box-sizing:border-box;margin-top:8px;padding:14px;border:1px solid #d0d5dd;border-radius:10px"><label style="display:block;font-weight:900;margin-top:14px">Problem / warning text</label><textarea id="driverProblemText" rows="6" style="width:100%;box-sizing:border-box;margin-top:8px" placeholder="Speak or type the exact warning/problem"></textarea><div id="driverPhotoStatus" class="status-note"></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-top:10px"><button class="ma-card ma-primary" onclick="startExactVoice(&quot;en-IN&quot;)">🎤 English</button><button class="ma-card" onclick="startExactVoice(&quot;hi-IN&quot;)">🎤 Hindi</button><button class="ma-card" onclick="startExactVoice(&quot;kn-IN&quot;)">🎤 Kannada</button></div><button class="ma-card" style="width:100%;margin-top:10px" onclick="startExactCamera()">📷 TAKE PHOTO — DIRECT CAMERA</button><button class="ma-card" style="width:100%;margin-top:10px" onclick="findExactSolution()">🔎 FIND EXACT SOLUTION</button><button class="ma-card" style="width:100%;margin-top:10px" onclick="saveDriverProblem()">📝 SAVE PROBLEM REPORT</button></div></main>';
    app.appendChild(root);
  };
  window.startExactCamera=function(){if(window.AndroidBridge?.captureDriverPhoto)AndroidBridge.captureDriverPhoto();};
  window.startExactVoice=function(locale){
    locale=locale||'en-IN';window._speechTarget='driver';
    const st=document.getElementById('driverPhotoStatus');if(st)st.textContent='🎤 Listening…';
    window.nativeSpeechResult=function(text){const el=document.getElementById('driverProblemText');if(el)el.value=String(text||'');if(st)st.textContent=text?'✅ Voice captured.':'⚠️ No voice text captured.';window.nativeSpeechResult=null;};
    if(window.AndroidBridge?.startSpeech)AndroidBridge.startSpeech(locale);
  };
  window.saveDriverProblem=function(){
    const vehicle=document.getElementById('driverVehicleNumber')?.value.trim()||'';
    const problem=document.getElementById('driverProblemText')?.value.trim()||'';
    const status=document.getElementById('driverPhotoStatus');
    if(!problem){if(status)status.textContent='Enter, speak, or photograph the exact problem first.';return;}
    if(status)status.textContent='⏳ Saving problem report…';
    apiRequest('save_problem',{vehicleNumber:vehicle,problem:problem,photoText:problem},r=>{if(status)status.textContent=r.ok?'✅ Problem report saved centrally.':'❌ '+(r.error||'Could not save report.');});
  };
    window.driverCamera=function(){
    const st=document.getElementById('driverPhotoStatus')||document.getElementById('photoStatus');if(st)st.textContent='📷 Opening camera…';
    if(window.AndroidBridge&&AndroidBridge.captureDriverPhoto){AndroidBridge.captureDriverPhoto();return}
    const input=document.getElementById('driverCameraInput')||document.getElementById('problemCamera');if(input)input.click();
  };
  window.openProblemCamera=window.driverCamera;
  window.nativeCameraResult=function(ok){const st=document.getElementById('driverPhotoStatus')||document.getElementById('photoStatus');if(st)st.textContent=ok?'✅ Photo captured. Now speak or type the problem.':'❌ Camera was not completed. Tap Take Photo again.'};

  // Inline handlers inside generated HTML need explicit window exports because this file uses an IIFE.
  Object.assign(window,{
    addManagedUser:addManagedUser,
    changeManagedRole:changeManagedRole,
    changeManagedStatus:changeManagedStatus,
    resetManagedPassword:resetManagedPassword,
    saveMechanicWork:saveMechanicWork,
    speakMechanicWork:speakMechanicWork,
    saveDriverProblem:saveDriverProblem,
    exactProblem:exactProblem,
    findExactSolution:findExactSolution,
    focusProblemText:focusProblemText,
    readExactSolution:readExactSolution,
    startExactCamera:startExactCamera,
    startExactVoice:startExactVoice,
    maBack:maBack,
    maDashboard:maDashboard,
    maLogout:maLogout,
    maOpenMenu:maOpenMenu,
    maCloseMenu:maCloseMenu,
    maOpenHelp:maOpenHelp,
    maSetLanguage:setLang,
    driverGuide:driverGuide,
    readDriverGuide:readDriverGuide,
    exportMechanicData:exportMechanicData
  });

  // Fresh Activity launches are reset by the native layer. Do not reload the WebView here:
  // reloading races the secure-login bootstrap and can leave only the static header visible.
  localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);
  hideOld();
  setTimeout(()=>{renderLogin();},120);
})();