# Pincher Creek Data - Troubleshooting Guide

## ✅ Data IS in the App Code

The Pincher Creek building data is **fully embedded** in [index.html](../index.html) starting at line 443, including:

- ✅ Building details (address, panel info, etc.)
- ✅ Pre-job checklist (5 items)
- ✅ Control equipment (16 items)
- ✅ Device inventory (19 devices)
- ✅ Battery health (5 items)
- ✅ Emergency lights (8 items)
- ✅ Signal test (custom section)
- ✅ 3 deficiencies

This data **perfectly matches** `docs/2026 Pincher Creek.txt`.

---

## 🛡️ Protection Systems in Place

### 1. Initial Load Protection
When the app loads, it checks localStorage and:
- Verifies both Bellevue and Pincher Creek exist
- Auto-restores any missing building
- Logs: `🛡️ PROTECTION: Restoring missing building: [name]`

### 2. Cloud Sync Protection  
After downloading from Firebase, it:
- Checks if default buildings were deleted from cloud
- Logs error if missing: `🚨 ALERT: [name] missing after cloud sync!`
- Buildings will be restored on next page reload

### 3. Manual Recovery Tools
Open browser console (F12) and use:
```javascript
// Check what's stored
window.checkBuildings()

// Force restore defaults
window.forceRestoreBuildings()
```

---

## 🐛 Why You Might Not See It

### Scenario 1: Old LocalStorage
**Problem:** Your browser has old data without Pincher Creek  
**Solution:** 
```javascript
window.forceRestoreBuildings()
```

### Scenario 2: Bad Cloud Data
**Problem:** Someone deleted Pincher Creek and synced to Firebase  
**Solution:**
1. Clear localStorage: `window.forceRestoreBuildings()`
2. This will restore locally
3. Next edit will sync correct data back to cloud

### Scenario 3: Cache Issue
**Problem:** Browser cached old version of index.html  
**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or: `Ctrl+F5` (Windows)

---

## 🔍 How to Verify It's Working

### Step 1: Check Console on Load
When you open the app, look for:
```
✅ Data loaded. Buildings in 2026: ["Bellevue", "Pincher Creek"]
```

### Step 2: Check Buildings Screen
Navigate to: Year Select → 2026  
You should see TWO buildings:
- Bellevue
- Pincher Creek

### Step 3: Check Browser Storage
Open DevTools → Application → Local Storage → Check `fire_inspection_v4_data`

---

## 🚨 If Still Missing

If you've tried everything and Pincher Creek is still missing:

1. **Take a screenshot** of the console logs
2. **Run this in console:**
   ```javascript
   window.checkBuildings()
   ```
3. **Check Firebase Console** - Is it there?
4. **Try incognito mode** - Does it work there?

If incognito works, it's a cache/localStorage issue on your main browser.

---

## 📱 iOS-Specific Issues

If missing only on iPhone/iPad:

1. **Clear Safari cache:**
   - Settings → Safari → Clear History and Website Data

2. **Force reload:**
   - Close tab completely
   - Reopen app URL

3. **Check if Private Browsing:**
   - Private mode has separate storage
   - Try regular mode

---

## ✅ Expected Console Output

When app loads successfully, you should see:
```
🆕 No saved data found. Creating fresh data with default buildings.
(or)
✅ Data loaded. Buildings in 2026: ["Bellevue", "Pincher Creek"]

🛠️ Developer Tools Available:
  • window.checkBuildings() - See what buildings are stored
  • window.forceRestoreBuildings() - Reset to default buildings
```

When cloud syncs:
```
☁️ Cloud sync complete. Buildings in 2026: ["Bellevue", "Pincher Creek"]
```

---

## 🎯 Quick Fix (Try This First!)

```javascript
// Open console (F12), paste this, hit Enter:
window.forceRestoreBuildings()
```

This clears everything and reloads with fresh default data.

---

*Last Updated: February 14, 2026*  
*File: docs/PINCHER-CREEK-TROUBLESHOOTING.md*
