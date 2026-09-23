(function(){
  'use strict';
  const TOKEN='mahindra_secure_token_v1', USER='mahindra_secure_user_v1', MODE='mahindra_user_role_v2';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getUser=()=>{try{return JSON.parse(localStorage.getItem(USER)||'null')}catch(e){return null}};
  const role=()=>{const r=String(getUser()?.role||'').toUpperCase();return r==='USER'?'DRIVER':r;};
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
  document.head.insertAdjacentHTML('beforeend',css);\n  /* MA-ROBUST-LOGIN-NAV-v1 */\n  const robustCss='<style id="ma-robust-login-nav">.ma-backbar{padding-top:env(safe-area-inset-top,0px);height:calc(48px + env(safe-area-inset-top,0px));}.ma-main{padding-top:calc(82px + env(safe-area-inset-top,0px));}.page-nav{position:sticky!important;top:0!important;left:auto!important;right:auto!important;width:100%!important;box-sizing:border-box!important;margin:0 0 14px!important;padding:8px 0!important;z-index:50!important;background:#fff!important}.page-nav button{min-height:52px!important;width:calc(50% - 6px)!important}.page-nav .nav-back{order:1!important}.page-nav .nav-home{order:2!important}#screen{padding-top:0!important}.auth-card input{font-family:Arial,sans-serif}</style>';document.head.insertAdjacentHTML('beforeend',robustCss);

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

  function apiRequest(action,payload,done){
    const req=Object.assign({action:action,token:localStorage.getItem(TOKEN)||''},payload||{});
    const prev=window.appHttpResult;
    window.appHttpResult=function(raw){
      let out=raw,res=null;
      try{out=typeof raw==='string'?JSON.parse(raw):raw;}catch(e){}
      try{res=typeof out.body==='string'?JSON.parse(out.body):(out.body||out);}catch(e){try{res=typeof raw==='string'?JSON.parse(raw):raw;}catch(e2){res={ok:false,error:'Backend response could not be read.'};}}
      window.appHttpResult=prev;
      if(done)done(res);
    };
    try{
      if(!window.AndroidBridge||!AndroidBridge.cloudRequest){window.appHttpResult=prev;done&&done({ok:false,error:'Android network bridge is unavailable.'});return;}
      AndroidBridge.cloudRequest('POST',AndroidBridge.getSharedApiUrl(),JSON.stringify(req));
    }catch(e){window.appHttpResult=prev;done&&done({ok:false,error:String(e.message||e)});}
  }

  function roleLabel(r){r=String(r||'').toUpperCase();return r==='USER'?'DRIVER':r;}
  function roleName(r){r=roleLabel(r);return r==='ADMIN'?'Administrator':r==='MECHANIC'?'Mechanic':'Driver';}

  function dashboard(){
    hideOld();document.getElementById('secureAuth')?.remove();document.getElementById('maLogin')?.remove();
    let root=document.getElementById('maApp');if(root)root.remove();root=document.createElement('div');root.id='maApp';
    const u=getUser()||{},r=roleLabel(u.role),admin=r==='ADMIN',mech=r==='MECHANIC';
    root.innerHTML='<div class="ma-bar"><button class="ma-icon" onclick="maOpenMenu()">☰</button><div class="ma-title">MAHINDRA BSVI<small>'+esc(roleName(r))+' • '+esc(u.name||'')+'</small></div><button class="ma-icon" onclick="maLogout()">⎋</button></div><main class="ma-main"><section class="ma-hero"><div class="ma-brand">Welcome, '+esc(u.name||'User')+'</div><div class="ma-sub">Secure role-based dashboard</div><div class="ma-role">🔐 '+esc(r)+' • '+esc(roleName(r))+'</div></section><div class="ma-section">'+(admin?'ADMINISTRATION':mech?'MECHANIC WORK':'DRIVER GUIDE')+'</div><section class="ma-grid" id="maCards"></section></main><div id="maDrawer" class="ma-drawer" onclick="if(event.target===this)maCloseMenu()"><aside class="ma-sheet"><div class="ma-sheet-head"><strong>MENU<br><small style="color:#667085">'+esc(r)+' • '+esc(u.name||'')+'</small></strong><button class="ma-icon" style="background:#17202a" onclick="maCloseMenu()">×</button></div><button class="ma-menu-btn" onclick="maDashboard()">⌂ Dashboard</button><div id="maMenuItems"></div><button class="ma-menu-btn" onclick="maOpenHelp()">🧭 App Help</button><button class="ma-menu-btn danger" onclick="maLogout()">⎋ Log out</button></aside></div>';
    app.appendChild(root);
    let cards;
    if(admin) cards=[['👥','MANAGE USERS','Add drivers, mechanics and admins • status • role • password',adminUsers],['👨‍🔧','MECHANIC DAILY UPDATES','View all mechanic work from the central DailyWork sheet',adminWork],['📝','PROBLEM REPORTS','View driver vehicle problem reports',adminProblems],['📚','MAHINDRA DATA','Open supplied BSVI source library',()=>oldAbout&&oldAbout()]];
    else if(mech) cards=[['➕','DAILY WORK UPDATE','Vehicle + work completed + voice • save centrally',mechanicUpdate],['📋','MY WORK RECORDS','View your central daily updates',mechanicRecords],['📚','MAHINDRA DATA','Open supplied BSVI source library',()=>oldAbout&&oldAbout()]];
    else cards=[['📷','VEHICLE PROBLEM','Photo / voice / text • exact documented solution',()=>window.exactProblem()],['🚨','WARNING LIGHTS','Warning-lamp guidance',()=>oldDriverCard('warning')],['♻️','DPF REGENERATION','DPF guidance',()=>oldDriverCard('dpf')],['🔧','DAILY CHECK','Before-driving checklist',()=>oldDriverCard('daily')],['💧','ADBLUE / DEF','Operating guidance',()=>oldDriverCard('adblue')],['🛑','DRIVER SAFETY','Safety guidance',()=>oldDriverCard('safety')],['📚','MAHINDRA DATA','Open supplied BSVI source library',()=>oldAbout&&oldAbout()]];
    const box=root.querySelector('#maCards'),mi=root.querySelector('#maMenuItems');
    cards.forEach((c,i)=>{const el=document.createElement('button');el.className='ma-card'+(i===0?' ma-primary':'');el.innerHTML='<b>'+c[0]+'</b><span>'+esc(c[1])+'</span><small>'+esc(c[2])+'</small>';el.onclick=c[3];box.appendChild(el);const m=document.createElement('button');m.className='ma-menu-btn';m.textContent=c[0]+'  '+c[1];m.onclick=c[3];mi.appendChild(m);});
  }

  function normalizeLoginResponse(raw){
    let candidates=[];
    const push=v=>{if(v&&typeof v==='object')candidates.push(v)};
    let x=raw;
    if(typeof x==='string'){try{x=JSON.parse(x)}catch(e){}}
    push(x);
    if(x&&typeof x==='object'){
      let b=x.body;
      if(typeof b==='string'){try{b=JSON.parse(b)}catch(e){}}
      push(b);
      if(b&&typeof b==='object'){
        let bb=b.body;
        if(typeof bb==='string'){try{bb=JSON.parse(bb)}catch(e){}}
        push(bb);
      }
      let result=x.result;
      if(typeof result==='string'){try{result=JSON.parse(result)}catch(e){}}
      push(result);
    }
    for(const v of candidates){
      if(v && (v.ok===true || v.token || v.user || v.error)) return v;
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
    let root=document.getElementById('maLogin');if(root)root.remove();root=document.createElement('div');root.id='maLogin';root.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#f5f7fa;overflow:auto;padding:24px;box-sizing:border-box;font-family:Arial,sans-serif';
    root.innerHTML='<div style="min-height:100%;display:flex;align-items:center;justify-content:center"><div class="auth-card" style="width:min(620px,100%);background:#fff;padding:34px 30px;border-radius:24px;box-sizing:border-box"><div style="font-size:72px;text-align:center">🚛</div><h1 style="text-align:center;color:#b71c1c;margin:10px 0 6px;font-size:38px">MAHINDRA BSVI</h1><p style="text-align:center;color:#667085;font-size:20px;margin:0 0 30px">Driver & Mechanic Guide AI • Secure Login</p><label style="display:block;font-weight:900;font-size:20px;margin-bottom:8px">Mobile Number (Username)</label><input id="maLoginMobile" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" style="width:100%;box-sizing:border-box;padding:18px;border:2px solid #d0d5dd;border-radius:14px;font-size:23px;margin-bottom:20px"><label style="display:block;font-weight:900;font-size:20px;margin-bottom:8px">Password</label><div style="position:relative;margin-bottom:20px"><input id="maLoginPass" name="password" autocomplete="current-password" autocapitalize="none" spellcheck="false" type="password" maxlength="64" style="width:100%;box-sizing:border-box;padding:18px 58px 18px 18px;border:2px solid #d0d5dd;border-radius:14px;font-size:23px"><button id="maPassToggle" type="button" aria-label="Show password" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:transparent;font-size:22px;padding:8px">👁️</button></div><button id="maLoginBtn" style="width:100%;padding:20px;border:0;border-radius:14px;background:#b71c1c;color:#fff;font-size:23px;font-weight:900">🔐 LOGIN</button><div id="maLoginErr" style="color:#b71c1c;font-weight:800;font-size:18px;margin-top:16px;min-height:26px">'+esc(message||'')+'</div><div style="color:#667085;font-size:15px;margin-top:16px;line-height:1.4">Mobile number is only the username. Password is a separate protected credential. Driver/Mechanic accounts use the last 4 digits of the mobile only when the Admin has not set a custom password.</div></div></div>';
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
        if(AndroidBridge?.cloudRequest) AndroidBridge.cloudRequest('POST',AndroidBridge.getSharedApiUrl(),JSON.stringify({action:'login',username:mobile,password:pass}));
        else throw new Error('Android network bridge unavailable');
      }catch(e){finish({ok:false,error:e.message||String(e)});}
      setTimeout(()=>{if(!finished){finished=true;window.appHttpResult=previousHttp;err.textContent='Login request timed out. Please try again.';btn.disabled=false;btn.textContent='🔐 LOGIN';}},70000);
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
  function addManagedUser(){const msg=document.getElementById('auMsg'),n=document.getElementById('auName').value.trim(),m=document.getElementById('auMobile').value.replace(/\D/g,''),r=document.getElementById('auRole').value,s=document.getElementById('auStatus').value,p=document.getElementById('auPass').value;if(!n||!/\d{10}/.test(m)){msg.textContent='Enter name and 10-digit mobile.';return;}apiRequest('add_user',{name:n,mobile:m,role:r,password:p},res=>{if(!res.ok){msg.textContent='❌ '+(res.error||'Could not create user.');return;}msg.textContent='✅ User created. Initial password: '+(p||m.slice(-4));apiRequest('set_user_status',{userId:res.user.id,status:s},()=>loadUsers());document.getElementById('auName').value='';document.getElementById('auMobile').value='';document.getElementById('auPass').value='';});}
  function changeManagedRole(id){const r=document.getElementById('role_'+id).value;apiRequest('set_user_role',{userId:id,role:r},res=>{alert(res.ok?'Role updated.':(res.error||'Failed.'));loadUsers();});}
  function changeManagedStatus(id){const s=document.getElementById('status_'+id).value;apiRequest('set_user_status',{userId:id,status:s},res=>{alert(res.ok?'Status updated.':(res.error||'Failed.'));loadUsers();});}
  function resetManagedPassword(id){const p=prompt('Enter new password (minimum 8 characters):');if(!p)return;apiRequest('set_user_password',{userId:id,password:p},res=>alert(res.ok?'Password updated.':(res.error||'Failed.')));}
  function workRecords(admin){page(admin?'MECHANIC DAILY UPDATES':'MY WORK RECORDS','<section class="ma-hero"><div class="ma-brand">'+(admin?'👨‍🔧 All Mechanic Records':'📋 Your Records')+'</div><div class="ma-sub">Central DailyWork records</div><div id="workList" style="margin-top:12px">Loading…</div></section>');apiRequest('list_work',{},r=>{const box=document.getElementById('workList');if(!box)return;if(!r.ok){box.innerHTML='❌ '+esc(r.error||'Could not load records.');return;}if(!(r.records||[]).length){box.innerHTML='<div class="status-note">No records yet.</div>';return;}box.innerHTML='';r.records.forEach(x=>{const d=document.createElement('div');d.style.cssText='border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:9px 0';d.innerHTML='<b>'+esc(x.date)+' • '+esc(x.vehicleNumber)+'</b><div>'+esc(x.userName)+' • '+esc(x.workCompleted)+'</div><small style="color:#667085">'+esc(x.createdAt)+'</small>';box.appendChild(d);});});}
  function adminWork(){workRecords(true)} function mechanicRecords(){workRecords(false)}
  function mechanicUpdate(){const u=getUser()||{};page('DAILY WORK UPDATE','<section class="ma-hero"><div class="ma-brand">➕ Record today\'s work</div><div class="ma-sub">Mechanic: '+esc(u.name||'')+'</div><div style="display:grid;gap:12px;margin-top:15px"><input id="mwVehicle" placeholder="Vehicle number" style="padding:15px;border:1px solid #d0d5dd;border-radius:10px;font-size:18px"><textarea id="mwWork" rows="7" placeholder="What work was completed?" style="padding:15px;border:1px solid #d0d5dd;border-radius:10px;font-size:18px"></textarea><button class="ma-card" onclick="speakMechanicWork()">🎤 VOICE UPDATE</button><button class="ma-card ma-primary" onclick="saveMechanicWork()">💾 SAVE DAILY UPDATE</button><div id="mwMsg" class="status-note"></div></div></section>');}
  function speakMechanicWork(){const st=document.getElementById('mwMsg');if(st)st.textContent='🎤 Listening…';window.nativeSpeechResult=function(text){const el=document.getElementById('mwWork');if(el)el.value=text||'';if(st)st.textContent=text?'✅ Voice captured.':'⚠️ No voice text captured.';window.nativeSpeechResult=null;};AndroidBridge.startSpeech('en-IN');}
  function saveMechanicWork(){const v=document.getElementById('mwVehicle').value.trim(),w=document.getElementById('mwWork').value.trim(),msg=document.getElementById('mwMsg');if(!v||!w){msg.textContent='Vehicle number and work completed are required.';return;}apiRequest('save_work',{date:new Date().toISOString().slice(0,10),vehicleNumber:v,workCompleted:w},r=>{msg.textContent=r.ok?'✅ Daily update saved centrally.':'❌ '+(r.error||'Save failed.');});}
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

  // Fresh Activity launches are reset by the native layer. Do not reload the WebView here:
  // reloading races the secure-login bootstrap and can leave only the static header visible.
  localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);
  hideOld();
  setTimeout(()=>{renderLogin();},120);
})();