# MAHINDRA BSVI DRIVER GUIDE AI — GitHub APK Project

Final Android WebView project for the Mahindra BSVI Driver & Mechanic Guide.

## Final UX requirements
- Secure mobile-number login with backend RBAC.
- No DRIVER/MECHANIC role-selection screen after login.
- DRIVER and MECHANIC accounts are routed directly from the backend role.
- ADMIN is visibly marked as ADMIN and gets the protected admin dashboard.
- Driver-first large buttons and short emergency actions.
- Diagnostic flow: STOP SAFELY → NEUTRAL → HAND BRAKE → CHECK LAMP → SPEAK PROBLEM → CALL MECHANIC.
- READ STEPS always shows the written steps and attempts native Android speech / WebView speech.
- Photo is never treated as a fake diagnosis. The app says PHOTO RECEIVED → TAKE CLEAR TRUCK/WARNING PHOTO → SPEAK PROBLEM.
- HOME is top-left and BACK is top-right; no large bottom HOME button.
- Back navigation restores the previous screen.
- Mahindra Data contains the embedded supplied source sections and opens matching source text with source name and page/slide.
- Large, minimal driver/mechanic controls with no API/database controls exposed to drivers.
- Kannada / Hindi / English support.
- Native camera capture and native speech recognition.
- Central DailyWork / Users / AuditLog backend.

## Backend
Android points to the deployed Apps Script URL in `MainActivity.java`.
Backend source is `backend/Code.gs`.

## Build
Push to `main`, then download the GitHub Actions artifact `Mahindra-BSVI-Driver-Guide-AI-debug`.
