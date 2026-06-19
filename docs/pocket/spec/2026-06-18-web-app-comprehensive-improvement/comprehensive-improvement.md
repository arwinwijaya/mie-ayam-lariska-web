# Web App Comprehensive Improvement

> Spec: Mie Ayam Lariska Web — Full Audit Remediation
> Date: 2026-06-18
> Status: Ready for Planning

---

## Context

Mie Ayam Lariska Web underwent a comprehensive audit on 2026-06-18 that identified:
- 2 Critical security issues (open Firebase rules, hardcoded credentials)
- 4 High severity issues (missing SEO, sync scripts, no unit tests, inline scripts)
- 20 Medium severity issues (code quality, UX, accessibility, testing gaps)
- 10 Low severity issues (nice-to-haves)

The restaurant owner wants ALL issues addressed, with security as the blocker.

---

## Scope

### IN-SCOPE
- Security: Firebase rules tightening, session management
- Code Quality: ES modules migration, extract inline scripts, fix duplication
- Testing: Unit tests for all services with Vitest
- SEO: og:image, JSON-LD, robots.txt, sitemap, canonical URLs
- UX/UI: Loading states, accessibility improvements

### OUT-OF-SCOPE
- Dark mode support
- CI/CD pipeline
- TypeScript migration
- CSS minification (Firebase Hosting handles this)
- Payment integration
- Multi-language support

---

## Architecture Constraints

- **Must maintain:** Static files only, no server-side functions
- **Must maintain:** Firebase client-side SDK
- **Must maintain:** Vanilla JavaScript only
- **Must maintain:** Firebase Hosting
- **Will change:** IIFE → ES modules (full migration)
- **Will add:** Vitest for unit testing (devDependency)

---

## Design Decision

**Approach:** Incremental Migration (5 phases)

Rationale:
1. Security is a blocker — must be done first
2. ES modules migration is large — needs careful testing
3. Safer for an active production website
4. Each phase can be deployed and tested independently

---

## Acceptance Criteria

### Phase 1: SECURITY

#### Firebase Rules
- ✓ Given a public user, when they try to write to Firebase, then write is rejected
- ✓ Given a public user, when they read menu/packages/stock, then data is returned
- ✓ Given Firebase rules, when validating data, then invalid data (negative price, empty name) is rejected
- ✓ Given init pages exist, when accessed without auth, then access is denied

#### Session Management
- ✓ Given admin logs in, when 24 hours pass, then session expires and redirect to login
- ✓ Given admin session stored, when checking expiry, then timestamp is validated
- ✓ Given hardcoded fallback, when Firebase Auth unavailable, then fallback credentials work

### Phase 2: CODE QUALITY — ES Modules

#### Module Migration
- ✓ Given all 9 service files, when converted, then they use ES module import/export
- ✓ Given inline scripts in index.html, when extracted, then no inline <script> blocks remain
- ✓ Given browser loads page, when fetching JS files, then files are cached by browser

#### Code Deduplication
- ✓ Given getStatusText function, when checked, then exists only in firebase-config.js
- ✓ Given BADGE_CONFIG, when checked, then exists only in one shared location

#### Error Handling
- ✓ Given any service function, when error occurs, then structured error object is returned
- ✓ Given service functions, when called, then all use consistent try/catch pattern

### Phase 3: UNIT TESTS

#### Test Infrastructure
- ✓ Given Vitest installed, when running tests, then all tests pass
- ✓ Given test mocks, when Firebase unavailable, then tests still run

#### Service Coverage
- ✓ Given StockService, when testing normalization, then all edge cases covered
- ✓ Given MenuService, when testing validation, then all rules tested
- ✓ Given PackagesService, when testing CRUD, then all operations tested
- ✓ Given DescriptionTemplates, when testing generation, then deterministic output
- ✓ Given test suite, when running, then completes in < 10 seconds

### Phase 4: SEO & PERFORMANCE

#### Social Sharing
- ✓ Given URL shared on WhatsApp, when preview loads, then shows image + title + description
- ✓ Given URL shared on Facebook, when preview loads, then shows og:image

#### Search Engine
- ✓ Given Google crawls site, when indexing, then rich results appear with business info
- ✓ Given robots.txt, when crawler reads, then admin pages are excluded
- ✓ Given sitemap.xml, when submitted, then all pages discoverable

#### Performance
- ✓ Given Firebase SDK scripts, when loaded, then use defer attribute
- ✓ Given page loads, when checking render-blocking, then no blocking scripts

### Phase 5: UX/UI & ACCESSIBILITY

#### Accessibility
- ✓ Given keyboard user, when pressing Tab, then focus moves logically
- ✓ Given screen reader user, when stock updates, then ARIA live region announces
- ✓ Given mobile user, when tapping, then touch targets >= 44x44px

#### Error States
- ✓ Given Firebase fails, when 5 seconds pass, then error banner shown
- ✓ Given fallback data, when displayed, then "Menampilkan data tersimpan" indicator shown

---

## OPEN QUESTIONS (Resolved)

| Question | Resolution |
|----------|------------|
| Firebase Auth? | Tidak — cukup perbaiki rules dengan custom validation |
| ES modules scope? | Full migration — semua 9 service files |
| Unit test framework? | Vitest |
| SEO priority? | Sangat penting — full implementation |
| Admin count? | 1 admin saja |
| Password reset? | Hardcode fallback sebagai backup |

---

## OUT-OF-SCOPE (Remind Pocket-Planning)

- Dark mode support
- CI/CD pipeline
- TypeScript migration
- CSS minification
- Payment integration
- Multi-language support
- Firebase Authentication (using rules + custom validation instead)

---

## Phases Summary

| Phase | Focus | Deliverables | Estimated Effort |
|-------|-------|--------------|------------------|
| 1 | Security | database.rules.json, admin-auth.js | Medium |
| 2 | ES Modules | All .js files converted | High |
| 3 | Unit Tests | tests/unit/ with Vitest | Medium |
| 4 | SEO | meta tags, robots.txt, sitemap.xml | Low |
| 5 | Accessibility | ARIA improvements, skip link | Low |

---

*Spec created: 2026-06-18*
*Ready for pocket-planning*
