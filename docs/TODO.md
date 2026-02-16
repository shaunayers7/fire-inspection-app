# Fire App Roadmap 🚀

## Recently Completed ✅
- [x] Remove import/batch import/clear all buildings functionality
- [x] Add N/A status (4-state toggle: pending → passed → failed → n/a)
- [x] Implement building copy feature between years
- [x] N/A status preservation during building copy
- [x] Comprehensive code audit
- [x] Remove parseImportText dead code (199 line reduction)

## Manual Cleanup Required 🧹
**Action needed:** Delete the following 4 unused utility files from project root:
- `populate-2025-buildings.html` (460 lines)
- `populate-pincher-creek.html` (143 lines)  
- `generate-2025-import.js` (284 lines)
- `test-import-parser.html` (426 lines)

These files were used for the now-removed import feature. Deleting them will reduce codebase by 1,313 lines.

## Phase 1: Data Import
- [x] Create docs folder
- [x] Convert Bellevue PDF to Text
- [x] Import Bellevue data into app logic
- [x] Import Pincher Creek data into app logic
- [x] Add cloud sync for multi-user collaboration
- [x] Fix iOS scrolling issues 

## Phase 2: Code Quality
- [x] Check for code bloat 
- [x] Check for any rogue dependencies
- [x] Remove unused import functionality
- [x] Comprehensive security and performance audit

## Phase 3: Feature Enhancements
- [x] 1. Be able to copy any building with keeping the building details, Pre-job checklists, any added devices and notes for locations. Added devices get copied to new check sheet but checks get reset for new inspection. All headings and subheadings stay the same, battery health and titles are the same but with blank input field to add new value.
- [ ] 2. Add a section to add a name of who is doing the inspection from Electric Boyes
- [ ] 3. Add further descriptions to all sections if pressed on an information icon so that it explains further what the category or heading means, and these are also editable and saved, also will copy to the next years building
- [x] 4. Make sure the firebase is working correctly
- [ ] 5. Light/Dark Mode with a single toggle icon
- [ ] 6. Display the app version number on the app

## Phase 4: Progressive Web App (Planned)
- [ ] Add service worker for offline support
- [ ] Implement app manifest for installability
- [ ] Add cache-first strategy for static assets
- [ ] Background sync for offline data changes

## Phase 5: Performance Optimization (Planned)
- [ ] Implement lazy loading for large building lists
- [ ] Virtualize long lists for better scroll performance
- [ ] Defer PDF generation until needed

## Phase 6: Testing Infrastructure (Planned)
- [ ] Set up E2E testing framework (Playwright/Cypress)
- [ ] Add basic smoke tests for critical flows
- [ ] Implement CI/CD pipeline for automated testing

## Current Status 📊
- **Lines of Code:** ~2,400 (after cleanup)
- **File Size:** ~156KB (down from 164KB)
- **Code Grade:** A- (per comprehensive audit)
- **Dependencies:** All validated, zero bloat
- **Performance:** Excellent (smart sync, local-first)
- **Security:** Firebase rules enforced, auth working correctly

## Phase 7: Testing Infrastructure (Planned)
- [ ] make sure that the app doesn't zoom or go beyond the bounds of the mobile screen
- [ ] Add device counts on the main building cards that indicate how many devices are completed out of the total devices
- [ ] 