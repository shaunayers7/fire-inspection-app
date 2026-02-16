# Draft Auto-Save Feature Documentation

## Overview
Implemented an automatic draft-saving system that prevents data loss when users get interrupted while editing inspection items.

## Problem Solved
Previously, if you were editing an inspection item and got interrupted (phone call, closed browser, app crash), all your changes would be lost because they were only stored in temporary component state (`localDraft`) until you clicked "Save".

## Solution
The app now automatically saves drafts to localStorage as you type, allowing your work to be preserved and restored even if you:
- Close the browser/tab
- Get a phone call and switch apps
- Experience a phone shutdown or battery death
- Navigate away from the page before clicking "Save"

## How It Works

### 1. Auto-Save (500ms debounce)
When you're editing an item, changes are automatically saved to localStorage every 500ms of inactivity. This prevents excessive writes while you're actively typing.

```javascript
// Saved to: 'fire_inspection_drafts' in localStorage
{
  "item-id-123": {
    "label": "Updated label",
    "note": "Work in progress notes",
    // ... other fields
  }
}
```

### 2. Draft Restoration
When you return to an item that has a saved draft, it's automatically restored:
- Draft is loaded when the component mounts
- A visual indicator shows "💾 Draft saved"
- You can continue editing or save the changes

### 3. Draft Cleanup
Drafts are automatically cleaned up when:
- You click "Save" (draft is removed)
- You click "Cancel" and confirm (draft is removed)
- Corrupted draft data is detected (entire draft store is cleared)

## Visual Indicators

When editing with an unsaved draft:
- Input field has blue highlight background
- "💾 Draft saved" indicator appears next to Save/Cancel buttons
- Console shows: `📝 Restoring draft for item: [item name]`
- Console shows: `💾 Auto-saved draft for: [item name]`

## Technical Implementation

### Components Modified

#### 1. Constants (Line 307)
```javascript
const DRAFT_KEY = 'fire_inspection_drafts';
```

#### 2. InspectionRow Component (Lines 556-584)
Added:
- Draft restoration on mount (useEffect)
- Auto-save with debouncing (useEffect)
- Draft cleanup on save/cancel
- Visual indicator for saved drafts

#### 3. App Initialization (Lines 1168-1186)
Added draft monitoring at startup to show how many drafts were preserved from previous sessions.

### localStorage Keys Used
- `fire_inspection_v4_data` - Main application data
- `fire_inspection_drafts` - Temporary draft storage

## User Benefits

✅ **No Lost Work**: Get interrupted without losing your edits  
✅ **Seamless Recovery**: Drafts automatically restore when you return  
✅ **Multi-Device Safety**: Drafts persist across app restarts  
✅ **Clear Feedback**: Visual indicators show when drafts are saved  
✅ **Smart Cleanup**: Drafts are removed once you complete or cancel edits

## Testing Instructions

1. Open an inspection form
2. Click on an item to edit it
3. Make some changes to the label or add a note
4. **WITHOUT clicking Save**, close the browser tab
5. Reopen the app and navigate back to that item
6. Click on the item to edit - your changes should be restored!
7. You'll see "💾 Draft saved" indicator
8. Click "Save" to commit the changes or "Cancel" to discard

## Future Enhancements

Potential improvements:
- Timestamp drafts and auto-delete after 7 days
- Show a "restore draft" prompt before auto-restoring
- List all pending drafts in settings
- Sync drafts across devices (via Firebase)
- Show draft count badge on building list

---

*Implemented: February 16, 2026*  
*Version: 2.5.1*
