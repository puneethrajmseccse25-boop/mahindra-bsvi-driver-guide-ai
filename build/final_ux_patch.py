from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
html_path = ROOT / "app/src/main/assets/index.html"
java_path = ROOT / "app/src/main/java/com/mahindra/bsvi/MainActivity.java"

html = html_path.read_text(encoding="utf-8")

# Replace the fixed Mahindra category list with a live index generated from the
# 700 supplied KB records embedded in the APK.
start = html.find("  window.about=function(){")
end = html.find("  window.searchKnowledgeCategory=function(q){showKBResult(q)};", start)
if start >= 0 and end >= 0 and "LIVE SOURCE INDEX" not in html:
    replacement = r"""  window.about=function(){
    const sourceMap={};
    KB.forEach(r=>{
      const key=String(r.source||r.file||'Unknown Source');
      if(!sourceMap[key])sourceMap[key]={source:key,file:String(r.file||''),rows:[]};
      sourceMap[key].rows.push(r);
    });
    const sources=Object.values(sourceMap).sort((a,b)=>a.source.localeCompare(b.source));
    let body='<div class="notice"><b>'+tr('📚 MAHINDRA BSVI SOURCE LIBRARY','📚 MAHINDRA BSVI SOURCE LIBRARY','📚 MAHINDRA BSVI SOURCE LIBRARY')+'</b><br>'+KB.length+' supplied source sections are stored inside this APK.</div>';
    body+='<div class="notice"><b>LIVE SOURCE INDEX</b><br>'+tr('These buttons are generated from the supplied Mahindra material. No fixed category list.','ये buttons supplied Mahindra material से बने हैं। कोई fixed category list नहीं।','ಈ buttons supplied Mahindra material ನಿಂದ ತಯಾರಾಗಿವೆ. fixed category list ಇಲ್ಲ.')+'</div>';
    body+='<div class="source-grid">'+sources.map((x,i)=>'<button class="secondary source-cat" onclick="openMahindraSource('+i+')">📖 '+esc(x.source)+'<br><small>'+x.rows.length+' sections</small></button>').join('')+'</div>';
    window._mahindraSources=sources;
    show('Mahindra Data',body);
  };
  window.openMahindraSource=function(index){
    const x=(window._mahindraSources||[])[index];
    if(!x)return;
    let body='<div class="notice"><b>'+esc(x.source)+'</b><br><small>'+esc(x.file)+'</small><br>'+x.rows.length+' supplied sections</div>';
    x.rows.forEach((r,i)=>{
      body+='<details style="margin-top:9px;background:#fff;border-radius:10px;border:1px solid #d7dde5;padding:4px"><summary style="font-weight:900;font-size:16px;padding:10px">📄 '+(r.page?'Page / Slide '+esc(r.page):'Section '+(i+1))+'</summary><div style="padding:10px;line-height:1.5">'+esc(r.text||'')+'</div></details>';
    });
    show(x.source,body);
  };
  window.searchKnowledgeCategory=function(q){showKBResult(q)};"""
    html = html[:start] + replacement + html[end:]

# Reverse both known navigation implementations: BACK left, HOME right.
html = html.replace(
    """nav.innerHTML='<button class="nav-home" onclick="finalHome()">⌂ HOME</button><button class="nav-back" onclick="finalBack()">‹ BACK</button>';""",
    """nav.innerHTML='<button class="nav-back" onclick="finalBack()">‹ BACK</button><button class="nav-home" onclick="finalHome()">⌂ HOME</button>';"""
)
html = html.replace(
    """nav.innerHTML='<button onclick="uxHome()" style="border:0;background:#17202a;color:#fff;border-radius:10px;padding:11px 16px;font-weight:900">⌂ HOME</button><button onclick="uxBack()" style="border:0;background:#b71c1c;color:#fff;border-radius:10px;padding:11px 16px;font-weight:900">‹ BACK</button>';""",
    """nav.innerHTML='<button onclick="uxBack()" style="border:0;background:#b71c1c;color:#fff;border-radius:10px;padding:11px 16px;font-weight:900">‹ BACK</button><button onclick="uxHome()" style="border:0;background:#17202a;color:#fff;border-radius:10px;padding:11px 16px;font-weight:900">⌂ HOME</button>';"""
)

marker = "FINAL-REQUIREMENTS-UX-PATCH-v2"
if marker not in html:
    html += f"""
<!-- {marker} -->
<style>
.page-nav{{position:fixed!important;top:72px!important;left:10px!important;right:10px!important;z-index:99999!important;display:flex!important;justify-content:space-between!important;gap:12px!important;margin:0!important;padding:0!important;background:transparent!important;pointer-events:none!important}}
.page-nav button{{pointer-events:auto!important;width:48%!important;min-height:58px!important;border-radius:14px!important;font-size:18px!important;font-weight:900!important;box-shadow:0 4px 12px #0003!important}}
.page-nav .nav-back{{order:1!important;background:#b71c1c!important;color:#fff!important}}
.page-nav .nav-home{{order:2!important;background:#17202a!important;color:#fff!important}}
#screen{{padding-top:76px!important}}
.secure-role-banner{{margin:0 0 12px;padding:14px 16px;border-radius:14px;background:#17202a;color:#fff;font-weight:900;font-size:17px;display:flex;justify-content:space-between;align-items:center;gap:10px}}
.secure-role-banner small{{opacity:.85;font-weight:700}}
.secure-role-banner button{{border:0;border-radius:9px;padding:9px 12px;background:#b71c1c;color:#fff;font-weight:900}}
</style>
<script>
(function(){{
  function currentUser(){{try{{return JSON.parse(localStorage.getItem('mahindra_secure_user_v1')||'null')}}catch(e){{return null}}}}
  function role(){{return String(currentUser()?.role||'').toUpperCase()}}
  function name(){{return currentUser()?.name||''}}
  window.mahindraLogout=function(){{
    try{{localStorage.removeItem('mahindra_secure_token_v1');localStorage.removeItem('mahindra_secure_user_v1');localStorage.removeItem('mahindra_user_role_v2')}}catch(e){{}}
    location.reload();
  }};
  window.mahindraShowRole=function(){{
    const u=currentUser(); if(!u)return;
    const target=document.getElementById('screen')?.classList.contains('hide')?document.getElementById('home'):document.getElementById('screen');
    if(!target)return;
    target.querySelectorAll('.secure-role-banner').forEach(x=>x.remove());
    const b=document.createElement('div');b.className='secure-role-banner';
    const clean=String(name()).replace(/[&<>"']/g,'');
    b.innerHTML='<span>🔐 '+(role()==='ADMIN'?'ADMIN':role()==='MECHANIC'?'MECHANIC':'DRIVER')+' <small>• '+clean+'</small></span><button onclick="mahindraLogout()">LOG OUT</button>';
    target.insertBefore(b,target.firstChild);
  }};
  const oldFinalHome=window.finalHome;
  window.finalHome=function(){{if(oldFinalHome)oldFinalHome();setTimeout(window.mahindraShowRole,120);}};
  const oldUxHome=window.uxHome;
  window.uxHome=function(){{if(oldUxHome)oldUxHome();setTimeout(window.mahindraShowRole,120);}};
  const oldSecureAdmin=window.secureAdmin;
  if(oldSecureAdmin)window.secureAdmin=function(){{oldSecureAdmin();setTimeout(window.mahindraShowRole,120);}};
  const oldSecureMechanic=window.secureMechanic;
  if(oldSecureMechanic)window.secureMechanic=function(){{oldSecureMechanic();setTimeout(window.mahindraShowRole,120);}};
  window.addEventListener('load',()=>setTimeout(()=>{{if(currentUser())window.mahindraShowRole();}},500));
  window.openProblemCamera=function(){{
    if(window.AndroidBridge&&AndroidBridge.captureDriverPhoto){{AndroidBridge.captureDriverPhoto();return;}}
    const input=document.getElementById('problemCamera');if(input)input.click();
  }};
  window.nativeCameraResult=function(ok){{
    const st=document.getElementById('photoStatus')||document.getElementById('driverPhotoStatus');
    if(st)st.textContent=ok?'📷 PHOTO RECEIVED → TAKE A CLEAR TRUCK / WARNING PHOTO → SPEAK PROBLEM':'❌ Camera was not completed. Tap TAKE PHOTO again.';
  }};
}})();
</script>
"""
    html_path.write_text(html, encoding="utf-8")

java = java_path.read_text(encoding="utf-8")
jmarker = "FINAL-DIRECT-CAMERA-v2"
if jmarker not in java:
    java = java.replace(
        "private static final int REQ_FILE = 3003;",
        "private static final int REQ_FILE = 3003;\n    private static final int REQ_DIRECT_CAMERA = 3004;"
    )
    needle = "    private void openCameraForFileChooser() {"
    direct = r'''    // FINAL-DIRECT-CAMERA-v2: bypass WebView file-picker behavior.
    private void openDirectCamera() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.CAMERA}, REQ_DIRECT_CAMERA);
            return;
        }
        try {
            File dir = new File(getCacheDir(), "camera");
            if (!dir.exists()) dir.mkdirs();
            String stamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(new Date());
            File photo = new File(dir, "MAHINDRA_DRIVER_" + stamp + ".jpg");
            cameraUri = FileProvider.getUriForFile(this,
                    "com.mahindra.bsvi.driverguide.fileprovider", photo);
            Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            i.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
            i.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivityForResult(i, REQ_DIRECT_CAMERA);
        } catch (Exception e) {
            sendCameraResult(false);
            Toast.makeText(this, "Camera could not be opened", Toast.LENGTH_SHORT).show();
        }
    }

    private void sendCameraResult(boolean ok) {
        if (web != null) {
            web.post(() -> web.evaluateJavascript(
                    "window.nativeCameraResult && window.nativeCameraResult(" + (ok ? "true" : "false") + ")",
                    null
            ));
        }
    }

'''
    if needle not in java:
        raise RuntimeError("camera method not found")
    java = java.replace(needle, direct + needle, 1)
    bridge_pattern = r"(?m)^\s*@JavascriptInterface\s+public void openCamera\(\) \{"
    method = """        @JavascriptInterface public void captureDriverPhoto() {
            runOnUiThread(() -> openDirectCamera());
        }

"""
    if not re.search(bridge_pattern, java):
        raise RuntimeError("bridge method not found")
    java = re.sub(bridge_pattern, method + "        @JavascriptInterface public void openCamera() {", java, count=1)
    perm = """        } else if (requestCode == REQ_CAMERA) {"""
    perm_block = """        } else if (requestCode == REQ_DIRECT_CAMERA) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openDirectCamera();
            } else {
                sendCameraResult(false);
            }
        } else if (requestCode == REQ_CAMERA) {"""
    if perm not in java:
        raise RuntimeError("permission branch not found")
    java = java.replace(perm, perm_block, 1)
    result = """        if (requestCode == REQ_FILE) {"""
    result_block = """        if (requestCode == REQ_DIRECT_CAMERA) {
            sendCameraResult(resultCode == RESULT_OK && cameraUri != null);
            return;
        }
        if (requestCode == REQ_FILE) {"""
    if result not in java:
        raise RuntimeError("activity result branch not found")
    java = java.replace(result, result_block, 1)
    java_path.write_text(java, encoding="utf-8")

print("patched build sources")
