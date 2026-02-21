# iPhone Photo Upload Guide

## How Photo Uploading Works

### 📱 The Process (iPhone)

1. **Take/Select Photo** → Tap 📷 Media button → Choose photo
2. **Saved Locally** → Photo saved to your iPhone (instant)
3. **Click "Export & Save"** → Photos upload to cloud + PDF generated
4. **Done!** → Photos backed up in cloud, PDF downloaded

### ⚠️ Important: Photos Don't Auto-Sync

**Photos are NOT automatically uploaded to the cloud!**

Photos save to your phone immediately, but they only upload when you:
1. Click the green **"Export & Save"** button at the bottom
2. Wait for the sync to complete
3. See the success message

This is by design - it prevents uploading every photo individually (slow) and lets you collect multiple photos before syncing.

## iPhone-Specific Issues & Fixes

### Problem 1: No Permission Prompt Appears

**If you tap 📷 Media and nothing happens:**

1. **Delete the app** from your home screen:
   - Long-press the app icon
   - Tap "Remove App" → "Delete App"

2. **Clear Safari cache**:
   - Settings → Safari → Clear History and Website Data

3. **Reinstall**:
   - Open Safari
   - Go to your fire inspection app URL
   - Tap Share button (⬆️)
   - Tap "Add to Home Screen"
   - Give it a name, tap "Add"

4. **Try again** - permission prompt should appear

### Problem 2: Photos Not Uploading to Cloud

**Symptoms:** You can see photo thumbnails, but they're not in cloud/PDF

**Solution:**
- Photos save locally first (you'll see them immediately)
- They only upload when you click **"Export & Save"**
- Look for the blue notice that says "Photos Ready to Upload"
- Click the green "Export & Save" button
- Wait for it to complete (don't close the app)

### Problem 3: "Storage Full" Error

**iPhone storage is full and can't save photos**

**Solutions:**
1. Free up iPhone storage (delete old photos/apps)
2. Export & Save current inspections to cloud
3. Delete old inspection buildings from the app
4. Use a device with more storage

### Problem 4: Camera Permission Denied

**You accidentally tapped "Don't Allow" for camera/photos**

**Fix Method 1 (Easiest):**
- Delete app from home screen
- Reinstall (see Problem 1 above)
- Grant permissions when prompted

**Fix Method 2 (Safari Settings):**
1. Settings → Safari
2. Scroll to "Settings for Websites"
3. Tap "Camera" → Set to "Allow"
4. Tap "Microphone" → Set to "Allow" (for videos)
5. Go back, tap "Photos" → Set to "All Photos"
6. Restart Safari
7. Try uploading again

## Visual Indicators

### Photo Status Badges

- **☁ Green badge** = Synced to cloud (backed up)
- **⏱ Orange badge** = Pending sync (only on your phone)
- **No badge** = Offline/needs sync

### Upload Status Messages

- "Preparing..." = Processing photo
- "Creating thumbnail..." = Making preview
- "Uploading..." = Sending to cloud
- "📱 Saved locally" = On your phone only
- "Complete!" = Fully synced to cloud

### Sync Notice Banner

When you have photos pending upload, you'll see a **blue notice** above the "Export & Save" button:

```
💡 Photos Ready to Upload
Your photos are saved on this device. Click "Export & Save" 
below to upload them to the cloud and generate the PDF report.
```

## Step-by-Step: First Photo Upload

### For New iPhone Users

1. **Open the inspection** (tap a building)
2. **Find an item** (e.g., "Fire Alarm Panel")
3. **Tap the "📷 Media" button** on the right
4. **Grant permissions:**
   - If prompted "Allow access to Camera?" → Tap **"OK"**
   - If prompted "Allow access to Photos?" → Tap **"Allow Access to All Photos"**
5. **Choose photo:**
   - "Take Photo/Video" = Open camera
   - "Photo Library" = Choose existing photo
6. **Wait for upload:**
   - You'll see "Preparing... Creating thumbnail... Uploading..."
   - Photo appears with orange ⏱ badge (pending sync)
7. **Repeat** for more photos (optional)
8. **Click "Export & Save":**
   - Scroll to bottom of inspection
   - Tap the big green **"Export & Save"** button
   - Wait for "Syncing..." → "Success!"
9. **Verify:**
   - Photos now have green ☁ badge (synced to cloud)
   - PDF downloads with photos included

## Troubleshooting Checklist

If photo upload isn't working, check:

- [ ] Granted camera/photos permission (see Problem 4)
- [ ] Have internet connection (photos save locally if offline)
- [ ] Have storage space on iPhone (see Problem 3)
- [ ] Clicked "Export & Save" button (photos don't auto-sync)
- [ ] Waited for sync to complete (don't close app during sync)
- [ ] Photo size is under 10MB (compress large photos)
- [ ] Using Safari or installed to home screen (not Chrome/other browser)

## Advanced: How It Works Behind the Scenes

### Offline-First Architecture

1. **Compression** - Photos compressed to ~300KB before upload
2. **Thumbnails** - 200px preview generated instantly
3. **IndexedDB** - Photos stored locally in browser database
4. **Background Sync** - Attempts upload every 30 seconds when online
5. **Manual Trigger** - "Export & Save" forces immediate sync
6. **Firebase Storage** - Cloud backup when sync completes

### Why This Design?

- **Works Offline** - Save photos even without internet
- **Fast Response** - See photos immediately (don't wait for upload)
- **Batch Upload** - Upload all photos at once (more efficient)
- **No Data Loss** - Photos saved locally until cloud sync confirms

## Still Having Issues?

### Try This Quick Fix

1. **Close Safari completely** (swipe up from app switcher and close Safari)
2. **Wait 10 seconds**
3. **Reopen the app** (from home screen or Safari)
4. **Try uploading one small photo** (test if permissions work)
5. **Click "Export & Save"** (test if cloud sync works)

### If That Doesn't Work

**Full Reset (last resort):**

1. Delete app from home screen
2. Settings → Safari → Clear History and Website Data
3. Restart iPhone
4. Reinstall app from Safari
5. Log in again
6. Grant all permissions
7. Try uploading

### Contact Support

If photos still won't upload after trying everything:
- Note the exact error message you see
- Check console logs (Safari → Develop → iPhone → Console)
- Take screenshot of the error
- Report to developer with details

## Quick Reference Card

```
📷 Tap "Media"       → Photo saves to phone
⏱ Orange badge      → Pending cloud sync  
📄 "Export & Save"   → Upload to cloud + PDF
☁ Green badge       → Synced to cloud
```

**Remember:** Photos save locally first, then sync to cloud when you click "Export & Save"!
