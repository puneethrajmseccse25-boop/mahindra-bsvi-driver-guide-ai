from pathlib import Path
import base64

# Build-time repair: use the exact supplied Driver/Mech AI logo.
ROOT = Path(__file__).resolve().parents[1]
b64_file = ROOT / "build" / "logo_fixed_b64.txt"
shell = ROOT / "app" / "src" / "main" / "assets" / "app_shell.js"
asset = ROOT / "app" / "src" / "main" / "assets" / "driver_mech_logo.jpg"
launcher = ROOT / "app" / "src" / "main" / "res" / "drawable" / "logo_exact.jpg"

if b64_file.exists():
    data = base64.b64decode(b64_file.read_text(encoding="utf-8").strip())
    asset.parent.mkdir(parents=True, exist_ok=True)
    launcher.parent.mkdir(parents=True, exist_ok=True)
    asset.write_bytes(data)
    launcher.write_bytes(data)
    if shell.exists():
        text = shell.read_text(encoding="utf-8")
        text = text.replace('src="driver_mech_logo.jpg"', 'src="data:image/jpeg;base64,' + base64.b64encode(data).decode("ascii") + '"')
        shell.write_text(text, encoding="utf-8")
