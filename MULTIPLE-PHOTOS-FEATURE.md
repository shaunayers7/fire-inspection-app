# Multiple Photos Per Item Feature

## Overview
Updated the photo upload system to support **multiple photos per inspection item** instead of replacing single photos. Each item can now have an unlimited photo gallery.

## What Changed

### 1. Data Structure
**Before:**
```javascript
{
  photoURL: "...",
  thumbnail: "...",
  storagePath: "...",
  mediaType: "image",
  _syncedToCloud: true
}
```

**After:**
```javascript
{
  photos: [
    {
      id: "photo_1234567890_abc123",
      photoURL: "...",
      thumbnail: "...",
      storagePath: "...",
      mediaType: "image",
      _syncedToCloud: true,
      uploadedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "photo_1234567891_def456",
      photoURL: "...",
      thumbnail: "...",
      // ... more photos
    }
  ]
}
```

### 2. Upload Behavior
- **Before:** Adding a new photo replaced the existing photo
- **After:** New photos are added to the `photos` array
- Each photo gets a unique ID: `photo_{timestamp}_{random}`
- All existing features preserved: compression, thumbnails, offline sync, progress tracking

### 3. Display UI
- **Before:** Single 96×96px thumbnail
- **After:** Horizontal scrollable gallery showing all photos
- Each photo is 80×80px in the gallery
- Photos show sync status badges (☁ synced, ⏱ pending)
- Click any photo to view full size in modal

### 4. Delete Functionality
- **Before:** Single "Delete Media" button removed the only photo
- **After:** Each photo has individual × delete button (shows on hover)
- Deletes from Firebase Storage, IndexedDB, and photos array
- Confirmation dialog before deletion

### 5. Backward Compatibility
- Old single-photo data automatically migrates to `photos` array
- Migration happens automatically on first render
- No data loss - existing photos preserved

## Features Preserved

All existing photo system features still work:
- ✅ Automatic image compression (2.7MB → 300KB)
- ✅ Instant thumbnail generation (200px preview)
- ✅ Offline photo storage (IndexedDB)
- ✅ Background auto-sync every 30 seconds
- ✅ Upload progress tracking (0-100%)
- ✅ Online/offline indicators
- ✅ Firebase Storage integration
- ✅ Video support

## How to Use

### Adding Photos
1. Click the camera icon on any inspection item
2. Select a photo from your device
3. Photo automatically compresses, generates thumbnail, and uploads
4. Photo appears in the gallery immediately
5. Repeat to add more photos - they won't replace existing ones

### Viewing Photos
- See all photos in horizontal scrolling gallery
- Green ☁ badge = synced to cloud
- Orange ⏱ badge = pending sync (offline)
- Click any photo to view full size

### Deleting Photos
1. Hover over any photo in the gallery
2. Click the × button that appears
3. Confirm deletion
4. Photo removed from cloud and local storage

## Technical Details

### Photo ID Generation
```javascript
const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```
- Timestamp ensures uniqueness
- Random suffix prevents collisions if multiple photos uploaded simultaneously

### Storage Structure
```
Firebase Storage:
  inspections/
    {itemId}/
      1234567890_photo1.jpg
      1234567891_photo2.jpg
      1234567892_photo3.jpg

IndexedDB:
  fire-inspection-photos/
    pending-uploads/
      {itemId} → { file: Blob, thumbnail: base64 }
```

### Backward Compatibility Migration
```javascript
// Detects old single-photo format
const hasOldPhoto = (item.photoURL || item.photo || item.thumbnail) && !item.photos;

// Automatically migrates to new format
if (hasOldPhoto) {
  const oldPhoto = {
    id: `photo_legacy_${Date.now()}`,
    photoURL: item.photoURL || item.photo,
    thumbnail: item.thumbnail,
    storagePath: item.storagePath,
    mediaType: item.mediaType || 'image',
    _syncedToCloud: item._syncedToCloud,
    uploadedAt: new Date().toISOString()
  };
  
  onUpdateMeta({ 
    photos: [oldPhoto],
    // Clear old fields
    photoURL: null,
    photo: null,
    thumbnail: null
  });
}
```

## Testing Checklist

- [x] Upload multiple photos to same item
- [x] Photos appear in gallery view
- [x] Click photo to view full size
- [x] Delete individual photos
- [x] Photos persist after page refresh
- [x] Offline photo upload and sync
- [x] Sync status badges display correctly
- [x] Old data migrates automatically
- [x] Background sync updates photos array

## Code Locations

**Upload Handler:** Lines 1040-1240 in [index.html](index.html)
- Modified to push to photos array instead of replacing single photo
- Generates unique photo ID for each upload

**Gallery Display:** Lines 1275-1395 in [index.html](index.html)
- Replaced single photo display with scrollable gallery
- Added individual delete buttons for each photo
- Includes backward compatibility migration

**Background Sync:** Lines 2385-2425 in [index.html](index.html)
- Updated to add synced photos to photos array
- Matches pending photos by thumbnail
- Updates existing pending or adds new

## Benefits

1. **No Data Loss:** Add unlimited photos without losing previous ones
2. **Better Documentation:** Capture multiple angles of same item
3. **Backward Compatible:** Existing data automatically upgrades
4. **Same Performance:** All compression and offline features still work
5. **Better UX:** Gallery view with individual photo management

## Future Enhancements

Possible improvements:
- Photo reordering (drag and drop)
- Add captions to individual photos
- Bulk photo upload
- Photo comparison (before/after)
- Export photos separately in PDF
- Photo metadata (location, timestamp)
