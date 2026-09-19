# MAHINDRA BSVI DRIVER GUIDE AI — GitHub APK Project

This repository is a GitHub Actions-ready Android WebView project for the Mahindra BSVI Driver & Mechanic Guide.

## Included
- Secure mobile-number login backed by Google Apps Script.
- ADMIN / USER RBAC.
- USER mode selection: DRIVER or MECHANIC.
- Native Android speech recognition for English, Hindi and Kannada.
- Native camera capture for the problem-photo flow.
- Mahindra BSVI knowledge base from the supplied source APK.
- Mechanic daily work saved to the secure `DailyWork` sheet.
- Admin user management and work-record export.
- GitHub Actions workflow that builds `app-debug.apk`.
- `stitch/STITCH_MASTER_PROMPT.md` for generating/refining the UI in Google Stitch.

## Backend
The Android app currently points to the supplied Apps Script deployment URL in `MainActivity.java`.
If you deploy a new Apps Script URL, change only the `API_URL` constant in `MainActivity.java` and push again.

Backend source is in `backend/Code.gs`.

## Google Sheet tabs
- Users
- DailyWork
- AuditLog

## GitHub build
1. Create a new GitHub repository.
2. Upload the entire contents of this ZIP to the repository root.
3. Commit to `main`.
4. Open **Actions**.
5. Run **Build Mahindra BSVI APK** (or let the push trigger run).
6. Open the completed workflow run.
7. Download artifact **Mahindra-BSVI-Driver-Guide-AI-debug**.
8. Inside the artifact is `app-debug.apk`.

The workflow intentionally uses a specified Gradle version, so a Gradle wrapper is not required.

## Apps Script setup
Use `backend/Code.gs` in the existing Apps Script project. Keep the existing deployment URL if possible.
Run the backend initialization/first-admin setup according to the comments at the top of `Code.gs`, then deploy the web app.

## Important
The bootstrap admin values in Apps Script are placeholders in this repository. Do not commit real passwords to GitHub. After creating the first admin, remove the temporary bootstrap values from Apps Script.
