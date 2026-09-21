from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
java_path = ROOT / "app/src/main/java/com/mahindra/bsvi/MainActivity.java"
asset_path = ROOT / "app/src/main/assets/startup_fix.js"

asset_path.write_text("(function(){\n  'use strict';\n  const TOKEN='mahindra_secure_token_v1';\n  const USER='mahindra_secure_user_v1';\n  const MODE='mahindra_user_role_v2';\n  function forceLogin(){\n    document.getElementById('maApp')?.remove();\n    document.getElementById('maBackBar')?.remove();\n    document.querySelector('header')?.classList.add('ma-auth-hidden');\n    ['home','screen','topIntro','languagePanel'].forEach(id=>{\n      document.getElementById(id)?.classList.remove('hide');\n    });\n    localStorage.removeItem(TOKEN);\n    localStorage.removeItem(USER);\n    localStorage.removeItem(MODE);\n    if(typeof window.showLogin==='function') window.showLogin();\n  }\n  // app_shell.js performs a first-load reload. On the stable page load,\n  // explicitly open the real secure login instead of leaving the original page hidden.\n  setTimeout(forceLogin,80);\n})();", encoding="utf-8")

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
elif new not in java:
    raise RuntimeError("app_shell injection block not found")
java_path.write_text(java, encoding="utf-8")
print("startup login fix applied")
