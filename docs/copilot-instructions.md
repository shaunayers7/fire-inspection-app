# Fire Inspection App: Architect Lock Rules

## ALWAYS-ON CONTEXT
- We are building a Fire Inspection App using React, Tailwind CSS, and Firebase.
- **Always refer to `docs/PRD.md`** as the "Source of Truth" for app logic and structure.
- **Always check `docs/TODO.md`** before starting new features to follow the roadmap.

## CODING GUIDELINES
- **State Preservation:** Never overwrite the `yearData` or `localStorage` logic. Changes must merge data, not delete it.
- **Protected Buildings:** Bellevue and Pincher Creek (2026) must ALWAYS exist. Initialization logic auto-restores if missing.
- **System Style:** Use "System Gray" (#F2F2F7) and the Inter font.
- **The "N" Logic:** Section 1 is always 'Building Details'. Sections 2 through N are dynamic inspection categories.
- **iOS Touch:** All touch interactions must support iOS momentum scrolling (`-webkit-overflow-scrolling: touch`, `touch-action: pan-y`).

## CLOUD SYNC RULES
- Auto-sync: 5 seconds after last edit
- Conflict resolution: Newer timestamp wins
- Local-first: Data saves to localStorage immediately, then syncs to cloud
- See `docs/technical/SYNC-FEATURE.md` for complete sync documentation

## DATA ARCHITECTURE
- **Building Data:** Embedded in code as `default2026Buildings` array
- **Storage Key:** `fire_inspection_v4_data` (NEVER change)
- **Historical Docs:** `.txt` files in `docs/archive/` are for reference only, NOT parsed by app
- **Protection Logic:** See `docs/security/DATA-PROTECTION.md` for recovery procedures

## DOCUMENTATION INDEX
- `PRD.md` - Product requirements and structure rules
- `TODO.md` - Feature roadmap and task checklist
- `technical/SYNC-FEATURE.md` - Cloud sync implementation details
- `security/DATA-PROTECTION.md` - Data recovery and protection logic
- `audits/CODE-AUDIT.md` - Dependency and bloat analysis

## WORKFLOW
1. Check `TODO.md` for next task
2. Read relevant PRD section
3. Implement feature
4. Update TODO.md checkbox when complete