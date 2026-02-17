# PRD: Fire Inspection App (Flexible Architect Version)

## 1. STABLE LAYOUT (The Foundation)
* **Core Style:** Tailwind-based "System Gray" (#F2F2F7) with Inter font.
* **Component Memory:** The `TriStateButton` (Pending/Passed/Failed/N/A) and `Long Press Drag` logic are core features. 
* **The "N+1" Logic:** Section 0 is always 'Inspection Details' (date, time, inspector). Section 1 is always 'Building Details'. Sections 2 through N are dynamic inspection categories.
* **Protected Sections:** Inspection Details and Building Details sections cannot be deleted or reordered. They are always displayed first.
* **User Account Display:** The logged-in user's display name AND email address must be visible in the header on all main views (year-select, building-select, settings) so users always know which account they're signed in with. This is a critical accountability feature.

## 2. MODIFIABLE STRUCTURE (The Flexible Parts)
* **This section is intended to change as the app evolves.**
* **Current Protected Sections:** `inspectionDetails` (Section 0), then dynamic inspection sections: `checklist`, `control`, `devices`, `battery`, `lights`.
* **Current Device Types:** Manual Pull, Heat/Smoke Detectors, Horns, etc.
* **Structural Rule:** New sections can be added to the `PROTECTED_SECTIONS` array in the code to prevent accidental deletion.
* **Inspection Details Fields:** Date (auto-populated with current date), Time (auto-populated with current time), Inspector Name (manual entry).

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

## 6A. DATA INTEGRITY & STRUCTURE PRESERVATION (CRITICAL - DO NOT VIOLATE)

### ABSOLUTE RULES - NO EXCEPTIONS:
1. **NEVER modify building structure without explicit user request**
   - Inspection details field order is FIXED: `date`, `time`, `inspector`
   - Building details field order is FIXED: `buildingName`, `address`, `city`, `panelLocation`, `manufacturer`, `panelModel`, `serialNumber`, `softwareVersion`, `dateManufactured`, `lastServiceDate`
   - Do NOT add, remove, or reorder these fields unless user explicitly requests it
   - All existing data must be preserved when making ANY changes

2. **NEVER change field names in data objects**
   - Field names like `buildingName`, `panelModel`, `date`, `inspector`, etc. are database keys
   - Changing these breaks existing saved data
   - If a field name must change, create migration code to preserve data

3. **NEVER remove fields from data structures**
   - Removing fields = data loss
   - If a field becomes obsolete, mark it deprecated but keep it
   - Old data in cloud/localStorage must always load correctly

4. **NEVER change the structure of `yearData` without explicit approval**
   - Format: `{ [year]: [buildings...] }`
   - Building structure: `{ id, name, lastSynced, inspectionDetails, details, sections, data }`
   - Section structure: `{ id, title, color, isDev }`
   - Any structural changes require user approval AND migration plan

5. **ALL changes must be backwards compatible**
   - New fields: Add with default values, never replace existing fields
   - Code changes: Must work with data saved by previous versions
   - Test with existing Bellevue/Pincher Creek data before confirming changes

### BEFORE MAKING ANY CHANGES:
- ✅ Ask: "Will this preserve all existing data?"
- ✅ Ask: "Will data saved yesterday still load correctly?"
- ✅ Ask: "Did the user explicitly request this structural change?"
- ❌ If answer is NO to any question, DO NOT PROCEED without user approval

### WHEN USER REQUESTS CHANGES:
- If change affects data structure, warn user about potential data impact
- Propose migration strategy if needed
- Get explicit confirmation before implementing
- Test with existing buildings (Bellevue, Pincher Creek) to verify data preservation

### IMPORTANT DISTINCTION - UI vs DATA:
- **UI Changes (SAFE):** Changing how fields are displayed, reordering UI elements, styling updates = NO data impact
- **Data Changes (REQUIRES APPROVAL):** Adding/removing/renaming fields in the data structure = REQUIRES explicit user approval
- Example: Displaying fields in specific order (UI change) ≠ Changing field names in database (data change)
- Always preserve the underlying data structure even when improving UI/UX

## 7. CLOUD SYNC (UPDATED FEB 2026)
* **Provider:** Firebase Firestore
* **Auto-Push:** 5 seconds after last edit, changes push to cloud automatically
* **Manual Pull:** "☁ Sync" button pulls latest data from cloud
* **Multi-User:** Multiple inspectors can collaborate on same buildings
* **Source of Truth:** Cloud is ALWAYS the source of truth (no merging)
* **Offline Support:** Works offline, pushes when internet available
* **Protected Buildings:** Bellevue & Pincher Creek only restored on FIRST LOAD (new user)
* **See:** [technical/SYNC-FEATURE.md](technical/SYNC-FEATURE.md) for complete documentation

## 7. PROJECT MANAGEMENT
* **Master Task List:** Located in `docs/TODO.md`.
* **Workflow Rule:** Before starting a new feature, the AI should check `TODO.md` to see what is next on the list and update the checkbox once the code is written.

## 8. FEATURE AUTHORIZATION POLICY (CRITICAL)
* **Explicit Approval Required:** No features, text, UI elements, or functionality may be added unless explicitly requested by the user.
* **No Unauthorized Changes:** Do not modify, add, or remove any words, labels, status messages, or content that was not specifically asked for.
* **User Intent Only:** All implementations must strictly follow user requirements without adding "helpful" extras or interpretations.
* **When In Doubt:** Ask the user before adding any feature or content that was not clearly specified in the request.