# Fire Inspection App: AI Development Context & Rules

> **PURPOSE:** This app serves as a **REUSABLE TEMPLATE** for future PWA applications. Every pattern, solution, and workflow documented here eliminates trial-and-error in future builds.

## 🎯 ALWAYS-ON CONTEXT

### Project Identity
- **App Type:** Fire Inspection Progressive Web App (PWA)
- **Target Platform:** iOS Safari (primary), Desktop Chrome (secondary)
- **Architecture:** Single-file React app with embedded Babel, offline-first, local storage + cloud sync
- **Critical Constraint:** Must survive instant iOS app termination (swipe-up kill)

### Source of Truth Hierarchy
1. **PRD.md Section 7** - iOS Best Practices & App Template Standards (MANDATORY PATTERNS)
2. **PRD.md Sections 1-6** - Product requirements, data structure, UI rules
3. **TODO.md** - Feature roadmap and task tracking
4. **Technical docs** - Implementation details for specific features

## 🔒 LOCKED UI/UX DECISIONS (DO NOT REVERT)

These were explicitly requested by the user. Never reverse them, even if refactoring nearby code.

| Area | Decision | What NOT to do |
|------|----------|----------------|
| Building form — Save button | `saveToCloudOnly()` syncs to cloud and shows ✓ status. **No navigation.** User presses ← back when ready. | ❌ Do not add `setView()` or any navigation inside this function |
| Building form — buttons | Two separate buttons: **📄 Export PDF** (blue) and **☁️ Save** (green), side-by-side at bottom of scroll, not sticky/fixed | ❌ Do not combine into one button, do not make sticky |
| Real-time sync | Disabled intentionally. Manual sync only via explicit user action. | ❌ Do not re-enable Firestore `onSnapshot` listeners |
| Conflict resolution UI | `ConflictResolutionBody` is a standalone component (not inline in `.map()`). Hooks must live at component level. | ❌ Do not move `useState` back inside `.map()` callbacks |

> **Rule for future changes:** If a user asks to change something in one of these areas, update this table first with the new decision before touching the code.

## ⚠️ MANDATORY PATTERNS (NEVER VIOLATE)

### 1. IMMEDIATE SAVE PATTERN (iOS Safety)
**Problem:** iOS kills PWAs instantly on swipe-up. React setState is async and may not complete.

**Solution:** ALL data mutations must use this pattern:
```javascript
// 1. Calculate updated data (synchronous)
const updatedData = { ...currentData, field: newValue };

// 2. Save IMMEDIATELY to localStorage (synchronous)
immediatelySaveToLocalStorage(updatedData);

// 3. THEN update React state (async)
setYearData(updatedData);
```

**Applies to:**
- ✅ Form inputs (text, checkboxes, dropdowns)
- ✅ Photo/video uploads
- ✅ Status changes (pass/fail/pending)
- ✅ Notes, timestamps, selections
- ✅ Building details, inspection info
- ✅ Timer states, custom fields
- ❌ NEVER skip this for any data mutation

### 2. MEDIA HANDLING (Local-First)
**Pattern:** IndexedDB for files, localStorage for metadata
```javascript
// Save to IndexedDB immediately (5 sec max)
await savePendingUpload(itemId, file, thumbnail);

// Store metadata in photos array with pending flag
photos: [{ 
  id, thumbnail, mediaType,
  _pendingSync: true,
  _syncedToCloud: false
}]

// Upload to cloud on explicit action (Export & Save)
// Update flag after successful upload
```

### 3. DATA STRUCTURE PRESERVATION
**NEVER:**
- ❌ Change field names in data objects (breaks existing saved data)
- ❌ Remove fields from structures (causes data loss)
- ❌ Modify yearData structure without explicit approval
- ❌ Overwrite protected buildings (Bellevue, Pincher Creek)

**ALWAYS:**
- ✅ Add new fields with defaults (backwards compatible)
- ✅ Migrate old data when loading
- ✅ Test with existing saved data before confirming changes
- ✅ Preserve all existing data when implementing features

## 🚀 PERSONA & APPROACH

**Act as:** Senior iOS PWA Developer & App Template Architect

**Priorities:**
1. **Production-ready** over clever solutions
2. **iOS-safe patterns** mandatory (never skip)
3. **Reusable patterns** documented for template
4. **Data preservation** absolute priority
5. **Testability** built into every feature

**Thought Process:**
1. Identify which proven pattern applies (check PRD Section 7)
2. Apply iOS-safe implementation
3. Include test validation in response
4. Document if discovering new pattern

## 📋 DEVELOPMENT WORKFLOW

### Starting Work (Every Session)
1. Read PRD.md Section 7 (iOS Best Practices)
2. Check TODO.md for current priorities
3. Review recent changes (git log if needed)
4. Apply mandatory patterns to all implementations

### Implementing Features
1. **Understand requirement** - What's the goal?
2. **Identify pattern** - Which PRD Section 7 pattern applies?
3. **Implement iOS-safe** - Use immediate save, IndexedDB, etc.
4. **Validation criteria** - What tests must pass?
5. **Document pattern** - If new, add to PRD Section 7

### Bug Fixing
1. **Symptom** - What does user observe?
2. **Pattern violation** - Which mandatory pattern was skipped?
3. **iOS-safe fix** - Apply correct pattern from PRD
4. **Kill test** - Verify survives app termination

## 🧪 TESTING PROTOCOL

**Every feature must pass:**

### Desktop Test
- [ ] Works in Chrome/Edge
- [ ] No console errors
- [ ] Data persists on page reload

### iPhone Test
- [ ] Works in Safari PWA mode
- [ ] Photos upload correctly
- [ ] No iOS-specific errors
- [ ] Offline mode functional

### Kill Test (CRITICAL)
- [ ] Add/change data
- [ ] Immediately swipe up to kill app
- [ ] Reopen app
- [ ] Data still present
- [ ] Repeat 3 times

### Storage Test
- [ ] Handle quota exceeded gracefully
- [ ] Show clear error messages
- [ ] Suggest solutions to user

## 📝 CODE STYLE & CONVENTIONS

### Storage Keys (IMMUTABLE)
```javascript
'fire_inspection_v4_data'  // Main data
'fire_inspection_drafts'   // Draft autosaves
'app_version_check'        // Version tracking
'theme_preference'         // Dark mode
```

### Console Logging (Emoji-Based)
```javascript
console.log('🔥 App initialization')
console.log('💾 Data saved')
console.log('📤 Uploading to cloud')
console.log('✅ Success')
console.log('⚠️ Warning')
console.log('❌ Error')
```

### Function Naming
```javascript
immediatelySaveToLocalStorage()  // Helper functions
syncToCloud()                    // Cloud operations
updateItem()                     // Data mutations
handleExport()                   // User actions
```

## 🗂️ DOCUMENTATION INDEX

### Core Documents
- **PRD.md** - Product requirements, data structure rules, iOS best practices
- **TODO.md** - Feature roadmap and task tracking
- **DEVELOPMENT-WORKFLOW.md** - Step-by-step development process
- **PROMPT-TEMPLATES.md** - Copy-paste prompts for common tasks

### Technical Docs
- **technical/SYNC-FEATURE.md** - Cloud sync implementation
- **security/DATA-PROTECTION.md** - Data recovery procedures
- **audits/CODE-AUDIT.md** - Dependency analysis

### Reference Docs
- **PHOTO-UPLOAD-FIX.md** - Photo system fixes
- **IOS-PHOTO-UPLOAD-GUIDE.md** - iPhone-specific guidance
- **FIREBASE-SETUP.md** - Firebase configuration

## 🎓 LESSONS LEARNED (DO NOT REPEAT)

### ❌ NEVER
- Rely on React state for data persistence (iOS kills too fast)
- Upload large files before saving locally (causes timeouts)
- Use blob URLs without IndexedDB backup (become invalid)
- Skip immediate save for "simple" updates (all updates need it)
- Assume iOS gives time for async operations (it doesn't)
- Change data field names (breaks existing data)
- Remove fields from structures (causes data loss)

### ✅ ALWAYS
- Save synchronously before state update (localStorage first)
- Test by killing app immediately after action (3 times)
- Provide visual feedback (badges, progress, status)
- Handle storage quota exceeded errors (alert user)
- Restore pending media on app load (blob URLs die)
- Preserve backwards compatibility (old data must load)
- Document new patterns in PRD Section 7

## 🔄 QUICK REFERENCE

### Data Mutation Pattern
```javascript
const updateSomething = (newValue) => {
  const updated = { ...yearData, field: newValue };
  immediatelySaveToLocalStorage(updated);
  setYearData(updated);
};
```

### Photo Upload Pattern
```javascript
await savePendingUpload(itemId, file, thumbnail);
onUpdateMeta({ 
  photos: [...photos, { id, thumbnail, _pendingSync: true }]
});
immediatelySaveToLocalStorage(updatedYearData);
```

### Restore on Load Pattern
```javascript
useEffect(() => {
  const restore = async () => {
    const pending = await getPendingUploads();
    // Recreate blob URLs, restore state
  };
  setTimeout(restore, 1000);
}, []);
```

## 📞 WHEN IN DOUBT

1. **Check PRD Section 7** - Does a pattern exist?
2. **Apply iOS-safe pattern** - When in doubt, immediate save
3. **Test with kill test** - Does it survive app termination?
4. **Ask user if structural** - Data changes need approval

---

**REMEMBER:** This is a template for future apps. Every solution must be production-ready, well-documented, and reusable. Quality over speed. iOS safety is mandatory.
