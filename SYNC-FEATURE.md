# Cloud Sync Feature Documentation

## Overview
The Fire Inspection App now includes automatic cloud synchronization using Firebase Firestore. This allows multiple inspectors to share data in real-time, ensuring everyone has access to the latest inspection results.

## How It Works

### 1. **Cloud is the Source of Truth** ⭐
- **All devices sync to the same cloud database**
- When you open the app, it loads the latest data from cloud
- This ensures everyone sees the same data across all accounts

### 2. **Local Storage for Offline**
- Data is saved locally so you can work offline
- When internet is available, cloud data takes priority

### 3. **Automatic Push After Edits**
- After any change, the app waits 5 seconds then automatically pushes to cloud
- This prevents excessive writes while you're actively editing
- Sync happens in the background - you can keep working

### 4. **Manual Sync Button**
- In the Buildings view, there's a "☁ Sync" button in the top-right
- Click it to pull the latest data from cloud immediately
- This is useful after another user makes changes
- Button shows current status:
  - **☁ Sync** - Ready to sync
  - **⟳ Syncing...** - Sync in progress
  - **✓ Synced** - Sync successful
  - **✕ Error** - Sync failed (will retry automatically)

### 5. **How Multi-User Sync Works**
- **User A** deletes a building and it auto-syncs to cloud (after 5 seconds)
- **User B** clicks "☁ Sync" button or refreshes page
- **User B** now sees the building is gone
- **Cloud is always the source of truth**

## Usage Scenarios

### Scenario 1: Single Inspector
1. Open app and start inspection
2. Fill out checklist, devices, etc.
3. Data saves locally immediately
4. After 5 seconds of no changes, data auto-pushes to cloud
5. Close app - data is safe both locally and in cloud

### Scenario 2: Multiple Inspectors (REAL-TIME COLLABORATION)
1. **Inspector A** starts inspection at Building X
2. **Inspector B** opens the app on their phone (automatically pulls from cloud)
3. **Inspector B** sees Building X with Inspector A's progress
4. **Inspector A** deletes Building X (auto-pushes to cloud in 5 seconds)
5. **Inspector B** clicks "☁ Sync" button
6. **Inspector B** now sees Building X is deleted
7. ✅ **Both inspectors are in sync**

### Scenario 3: Offline Work
1. Inspector goes to remote location with no internet
2. Completes entire inspection - all saved locally
3. When internet becomes available, changes auto-push to cloud
4. Other team members can click "☁ Sync" to see the updates

## Technical Details

### Data Structure in Cloud
```
apps/
  └── fire-inspect-default/
      └── buildings/
          ├── b-2026-bellevue
          ├── b-2026-pincher-creek
          └── [other building IDs]
```

Each building document contains:
- All inspection data (checklist, devices, battery, lights, etc.)
- Building details (name, address, panel info)
- `lastSynced` timestamp
- `year` field for organizing by inspection year

### Conflict Resolution (UPDATED FEB 2026)
- **Cloud is ALWAYS the source of truth**
- **Smart deletion detection**: If a building was previously synced but is no longer in cloud → it was deleted by another user → remove it locally
- **New building protection**: Buildings that were never synced (no `lastSynced` timestamp) are kept as new additions
- When you open the app, cloud data replaces local data
- When you click "☁ Sync", cloud data replaces local data
- When you make edits, they auto-push to cloud after 5 seconds
- **Auto-sync is intelligent**: Before pushing, it pulls from cloud and merges properly to avoid overwriting deletions

### How It Works Behind the Scenes
1. **On App Load**: 
   - Pulls latest data from cloud
   - Replaces local data with cloud data
   
2. **When You Edit**:
   - Saves to local storage immediately (instant)
   - After 5 seconds, auto-sync triggers
   
3. **Auto-Sync Process** (THE KEY FIX):
   - **Step 1**: Pull latest from cloud
   - **Step 2**: Smart merge:
     - Building in BOTH local & cloud → Use newer version
     - Building in LOCAL only + never synced (`lastSynced = null`) → Keep it (new)
     - Building in LOCAL only + was synced before (`lastSynced` exists) → Remove it (deleted by another user)
     - Building in CLOUD only → Add it (created by another user)
   - **Step 3**: Push merged state to cloud
   
4. **When You Click "☁ Sync"**:
   - Pulls latest data from cloud
   - Replaces your local data
   - Shows what other users have done

### Firebase Authentication
- Uses anonymous authentication (no login required)
- Each device gets a unique ID
- All devices share the same data in the `apps/${APP_ID}` namespace

## Benefits

✅ **Never Lose Data**: Saved locally AND in cloud  
✅ **Team Collaboration**: Multiple inspectors can work together  
✅ **Offline Support**: Works without internet, syncs when available  
✅ **Automatic**: No need to remember to save or sync  
✅ **Real-time**: Changes appear on all devices within seconds  
✅ **Free**: Uses Firebase free tier (generous limits)

## Limitations & Notes

⚠️ **Firebase Free Tier Limits**:
- 50k document reads/day
- 20k document writes/day
- 1 GB stored data
- Should be sufficient for typical inspection use

⚠️ **No User Accounts**: 
- Currently uses anonymous auth
- Anyone with the app URL can access/edit data
- Consider adding password protection if needed

⚠️ **No Edit History**:
- Doesn't track who made which changes
- Latest change always wins
- Consider adding user identification if needed

## Future Enhancements

Possible improvements:
- User authentication/login system
- Activity log (who changed what, when)
- Conflict resolution UI (choose which version to keep)
- Selective sync (only sync certain buildings)
- Export/import backups
- Real-time live updates (currently requires reload to see others' changes)

## Troubleshooting

**Sync button shows "✕ Error"**:
- Check internet connection
- Check Firebase configuration
- Check browser console for error details
- Data is still saved locally - try syncing again later

**Not seeing other inspector's changes**:
- Refresh the app (go back to year selection and re-enter)
- Wait for auto-sync to complete (up to 5 seconds)
- Click manual sync button

**Data disappeared**:
- Check local storage (shouldn't happen)
- Data is backed up in cloud
- Reload app to fetch from cloud

## Testing

To test sync between devices:
1. Open app on Device A
2. Open app on Device B (different phone or browser)
3. On Device A: Edit a building's inspection
4. Wait 5 seconds or click sync button
5. On Device B: Reload the page or navigate to building list
6. You should see Device A's changes

---

*Last Updated: February 14, 2026*
