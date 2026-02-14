# PRD: Fire Inspection App (Flexible Architect Version)

## 1. STABLE LAYOUT (The Foundation)
* **Core Style:** Tailwind-based "System Gray" (#F2F2F7) with Inter font.
* **Component Memory:** The `TriStateButton` (Pending/Passed/Failed) and `Long Press Drag` logic are core features. 
* **The "N" Logic:** Section 1 is always 'Building Details'. Sections 2 through N are dynamic inspection categories.

## 2. MODIFIABLE STRUCTURE (The Flexible Parts)
* **This section is intended to change as the app evolves.**
* **Current Sections:** `checklist`, `control`, `devices`, `battery`, `lights`.
* **Current Device Types:** Manual Pull, Heat/Smoke Detectors, Horns, etc.
* **Structural Rule:** New sections can be added to the `PROTECTED_SECTIONS` array in the code to prevent accidental deletion.

## 3. PHOTO & MEDIA HANDLING
* **Current State:** Base64 local storage (Temporary).
* **Future State:** Potential Firebase Storage integration.
* **Constraint:** Keep the "Media" button and "Note" toggle visible for every row.

## 4. PDF LOGIC
* **Header:** Professional "FIRE INSPECTION REPORT" centered.
* **Tables:** Must use `jspdf-autotable` with navy blue headers.