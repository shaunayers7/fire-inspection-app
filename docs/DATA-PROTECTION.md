# Data Protection & Recovery Guide

## 🛡️ Updated Protection Logic (Feb 2026)

The app now uses **cloud-first sync** for proper multi-user collaboration:

### How It Works Now

1. **First Load Only**: Default buildings (Bellevue, Pincher Creek) are created when localStorage is empty
2. **After First Load**: Cloud is the source of truth
3. **Multi-User Support**: If one user deletes a building, other users will see it deleted when they sync
4. **No Auto-Restore**: Buildings are NOT automatically restored after first load

### Why This Change?

The old system would restore deleted buildings even when they were intentionally removed by another user. This prevented proper team collaboration.

**New Behavior:**
- ✅ User A deletes building → syncs to cloud
- ✅ User B clicks "☁ Sync" → sees deletion
- ✅ Cloud is always the source of truth

### Protected Buildings

- **Bellevue** (ID: `b-2026-bellevue`)
- **Pincher Creek** (ID: `b-2026-pincher-creek`)

These buildings will automatically be restored if they're missing from your localStorage.

## 🔍 Diagnostic Console Logs

Open your browser's developer console to see what's happening:

- `✅ Restoring missing building: [name]` - Default building was restored
- `📥 Keeping local building: [name]` - Local building not in cloud, kept anyway
- `🔄 Local version newer for: [name]` - Used local copy because it's more recent
- `☁️ Cloud version newer for: [name]` - Used cloud copy because it's more recent

## 🚨 If Data Is Still Missing

### Option 1: Clear localStorage and Refresh

Open browser console (F12) and run:
```javascript
localStorage.removeItem('fire_inspection_v4_data');
location.reload();
```

This will force the app to restore all default buildings.

### Option 2: Force Sync from Cloud

1. Open the app
2. Go to Buildings screen
3. Click the "☁ Sync" button
4. This will re-download all data from cloud

### Option 3: Manual Data Restore

If you need to manually restore a building, use the browser console:

```javascript
// Get current data
const data = JSON.parse(localStorage.getItem('fire_inspection_v4_data'));

// Add Pincher Creek if missing
if (!data[2026].some(b => b.id === 'b-2026-pincher-creek')) {
    data[2026].push({
        id: "b-2026-pincher-creek",
        name: "Pincher Creek",
        // ... full data structure ...
    });
}

// Save back
localStorage.setItem('fire_inspection_v4_data', JSON.stringify(data));
location.reload();
```

## 📋 Data Storage Key

The app uses this localStorage key (per PRD):
```
fire_inspection_v4_data
```

**⚠️ NEVER CHANGE THIS KEY** - changing it will cause data loss.

## 🔄 Sync vs Local Priority

### Timeline of Data Flow

1. **Initial Load**: localStorage → Check for missing defaults → Restore if needed
2. **Firebase Auth**: Authenticate user anonymously
3. **Cloud Load**: Download cloud data → Merge with local (newer timestamp wins)
4. **User Edits**: Save to localStorage immediately
5. **Auto-Sync**: After 5 seconds of inactivity → Upload to cloud

### Conflict Resolution Rules

When the same building exists both locally and in cloud:

1. Compare `lastSynced` timestamps
2. Keep the version with the **newer** timestamp
3. This ensures the most recent edits are preserved

### Special Case: Default Buildings

- Bellevue and Pincher Creek are **protected**
- If missing during initial load, they're automatically restored
- This protection runs BEFORE cloud sync
- Therefore, they'll always exist locally and be synced to cloud

## 🧪 Testing Protection

To test that protection is working:

1. Open browser console
2. Check current data:
   ```javascript
   const data = JSON.parse(localStorage.getItem('fire_inspection_v4_data'));
   console.log(data[2026].map(b => b.name));
   ```
3. Manually delete Pincher Creek:
   ```javascript
   const data = JSON.parse(localStorage.getItem('fire_inspection_v4_data'));
   data[2026] = data[2026].filter(b => b.id !== 'b-2026-pincher-creek');
   localStorage.setItem('fire_inspection_v4_data', JSON.stringify(data));
   ```
4. Refresh page
5. Check data again - Pincher Creek should be back!

## 📝 What Changed

### Before (The Problem)
- If you deleted a building, it was gone forever
- Cloud sync could overwrite local data completely
- No protection for important baseline buildings

### After (The Solution)  
- Default buildings auto-restore if missing
- Cloud sync merges instead of overwriting
- Console logs show exactly what's happening
- Follows PRD requirement: "Merge rather than overwriting with blank template"

## 🆘 Still Having Issues?

1. Check browser console for error messages
2. Verify Firebase connection (look for auth errors)
3. Try clearing localStorage and refreshing
4. Check that you're using the latest version of index.html
5. Ensure default buildings data is present in the source code

---

*Last Updated: February 14, 2026*
*Related: PRD.md, SYNC-FEATURE.md*
