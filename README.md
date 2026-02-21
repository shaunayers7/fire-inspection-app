# Fire Inspection App

> **Progressive Web App (PWA)** for field fire inspections  
> **iOS-optimized** with offline-first architecture  
> **Production-ready template** for building similar apps

## 🚀 Quick Start

### For Users
1. **Access:** Visit the deployed URL on your iPhone/iPad
2. **Install:** Tap Share → Add to Home Screen
3. **Use:** Open from home screen, works offline
4. **Guide:** See [IOS-PHOTO-UPLOAD-GUIDE.md](IOS-PHOTO-UPLOAD-GUIDE.md) for photo upload help

### For Developers
```bash
# Clone repository
git clone https://github.com/shaunayers7/fire-inspection-app.git
cd fire-inspection-app

# Open in browser
# index.html is a single-file React app - just open it!

# Or run local server
python -m http.server 8000
# Visit http://localhost:8000
```

**First-time setup?** See [QUICK-START.md](QUICK-START.md)

---

## 📚 Documentation

**🎯 Start here for development:**
- **[docs/COPILOT-INSTRUCTIONS.md](docs/COPILOT-INSTRUCTIONS.md)** - AI context & mandatory patterns
- **[docs/PRD.md](docs/PRD.md)** - Product requirements (Section 7 = iOS Best Practices)
- **[docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md)** - Step-by-step processes
- **[docs/PROMPT-TEMPLATES.md](docs/PROMPT-TEMPLATES.md)** - Copy-paste AI prompts

**📖 Full documentation index:** [docs/README.md](docs/README.md)

---

## ✨ Key Features

### Mobile-First PWA
- **Installable** - Works like native app on iPhone/iPad
- **Offline-first** - Saves locally, syncs when online
- **Fast & responsive** - Single-file architecture, instant load
- **iOS-optimized** - Survives app termination, handles permissions

### Photo & Media
- **Multiple photos per item** - Unlimited photos with thumbnails
- **Compression** - Automatic image optimization (2.7MB → 300KB)
- **Offline storage** - IndexedDB for media, works without internet
- **Cloud sync** - Upload to Firebase Storage on demand
- **Video support** - Works with both photos and videos

### Data Management
- **Local-first** - Immediate save to device (iOS-safe)
- **Cloud backup** - Firebase Firestore for multi-user sync
- **Conflict resolution** - Field-level conflict detection
- **Protected data** - Critical buildings auto-restored
- **Export** - PDF generation with jsPDF

### Multi-User Collaboration
- **Firebase Authentication** - Email/password login
- **Real-time sync** - Changes sync across devices
- **Conflict handling** - User chooses resolution per field
- **Admin controls** - User management and permissions
- **Audit trail** - All changes logged with user & timestamp

---

## 🏗️ Architecture

### Single-File React App
```
index.html (6500+ lines)
├─ React 18 (CDN)
├─ Babel (in-browser JSX)
├─ Tailwind CSS (CDN)
├─ Firebase SDK (Auth, Firestore, Storage)
├─ jsPDF (Export) 
└─ Service Worker (Offline cache)
```

### Data Flow
```
User Action
    ↓
Calculate Updated Data (sync)
    ↓
immediatelySaveToLocalStorage() ← iOS safety
    ↓
React setState() (async)
    ↓
useEffect → Also saves to localStorage
    ↓
(Optional) Cloud sync on "Export & Save"
```

### Storage Strategy
- **localStorage** - Main data (5-10MB, synchronous)
- **IndexedDB** - Photos/videos (50MB+, asynchronous)
- **Firebase Firestore** - Cloud backup (unlimited)
- **Firebase Storage** - Photo/video cloud storage

---

## 🎯 Use as App Template

This app is designed to be a **reusable template** for building similar PWAs.

### To Create New App
1. **Read template docs:**
   - [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md) → "Building from Template"
   - [docs/PRD.md](docs/PRD.md) → Section 7 (iOS Best Practices)

2. **Copy essential patterns:**
   ```javascript
   // iOS-safe save helper (MUST HAVE)
   const immediatelySaveToLocalStorage = (data) => { ... }
   
   // Media handling (if app uses photos)
   const savePendingUpload = async (id, file, thumbnail) => { ... }
   
   // Offline architecture
   Service Worker + localStorage + IndexedDB
   ```

3. **Customize for your app:**
   - Change data structure
   - Update field names
   - Modify UI/UX
   - **Keep iOS-safe patterns intact**

4. **Test thoroughly:**
   - Desktop browser ✅
   - iPhone/iPad ✅
   - Kill test (close app immediately) ✅ × 3
   - Offline mode ✅

### Proven Patterns Included
✅ **Immediate save pattern** - Survives iOS app termination  
✅ **IndexedDB media handling** - Photos/videos persist  
✅ **Offline-first architecture** - Works without internet  
✅ **Multi-user sync** - Conflict resolution at field level  
✅ **Error handling** - Storage quota, network errors  
✅ **Data migration** - Backwards compatibility  

**All trial-and-error eliminated** - Use what works!

---

## 🧪 Testing

### Desktop Test
```bash
# Open index.html in Chrome
# Test all features
# Check console for errors
```

### iPhone Test (Required for Production)
```bash
# Deploy to web server
# Access on iPhone Safari
# Install as PWA (Add to Home Screen)
# Test photo upload
# Test offline mode
# Test kill test (swipe up immediately after action)
```

### iOS Kill Test Protocol
```
1. Add photo → Kill app (swipe up) → Reopen → Photo still there ✅
2. Change checkbox → Kill app → Reopen → State preserved ✅  
3. Edit text → Kill app → Reopen → Text saved ✅
Repeat 3 times each for confidence
```

---

## 📦 Deployment

### GitHub Pages (Simple)
```bash
# Push to GitHub
git add .
git commit -m "Deploy"
git push origin main

# Enable GitHub Pages
# Settings → Pages → Source: main branch → Save
# URL: https://username.github.io/fire-inspection-app/
```

### Firebase Hosting (Recommended)
```bash
# See FIREBASE-SETUP.md for complete guide
firebase deploy --only hosting
```

---

## 🔧 Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Authentication, Firestore, Storage
3. Update Firebase config in index.html (lines ~69-96)
4. Deploy

See [FIREBASE-SETUP.md](FIREBASE-SETUP.md) for details

### App Customization
- **Storage key:** Change `'fire_inspection_v4_data'` to `'your_app_v1_data'`
- **App name:** Update in manifest.json, index.html
- **Colors:** Tailwind classes throughout
- **Data structure:** Modify while keeping iOS-safe patterns

---

## 📊 Tech Stack

| Technology | Purpose | Why |
|-----------|---------|-----|
| React 18 | UI framework | Reactive updates, component model |
| Tailwind CSS | Styling | Fast development, mobile-first |
| Firebase | Backend | Auth, Database, Storage, Hosting |
| IndexedDB | Media storage | Large file support, offline |
| localStorage | Data persistence | Fast, synchronous, iOS-safe |
| Service Worker | Offline mode | PWA caching |
| jsPDF | PDF export | Client-side report generation |

---

## 🤝 Contributing

### Before Making Changes
1. Read [docs/PRD.md](docs/PRD.md) Section 6A - Data Integrity Rules
2. Check [docs/TODO.md](docs/TODO.md) for planned features
3. Follow [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md)

### Mandatory
- ✅ Use immediate save pattern for all data changes
- ✅ Test iOS kill test (3 times minimum)
- ✅ Preserve backwards compatibility
- ✅ Update documentation if new pattern

---

## 📄 License

MIT License - Use freely for your projects

---

## 🆘 Support

- **Documentation:** [docs/README.md](docs/README.md)
- **Common Issues:** [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md) → "Bug Fixing"
- **iOS Photos:** [IOS-PHOTO-UPLOAD-GUIDE.md](IOS-PHOTO-UPLOAD-GUIDE.md)
- **Firebase:** [FIREBASE-SETUP.md](FIREBASE-SETUP.md)

---

**Status:** Production-ready | **Version:** 1.0 | **Template:** Ready for reuse  
**Last Updated:** February 2026

Manual: New deficiencies can be added at the bottom with photos and notes.

Completion: Each deficiency has a "Mark Fixed" checkbox. A building is only marked "Complete" when all inventory is checked and all deficiencies are marked as fixed.

Data Safety

Use the "Export" button to save a copy of the report to your device or Google Drive before clearing browser history, as clearing history will delete local data.
