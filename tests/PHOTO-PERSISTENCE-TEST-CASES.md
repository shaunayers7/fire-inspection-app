# Photo Persistence Test Cases

## Issue
Photos disappear after closing/reopening app on iPhone despite immediate save implementation.

## Root Cause
Photo upload code uses manual localStorage manipulation instead of the centralized `immediatelySaveToLocalStorage()` helper function.

## Test Cases

### Test 1: Single Photo Add (Kill Test)
**Steps:**
1. Open app on iPhone
2. Navigate to any building → any section → any item
3. Tap "Add Photo/Video"
4. Select 1 photo from camera/library
5. **IMMEDIATELY** kill app (swipe up from home screen)
6. Reopen app
7. Navigate back to same item

**Expected:** Photo should be visible
**Actual (Before Fix):** Photo disappears
**Why:** Manual localStorage code may fail silently or execute too slowly

---

### Test 2: Multiple Photos Add (Kill Test)
**Steps:**
1. Open app → navigate to item
2. Add 2 photos in quick succession
3. **IMMEDIATELY** kill app (don't wait for save)
4. Reopen app → check item

**Expected:** Both photos visible
**Actual (Before Fix):** Photos disappear
**Why:** Second photo may overwrite first, or both fail to save

---

### Test 3: Photo Add → Photo Delete (Kill Test)
**Steps:**
1. Open app → navigate to item
2. Add 1 photo
3. Delete that photo
4. **IMMEDIATELY** kill app
5. Reopen app → check item

**Expected:** No photos (deletion persisted)
**Actual (Before Fix):** May show deleted photo
**Why:** Deletion uses same flawed manual approach

---

### Test 4: Photo Add → Checkbox Change (Kill Test)
**Steps:**
1. Open app → navigate to item
2. Add 1 photo (wait for save message)
3. Change checkbox status (OK/Deficiency/N/A)
4. **IMMEDIATELY** kill app
5. Reopen app → check item

**Expected:** Photo + checkbox change both persisted
**Actual (Before Fix):** Photo may persist, checkbox may not (or vice versa)
**Why:** Different code paths, inconsistent save patterns

---

### Test 5: Video Upload (Kill Test)
**Steps:**
1. Open app → navigate to item
2. Add 1 video from library
3. **IMMEDIATELY** kill app (don't wait)
4. Reopen app → check item

**Expected:** Video thumbnail visible
**Actual (Before Fix):** Video disappears
**Why:** Video uses same flawed localStorage approach + blob URL issues

---

### Test 6: Rapid Multi-Item Photo Add (Stress Test)
**Steps:**
1. Open app → navigate to building
2. Add photos to 3 different items rapidly (one after another)
3. **IMMEDIATELY** kill app
4. Reopen app → check all 3 items

**Expected:** All 3 photos visible
**Actual (Before Fix):** Some or all photos disappear
**Why:** Rapid saves may conflict or overwrite each other

---

### Test 7: Photo Add → Navigate Away → Kill (Navigation Test)
**Steps:**
1. Open app → navigate to item
2. Add 1 photo
3. Tap "Back" button (navigate to building list)
4. **IMMEDIATELY** kill app
5. Reopen app → navigate to item

**Expected:** Photo visible
**Actual (Before Fix):** Photo may disappear
**Why:** Navigation triggers separate save, may conflict with photo save

---

### Test 8: Photo Add → Wait → Kill (Delayed Kill Test)
**Steps:**
1. Open app → navigate to item
2. Add 1 photo
3. Wait 5 seconds
4. Kill app
5. Reopen app → check item

**Expected:** Photo visible
**Actual (Before Fix):** Photo may persist (useEffect has time to run)
**Why:** Delayed kill allows async state update + useEffect save

---

### Test 9: Large Photo Upload (Storage Test)
**Steps:**
1. Open app → navigate to item
2. Add very large photo (10MB+)
3. **IMMEDIATELY** kill app
4. Reopen app → check item

**Expected:** Photo visible (compressed)
**Actual (Before Fix):** Photo disappears OR error
**Why:** Large file compression + save may not complete

---

### Test 10: IndexedDB Verification (Data Integrity Test)
**Steps:**
1. Open app → navigate to item
2. Add 1 photo
3. Open browser DevTools → Application → IndexedDB → firePhotos
4. Verify photo exists in IndexedDB
5. Open DevTools → Console → check localStorage size
6. Verify photo metadata in localStorage 'fire_inspection_v4_data'
7. Kill app → reopen
8. Re-verify IndexedDB and localStorage

**Expected:** 
- Photo blob in IndexedDB before and after kill
- Photo metadata in localStorage before and after kill
**Actual (Before Fix):** 
- IndexedDB may have blob but localStorage missing metadata
- Or opposite: localStorage has metadata but IndexedDB missing blob

---

## Success Criteria

**All tests must pass 3 times in a row** to confirm fix is reliable.

### Pass Definition:
- Photo/video visible after kill test
- No console errors
- No data corruption (other items unaffected)
- No duplicate photos
- Proper sync indicators (badges, pending counts)

### Fail Definition:
- Photo disappears after kill
- Console errors during save
- Other data corrupted
- Photos duplicated
- Sync indicators incorrect

---

## Debug Logging Checklist

When testing, verify these console logs appear:

**Photo Add:**
```
💾 Saving photo locally (will upload to cloud when you click Export & Save)
📸 Saved to IndexedDB
💾 IMMEDIATE save to localStorage (iOS safety)  ← MUST SEE THIS
✅ Photo saved locally - will sync to cloud when you click Export & Save
```

**Photo Delete:**
```
🗑️ Deleting photo...
💾 IMMEDIATE save after photo deletion (iOS safety)  ← MUST SEE THIS
```

**App Load:**
```
🔥 Fire Inspection App v[version]
💾 Auto-saved to localStorage ([size]MB)
🔄 Restored X pending media items from IndexedDB  ← For videos
```

---

## Fix Verification

After implementing fix, verify:

1. **Code uses helper:** `immediatelySaveToLocalStorage(updatedYearData)` instead of manual localStorage.setItem
2. **Synchronous execution:** Save happens BEFORE React setState
3. **Error handling:** Try-catch with user-friendly alerts
4. **Consistent pattern:** Same approach as updateItem() and updateBuildingDetail()
5. **IndexedDB still used:** Photos/videos still stored in IndexedDB for blob data
6. **localStorage metadata:** Photo metadata (id, URL, etc.) in yearData → saved to localStorage

---

## Performance Benchmarks

**Target Times (iPhone):**
- Photo add → save complete: < 500ms
- Photo delete → save complete: < 200ms
- localStorage size check: < 50ms
- IndexedDB save: < 300ms

**Monitor for:**
- localStorage quota exceeded errors (5MB limit on some browsers)
- IndexedDB quota exceeded errors (50MB+ limit)
- Save operation blocking UI (should not happen with current approach)

---

## iOS-Specific Behaviors to Test

1. **Safari Private Mode:** Photos should still save (IndexedDB available)
2. **Low Power Mode:** Saves should still work (no throttling)
3. **Background App Refresh OFF:** Saves should still work (happens in foreground)
4. **Multiple Tabs:** Opening app in 2+ tabs should not corrupt data
5. **Storage Pressure:** When iPhone storage almost full, handle gracefully

---

## Regression Testing

After fix, also test these to ensure nothing broke:

- ✅ Checkbox changes still persist
- ✅ Text edits still persist
- ✅ Building name changes persist
- ✅ Cloud sync still works
- ✅ Export PDF still works
- ✅ Multi-user sync still works
- ✅ Offline mode still works

