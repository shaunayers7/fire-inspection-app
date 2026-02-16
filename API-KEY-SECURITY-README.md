# API Key Security - README

## ℹ️ Important: Firebase Web API Keys Are Public By Design

Your Firebase Web API key (`AIzaSyBTKxOrANuORfE4H8AiHECc-Ty46Hqrk9g`) being visible in your code is **NORMAL and SAFE**.

### Why This is OK

From Firebase documentation:
> "Unlike how API keys are typically used, API keys for Firebase services are not used to control access to backend resources. They're just used to identify your Firebase project on the Google servers."

**What protects your Firebase data:**
- ✅ **Firestore Security Rules** ← THIS IS CRITICAL
- ✅ Firebase Authentication
- ✅ Domain restrictions (recommended)
- ❌ NOT hiding the API key

### Your Current Security Status

**✅ SAFE:**
- Firebase Web API key in client code

**❌ CRITICAL — NEEDS IMMEDIATE FIX:**
- Firestore Security Rules (see SECURITY-FIX-IMPLEMENTATION-GUIDE.md)
- Missing domain restrictions (see below)

### Recommended Security Setup

#### 1. Fix Firestore Security Rules (CRITICAL)
Follow: `SECURITY-FIX-IMPLEMENTATION-GUIDE.md` → Priority 1

Current rules likely allow anyone to read/write:
```javascript
allow read, write: if true;  // ⚠️ INSECURE!
```

Should be:
```javascript
allow read, write: if isAuthenticated() && isAllowedUser();
```

#### 2. Add Domain Restrictions (Recommended)

**Steps:**
1. Go to: https://console.firebase.google.com/
2. Select project: `fire-inspection-app-9c13f`
3. Project Settings → API restrictions
4. Add authorized domains:
   - `localhost` (for testing)
   - Your production domain
5. Click Save

**Why:** Prevents others from using your Firebase config on their websites

#### 3. Enable Firebase App Check (Optional - Advanced)

For additional protection against abuse:
1. Go to Firebase Console → App Check
2. Register your app
3. Add App Check SDK to your code

### What About GitHub?

**Q: Should I remove the API key from my public GitHub repo?**

**A:** Technically not required for Firebase Web API keys, but here are your options:

#### Option A: Leave it (Recommended for Firebase Web Apps)
- ✅ Standard practice for Firebase Web apps
- ✅ Easier to deploy and maintain
- ✅ Still secure if Firestore rules are correct
- ✅ Many popular open-source Firebase apps do this

#### Option B: Use Environment Variables (Extra obscurity)
- Slightly more complex setup
- Doesn't provide real security benefit for Firebase Web
- See "Environment Variable Setup" below if you prefer this

### Environment Variable Setup (Optional)

If you still want to hide the API key (even though it's not necessary):

#### 1. Create `.env` file:
```bash
# .env (DO NOT commit this file)
VITE_FIREBASE_API_KEY=AIzaSyBTKxOrANuORfE4H8AiHECc-Ty46Hqrk9g
VITE_FIREBASE_AUTH_DOMAIN=fire-inspection-app-9c13f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fire-inspection-app-9c13f
VITE_FIREBASE_STORAGE_BUCKET=fire-inspection-app-9c13f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=423281715493
VITE_FIREBASE_APP_ID=1:423281715493:web:f1e66ea9f9f9fb980b92cc
```

#### 2. Update `.gitignore`:
```
.env
.env.local
.env.*.local
```

#### 3. Modify `index.html`:
```javascript
// Instead of hard-coded config:
window.__firebase_config = JSON.stringify({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBTKxOrANuORfE4H8AiHECc-Ty46Hqrk9g",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fire-inspection-app-9c13f.firebaseapp.com",
    // ... etc
});
```

**Note:** This requires a build tool like Vite/Webpack. For a simple single HTML file app like yours, this adds unnecessary complexity.

### Real-World Examples

Many popular open-source Firebase apps have public API keys:
- Firebase official samples on GitHub
- TodoMVC Firebase examples
- React Native Firebase apps

**They're all secure because they use proper Firestore Security Rules.**

### Quick Security Checklist

- [ ] **Firestore Security Rules configured** ← MOST IMPORTANT
- [ ] Firebase Authentication enabled
- [ ] Domain restrictions added in Firebase Console
- [ ] Allowed emails whitelist configured
- [ ] Admin controls properly secured
- [ ] Regular security rules testing

### References

- [Firebase: API Keys in Web Apps](https://firebase.google.com/docs/projects/api-keys)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

### Summary

**Your API key being visible is NORMAL and SAFE for Firebase Web apps.**

**Focus on fixing:**
1. ✅ Firestore Security Rules (CRITICAL)
2. ✅ Domain restrictions (RECOMMENDED)
3. ❌ Don't worry about the visible API key

---

**Still concerned?** Read Firebase's official documentation on API keys: https://firebase.google.com/docs/projects/api-keys
