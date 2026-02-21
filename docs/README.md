# 📚 Documentation Guide

> **Complete documentation system for the Fire Inspection App template**

## 🚀 Quick Start

**For AI Assistants (every session):**
1. Read [COPILOT-INSTRUCTIONS.md](COPILOT-INSTRUCTIONS.md) - Full context & mandatory patterns
2. Review [PRD.md](PRD.md) Section 7 - iOS Best Practices
3. Check [TODO.md](TODO.md) - Current priorities  
4. Use [PROMPT-TEMPLATES.md](PROMPT-TEMPLATES.md) - Copy-paste prompts

**For Human Developers:**
1. Read [PRD.md](PRD.md) - Understand requirements
2. Follow [DEVELOPMENT-WORKFLOW.md](DEVELOPMENT-WORKFLOW.md) - Step-by-step processes
3. Reference [COPILOT-INSTRUCTIONS.md](COPILOT-INSTRUCTIONS.md) - Patterns & rules

---

## 📁 Documentation Structure

### 🎯 Core Documents (Read These First)

#### [COPILOT-INSTRUCTIONS.md](COPILOT-INSTRUCTIONS.md)
**For:** AI assistants & developers  
**Purpose:** Complete project context, mandatory patterns, persona  
**Contains:**
- Immediate save pattern (iOS safety)
- Media handling (IndexedDB)
- Data structure preservation rules
- Testing protocols
- Quick reference code

**Read when:** Starting any session, implementing features, fixing bugs

---

#### [PRD.md](PRD.md) - Product Requirements Document
**For:** Everyone  
**Purpose:** Source of truth for app logic and structure  
**Key Sections:**
- **Section 1-6:** Layout, structure, features, data persistence
- **Section 7:** iOS Best Practices & App Template Standards ⭐ **CRITICAL**
- **Section 8:** Cloud Sync
- **Section 9:** Project Management
- **Section 10:** Feature Authorization Policy

**Read when:** Understanding requirements, checking constraints, learning patterns

---

#### [DEVELOPMENT-WORKFLOW.md](DEVELOPMENT-WORKFLOW.md)
**For:** Developers & AI  
**Purpose:** Step-by-step processes for common tasks  
**Contains:**
- Session start checklist
- Feature implementation workflow
- Bug fixing workflow
- Photo/video feature process
- Data structure change protocol
- Testing protocols (Desktop, iPhone, Kill test)
- Building from template guide

**Read when:** Starting work, adding features, fixing bugs, creating new apps

---

#### [PROMPT-TEMPLATES.md](PROMPT-TEMPLATES.md)
**For:** AI users  
**Purpose:** Copy-paste prompts for fast development  
**Contains:**
- General purpose prompts
- Data field prompts
- Media prompts
- UI prompts
- Cloud sync prompts
- Test prompts
- Debugging prompts
- Documentation prompts

**Use when:** You know what you want but need efficient prompt

---

### 📋 Project Management

#### [TODO.md](TODO.md)
**Current feature roadmap and task tracking**  
Check before starting work, update when tasks complete

---

### 🔧 Technical Documentation

#### [technical/SYNC-FEATURE.md](technical/SYNC-FEATURE.md)
**Cloud sync implementation details**  
Multi-user collaboration, conflict resolution, Firebase integration

#### [security/DATA-PROTECTION.md](security/DATA-PROTECTION.md)
**Data recovery and protection logic**  
Protected buildings, backup strategies, recovery procedures

#### [audits/CODE-AUDIT.md](audits/CODE-AUDIT.md)
**Dependency analysis and optimization**  
Bundle size, performance, bloat reduction

---

### 📸 Feature-Specific Guides

#### [PHOTO-UPLOAD-FIX.md](../PHOTO-UPLOAD-FIX.md)
Original photo upload system documentation

#### [IOS-PHOTO-UPLOAD-GUIDE.md](../IOS-PHOTO-UPLOAD-GUIDE.md)
iPhone-specific photo upload guide for users

#### [PHOTO-FIXES-README.md](../PHOTO-FIXES-README.md)
Critical photo system fixes and local-first architecture

#### [MULTIPLE-PHOTOS-FEATURE.md](../MULTIPLE-PHOTOS-FEATURE.md)
Array-based photo storage implementation

---

### ⚙️ Setup Guides

#### [FIREBASE-SETUP.md](../FIREBASE-SETUP.md)
Firebase configuration and deployment

#### [AUTH-SETUP.md](../AUTH-SETUP.md)
Authentication system setup

#### [QUICK-START.md](../QUICK-START.md)
Get app running locally

---

### 📊 Reference Data

#### [2026-buildings-data.json](2026-buildings-data.json)
Default building data for 2026

#### [2026-DATA-SUMMARY.md](2026-DATA-SUMMARY.md)
Summary of 2026 inspection data

---

## 🎯 Common Tasks → Required Reading

| Task | Read These Docs |
|------|----------------|
| **Starting a session** | COPILOT-INSTRUCTIONS.md, PRD.md Section 7 |
| **Adding a feature** | DEVELOPMENT-WORKFLOW.md "Adding a New Feature" |
| **Fixing a bug** | DEVELOPMENT-WORKFLOW.md "Bug Fixing Workflow" |
| **Photo/media feature** | DEVELOPMENT-WORKFLOW.md "Photo/Video Workflow", PRD.md Section 7.5 |
| **Data structure change** | PRD.md Section 6A, DEVELOPMENT-WORKFLOW.md "Data Structure Changes" |
| **Building new app** | DEVELOPMENT-WORKFLOW.md "Building from Template" |
| **Testing** | DEVELOPMENT-WORKFLOW.md "Testing Protocols" |
| **Cloud sync** | technical/SYNC-FEATURE.md, PRD.md Section 8 |
| **Need quick prompt** | PROMPT-TEMPLATES.md |

---

## 🔄 Workflow Decision Tree

```
Need to do something?
│
├─ Know exactly what? → Use PROMPT-TEMPLATES.md
│
├─ Need step-by-step? → Use DEVELOPMENT-WORKFLOW.md
│
├─ Need to understand pattern? → Use PRD.md Section 7
│
├─ Starting session? → Read COPILOT-INSTRUCTIONS.md
│
└─ Building new app? → Start with DEVELOPMENT-WORKFLOW.md "Building from Template"
```

---

## ⚡ Quick Reference

### Mandatory Patterns (NEVER skip)
1. **Immediate Save** - All data mutations → `immediatelySaveToLocalStorage()` → `setState()`
2. **Media Handling** - Photos/videos → IndexedDB + localStorage metadata
3. **Blob URL Restore** - Videos → Recreate blob URLs on app load
4. **iOS Kill Test** - Every data feature → Must survive instant app termination
5. **Error Handling** - Storage quota, network errors → User feedback

### Storage Keys (Immutable)
```javascript
'fire_inspection_v4_data'  // Main data - NEVER change
'fire_inspection_drafts'   // Drafts
'app_version_check'        // Version
'theme_preference'         // Theme
```

### Test Protocol
```
Desktop → iPhone → Kill Test (3x) → Pass
```

---

## 📦 For Template Users

**Building a new app from this template?**

1. **Read first:**
   - COPILOT-INSTRUCTIONS.md (understand patterns)
   - PRD.md Section 7 (iOS best practices)
   - DEVELOPMENT-WORKFLOW.md → "Building from Template"

2. **Copy these patterns:**
   - `immediatelySaveToLocalStorage()` helper
   - IndexedDB media handling
   - Offline-first architecture
   - iOS kill test protocol

3. **Customize:**
   - Data structure (keep pattern)
   - Storage key name
   - Field names
   - UI/UX
   
4. **DO NOT skip:**
   - iOS testing
   - Kill test validation
   - Error handling
   - Backwards compatibility

---

## 🆘 Get Help

**Can't find what you need?**

1. Search PRD.md for keywords
2. Check DEVELOPMENT-WORKFLOW.md for process
3. Look in PROMPT-TEMPLATES.md for similar task
4. Review COPILOT-INSTRUCTIONS.md for patterns
5. Check technical/ folder for feature-specific docs

**Still stuck?**  
Review "Lessons Learned" in COPILOT-INSTRUCTIONS.md for common pitfalls.

---

## 📝 Contributing to Documentation

**When you discover a new pattern or solution:**

1. Document in PRD.md Section 7 (if reusable pattern)
2. Add workflow to DEVELOPMENT-WORKFLOW.md (if process)
3. Add prompt to PROMPT-TEMPLATES.md (if AI-useful)
4. Update this README if new doc created

**Keep documentation:**
- ✅ Practical (code examples)
- ✅ Tested (iOS validated)
- ✅ Reusable (generalized)
- ✅ Concise (to the point)

---

**Last Updated:** February 2026  
**Template Version:** 1.0  
**Status:** Production-ready for future app templates
