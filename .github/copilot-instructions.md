# Fire Inspection App — Auto-loaded Copilot Instructions

This is a single-file React PWA (`index.html`). Firebase + Firestore backend. Primary target: iOS Safari.

---

## 🔒 LOCKED DECISIONS — DO NOT REVERT

| Area | Decision | Never do this |
|------|----------|---------------|
| `saveToCloudOnly()` | Syncs to cloud, shows ✓ status in header. **No navigation after save.** User uses ← back button themselves. | ❌ No `setView()` inside this function |
| Bottom action buttons | Two side-by-side buttons: **📄 Export PDF** (blue) + **☁️ Save** (green). Inline at bottom of scroll. Not sticky/fixed. Not combined. | ❌ Don't combine, don't make sticky |
| Real-time sync | Disabled intentionally. Manual sync only. | ❌ Don't re-enable `onSnapshot` listeners |
| `ConflictResolutionBody` | Standalone React component. Hooks must not be called inside `.map()`. | ❌ Don't inline `useState` inside `.map()` |
| Storage bar total | `5MB` — iOS Safari localStorage hard limit. `Math.min(..., 100)` prevents overflow/reset. | ❌ Don't change to 10MB or use `navigator.storage` for this |

> **When changing anything near a locked item:** read this table first. If the user asks to change a locked decision, update this table before touching the code.

---

## ⚠️ MANDATORY PATTERNS

### iOS Safety — Immediate Save
ALL data mutations must save to localStorage synchronously BEFORE calling `setYearData`:
```js
const updated = { ...yearData, [year]: newBuildings };
localStorage.setItem('fire_inspection_v4_data', JSON.stringify(updated)); // sync first
setYearData(updated); // then react state
```

### Protected Buildings
`Bellevue` and `Pincher Creek` (2026) must always exist. Never delete them during merges or syncs.

### Data Structure
Never rename or remove fields from building objects — breaks existing saved data. Add new fields with defaults only.

### React Hooks
Never call `useState` / `useEffect` inside `.map()`, loops, or conditionals. Must be at component top level.

---

## Key Architecture
- `yearData` shape: `{ [year]: Building[] }`  
- Cloud sync: Firestore collection `apps/${APP_ID}/buildings` — one doc per building  
- `lastSynced` on each building is the conflict detection timestamp  
- Photos stored as base64 thumbnails in `item.photos[]`, full files in IndexedDB with `_pendingSync: true`  
- `isUpdatingFromSync` ref prevents the `yearData` useEffect from marking cloud pulls as local changes  

---

## Full Docs
- [docs/COPILOT-INSTRUCTIONS.md](../docs/COPILOT-INSTRUCTIONS.md) — full patterns and workflow
- [docs/PRD.md](../docs/PRD.md) — iOS best practices (Section 7)
- [docs/TODO.md](../docs/TODO.md) — current priorities
