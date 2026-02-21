# Photo Upload Issue Fix

## Problem
Photos (2.7MB) get stuck at 30% during upload and never complete.

## Root Cause
Two possible issues:
1. **Firebase Storage security rules not configured** - blocking uploads
2. **Network timeout** - slow connection causing upload to hang indefinitely

## Solutions Implemented

### ✅ Fix 1: Added Upload Timeout (60 seconds)
The app now has a 60-second timeout for uploads. If the upload doesn't complete within this time, you'll get a clear error message instead of hanging forever.

**What you'll see:**
- Upload will show progress: 0% → 10% → 30% → 70% → 100%
- If it times out, you'll get: "Upload timeout - please check your internet connection"

### ✅ Fix 2: Better Error Messages
The app now provides specific guidance based on the error:
- **Timeout errors**: Suggests checking internet or using smaller images
- **Permission errors**: Indicates Firebase Storage configuration issue
- **Unknown errors**: Provides troubleshooting steps

## Required: Configure Firebase Storage Rules

If uploads are timing out or failing with "permission denied", you need to configure Firebase Storage security rules:

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fire-inspection-app-9c13f**

### Step 2: Configure Storage Rules
1. In the left sidebar, click **Storage**
2. If Storage isn't enabled yet, click **Get Started** and follow the prompts
3. Click on the **Rules** tab at the top
4. Replace the rules with this (for testing):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // ⚠️ TEST ONLY - allows all uploads
    }
  }
}
```

5. Click **Publish** to save

⚠️ **Security Note:** These rules allow anyone to upload/download. This is fine for:
- Personal/team use with a private URL
- Testing phase

For production, consider adding authentication requirements.

### Step 3: Verify Storage is Enabled
1. Still in **Storage** section
2. You should see a **Files** tab
3. If you see "Get Started" instead, click it to enable Storage

## Testing the Fix

### Test 1: Small Photo (< 1MB)
1. Try uploading a small photo first
2. Should complete in 5-10 seconds
3. Progress: 0% → 10% → 30% → 70% → 100%

### Test 2: Larger Photo (2-3MB)
1. Once small photos work, try a larger one
2. May take 20-40 seconds depending on connection
3. Watch the progress percentage

### Test 3: Timeout Scenario
If upload gets stuck at 30% for more than 60 seconds:
- You'll get a timeout error message
- Check your internet connection
- Try compressing the image first
- Verify Storage rules are published

## Alternative: Compress Images Before Upload

If uploads keep timing out even after configuration:

### On iPhone:
1. **Use iOS Shortcuts** to compress photos:
   - Install "Image Size" shortcut
   - Resize to 1200px width before selecting
   
2. **Use a compression app**:
   - Download "Photo Compress" (free)
   - Compress images to ~500KB before upload

### On Computer:
1. **Use built-in tools**:
   - Preview (Mac): File → Export → Reduce Quality
   - Paint (Windows): Resize → 1200px width
   
2. **Online tools**:
   - TinyPNG.com (free, easy)
   - Squoosh.app (by Google)

## What Changed in the Code

```javascript
// OLD: Upload could hang forever
await uploadBytes(storageRef, file);

// NEW: Upload has 60-second timeout
const uploadWithTimeout = Promise.race([
    uploadBytes(storageRef, file),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout...')), 60000)
    )
]);
await uploadWithTimeout;
```

## Expected Upload Times

| File Size | Good Connection | Slow Connection | Mobile Data |
|-----------|----------------|-----------------|-------------|
| 500KB     | 2-5 sec        | 5-10 sec        | 10-15 sec   |
| 1MB       | 5-10 sec       | 10-20 sec       | 20-30 sec   |
| 2.7MB     | 10-20 sec      | 30-50 sec       | 50-60 sec   |
| 5MB       | 20-30 sec      | 60+ sec (may timeout) | Will likely timeout |

## Troubleshooting

### Still stuck at 30%?
1. ✅ Check Firebase Storage is enabled
2. ✅ Verify Storage rules are published (see above)
3. ✅ Test internet speed (need at least 1 Mbps upload)
4. ✅ Try a smaller image (< 1MB)
5. ✅ Check browser console (F12) for specific errors

### "Permission denied" error?
- Firebase Storage rules aren't set correctly
- Follow "Configure Firebase Storage Rules" section above

### "Upload timeout" error?
- Connection is too slow for the file size
- Compress the image first
- Try on WiFi instead of mobile data
- Check if other uploads are working (other apps/websites)

### Photos upload but don't display?
- Clear service worker cache:
  - On iPhone: Settings → Safari → Clear History and Website Data
  - On computer: Browser settings → Clear cache
- Reload the app

## Emergency Fallback: Local-Only Storage

If Firebase Storage continues to fail, the app will automatically fall back to storing compressed images locally in your browser. This means:
- ✅ You can still add photos to inspections
- ⚠️ Photos won't sync to other devices
- ⚠️ Photos stored as base64 (takes more space)
- ⚠️ Photos lost if you clear browser data

**To use local-only mode:**
- Just ignore the Firebase Storage setup
- App will detect and use fallback automatically
- You'll see: "Firebase Storage not available, storing locally"

---

**Need More Help?**

If you're still experiencing issues:
1. Check the browser console (F12) for detailed error messages
2. Screenshot the error and the progress bar
3. Note the exact file size and format (JPG/PNG/HEIC)
4. Check if the issue happens on WiFi vs mobile data
5. Try a different browser/device to isolate the problem

**Last Updated:** February 21, 2026
