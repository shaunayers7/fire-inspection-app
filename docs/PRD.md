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

## 6. DATA PERSISTENCE LOCK (CRITICAL)
* **Storage Key:** `fire_inspection_v4_data` must remain constant.
* **Save Trigger:** Every change to `yearData` must trigger a `localStorage.setItem`.
* **Conflict Resolution:** When adding new code features, the AI must check if `localStorage` already has data and "Merge" it rather than overwriting it with a blank template.
* **Protected Buildings:** Bellevue and Pincher Creek (2026) are baseline buildings that must ALWAYS exist. The initialization logic automatically restores them if missing.
* **Cloud Sync:** Firebase integration provides multi-user collaboration. Cloud data is merged with local data (newer timestamp wins), but protected buildings are always preserved locally first.

## 7. CLOUD SYNC (NEW)
* **Provider:** Firebase Firestore
* **Auto-Sync:** 5 seconds after last edit, changes sync to cloud automatically
* **Manual Sync:** "☁ Sync" button in Buildings view
* **Multi-User:** Multiple inspectors can collaborate on same buildings
* **Conflict Resolution:** Newer timestamp wins when same building exists locally and in cloud
* **Offline Support:** Works offline, syncs when internet available
* **See:** SYNC-FEATURE.md for complete documentation

## 7. PROJECT MANAGEMENT
* **Master Task List:** Located in `docs/TODO.md`.
* **Workflow Rule:** Before starting a new feature, the AI should check `TODO.md` to see what is next on the list and update the checkbox once the code is written.