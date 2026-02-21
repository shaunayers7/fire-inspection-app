# ⚠️ DEPRECATED - See COPILOT-INSTRUCTIONS.md

This file has been superseded by the comprehensive workflow documentation system.

## 📚 NEW DOCUMENTATION (READ THESE)

**Start here for every session:**
- **[COPILOT-INSTRUCTIONS.md](COPILOT-INSTRUCTIONS.md)** - Complete AI context, mandatory patterns, persona
- **[PRD.md](PRD.md)** - Product requirements (especially Section 7: iOS Best Practices)

**For development tasks:**
- **[DEVELOPMENT-WORKFLOW.md](DEVELOPMENT-WORKFLOW.md)** - Step-by-step processes for common tasks
- **[PROMPT-TEMPLATES.md](PROMPT-TEMPLATES.md)** - Copy-paste prompts for quick implementation

**Quick reference:**
- **[TODO.md](TODO.md)** - Current feature roadmap
- **[technical/SYNC-FEATURE.md](technical/SYNC-FEATURE.md)** - Cloud sync details
- **[security/DATA-PROTECTION.md](security/DATA-PROTECTION.md)** - Data recovery

## 🎯 Quick Start

```
1. Read: COPILOT-INSTRUCTIONS.md (5 min)
2. Read: PRD.md Section 7 (10 min)
3. Check: TODO.md for current priorities
4. Use: PROMPT-TEMPLATES.md for common tasks
5. Follow: DEVELOPMENT-WORKFLOW.md for step-by-step guidance
```

---

## Legacy Content (Preserved for Reference)

**The content below is deprecated. Use the new documentation above.**

---

### CODING GUIDELINES (OLD)
- **State Preservation:** Never overwrite the `yearData` or `localStorage` logic. Changes must merge data, not delete it.
- **Protected Buildings:** Bellevue and Pincher Creek (2026) must ALWAYS exist. Initialization logic auto-restores if missing.
- **System Style:** Use "System Gray" (#F2F2F7) and the Inter font.
- **The "N" Logic:** Section 1 is always 'Building Details'. Sections 2 through N are dynamic inspection categories.
- **iOS Touch:** All touch interactions must support iOS momentum scrolling (`-webkit-overflow-scrolling: touch`, `touch-action: pan-y`).

> **Note:** These rules are now documented in COPILOT-INSTRUCTIONS.md with expanded iOS safety requirements.