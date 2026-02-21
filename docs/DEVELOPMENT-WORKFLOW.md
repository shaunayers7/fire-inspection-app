# Development Workflow Guide

> **For AI Assistants & Human Developers:** Step-by-step process for building features in this app template.

## 🎯 Workflow Overview

This document provides structured processes for common development tasks. Follow these workflows to maintain code quality, ensure iOS compatibility, and preserve all established patterns.

---

## 📋 SESSION START CHECKLIST

**Before implementing any feature, complete this checklist:**

- [ ] Read COPILOT-INSTRUCTIONS.md (understand mandatory patterns)
- [ ] Review PRD.md Section 7 (iOS Best Practices)
- [ ] Check TODO.md (current priorities)
- [ ] Read recent git commits (context on latest changes)
- [ ] Verify test iPhone available (if working on iOS features)

---

## 🆕 ADDING A NEW FEATURE

### 1. Requirements Analysis
**Questions to answer:**
- What is the user goal?
- What data needs to be stored?
- Does this affect existing data structures?
- Is this iOS-critical (data persistence)?
- What are the acceptance criteria?

### 2. Pattern Identification
**Check PRD Section 7 for applicable patterns:**
- [ ] Data mutation → Immediate save pattern?
- [ ] Photo/video → IndexedDB pattern?
- [ ] User input → Form field pattern?
- [ ] Status change → State update pattern?
- [ ] New data field → Backwards compatibility needed?

### 3. Implementation
**Standard process:**
```javascript
// 1. Identify the update function (e.g., updateItem, updateBuildingDetail)

// 2. Calculate new data synchronously
const updatedData = {
  ...currentData,
  newField: value
};

// 3. Save immediately to localStorage
immediatelySaveToLocalStorage(updatedData);

// 4. Update React state
setYearData(updatedData);

// 5. Log the change (for audit trail)
logChange('action_name', { details });
```

### 4. Validation
**Test on desktop:**
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Data persists on page reload
- [ ] No performance issues

**Test on iPhone (if applicable):**
- [ ] Feature works in Safari PWA
- [ ] Permissions handled correctly
- [ ] No iOS-specific errors
- [ ] Gestures work properly

**Kill test (CRITICAL for data features):**
1. Add/modify data
2. Immediately swipe up to close app
3. Reopen app from home screen
4. Verify data still present
5. Repeat 3 times to ensure consistency

### 5. Documentation
**If new pattern discovered:**
- [ ] Document in PRD Section 7
- [ ] Add code example
- [ ] Note iOS testing results
- [ ] Update PROMPT-TEMPLATES.md if applicable

---

## 🐛 BUG FIXING WORKFLOW

### 1. Bug Report Analysis
**Gather information:**
- **Symptom:** What does user see/experience?
- **Device:** iPhone/iPad/Desktop? iOS version?
- **Steps to reproduce:** Exact sequence of actions
- **Expected:** What should happen?
- **Actual:** What actually happens?
- **Console logs:** Any error messages?

### 2. Pattern Violation Check
**Common issues and causes:**

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Data disappears after app restart | Missing immediate save | Add `immediatelySaveToLocalStorage()` |
| Photos gone after reopen | Blob URLs not restored | Add IndexedDB restore in useEffect |
| Changes lost when navigating | Async state not saved | Use `saveAndNavigate()` helper |
| Storage quota exceeded | No error handling | Add try/catch with user alert |
| Video won't play after restart | Blob URL invalid | Recreate from IndexedDB |

### 3. Root Cause Analysis
**Ask:**
- Which mandatory pattern was violated?
- Is this an iOS-specific issue?
- Does this affect saved data?
- Is there a timing/race condition?

### 4. iOS-Safe Fix
**Implementation checklist:**
- [ ] Identify violated pattern
- [ ] Apply correct pattern from PRD Section 7
- [ ] Add immediate save if missing
- [ ] Handle edge cases (offline, quota, etc.)
- [ ] Add error handling with user feedback

### 5. Verification
- [ ] Bug no longer reproduces
- [ ] Fix doesn't break existing features
- [ ] Kill test passes (if data-related)
- [ ] Works on both iOS and desktop

---

## 📸 PHOTO/VIDEO FEATURE WORKFLOW

### Pattern: Local-First with Cloud Upload on Demand

**1. File Selection**
```javascript
// Detect iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Check file size
const maxSize = isVideo ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
if (file.size > maxSize) {
  alert('File too large!');
  return;
}
```

**2. Process File Locally**
```javascript
// Create thumbnail immediately (instant feedback)
const thumbnail = await createThumbnail(file);

// Compress image (reduce size)
const compressed = await compressImage(file);
```

**3. Save to IndexedDB**
```javascript
// Save file to IndexedDB for later upload
await savePendingUpload(itemId, compressedFile, thumbnail);

// Add to photos array with pending flag
const newPhoto = {
  id: `photo_${Date.now()}_${random}`,
  thumbnail: thumbnail,
  mediaType: 'image',
  _pendingSync: true,
  _syncedToCloud: false,
  uploadedAt: new Date().toISOString()
};
```

**4. Immediate Save to localStorage**
```javascript
// CRITICAL: Save immediately (iOS safety)
const currentData = localStorage.getItem('fire_inspection_v4_data');
const parsedData = JSON.parse(currentData);
// Update photos array in the data
parsedData[year][buildingIndex].data[section][itemIndex].photos = [...photos, newPhoto];
localStorage.setItem('fire_inspection_v4_data', JSON.stringify(parsedData));

// Then update React state
onUpdateMeta({ photos: [...photos, newPhoto] });
```

**5. Background Sync (Optional)**
```javascript
// Every 30 seconds, upload pending photos when online
useEffect(() => {
  const syncPending = async () => {
    const pending = await getPendingUploads();
    for (const upload of pending) {
      // Upload to Firebase Storage
      // Update photo with photoURL and _syncedToCloud: true
    }
  };
  const interval = setInterval(syncPending, 30000);
  return () => clearInterval(interval);
}, []);
```

**6. Restore on App Load**
```javascript
// Recreate blob URLs for videos that died when app was killed
useEffect(() => {
  const restore = async () => {
    const pending = await getPendingUploads();
    const mediaMap = new Map();
    for (const upload of pending) {
      const blobURL = URL.createObjectURL(upload.file);
      mediaMap.set(upload.id, { blobURL, thumbnail: upload.thumbnail });
    }
    // Update yearData with restored URLs
  };
  setTimeout(restore, 1000);
}, []);
```

---

## 💾 DATA STRUCTURE CHANGES

### When to Get User Approval
**ALWAYS get explicit approval before:**
- Adding/removing fields from data objects
- Changing field names
- Modifying yearData structure
- Changing storage keys
- Removing protected buildings
- Altering inspection details structure

### Safe Changes (No Approval Needed)
- UI-only changes (styling, layout, labels)
- Adding new optional fields with defaults
- Internal helper functions
- Console logging improvements
- Performance optimizations that don't affect data

### Migration Pattern
**When adding new field:**
```javascript
// OLD DATA: { name, address }
// NEW DATA: { name, address, email }

// In initialization code:
const saved = localStorage.getItem('fire_inspection_v4_data');
if (saved) {
  const data = JSON.parse(saved);
  
  // MIGRATION: Add new field if missing
  Object.keys(data).forEach(year => {
    data[year] = data[year].map(building => {
      if (!building.email) {
        return { ...building, email: '' }; // Default value
      }
      return building;
    });
  });
  
  return data;
}
```

---

## 🧪 TESTING PROTOCOLS

### Quick Test (5 min)
**For small changes:**
1. Make change
2. Refresh page
3. Verify feature works
4. Check console for errors
5. Done

### Standard Test (15 min)
**For data changes:**
1. Desktop: Feature works
2. Desktop: Data persists on reload
3. iPhone: Feature works
4. iPhone: Kill test passes (3x)
5. No console errors
6. Done

### Comprehensive Test (30 min)
**For major features:**
1. Desktop Chrome: Full feature test
2. Desktop: Offline mode test
3. Desktop: Storage quota test
4. iPhone Safari: Full feature test
5. iPhone: Kill test (5x different scenarios)
6. iPhone: Offline → online transition
7. Multiple photos/videos test
8. Cloud sync test (if applicable)
9. Cross-device test (if multi-user)
10. Done

---

## 📦 BUILDING FROM TEMPLATE

### Starting a New App from This Template

**1. Clone & Setup (10 min)**
```bash
# Clone template
git clone fire-inspection-app new-app-name
cd new-app-name

# Update project name
# Edit package.json, manifest.json, index.html

# Initialize new git repo
rm -rf .git
git init
```

**2. Customize Data Structure (20 min)**
```javascript
// 1. Define your data fields
const yourAppData = {
  field1: '',
  field2: '',
  sections: [...],
  data: {...}
};

// 2. Update storage key (IMPORTANT)
const STORAGE_KEY = 'your_app_v1_data';

// 3. Keep helper functions
// - immediatelySaveToLocalStorage (change key only)
// - savePendingUpload (keep as-is)
// - getPendingUploads (keep as-is)
```

**3. Apply Mandatory Patterns (30 min)**
- [ ] Copy `immediatelySaveToLocalStorage` helper
- [ ] Apply to all update functions
- [ ] Copy IndexedDB media handling
- [ ] Copy offline-first architecture
- [ ] Test kill test on iPhone

**4. Customize Features (varies)**
- Modify UI to match your app needs
- Update field names (data structure)
- Add app-specific logic
- Keep iOS-safe patterns intact

**5. Deploy & Test (1 hour)**
- [ ] Deploy to production URL
- [ ] Test on iPhone (full test protocol)
- [ ] Verify offline mode works
- [ ] Test storage quota handling
- [ ] Verify photos/media work
- [ ] Test multi-user sync (if applicable)

---

## 🎯 QUICK DECISION TREE

### "Should I use immediate save pattern?"
```
Does this change user data? 
├─ YES → Use immediate save pattern
└─ NO → Is it UI state only?
    ├─ YES → Normal setState is fine
    └─ NO → When in doubt, use immediate save
```

### "Should I use IndexedDB?"
```
Is it a photo/video/large file?
├─ YES → Use IndexedDB + localStorage metadata
└─ NO → Is it >100KB of data?
    ├─ YES → Consider IndexedDB
    └─ NO → localStorage is fine
```

### "Should I get user approval?"
```
Does this change data structure?
├─ YES → Get explicit approval
└─ NO → Is it just UI changes?
    ├─ YES → Proceed (no approval needed)
    └─ NO → When in doubt, ask
```

---

## 📞 COMMON SCENARIOS

### Scenario 1: Adding a Text Input Field
```javascript
// User wants to add "inspectorPhone" field

// 1. Identify update function
const updateInspectorPhone = (phone) => {
  // 2. Calculate updated data
  const updatedData = {
    ...yearData,
    [selectedYear]: yearData[selectedYear].map(b => 
      b.id === selectedBuildingId 
        ? { ...b, inspectionDetails: { ...b.inspectionDetails, inspectorPhone: phone }}
        : b
    )
  };
  
  // 3. Immediate save
  immediatelySaveToLocalStorage(updatedData);
  
  // 4. Update state
  setYearData(updatedData);
};

// 5. In JSX
<input 
  value={activeBuilding.inspectionDetails.inspectorPhone || ''}
  onChange={(e) => updateInspectorPhone(e.target.value)}
/>
```

### Scenario 2: Adding a Checkbox
```javascript
// User wants to add "emailReportToOwner" checkbox

// Same pattern as text input
const toggleEmailReport = () => {
  const currentValue = activeBuilding.emailReportToOwner || false;
  const updatedData = { /* same pattern */ };
  immediatelySaveToLocalStorage(updatedData);
  setYearData(updatedData);
};
```

### Scenario 3: Photo Feature
See "PHOTO/VIDEO FEATURE WORKFLOW" section above.

---

## ✅ PRE-DEPLOYMENT CHECKLIST

**Before marking feature complete:**

- [ ] Desktop test passed
- [ ] iPhone test passed (if relevant)
- [ ] Kill test passed (if data feature)
- [ ] No console errors
- [ ] Code follows established patterns
- [ ] PRD updated (if new pattern)
- [ ] TODO.md checkbox updated
- [ ] Documentation updated (if needed)
- [ ] User feedback considered
- [ ] Ready for production

---

**Remember:** Quality over speed. iOS safety is mandatory. Every solution must be reusable for future apps.
