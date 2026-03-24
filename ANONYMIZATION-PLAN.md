# Anonymization Plan

## Status: On Roadmap (Pending Decision)

When ready to execute, this plan will move the repository to an anonymous GitHub account while preserving the ability to reclaim authorship later.

---

## PII Audit Results

### Git History
- **All commits**: `RexAffects <rexaffects@yahoo.com>` — must be rewritten

### Codebase References

| File | Line | Content | Status |
|------|------|---------|--------|
| `OUTREACH.md` | 22 | "Rex to identify specific ones" | ✅ Removed |
| `OUTREACH.md` | 39 | "Rex's district" | ✅ Removed |
| `footer.tsx` | 111 | GitHub link to `RexAffects/OpenSkies` | ⏳ Update when anonymous account created |
| `Research/.../2026-02-17-atmospheric-spraying-geoengineering.md` | — | Personal research notes with "Rex" and "Riley" | ✅ File deleted |
| `src/lib/data/legal.ts` | 254 | "Rex's home state" | ✅ Removed |

### Clean Areas (No PII Found)
- `package.json` — no author field
- `README.md` — default Next.js template
- No LICENSE file
- No personal email addresses in codebase
- No phone numbers
- No physical addresses

---

## Simplified Plan

### Phase 1: Preserve Proof of Ownership (Do First)
- [ ] Sign a timestamped document stating original authorship
- [ ] Create private backup of original `.git` folder with full history
- [ ] Optional: Create private gist as timestamp proof

### Phase 2: Clean the Codebase
- [ ] Replace 6 "Rex" references with neutral terms
- [ ] Remove "Riley" reference
- [ ] Update footer GitHub link to new anonymous account

### Phase 3: Rewrite Git History
```bash
git filter-branch --env-filter '
export GIT_AUTHOR_NAME="SkyLedger"
export GIT_AUTHOR_EMAIL="skyledger@proton.me"
export GIT_COMMITTER_NAME="SkyLedger"
export GIT_COMMITTER_EMAIL="skyledger@proton.me"
' --force --tag-name-filter cat -- --all
```

### Phase 4: Create Anonymous GitHub Account
- [ ] Create ProtonMail or similar privacy-focused email
- [ ] Create GitHub account with pseudonym
- [ ] Push cleaned repo to new account
- [ ] Verify everything looks correct

### Phase 5: Delete from RexAffects Account
- [ ] Confirm anonymous repo is fully functional
- [ ] Delete original repo from RexAffects account

---

## Reclaiming Authorship Later

If you decide to put your name back on the project:
1. Use your private backup with original git history as proof
2. Update the anonymous repo's README with attribution
3. Or transfer the repo back to your personal account

---

*Last updated: 2026-03-24*
