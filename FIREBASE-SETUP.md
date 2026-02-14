# Firebase Setup Guide for Sync Feature

## Problem
Your sync feature isn't working because Firebase hasn't been configured yet. The app needs Firebase credentials to enable cloud synchronization between your iPad and computer.

## Solution: Set Up Firebase (Free)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "fire-inspection-app")
4. Disable Google Analytics (not needed) or keep it if you want
5. Click "Create project"

### Step 2: Register Your Web App

1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Give it a nickname (e.g., "Fire Inspection Web App")
3. **Do NOT** check "Set up Firebase Hosting" (we don't need it)
4. Click "Register app"

### Step 3: Copy Your Firebase Configuration

You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnop",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Copy these values!** You'll need them in the next step.

### Step 4: Enable Firestore Database

1. In the Firebase Console, go to **Firestore Database** (left sidebar)
2. Click "Create database"
3. Choose **"Start in test mode"** (allows read/write for 30 days)
4. Select a location (choose closest to you, e.g., `us-central` or `europe-west`)
5. Click "Enable"

### Step 5: Update Your index.html

1. Open `index.html` in your editor
2. Find the section that says `<!-- Firebase Configuration -->` (around line 20)
3. Replace the placeholder values with your actual Firebase config:

```html
<!-- Firebase Configuration -->
<script>
    window.__firebase_config = JSON.stringify({
        apiKey: "AIzaSyC1234567890abcdefghijklmnop",  // ← Replace with your actual values
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef1234567890"
    });
</script>
```

4. Save the file

### Step 6: Test the Sync

1. Open `index.html` in your browser (on your computer)
2. Open the browser's **Developer Console** (F12 or right-click > Inspect > Console)
3. Look for the message: `✅ Firebase connected successfully`
4. If you see this, sync is working! 🎉

### Step 7: Test Cross-Device Sync

1. **On your computer**: Make a change to a building inspection
2. Wait 5 seconds or click the "☁ Sync" button
3. **On your iPad**: Open the same URL in Safari
4. You should see the changes from your computer!

## Troubleshooting

### ⚠️ "Firebase not configured" in console
- You haven't added your Firebase config yet. Complete Step 5 above.

### ❌ "Firebase initialization failed"
- **Double-check your config values** - they must be exact (no typos!)
- Make sure you enabled Firestore Database (Step 4)
- Check that you're using the correct config (Web app config, not iOS/Android)

### 🔒 "Permission denied" error
- Your Firestore security rules are too strict
- Go to **Firestore Database > Rules** in Firebase Console
- While testing, use these rules (WARNING: allows anyone to read/write):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ TEST ONLY - See security notes below
    }
  }
}
```

- Click "Publish" to save the rules

### 🌐 Not syncing between devices
- Make sure both devices are using the **same URL**
- Check internet connection on both devices
- Try clicking the manual sync button (☁ Sync)
- Open browser console to see if there are any errors

## Security Notes

⚠️ **The test mode rules above allow ANYONE with your URL to read/write data.** This is fine for:
- Personal use
- Testing with a team
- If you don't share the URL publicly

For better security:
1. Keep your URL private
2. After testing, consider setting up Firebase Authentication
3. Update security rules to require authentication

## Costs

Firebase offers a **free tier** that should be more than enough:
- ✅ 50,000 reads/day (checking for updates)
- ✅ 20,000 writes/day (saving inspections)
- ✅ 1 GB storage (thousands of inspections)

You won't be charged unless you exceed these limits (very unlikely for fire inspections).

## What Happens Now?

Once Firebase is configured:
- ✅ Your data is **backed up to the cloud**
- ✅ Changes sync **automatically every 5 seconds**
- ✅ Multiple inspectors can work together
- ✅ Your iPad and computer will stay in sync
- ✅ You can still work **offline** (syncs when online)

## Need Help?

If you're stuck:
1. Check the browser console (F12) for error messages
2. Verify your Firebase config is correct
3. Make sure Firestore is enabled and has test mode rules
4. Try accessing the Firebase Console to verify your project exists

---

**Last Updated:** February 14, 2026
