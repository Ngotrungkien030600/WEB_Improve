# Story 6.6 — Build & Regression Test

## Header

- **Story:** 6.6 — Build & Regression Test
- **Epic:** 6 — R8 CSS Audit
- **Status:** done
- **Hardened:** soft (2026-08-04)

---

## User Story

As a developer,
I want to verify the build passes and no regressions occurred after all CSS token migrations,
So that Epic 6 is complete.

---

## Context

### Story 6-5 vừa hoàn thành
- Migrated 5 CSS hex → tokens trong 4 pages
- Files: AiHubPage, BmadAgentsPage, CodeLearnPage
- Tokens mới: `--color-text-inverse`, `--color-accent-mid`

### Epic 6 Stories Status
| Story | Status |
|-------|--------|
| 6-1 Detection & Token Mapping | ✅ done |
| 6-2 Page Components | ✅ done |
| 6-3 Remaining Pages | ✅ done |
| 6-4 Shared Components | ✅ done |
| 6-5 Pages (4 files) | ✅ done |
| **6-6 Build Regression** | 🔄 this |

---

## Acceptance Criteria

### AC1: Build Verification
- [ ] `npm run build` passes without errors
- [ ] No CSS syntax errors
- [ ] No missing token warnings

### AC2: Hex Audit Final
- [ ] Run `node scripts/hex-audit.js`
- [ ] Compare with baseline from story 6-1
- [ ] Report total replaceable count

### AC3: Smoke Test (Manual - NFR5)
- [ ] Load AiHubPage — verify purple accent bg visible
- [ ] Load BmadAgentsPage — verify error color visible
- [ ] Load CodeLearnPage — verify blue accent visible

### AC4: Epic Sign-off
- [ ] All 6 stories in `done` status
- [ ] Epic 6 status → `done`

---

## Technical Notes

### Build Command
```bash
cd projects/web-app && npm run build
```

### Audit Command
```bash
node scripts/hex-audit.js
```

### Check sprint-status
- 6-1: done
- 6-2: done
- 6-3: done
- 6-4: done
- 6-5: done (vừa xong)
- **6-6: in-progress**

---

## Dev Notes

### Approach
1. Run build → verify pass
2. Run hex-audit → record metrics
3. Update sprint-status.yaml → mark epic done
4. Complete story file

### Expected Outcome
- Build: ✅ pass
- Hex replaceable: < 5 (mostly code/accent legitimate)
- Epic 6: ✅ complete

---

## Metadata

**Created:** 2026-08-04
**Completed:** 2026-08-04

## Results

| Metric | Value |
|--------|-------|
| Build | ✅ pass |
| Hex replaceable | 2 (minor technical debt) |
| Hex fallback | 203 |
| Epic 6 | ✅ complete |
