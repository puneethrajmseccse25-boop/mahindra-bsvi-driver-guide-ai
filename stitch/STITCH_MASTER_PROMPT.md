# Google Stitch master prompt — Mahindra BSVI Driver Guide AI

Create a production-ready Android mobile UI for an app called **MAHINDRA BSVI DRIVER GUIDE AI**.

## Product purpose
This is a simple field app for Mahindra BSVI truck drivers and mechanics. It must be extremely easy for a low-literacy driver to use while standing beside a truck. Large touch targets, very little text, strong visual hierarchy, and no scrolling for primary actions.

## Visual direction
- Industrial Mahindra-truck-inspired visual language, but do not invent or redraw a Mahindra corporate logo.
- Primary red: #B71C1C.
- Secondary charcoal: #17202A.
- White cards, light grey background, subtle shadows, rounded 14–20px corners.
- Android-first portrait layout.
- Large icon + large label buttons.
- High contrast and outdoor readability.
- Use realistic truck/cabin imagery only where it improves comprehension.
- Do not use cartoon trucks, fake 3D toy trucks, or decorative clutter.

## Security flow
Screen 1: Secure Login
- App title: MAHINDRA BSVI DRIVER GUIDE AI
- 10-digit mobile number field.
- Password field.
- LOGIN button.
- Small note: User accounts created by Admin initially use the last 4 digits of the mobile number as the password.
- No public signup.

After USER login, show only a simple mode choice:
- DRIVER
- MECHANIC

ADMIN login goes directly to the Admin Dashboard.

## DRIVER HOME
Show only these large primary actions:
1. Vehicle Problem — camera + voice
2. Speak Problem — Kannada/Hindi/English voice
3. Warning Lights
4. Daily Check
5. DPF Regeneration
6. AdBlue / DEF
7. Driver Safety
8. Mahindra Data

Language selector:
- English
- ಕನ್ನಡ
- हिंदी

Vehicle Problem flow:
- Direct camera action.
- User can speak the problem.
- Editable voice transcript.
- Find Solution button.
- Search only the supplied Mahindra BSVI knowledge base.
- Show relevant documented guidance.
- If a relevant real Mahindra training video exists, show REAL VIDEO.
- Video screen must have an obvious BACK TO APP button.

## MECHANIC HOME
Only show:
- Vehicle Number
- Mechanic Name
- Work Completed
- SPEAK WORK
- SAVE UPDATE
- REFRESH
- My Daily Work records

Voice input must support English, Hindi and Kannada.
Saved records must go to the secure Google Apps Script backend and appear in the central DailyWork Google Sheet.

## ADMIN DASHBOARD
Cards:
- User Management
- Daily Work Records
- Export CSV

User Management:
- Name
- 10-digit mobile
- Role: USER / ADMIN
- Status: ACTIVE / DISABLED
- Add User
- Enable/Disable
- Change Role

Daily Work:
- Date
- Vehicle Number
- User Name
- Work Completed
- Refresh
- Export CSV

## Interaction rules
- No API URL field visible to drivers or mechanics.
- No database settings visible to users.
- No cloud configuration buttons visible to users.
- No technical backend information visible in the normal app.
- Logout must always be accessible.
- Primary buttons should be at least 56–64dp high.
- Keep the main driver screen usable with one hand.

## Prototype screens to generate
1. Login
2. Driver/Mechanic mode selection
3. Driver Home
4. Vehicle Problem
5. Solution Result
6. Warning Lights
7. Daily Check
8. DPF Regeneration
9. AdBlue/DEF
10. Driver Safety
11. Mahindra Data
12. Mechanic Daily Update
13. My Daily Work
14. Admin Dashboard
15. User Management
16. Daily Work Records
17. Export confirmation
18. Video Player with BACK TO APP

Create a consistent design system and component library. Keep all screen labels exactly as specified above. Make the prototype Android portrait first.
