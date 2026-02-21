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

## 7. iOS BEST PRACTICES & APP TEMPLATE STANDARDS (CRITICAL)

### PURPOSE:
This app serves as a **STARTER TEMPLATE** for future app development. All patterns, solutions, and best practices documented here are designed to eliminate trial-and-error in future builds. When building new apps from this template, follow these proven patterns.

### IMMEDIATE SAVE PATTERN (MANDATORY FOR ALL DATA UPDATES):
**Problem Solved:** iOS PWAs can be killed instantly when user swipes up to close app. React state updates are asynchronous and may not complete before app termination, causing data loss.

**Solution Implementation:**
1. **Helper Function Pattern:**
   ```javascript
   const immediatelySaveToLocalStorage = (updatedYearData) => {
       try {
           const dataString = JSON.stringify(updatedYearData);
           localStorage.setItem('YOUR_STORAGE_KEY', dataString);
           console.log(`💾 IMMEDIATE save to localStorage - iOS safety`);
           return true;
       } catch (error) {
           console.error('❌ Immediate save failed:', error);
           if (error.name === 'QuotaExceededError' || error.code === 22) {
               console.error('⚠️ Storage full! Cannot save changes.');
           }
           return false;
       }
   };
   ```

2. **Apply to ALL state mutations:**
   - ✅ Form input changes (text fields, checkboxes, dropdowns)
   - ✅ Photo/video uploads (save metadata + IndexedDB)
   - ✅ Item status updates (pass/fail/pending)
   - ✅ Notes, timestamps, user selections
   - ✅ Building details, inspection info
   - ✅ Timer states, custom fields
   - ❌ DO NOT skip any data mutation

3. **Standard Update Pattern:**
   ```javascript
   const updateSomething = (newValue) => {
       // 1. Calculate updated data (synchronous)
       const updatedData = {
           ...currentData,
           field: newValue
       };
       
       // 2. Save IMMEDIATELY to localStorage (synchronous)
       immediatelySaveToLocalStorage(updatedData);
       
       // 3. THEN update React state (async - triggers useEffect)
       setYearData(updatedData);
   };
   ```

4. **Why this order matters:**
   - localStorage save is **synchronous** (completes before next line)
   - React setState is **asynchronous** (scheduled for later)
   - If app is killed after step 2, data is already saved
   - If app is killed before step 2, data loss occurs

### MEDIA HANDLING (PHOTOS/VIDEOS):
**Pattern:** Local-first with cloud upload on demand
1. **Save to IndexedDB immediately** (within 5 seconds)
2. **Store thumbnail in localStorage** (small, fast)
3. **Mark as pending sync** (orange badge ⏱)
4. **Upload to cloud on explicit action** (Export & Save button)
5. **Update badge to synced** (green ☁) after upload

**IndexedDB Structure:**
```javascript
{
    id: itemId,
    file: blob,
    thumbnail: dataURL,
    timestamp: Date.now(),
    uploaded: false
}
```

**Restore on App Load:**
```javascript
useEffect(() => {
    const restorePendingMedia = async () => {
        const pending = await getPendingUploads();
        // Recreate blob URLs for videos
        // Restore thumbnails for photos
        // Update state with restored media
    };
    setTimeout(restorePendingMedia, 1000);
}, []); // Run once on mount
```

### PWA OFFLINE-FIRST ARCHITECTURE:
1. **Service Worker:** Cache all static assets (HTML, CSS, JS, icons)
2. **localStorage:** Primary data storage (5-10MB limit)
3. **IndexedDB:** Media files and large objects (50MB+ capacity)
4. **Firebase:** Cloud backup and multi-user sync (secondary)
5. **Network Detection:** Show online/offline indicator
6. **Background Sync:** Upload pending changes every 30 seconds when online

### DATA PERSISTENCE CHECKLIST (BEFORE DEPLOYMENT):
- [ ] All form inputs call `immediatelySaveToLocalStorage()`
- [ ] All status changes save immediately
- [ ] Photo uploads save to IndexedDB + localStorage
- [ ] App tested: Add photo → Kill app → Reopen → Photo still there
- [ ] App tested: Change checkbox → Kill app → Reopen → State preserved
- [ ] App tested: Edit text → Kill app → Reopen → Text saved
- [ ] Storage quota exceeded handled gracefully (alert user)
- [ ] IndexedDB restore runs on app load (useEffect hook)

### MULTI-USER SYNC STRATEGY:
1. **Local changes save immediately** (iOS safety)
2. **Cloud sync happens on explicit action** (Export & Save)
3. **Conflict detection at field level** (timestamp comparison)
4. **User chooses resolution** (local vs cloud per field)
5. **Protected data preserved** (baseline buildings, critical fields)

### APP TEMPLATE USAGE GUIDE:
When creating a new app from this template:
1. **Keep the immediate save pattern** (change storage key only)
2. **Keep IndexedDB media handling** (proven iOS solution)
3. **Keep offline-first architecture** (service worker + localStorage)
4. **Keep conflict resolution logic** (multi-user proven)
5. **Update field names but preserve pattern** (immediate save → state update)
6. **Test iOS extensively** (most common failure point)

### LESSONS LEARNED (DO NOT REPEAT):
- ❌ Never rely on React state for data persistence
- ❌ Never upload large files before saving locally
- ❌ Never use blob URLs without IndexedDB backup (videos)
- ❌ Never skip immediate save for "simple" updates
- ❌ Never assume iOS gives time for async operations
- ❌ Never use browser alert() or confirm() - use console.log only
- ❌ Never show lengthy instruction boxes or help text
- ✅ Always save synchronously before state update
- ✅ Always test by killing app immediately after action
- ✅ Always provide visual feedback (badges, progress bars)
- ✅ Always handle storage quota exceeded errors
- ✅ Always restore pending media on app load
- ✅ Always use console logging only (no browser notifications)
- ✅ Always keep UX clean and minimal (no instruction boxes)

### NOTIFICATION POLICY (MANDATORY):
**Browser Notifications Prohibited:**
- ❌ No alert() calls (browser popup dialogs)
- ❌ No confirm() calls (browser confirmation dialogs)
- ❌ No prompt() calls (browser input dialogs)
- ❌ No lengthy instruction boxes in the UI
- ❌ No help text overlays or tutorials

**Approved Communication Methods:**
- ✅ console.log() for debugging and status messages
- ✅ console.error() for error logging
- ✅ console.warn() for warnings
- ✅ In-app status badges (⏱ pending, ☁ synced, ✓ complete)
- ✅ Brief inline status text (max 1-2 words)
- ✅ Visual indicators (colors, icons, progress bars)
- ✅ Sound notifications (for timers only, optional)

**Rationale:**
- Browser alerts interrupt user workflow
- Users know how to use the app (no hand-holding)
- Status should be visible in UI, not in popups
- Professional apps don't spam alerts
- Future apps built from this template should follow same clean UX pattern

## 8. CLOUD SYNC (UPDATED FEB 2026)
* **Provider:** Firebase Firestore
* **Auto-Push:** 5 seconds after last edit, changes push to cloud automatically
* **Manual Pull:** "☁ Sync" button pulls latest data from cloud
* **Multi-User:** Multiple inspectors can collaborate on same buildings
* **Source of Truth:** Cloud is ALWAYS the source of truth (no merging)
* **Offline Support:** Works offline, pushes when internet available
* **Protected Buildings:** Bellevue & Pincher Creek only restored on FIRST LOAD (new user)
* **See:** [technical/SYNC-FEATURE.md](technical/SYNC-FEATURE.md) for complete documentation

## 9. PROJECT MANAGEMENT
* **Master Task List:** Located in `docs/TODO.md`.
* **Workflow Rule:** Before starting a new feature, the AI should check `TODO.md` to see what is next on the list and update the checkbox once the code is written.

## 10. FEATURE AUTHORIZATION POLICY (CRITICAL)
* **Explicit Approval Required:** No features, text, UI elements, or functionality may be added unless explicitly requested by the user.
* **No Unauthorized Changes:** Do not modify, add, or remove any words, labels, status messages, or content that was not specifically asked for.
* **User Intent Only:** All implementations must strictly follow user requirements without adding "helpful" extras or interpretations.
* **When In Doubt:** Ask the user before adding any feature or content that was not clearly specified in the request.