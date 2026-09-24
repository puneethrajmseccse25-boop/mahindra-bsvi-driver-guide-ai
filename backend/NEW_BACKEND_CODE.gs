const CFG={SPREADSHEET_ID:'1kQ5k6i7NGFwswfnlquyDiBMtqpr9Pav7Ki4XFWSnJGE',TTL:8*60*60*1000,SHEETS:{USERS:'Users',WORK:'DailyWork',PROBLEMS:'ProblemReports',AUDIT:'AuditLog',MAHINDRA:'MahindraData'}};

function setupNewBackend(){
  const ss=SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
  ensure_(ss,CFG.SHEETS.USERS,['User ID','Name','Mobile','Role','Status','Password Hash','Password Salt','Created At','Updated At']);
  ensure_(ss,CFG.SHEETS.WORK,['Record ID','Date','Vehicle Number','User ID','User Name','Work Completed','Created At']);
  ensure_(ss,CFG.SHEETS.PROBLEMS,['Report ID','Date','Time','User ID','User Name','Role','Vehicle Number','Problem','Photo Text','Created At']);
  ensure_(ss,CFG.SHEETS.AUDIT,['Timestamp','User ID','Action','Target','Result']);
  ensure_(ss,CFG.SHEETS.MAHINDRA,['ID','Category','Title','Content','Language','Source','Updated At']);
  const ui=SpreadsheetApp.getUi();
  const n=ui.prompt('ADMIN name','Enter admin name:',ui.ButtonSet.OK_CANCEL);
  if(n.getSelectedButton()!=ui.Button.OK) return;
  const m=ui.prompt('ADMIN mobile','Enter 10-digit mobile:',ui.ButtonSet.OK_CANCEL);
  if(m.getSelectedButton()!=ui.Button.OK) return;
  const p=ui.prompt('ADMIN password','Enter password (minimum 8 characters):',ui.ButtonSet.OK_CANCEL);
  if(p.getSelectedButton()!=ui.Button.OK) return;
  const name=n.getResponseText().trim(), mobile=norm(m.getResponseText()), pass=p.getResponseText();
  if(!/^\d{10}$/.test(mobile)||pass.length<8) throw new Error('Invalid admin details.');
  const sh=ss.getSheetByName(CFG.SHEETS.USERS);
  if(findUser(mobile)) throw new Error('This mobile already exists.');
  const salt=Utilities.getUuid().replace(/-/g,'').slice(0,32), id=Utilities.getUuid(), ts=now();
  sh.appendRow([id,name,mobile,'ADMIN','ACTIVE',hash(pass,salt),salt,ts,ts]);
  return 'READY — ADMIN created. Now deploy this script as a Web App.';
}
function ensure_(ss,name,headers){let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(s.getLastRow()===0)s.appendRow(headers);}
function ss_(){return SpreadsheetApp.openById(CFG.SPREADSHEET_ID);}
function sh_(n){return ss_().getSheetByName(n);}
function now(){return new Date().toISOString();}
function norm(v){return String(v||'').replace(/\D/g,'');}
function hash(p,s){return hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(s)+':'+String(p),Utilities.Charset.UTF_8));}
function hex(a){return a.map(b=>{b=b<0?b+256:b;return('0'+b.toString(16)).slice(-2)}).join('');}
function token(){return hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,Utilities.getUuid()+Date.now()+Math.random(),Utilities.Charset.UTF_8))+Utilities.getUuid().replace(/-/g,'');}
function json(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function findUser(m){const v=sh_(CFG.SHEETS.USERS).getDataRange().getValues();for(let i=1;i<v.length;i++)if(String(v[i][2])===String(m))return{row:i+1,data:v[i]};return null;}
function findId(id){const v=sh_(CFG.SHEETS.USERS).getDataRange().getValues();for(let i=1;i<v.length;i++)if(String(v[i][0])===String(id))return{row:i+1,data:v[i]};return null;}
function pub(u){return{id:String(u.data[0]),name:String(u.data[1]),mobile:String(u.data[2]),role:String(u.data[3]),status:String(u.data[4])};}
function saveSession(u){const t=token(),exp=Date.now()+CFG.TTL;PropertiesService.getScriptProperties().setProperty('S_'+hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,t,Utilities.Charset.UTF_8)),JSON.stringify({id:String(u.data[0]),exp}));return{token:t,expiresAt:exp};}
function session(req){const t=String(req.token||'');if(!t)return{ok:false,code:401,error:'Authentication required.'};const k='S_'+hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,t,Utilities.Charset.UTF_8)),pr=PropertiesService.getScriptProperties(),raw=pr.getProperty(k);if(!raw)return{ok:false,code:401,error:'Session expired or invalid.'};let s;try{s=JSON.parse(raw)}catch(e){pr.deleteProperty(k);return{ok:false,code:401,error:'Invalid session.'}}if(Date.now()>=Number(s.exp)){pr.deleteProperty(k);return{ok:false,code:401,error:'Session expired.'}}const u=findId(s.id);if(!u||String(u.data[4])!=='ACTIVE'){pr.deleteProperty(k);return{ok:false,code:403,error:'Account disabled.'}}return{ok:true,user:u};}
function admin(u){return String(u.data[3])==='ADMIN';}
function audit(u,a,t,r){sh_(CFG.SHEETS.AUDIT).appendRow([now(),String(u.data[0]),a,t,r]);}

function doGet(e){return json_({ok:true,service:'MAHINDRA BSVI secure backend v2',status:'online'});}
function doPost(e){
 try{
  const q=JSON.parse((e&&e.postData&&e.postData.contents)||'{}'),a=String(q.action||'');
  if(a==='login')return json_(login(q));
  if(a==='logout'){if(q.token)PropertiesService.getScriptProperties().deleteProperty('S_'+hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(q.token),Utilities.Charset.UTF_8)));return json_({ok:true,code:200});}
  const s=session(q);if(!s.ok)return json_(s);const u=s.user;
  if(a==='me')return json_({ok:true,code:200,user:pub(u)});
  if(a==='save_work')return json_(saveWork(q,u));
  if(a==='list_work'||a==='sync')return json_(listWork(q,u));
  if(a==='save_problem')return json_(saveProblem(q,u));
  if(a==='list_problems')return json_(listProblems(q,u));
  if(a==='list_users')return json_(listUsers(q,u));
  if(a==='add_user')return json_(addUser(q,u));
  if(a==='set_user_status')return json_(setStatus(q,u));
  if(a==='set_user_role')return json_(setRole(q,u));
  if(a==='set_user_password')return json_(setPassword(q,u));
  if(a==='export_work')return json_(exportWork(q,u));
  return json_({ok:false,code:400,error:'Unknown action.'});
 }catch(e){return json_({ok:false,code:500,error:String(e.message||e)});}
}
function login(q){
 const m=norm(q.username),p=String(q.password||'');if(!/^\d{10}$/.test(m)||!p)return{ok:false,code:401,error:'Mobile number or password is incorrect.'};
 const u=findUser(m);if(!u||String(u.data[4])!=='ACTIVE'||hash(p,String(u.data[6]))!==String(u.data[5])){if(u)audit(u,'LOGIN','AUTH','FAILED');return{ok:false,code:401,error:'Mobile number or password is incorrect.'}};
 const s=saveSession(u);audit(u,'LOGIN','AUTH','SUCCESS');return{ok:true,code:200,token:s.token,expiresAt:s.expiresAt,user:pub(u)};
}
function saveWork(q,u){if(!q.date||!q.vehicleNumber||!q.workCompleted)return{ok:false,code:400,error:'Date, vehicle number and work details are required.'};const id=Utilities.getUuid();sh_(CFG.SHEETS.WORK).appendRow([id,String(q.date),String(q.vehicleNumber).toUpperCase(),u.data[0],u.data[1],String(q.workCompleted),now()]);audit(u,'SAVE_WORK',id,'SUCCESS');return{ok:true,code:200,recordId:id};}
function listWork(q,u){const v=sh_(CFG.SHEETS.WORK).getDataRange().getValues(),out=[],isA=admin(u);for(let i=1;i<v.length;i++){const r=v[i];if(!r[0]||(!isA&&String(r[3])!==String(u.data[0])))continue;out.push({id:String(r[0]),date:String(r[1]),vehicleNumber:String(r[2]),userId:String(r[3]),userName:String(r[4]),workCompleted:String(r[5]),createdAt:String(r[6])});}out.reverse();return{ok:true,code:200,records:out};}
function saveProblem(q,u){if(!q.problem&&!q.photoText)return{ok:false,code:400,error:'Problem details are required.'};const d=new Date(),id=Utilities.getUuid(),date=Utilities.formatDate(d,Session.getScriptTimeZone(),'yyyy-MM-dd'),time=Utilities.formatDate(d,Session.getScriptTimeZone(),'HH:mm:ss');sh_(CFG.SHEETS.PROBLEMS).appendRow([id,date,time,u.data[0],u.data[1],u.data[3],String(q.vehicleNumber||'').toUpperCase(),String(q.problem||''),String(q.photoText||''),now()]);audit(u,'SAVE_PROBLEM',id,'SUCCESS');return{ok:true,code:200,reportId:id};}
function listProblems(q,u){const v=sh_(CFG.SHEETS.PROBLEMS).getDataRange().getValues(),out=[],isA=admin(u);for(let i=1;i<v.length;i++){const r=v[i];if(!r[0]||(!isA&&String(r[3])!==String(u.data[0])))continue;out.push({id:String(r[0]),date:String(r[1]),time:String(r[2]),userId:String(r[3]),userName:String(r[4]),role:String(r[5]),vehicleNumber:String(r[6]),problem:String(r[7]),photoText:String(r[8]),createdAt:String(r[9])});}out.reverse();return{ok:true,code:200,records:out};}
function listUsers(q,u){if(!admin(u))return{ok:false,code:403,error:'Admin permission required.'};const v=sh_(CFG.SHEETS.USERS).getDataRange().getValues(),out=[];for(let i=1;i<v.length;i++)if(v[i][0])out.push(pub({data:v[i]}));return{ok:true,code:200,users:out};}
function addUser(q,u){if(!admin(u))return{ok:false,code:403,error:'Admin permission required.'};const n=String(q.name||'').trim(),m=norm(q.mobile),r=String(q.role||'DRIVER').toUpperCase(),p=String(q.password||'');if(!n||!/^\d{10}$/.test(m))return{ok:false,code:400,error:'Invalid user details.'};if(findUser(m))return{ok:false,code:409,error:'Mobile already exists.'};if(!['ADMIN','DRIVER','MECHANIC','USER'].includes(r))return{ok:false,code:400,error:'Invalid role.'};const salt=token().slice(0,32),pass=p||m.slice(-4),id=Utilities.getUuid(),ts=now();sh_(CFG.SHEETS.USERS).appendRow([id,n,m,r,'ACTIVE',hash(pass,salt),salt,ts,ts]);audit(u,'ADD_USER',id,'SUCCESS');return{ok:true,code:200,user:{id,name:n,mobile:m,role:r,status:'ACTIVE'}};}
function setStatus(q,u){if(!admin(u))return{ok:false,code:403,error:'Admin permission required.'};const f=findId(q.userId),st=String(q.status||'').toUpperCase();if(!f||!['ACTIVE','DISABLED'].includes(st))return{ok:false,code:400,error:'Invalid request.'};if(String(f.data[0])===String(u.data[0])&&st!=='ACTIVE')return{ok:false,code:400,error:'Cannot disable current admin.'};sh_(CFG.SHEETS.USERS).getRange(f.row,5).setValue(st);sh_(CFG.SHEETS.USERS).getRange(f.row,9).setValue(now());audit(u,'SET_USER_STATUS',q.userId,st);return{ok:true,code:200};}
function setRole(q,u){if(!admin(u))return{ok:false,code:403,error:'Admin permission required.'};const f=findId(q.userId),r=String(q.role||'').toUpperCase();if(!f||!['ADMIN','DRIVER','MECHANIC','USER'].includes(r))return{ok:false,code:400,error:'Invalid request.'};if(String(f.data[0])===String(u.data[0])&&r!=='ADMIN')return{ok:false,code:400,error:'Cannot remove your admin role.'};sh_(CFG.SHEETS.USERS).getRange(f.row,4).setValue(r);sh_(CFG.SHEETS.USERS).getRange(f.row,9).setValue(now());audit(u,'SET_USER_ROLE',q.userId,r);return{ok:true,code:200};}
function setPassword(q,u){if(!admin(u))return{ok:false,code:403,error:'Admin permission required.'};const f=findId(q.userId),p=String(q.password||'');if(!f||p.length<8)return{ok:false,code:400,error:'User not found or password too short.'};const s=token().slice(0,32);sh_(CFG.SHEETS.USERS).getRange(f.row,6).setValue(hash(p,s));sh_(CFG.SHEETS.USERS).getRange(f.row,7).setValue(s);sh_(CFG.SHEETS.USERS).getRange(f.row,9).setValue(now());audit(u,'SET_USER_PASSWORD',q.userId,'SUCCESS');return{ok:true,code:200};}
function exportWork(q,u){if(!admin(u))return{ok:false,code:403,error:'Admin permission required.'};const r=listWork(q,u),lines=['Date,Vehicle Number,User ID,User Name,Work Completed,Created At'];r.records.forEach(x=>lines.push([x.date,x.vehicleNumber,x.userId,x.userName,x.workCompleted,x.createdAt].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')));return{ok:true,code:200,csv:lines.join('\\r\\n')};}
