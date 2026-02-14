# Cloud Sync Feature Documentation

## Overview
The Fire Inspection App now includes automatic cloud synchronization using Firebase Firestore. This allows multiple inspectors to share data in real-time, ensuring everyone has access to the latest inspection results.

## How It Works

### 1. **Local Storage First**
- All data is saved immediately to your phone's local storage
- You can work offline without any issues
- Data persists even if you close the app or shut down your phone

### 2. **Automatic Cloud Sync**
- After any change, the app waits 5 seconds then automatically syncs to the cloud
- This prevents excessive writes while you're actively editing
- Sync happens in the background - you can keep working

### 3. **Multi-User Support**
- When you open the app, it automatically loads the latest data from the cloud
- If multiple people edit the same building, the most recent change wins
- Each building tracks when it was last synced

### 4. **Manual Sync Button**
- In the Buildings view, there's a "☁ Sync" button in the top-right
- Click it to force an immediate sync to the cloud
- Button shows current status:
  - **☁ Sync** - Ready to sync
  - **⟳ Syncing...** - Sync in progress
  - **✓ Synced** - Sync successful
  - **✕ Error** - Sync failed (will retry automatically)

### 5. **Sync Status Indicators**
- **Buildings View**: Shows when data was last synced to cloud
- **Inspection Form**: Small banner at top shows sync status

## Usage Scenarios

### Scenario 1: Single Inspector
1. Open app and start inspection
2. Fill out checklist, devices, etc.
3. Data saves locally immediately
4. After 5 seconds of no changes, data syncs to cloud automatically
5. Close app - data is safe both locally and in cloud

### Scenario 2: Multiple Inspectors
1. Inspector A starts inspection at Building X
2. Inspector B opens the app on their phone
3. Inspector B sees Building X with Inspector A's progress
4. Inspector A finishes the control equipment section
5. After 5 seconds, it syncs to cloud
6. Inspector B can now see the updated control equipment data
7. Inspector B completes the emergency lights section
8. Both inspectors' work is merged and available to everyone

### Scenario 3: Offline Work
1. Inspector goes to remote location with no internet
2. Completes entire inspection - all saved locally
3. When internet becomes available, click "☁ Sync" button
4. All work uploads to cloud for team to see

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

### Conflict Resolution
- Cloud data is loaded when app starts
- If same building exists locally AND in cloud:
  - Compare `lastSynced` timestamps
  - Keep the version with the most recent timestamp
  - This ensures the latest edits are always preserved

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
