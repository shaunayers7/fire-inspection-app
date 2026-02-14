# Multi-User Sync Testing Guide

## ✅ What Was Fixed

### Previous Issues:
- ❌ User A deletes building → User B refreshes → building reappears
- ❌ Auto-restore logic conflicted with multi-user collaboration
- ❌ Local data was merged with cloud data, causing deleted items to return

### New Behavior:
- ✅ **Cloud is the single source of truth**
- ✅ Deletions by one user are seen by all users
- ✅ Manual "☁ Sync" button pulls latest from cloud
- ✅ Auto-push sends local changes to cloud (5 seconds after edit)
- ✅ Protected buildings only created on FIRST LOAD (new user)

---

## 🧪 How to Test Multi-User Sync

### Test 1: Delete Sync Between Accounts

**Setup:** Open app in two different browsers (use different user accounts)

**Steps:**
1. **Browser A** (User 1): Login with account 1
2. **Browser B** (User 2): Login with account 2
3. Both should see the same buildings
4. **Browser A**: Delete a building
5. Wait 5 seconds for auto-sync
6. **Browser B**: Click "☁ Sync" button
7. ✅ **Expected**: Building is now deleted in Browser B

---

### Test 2: Add Building Sync

**Steps:**
1. **Browser A**: Add a new building named "Test Building"
2. Wait 5 seconds for auto-sync
3. **Browser B**: Click "☁ Sync" button
4. ✅ **Expected**: "Test Building" appears in Browser B

---

### Test 3: Edit Building Details

**Steps:**
1. **Browser A**: Open a building and change the address
2. Wait 5 seconds for auto-sync
3. **Browser B**: Click "☁ Sync" button
4. Open the same building
5. ✅ **Expected**: Address change is visible in Browser B

---

### Test 4: Simultaneous Edits (Last Write Wins)

**Steps:**
1. **Browser A**: Edit Building X, change address to "123 Main St"
2. **Browser B**: Edit Building X, change address to "456 Oak Ave"
3. Both wait 5 seconds for auto-sync
4. **Browser A**: Click "☁ Sync"
5. **Browser B**: Click "☁ Sync"
6. ✅ **Expected**: Both show whichever edit synced LAST

---

### Test 5: Offline → Online Sync

**Steps:**
1. **Browser A**: Disconnect from internet (developer tools → Network → Offline)
2. **Browser A**: Make several edits (will save locally only)
3. **Browser A**: Reconnect to internet
4. Wait 5 seconds for auto-sync
5. **Browser B**: Click "☁ Sync"
6. ✅ **Expected**: Browser B sees all edits from Browser A

---

## 🔍 Console Logs to Watch For

When testing, open **Developer Console** (F12) to see:

### On App Load (Login):
```
☁️ Syncing from cloud: Cloud data is now the source of truth
☁️ Cloud has X building(s)
✅ Cloud sync complete. Buildings in 2026: [...]
```

### When Clicking "☁ Sync" Button:
```
📥 Syncing from cloud...
☁️ Syncing from cloud: Cloud data is now the source of truth
✅ Sync from cloud complete!
```

### After Making Edits (5 seconds later):
```
📤 Pushing local changes to cloud...
✅ Push to cloud complete!
```

### When Deleting a Building:
```
🗑️ Deleting building b-xxx-xxx from cloud...
✅ Building b-xxx-xxx deleted from cloud
```

---

## 🐛 If Something Goes Wrong

### Buildings Keep Reappearing After Deletion

**Possible Causes:**
1. Auto-sync didn't complete (check console for errors)
2. User B didn't click "☁ Sync" button
3. Firebase rules are blocking deletions

**Solution:**
- Check Firebase Console → Firestore Database
- Verify the building is actually deleted from cloud
- Check Firebase Rules allow deletions

### Changes Don't Sync Between Users

**Possible Causes:**
1. Users are on different Firebase projects
2. Auto-sync is being blocked (check console)
3. Network connectivity issues

**Solution:**
- Verify both users see same Firebase config in console
- Check Network tab in DevTools for failed requests
- Try manual sync with "☁ Sync" button

---

## 📊 Expected Firebase Structure

In Firebase Console → Firestore Database, you should see:

```
apps/
  └── fire-inspect-default/
      └── buildings/
          ├── b-2026-bellevue
          ├── b-2026-pincher-creek
          └── [any other buildings]
```

**When a building is deleted:**
- It should be removed from this collection
- All users syncing will see it's gone

---

## ✅ Success Criteria

Multi-user sync is working correctly when:

1. ✅ Deletions are visible to all users after sync
2. ✅ New buildings appear for all users after sync
3. ✅ Edits are visible to all users after sync
4. ✅ "☁ Sync" button pulls latest data from cloud
5. ✅ Auto-sync pushes changes 5 seconds after edit
6. ✅ No phantom buildings reappearing after deletion
7. ✅ Console logs show "Cloud is source of truth"

---

## 🔧 Manual Recovery (If Needed)

If you need to reset to defaults:

```javascript
// In browser console
localStorage.removeItem('fire_inspection_v4_data');
location.reload();
```

This will restore default buildings (Bellevue, Pincher Creek) on first load.
