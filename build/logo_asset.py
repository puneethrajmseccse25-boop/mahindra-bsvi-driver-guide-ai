from pathlib import Path
import base64

# Force the login page to embed the committed Driver/Mech AI logo directly.
# This avoids WebView file:// image resolution problems that caused the blank logo.
ROOT = Path(__file__).resolve().parents[1]
asset = ROOT / "app" / "src" / "main" / "assets" / "driver_mech_logo.jpg"
shell = ROOT / "app" / "src" / "main" / "assets" / "app_shell.js"
if asset.exists() and shell.exists():
    data = base64.b64encode(asset.read_bytes()).decode("ascii")
    text = shell.read_text(encoding="utf-8")
    text = text.replace('src="driver_mech_logo.jpg"', 'src="data:image/jpeg;base64,' + data + '"')
    shell.write_text(text, encoding="utf-8")
# Fixed exact logo asset build.
