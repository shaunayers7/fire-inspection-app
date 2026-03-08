# New PWA Project — Setup Instructions for AI Agent

> Copy and paste this entire file into your new project as `docs/COPILOT-INSTRUCTIONS.md`
> Replace all `[APP_NAME]` and `[APP_DESCRIPTION]` placeholders before starting.

---

## 🎯 PROJECT IDENTITY

- **App Name:** [APP_NAME] (e.g. HikVision Camera Manager)
- **App Type:** Progressive Web App (PWA)
- **Primary Target:** iOS Safari (installed to home screen)
- **Secondary Target:** Android Chrome
- **Architecture:** Single-file React app (`index.html`) with embedded Babel + Tailwind CDN
- **Backend:** Firebase Firestore + Firebase Auth
- **Critical Constraint:** Must survive instant iOS app kill (swipe-up termination)

---

## 📁 REQUIRED FILE/FOLDER STRUCTURE

Create these before writing any code:

```
/
├── index.html              ← ENTIRE app lives here (React + styles + logic)
├── manifest.json           ← PWA installability
├── service-worker.js       ← Offline caching
├── package.json            ← Dev dependencies only (no bundler needed)
├── docs/
│   ├── COPILOT-INSTRUCTIONS.md   ← This file (AI rules + patterns)
│   ├── PRD.md                    ← Product requirements
│   ├── TODO.md                   ← Feature roadmap / task tracking
│   └── archive/                  ← Old docs moved here, not deleted
├── tests/
│   └── smoke.spec.js             ← Basic E2E smoke tests (Playwright)
└── .github/
    └── copilot-instructions.md   ← Short version of rules for Copilot auto-load
```

---

## 🔒 LOCKED DECISIONS — FILL IN BEFORE STARTING

| Area | Decision | Never do this |
|------|----------|---------------|
| Data save pattern | Save to localStorage FIRST, then `setState` | ❌ Never setState before localStorage |
| Navigation after save | User controls with ← back button. No auto-navigate. | ❌ No `setView()` inside save functions |
| Notifications | In-app status messages (toast / header ✓). No `alert()`. | ❌ No `alert()`, `confirm()`, `prompt()` |
| Real-time sync | Disabled. Manual sync only. | ❌ No `onSnapshot` listeners |
| Storage bar total | `5MB` — iOS Safari hard limit | ❌ Don't use `navigator.storage` for quota |
| Sticky UI | Non-sticky by default. Inline buttons only. | ❌ Don't make action buttons `position: fixed` |

---

## ⚠️ MANDATORY PATTERNS — NEVER SKIP

### 1. iOS Safety Save (ALL data mutations)

```javascript
// CORRECT — always in this order:
const updated = { ...currentData, field: newValue };
localStorage.setItem('APP_KEY', JSON.stringify(updated)); // sync FIRST
setAppData(updated);                                        // state SECOND

// WRONG — state first is NOT safe on iOS:
setAppData(updated);
localStorage.setItem(...);
```

### 2. Media / File Handling (Local-First)

```javascript
// Files → IndexedDB immediately (5 second max budget)
await saveToIndexedDB(itemId, file, thumbnail);

// Metadata → localStorage with pending flag
photos: [{
  id, thumbnail, mediaType,
  _pendingSync: true,
  _syncedToCloud: false
}]

// Push to cloud only on explicit user Save action
// Clear _pendingSync flag after successful upload
```

### 3. React Hooks Rules

- NEVER call `useState` / `useEffect` inside `.map()`, loops, or conditionals
- Extract any component that needs hooks into its own named function
- Hooks ONLY at the top level of a component

### 4. Data Structure Preservation

- NEVER rename or remove existing fields (breaks saved data)
- ADD new fields with safe defaults only
- Migrate old data on load when schema changes

---

## 🏗️ INDEX.HTML SKELETON — COPY THIS PATTERN

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <title>[APP_NAME]</title>
  <link rel="manifest" href="/manifest.json">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- React + Babel CDN (no bundler needed) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Firebase SDKs -->
  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js';
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js';
    import { getAuth } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js';
    window.FirebaseSDK = { initializeApp, getFirestore, getAuth, /* ... other imports */ };
  </script>
</head>
<body>
  <div id="root"></div>
  <!-- Pre-React loading screen (removed on first React render) -->
  <div id="pre-react-loader" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;">
    Loading...
  </div>

  <script type="text/babel">
    const APP_VERSION = '1.0.0';
    const STORAGE_KEY = '[APP_NAME]_v1_data';
    const APP_ID = '[FIREBASE_APP_ID]';

    const App = () => {
      // --- STATE ---
      const [data, setData] = React.useState(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
      });
      const [view, setView] = React.useState('home');
      const [user, setUser] = React.useState(null);
      const [db, setDb] = React.useState(null);
      const [syncStatus, setSyncStatus] = React.useState('idle'); // idle | syncing | success | error
      const isUpdatingFromSync = React.useRef(false);

      // --- AUTO SAVE (every data change) ---
      React.useEffect(() => {
        if (isUpdatingFromSync.current) { isUpdatingFromSync.current = false; return; }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) { console.error('Save failed', e); }
      }, [data]);

      // Remove pre-loader after first render
      React.useEffect(() => {
        document.getElementById('pre-react-loader')?.remove();
      }, []);

      return <div>{/* Your app UI here */}</div>;
    };

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

---

## ✅ FEATURES CHECKLIST — IMPLEMENT IN ORDER

### Phase 0 — Foundation (do first, everything depends on this)
- [ ] `index.html` skeleton with React + Tailwind + Firebase CDN links
- [ ] `manifest.json` for PWA installability (name, icons, `display: standalone`)
- [ ] `service-worker.js` registered in index.html for offline support
- [ ] Firebase project created, Auth and Firestore enabled
- [ ] Firebase config embedded in index.html (use env vars / Firestore rules, never expose admin key)
- [ ] localStorage save/load on startup
- [ ] Pre-React loading screen (prevents white flash)
- [ ] Mobile viewport meta tag (`maximum-scale=1.0, user-scalable=no`)

### Phase 1 — Auth
- [ ] Email/password login screen
- [ ] Sign up with allowed-email whitelist (stored in Firestore `allowedEmails` collection)
- [ ] Admin role check (separate `adminEmails` collection)
- [ ] "Forgot password" email reset
- [ ] 12-second Firebase init timeout failsafe (prevent permanent white screen)
- [ ] 30-second data load timeout failsafe

### Phase 2 — Core App Screen
- [ ] Main list view with search + sort
- [ ] Detail / edit view
- [ ] ← Back button navigation (user-controlled, no auto-navigate after save)
- [ ] Dark/Light mode toggle (saved to localStorage, key: `[APP_NAME]_theme`)
- [ ] App version number displayed in header/settings

### Phase 3 — Data Persistence
- [ ] All mutations use iOS Safety Save pattern (localStorage THEN setState)
- [ ] IndexedDB helper for binary files (photos/videos)
- [ ] Storage usage bar (used/5MB, `Math.min(pct, 100)` prevents overflow)
- [ ] Export data as JSON (backup)

### Phase 4 — Cloud Sync
- [ ] Manual sync only (no real-time `onSnapshot`)
- [ ] Bidirectional sync: pull cloud → detect conflicts → push local
- [ ] Field-level conflict detection with resolution UI
- [ ] `lastSynced` timestamp on each record
- [ ] `fieldModifications` map tracking what changed and when
- [ ] `isUpdatingFromSync` ref to prevent sync loop in `useEffect`
- [ ] 30-second sync timeout (prevents "Saving..." sticking forever)
- [ ] `hasUnsavedCloudChanges` flag shown in header

### Phase 5 — Media (if needed)
- [ ] Photo capture / upload (iOS-safe: always use `<input type="file" accept="image/*" capture="environment">`)
- [ ] Thumbnail generation (base64, stored in localStorage record)
- [ ] Full file stored in IndexedDB with `_pendingSync: true`
- [ ] Background upload to Firebase Storage on explicit Save
- [ ] Restore pending blob URLs on app reload (iOS kills URLs on suspend)

### Phase 6 — UX Polish
- [ ] In-app toast / status messages (no `alert()`)
- [ ] Pull-to-refresh (iOS-style: content moves, spinner at top)
- [ ] Lazy loading for long lists (show 20, load more on scroll/button)
- [ ] Completion celebration (confetti + sound) when all items done
- [ ] Share app section with iOS / Android install instructions
- [ ] Settings screen (change password, manage allowed users, admin panel)

### Phase 7 — Testing
- [ ] Playwright smoke test: login → main screen renders
- [ ] Smoke test: create item → appears in list
- [ ] Smoke test: refresh page → data still there (localStorage persistence)

---

## 🔑 FIREBASE SECURITY RULES TEMPLATE

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Auth required for all reads/writes
    match /apps/{appId}/{document=**} {
      allow read, write: if request.auth != null
        && exists(/databases/$(database)/documents/allowedEmails/$(request.auth.token.email));
    }
    // Whitelist readable by any logged-in user
    match /allowedEmails/{email} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && exists(/databases/$(database)/documents/adminEmails/$(request.auth.token.email));
    }
    // Admin list readable by any logged-in user
    match /adminEmails/{email} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && exists(/databases/$(database)/documents/adminEmails/$(request.auth.token.email));
    }
  }
}
```

---

## ❓ ALWAYS ASK BEFORE ASSUMING (Agent Rules)

- When an API behaves differently on iOS Safari vs desktop
- When there are two valid implementations with different UX tradeoffs
- When a change affects navigation, data persistence, or notifications
- When adding any feature that uses device hardware (camera, GPS, microphone)

**Never silently assume and implement platform-specific behavior.**

---

## 📖 READING ORDER FOR NEW SESSIONS

1. This file (`COPILOT-INSTRUCTIONS.md`) — rules and patterns
2. `PRD.md` — what the app does and why
3. `TODO.md` — current priorities

---

## 🚫 ANTI-PATTERNS — NEVER DO THESE

| Don't | Why |
|-------|-----|
| `alert()` / `confirm()` / `prompt()` | Blocked in iOS PWA standalone mode |
| `setState` before `localStorage.setItem` | iOS can kill app before setState flushes |
| `onSnapshot` real-time listeners | Causes sync loops and battery drain |
| `useState` inside `.map()` | Breaks React hooks rules, causes crashes |
| Storing full-size images in localStorage | 5MB limit, will throw QuotaExceeded |
| `navigator.storage.estimate()` for quota bar | Returns OS quota, not iOS 5MB limit |
| Auto-navigate after save | Removes user control, causes UX issues |
| Fixed/sticky action buttons | Covered by iOS keyboard, poor UX |
| Combining Save + Export into one button | Hides functionality, harder to test |
