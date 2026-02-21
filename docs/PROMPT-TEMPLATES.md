# AI Prompt Templates

> **Copy-paste these prompts** for common development tasks. Optimized for AI assistants working with this app template.

## 🎯 GENERAL PURPOSE PROMPTS

### Start of Session
```
I'm working on the fire-inspection-app. This is an iOS PWA template with mandatory 
immediate-save patterns for data persistence. Please read:
- docs/COPILOT-INSTRUCTIONS.md
- docs/PRD.md Section 7 (iOS Best Practices)

Ready to implement [FEATURE NAME] following established patterns.
```

### Feature Request
```
Implement [FEATURE DESCRIPTION].

Requirements:
- Must use immediate-save pattern (PRD Section 7.3)
- Must survive iOS kill test
- Must handle offline mode
- Must preserve all existing data

Expected outcome: [DESCRIBE SUCCESS CRITERIA]
```

### Bug Report
```
Bug on [DEVICE TYPE]:
- Symptom: [WHAT USER SEES]
- Steps: [EXACT REPRODUCTION STEPS]
- Expected: [WHAT SHOULD HAPPEN]
- Actual: [WHAT ACTUALLY HAPPENS]
- Console: [ERROR MESSAGES IF ANY]

Suspected cause: [PATTERN VIOLATION/HYPOTHESIS]

Apply iOS-safe fix from PRD Section 7.
```

---

## 📝 DATA FIELD PROMPTS

### Add New Text Field
```
Add text input field "[FIELD NAME]" to [LOCATION].

Requirements:
- Apply immediate-save pattern (immediatelySaveToLocalStorage)
- Add to [inspectionDetails/details/data section]
- Default value: empty string
- Must persist through iOS app kill

Test: Add text → Kill app → Reopen → Text still there
```

### Add New Checkbox
```
Add checkbox "[FIELD NAME]" to [LOCATION].

Requirements:
- Tri-state or boolean: [SPECIFY]
- Apply immediate-save pattern
- Default: [unchecked/pending/etc]
- Visual feedback on state change
- iOS kill test must pass
```

### Add New Dropdown
```
Add dropdown "[FIELD NAME]" with options: [LIST OPTIONS].

Requirements:
- Apply immediate-save pattern
- Default: [SPECIFY]
- Store as: [string/number/etc]
- Must persist through app kill
```

---

## 📸 MEDIA PROMPTS

### Add Photo Upload
```
Add photo upload to [SECTION/ITEM].

Requirements:
- Use IndexedDB pattern (PRD Section 7.5)
- Create thumbnail immediately (instant feedback)
- Compress images (max 1200px, 85% quality)
- Save to IndexedDB + localStorage metadata
- Mark as pending sync (orange badge)
- Handle offline mode
- Restore blob URLs on app load
- iOS kill test: Upload → Kill → Reopen → Photo still there

Max file size: [SPECIFY]
```

### Add Video Support
```
Add video upload to [SECTION/ITEM].

Requirements:
- Use IndexedDB pattern
- Store blob URL temporarily
- Recreate blob URL on app load
- Max size: 30MB
- Mark as pending sync
- Upload to cloud on "Export & Save"
- iOS kill test must pass
```

### Add Multiple Photos
```
Convert from single photo to multiple photos array for [SECTION].

Requirements:
- Change from photo: '' to photos: []
- Migrate existing single-photo data (backwards compatibility)
- Horizontal scrolling gallery UI
- Individual delete buttons per photo
- Sync status badge per photo (green ☁ synced, orange ⏱ pending)
- iOS kill test: Add 3 photos → Kill → Reopen → All 3 still there
```

---

## 🎨 UI PROMPTS

### Add Modal/Dialog
```
Add [modal/dialog] for [PURPOSE].

Requirements:
- Use existing Modal component pattern
- Close on: [X button/tap outside/ESC key]
- Mobile-friendly (tap zones, scrolling)
- Accessibility (keyboard navigation)
- Optional: Background blur/overlay
```

### Add Full-Screen Viewer
```
Add full-screen viewer for [images/videos].

Requirements:
- Black background overlay
- Centered content
- Close button (top-right)
- Tap anywhere to close
- Support for: [image/video/both]
- iOS-safe scrolling and zoom
```

### Add Status Badge
```
Add status badge showing [INFORMATION].

Requirements:
- Colors: [green/orange/red/blue]
- Position: [specify]
- Update in real-time when [CONDITION]
- Visual feedback (pulse/fade/etc)
```

---

## ☁️ CLOUD SYNC PROMPTS

### Add Cloud Sync for Field
```
Enable cloud sync for [FIELD NAME].

Requirements:
- Track in fieldModifications object
- Include timestamp and user
- Conflict detection at field level
- User chooses resolution on conflict
- Sync on "Export & Save" click
- Offline queue if no connection
```

### Add Background Sync
```
Add background sync for [FEATURE].

Requirements:
- Check every 30 seconds
- Only when online
- Upload pending items
- Update sync status (green badge)
- Handle errors gracefully
- Don't block UI
```

---

## 🧪 TEST PROMPTS

### Request Kill Test
```
I need to verify [FEATURE] survives iOS app termination.

iOS Kill Test Protocol:
1. Describe exact steps to test
2. Expected result after app restart
3. Repeat 3 times to ensure consistency

Please confirm test steps before I proceed.
```

### Request Full Test Plan
```
What's the complete test plan for [FEATURE]?

Include:
- Desktop tests
- iPhone tests
- Kill tests
- Offline tests
- Edge cases
- Storage quota tests
```

---

## 🔧 MAINTENANCE PROMPTS

### Code Audit Request
```
Audit [SECTION/FUNCTION] for:
- iOS safety (immediate save pattern applied?)
- Data preservation (all mutations saved?)
- Error handling (quota exceeded, network errors?)
- Performance issues
- Unused code

Suggest improvements following PRD Section 7 patterns.
```

### Pattern Compliance Check
```
Verify [FEATURE/FILE] complies with mandatory patterns:

Check PRD Section 7:
- [ ] Immediate save pattern used for all data mutations
- [ ] Media uses IndexedDB pattern
- [ ] Blob URLs restored on app load
- [ ] Error handling with user feedback
- [ ] Backwards compatibility preserved

Report any violations and suggest fixes.
```

### Refactor for iOS Safety
```
Refactor [FUNCTION/SECTION] to be iOS-safe.

Current issues:
- [LIST PROBLEMS]

Apply patterns from PRD Section 7:
- Immediate save pattern
- Error handling
- User feedback
- iOS kill test validation
```

---

## 📦 TEMPLATE PROMPTS

### Start New App from Template
```
I'm starting a new app based on fire-inspection-app template.

App type: [DESCRIBE]
Data structure: [DESCRIBE FIELDS]
Key features: [LIST]

Please guide me through:
1. Copying essential patterns
2. Updating data structure
3. Customizing for my app
4. Testing checklist

Follow DEVELOPMENT-WORKFLOW.md → "BUILDING FROM TEMPLATE"
```

### Extract Pattern for Reuse
```
Extract [FEATURE] as a reusable pattern for future apps.

Requirements:
- Generalize from fire-inspection-specific code
- Document in PRD Section 7
- Include code template
- List test requirements
- Note iOS-specific considerations
```

---

## 🐛 DEBUGGING PROMPTS

### Data Loss Investigation
```
Users report data loss on [DEVICE].

Investigation needed:
- Review save pattern in [FUNCTION]
- Check for missing immediatelySaveToLocalStorage
- Verify localStorage not hitting quota
- Check for async race conditions
- Validate iOS kill test coverage

Provide iOS-safe fix following PRD Section 7.
```

### iOS-Specific Issue
```
Issue only occurs on iOS: [DESCRIBE]

iOS Context:
- Device: [iPhone/iPad + iOS version]
- PWA installed or Safari?
- Permissions granted?
- Storage available?

Check PRD Section 7 for iOS-specific solutions.
Apply appropriate pattern and verify with kill test.
```

### Performance Issue
```
Performance problem: [DESCRIBE]

Metrics:
- Load time: [SPECIFY]
- Action lag: [SPECIFY]
- Device: [SPECIFY]

Optimize while maintaining:
- iOS safety (all patterns intact)
- Data preservation
- Offline capability
```

---

## 📚 DOCUMENTATION PROMPTS

### Document New Pattern
```
We discovered a new iOS-safe pattern for [FEATURE].

Add to PRD Section 7:
- Problem it solves
- Solution implementation (with code)
- Why this pattern is necessary
- Test validation steps
- iOS-specific notes

Make it reusable for future apps.
```

### Update Workflow
```
Update DEVELOPMENT-WORKFLOW.md with new process for [TASK].

Include:
- Step-by-step instructions
- Code examples
- Test requirements
- Common pitfalls
- Quick decision tree if applicable
```

---

## 🎓 LEARNING PROMPTS

### Explain Pattern
```
Explain the [PATTERN NAME] pattern from PRD Section 7:
- Why is it necessary?
- What problem does it solve?
- When should it be used?
- What happens if skipped?
- Show code example
```

### Compare Approaches
```
Compare these approaches for [TASK]:

Option A: [DESCRIBE]
Option B: [DESCRIBE]

Which is more:
- iOS-safe
- Performant
- Maintainable
- Reusable for template

Recommend best approach with reasoning.
```

---

## ⚡ QUICK FIXES

### Fix Missing Immediate Save
```
Function [NAME] at line [X] is missing immediate save pattern.

Fix by:
1. Calculate updated data
2. Call immediatelySaveToLocalStorage(updatedData)
3. Then update React state
4. Verify iOS kill test passes
```

### Fix Blob URL Issue
```
Videos/photos not showing after app restart.

Fix:
1. Save file to IndexedDB when uploaded
2. Add restore function in useEffect
3. Recreate blob URLs from IndexedDB on load
4. Test: Upload → Kill app → Reopen → Media visible
```

---

## 🎯 SPECIALIZED PROMPTS

### Firebase Integration
```
Add Firebase [feature] integration.

Requirements:
- Follow FIREBASE-SETUP.md
- Local-first (save locally before cloud)
- Handle offline mode
- Sync on "Export & Save"
- Error handling with user feedback
```

### Offline Mode Enhancement
```
Improve offline experience for [FEATURE].

Requirements:
- Cache all necessary assets
- Queue actions for sync
- Show offline indicator
- Sync automatically when online
- Handle conflicts on reconnect
```

---

**💡 TIP:** Combine prompts for complex tasks. Example:

```
Implement photo gallery with multiple photos.

Use patterns:
- Multiple photos array (MEDIA PROMPTS)
- IndexedDB storage (PRD Section 7.5)
- Immediate save pattern (PRD Section 7.3)
- Full-screen viewer (UI PROMPTS)
- iOS kill test validation

Expected outcome: Gallery with 5 photos survives app kill test.
```

---

**Remember:** Always reference PRD Section 7 for mandatory patterns. Every prompt should result in iOS-safe, production-ready code.
