from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
java_path = ROOT / "app/src/main/java/com/mahindra/bsvi/MainActivity.java"
asset_path = ROOT / "app/src/main/assets/startup_fix.js"

asset_path.write_text("""(function(){
  'use strict';
  const TOKEN='mahindra_secure_token_v1', USER='mahindra_secure_user_v1', MODE='mahindra_user_role_v2';
  function forceLogin(){
    try{localStorage.removeItem(TOKEN);localStorage.removeItem(USER);localStorage.removeItem(MODE);}catch(e){}
    document.getElementById('maApp')?.remove();
    document.getElementById('maBackBar')?.remove();
    document.getElementById('modeOverlay')?.remove();
    ['home','screen','topIntro','languagePanel'].forEach(id=>document.getElementById(id)?.classList.add('hide'));
    if(typeof window.showLogin==='function') window.showLogin();
  }
  setTimeout(forceLogin,220);
})();
""", encoding="utf-8")

java = java_path.read_text(encoding="utf-8")
old = '''view.evaluateJavascript(
                        "(function(){var s=document.createElement('script');s.src='file:///android_asset/app_shell.js';document.head.appendChild(s);})();",
                        null
                );'''
new = '''view.evaluateJavascript(
                        "(function(){var s=document.createElement('script');s.src='file:///android_asset/app_shell.js';s.onload=function(){var f=document.createElement('script');f.src='file:///android_asset/startup_fix.js';document.head.appendChild(f);};document.head.appendChild(s);})();",
                        null
                );'''
if old in java:
    java = java.replace(old, new, 1)
elif "file:///android_asset/app_shell.js" in java:
    needle = "s.src='file:///android_asset/app_shell.js';document.head.appendChild(s);"
    replacement = "s.src='file:///android_asset/app_shell.js';s.onload=function(){var f=document.createElement('script');f.src='file:///android_asset/startup_fix.js';document.head.appendChild(f);};document.head.appendChild(s);"
    if needle in java and "startup_fix.js" not in java:
        java = java.replace(needle, replacement, 1)
else:
    raise RuntimeError("app_shell injection block not found")
# If MainActivity already clears the secure session before loading the shell,
# no extra startup script is required.
java_path.write_text(java, encoding="utf-8")
print("startup login fix applied")
