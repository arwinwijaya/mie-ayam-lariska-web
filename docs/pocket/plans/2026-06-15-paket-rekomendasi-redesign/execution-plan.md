# Execution Plan — Paket Rekomendasi Redesign + Admin CRUD

> **Date:** 2026-06-15
> **Spec:** `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md`
> **Tasks:** 5 | TDD-structured

---

### Task 1: Firebase Packages API + Service [prereq]
---

## OBJECTIVE
Create the packages data service and extend Firebase config with packages CRUD API. This is the foundation for both admin CRUD and visitor dynamic rendering.

Files:
- Create: `js/packages-service.js`
- Modify: `js/firebase-config.js`

Steps:
1. Write failing test for: PackagesService initialization and API exposure
   File: `tests/e2e/packages-service.spec.js`
   Test verifies: Given page loads, When packages-service.js is loaded, Then window.PackagesService exists with required methods (getAll, getById, add, update, delete, onAllChange)

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/packages-service.spec.js`
   Expected failure: window.PackagesService is undefined

3. Implement minimal code to satisfy the test:
   File: `js/packages-service.js`
   Implement: IIFE module with PackagesService exposing getAll, getById, add, update, delete, onAllChange methods. Uses Firebase Realtime Database `packages/` node.

4. Run test — verify PASS:
   `npx playwright test tests/e2e/packages-service.spec.js`
   Expected: PASS

5. Commit:
   `git add js/packages-service.js`
   `git commit -m "feat(packages): add packages service with Firebase CRUD API"`

6. Write failing test for: Firebase packages API functions
   File: `tests/e2e/firebase-packages-api.spec.js`
   Test verifies: Given Firebase connected, When calling FirebaseService.addPackage/getPackages/updatePackage/deletePackage, Then data persists to packages/ node

7. Run test — verify FAIL:
   `npx playwright test tests/e2e/firebase-packages-api.spec.js`
   Expected failure: FirebaseService.addPackage is not a function

8. Implement minimal code to satisfy the test:
   File: `js/firebase-config.js`
   Implement: Add packagesRef, INITIAL_PACKAGES_DATA, seedInitialPackages, addPackage, getPackages, updatePackage, deletePackage, onAllPackagesChange to FirebaseService

9. Run test — verify PASS:
   `npx playwright test tests/e2e/firebase-packages-api.spec.js`
   Expected: PASS

10. Commit:
    `git add js/firebase-config.js tests/e2e/firebase-packages-api.spec.js`
    `git commit -m "feat(packages): add packages CRUD API to FirebaseService"`

## REFERENCES LOADED
- `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md` — Rule 3: Dynamic Data from Firebase
- `js/firebase-config.js` — Firebase initialization pattern, menu API reference
- `js/menu-service.js` — IIFE module pattern, validation functions

## WHY THIS APPROACH
Justification: Separating packages-service.js follows existing pattern (menu-service.js). Firebase API in firebase-config.js keeps Firebase logic centralized.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Firebase must be initialized before any service calls]
You are implementing Firebase packages API for Mie Ayam Lariska.
Spec: `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md`
Design decision: Featured Card Spotlight + Admin CRUD + Firebase dynamic data
Files in scope: `js/packages-service.js`, `js/firebase-config.js`
Test framework: Playwright E2E
Available after: none (prereq)
Architecture rule: IIFE pattern, no framework, client-side Firebase SDK only
[RESTATE: Firebase must be initialized before any service calls]

## DELIVERABLE
Verification — task is DONE when all pass:

Given page loads with packages-service.js, When inspected, Then window.PackagesService exists with methods: getAll, getById, add, update, delete, onAllChange
Given Firebase connected, When calling FirebaseService.addPackage with valid data, Then package saved to packages/ node
Given packages exist in Firebase, When calling FirebaseService.getPackages, Then returns all packages object
Given package ID, When calling FirebaseService.updatePackage, Then package data updated
Given package ID, When calling FirebaseService.deletePackage, Then package removed from packages/
Given packages change in Firebase, When listener registered, Then callback fires with new data

All tests PASS. Commit exists with message matching `feat(packages): ...`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - IIFE module pattern (consistent with menu-service.js)
  - All CRUD operations: create, read, update, delete
  - Real-time listener via onAllPackagesChange
  - Initial seed data for default packages
  - Input validation (name required, price > 0, etc.)
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Direct DOM manipulation in service
  - Framework dependencies
  - Server-side functions
  - Modifications to files outside listed scope

Open question risks:
  - None (all resolved)

Rollback note:
  - git revert to remove packages-service.js and firebase-config.js changes

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commits created
Uncertain when: Firebase API behavior differs from menu API pattern
Escalate when: need to modify files outside scope

---

### Task 2: Admin Packages CRUD UI [depends: T1]
---

## OBJECTIVE
Add packages management tab to admin dashboard with table view and add/edit/delete modals. Admin can CRUD packages with all fields: name, description, icon, items (multi-select), price, tag, isFeatured, isActive, order, whatsappMessage.

Files:
- Modify: `admin/index.html`
- Modify: `css/admin.css`

Steps:
1. Write failing test for: Admin packages tab presence
   File: `tests/e2e/admin-packages.spec.js`
   Test verifies: Given admin logged in, When dashboard loads, Then "Paket" tab visible in navigation

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/admin-packages.spec.js`
   Expected failure: "Paket" tab not found

3. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add "Paket" tab button in admin navigation, add packages container div

4. Run test — verify PASS:
   `npx playwright test tests/e2e/admin-packages.spec.js`
   Expected: PASS

5. Commit:
   `git add admin/index.html`
   `git commit -m "feat(admin): add packages management tab"`

6. Write failing test for: Packages table view
   File: `tests/e2e/admin-packages.spec.js`
   Test verifies: Given admin clicks "Paket" tab, When packages loaded, Then table displays with columns: Icon, Nama, Harga, Items, Tag, Status, Aksi

7. Run test — verify FAIL:
   `npx playwright test tests/e2e/admin-packages.spec.js`
   Expected failure: table not found or missing columns

8. Implement minimal code to satisfy the test:
   File: `admin/index.html`, `css/admin.css`
   Implement: Packages table with columns, data rendering from Firebase, edit/delete action buttons

9. Run test — verify PASS:
   `npx playwright test tests/e2e/admin-packages.spec.js`
   Expected: PASS

10. Commit:
    `git add admin/index.html css/admin.css`
    `git commit -m "feat(admin): add packages table view with CRUD actions"`

11. Write failing test for: Add package modal
    File: `tests/e2e/admin-packages.spec.js`
    Test verifies: Given admin clicks "Tambah Paket", When modal opens, Then form shows all fields (name, description, icon, items multi-select from menu, price, tag, featured, active, order, whatsappMessage)

12. Run test — verify FAIL:
    `npx playwright test tests/e2e/admin-packages.spec.js`
    Expected failure: modal not found or missing form fields

13. Implement minimal code to satisfy the test:
    File: `admin/index.html`
    Implement: Add package modal with all form fields, multi-select for items loaded from FirebaseService menu data

14. Run test — verify PASS:
    `npx playwright test tests/e2e/admin-packages.spec.js`
    Expected: PASS

15. Commit:
    `git add admin/index.html`
    `git commit -m "feat(admin): add package form with all fields"`

16. Write failing test for: Edit and delete package
    File: `tests/e2e/admin-packages.spec.js`
    Test verifies: Given admin clicks edit on a package, When form opens, Then fields pre-filled. Given admin clicks delete, When confirmed, Then package removed.

17. Run test — verify FAIL:
    `npx playwright test tests/e2e/admin-packages.spec.js`
    Expected failure: edit/delete functionality not working

18. Implement minimal code to satisfy the test:
    File: `admin/index.html`
    Implement: Edit pre-fill logic, delete confirmation, Firebase save/update/delete calls

19. Run test — verify PASS:
    `npx playwright test tests/e2e/admin-packages.spec.js`
    Expected: PASS

20. Commit:
    `git add admin/index.html`
    `git commit -m "feat(admin): implement package edit and delete functionality"`

## REFERENCES LOADED
- `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md` — Rules 4-7: Admin CRUD
- `admin/index.html` — Admin dashboard structure, menu CRUD modal reference
- `css/admin.css` — Admin styles reference
- `js/menu-service.js` — Validation patterns

## WHY THIS APPROACH
Justification: Extending existing admin dashboard with new tab follows established pattern. Table view consistent with admin design language.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Admin auth must be enforced — AdminAuth.requireAuth()]
You are implementing admin packages CRUD for Mie Ayam Lariska.
Spec: `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md`
Design decision: Table view with form modal
Files in scope: `admin/index.html`, `css/admin.css`
Test framework: Playwright E2E
Available after: T1 (Firebase packages API)
Architecture rule: IIFE pattern, client-side only, AdminAuth protection
[RESTATE: Admin auth must be enforced — AdminAuth.requireAuth()]

## DELIVERABLE
Verification — task is DONE when all pass:

Given admin logged in, When dashboard loads, Then "Paket" tab visible
Given admin clicks "Paket" tab, When packages loaded, Then table displays all packages
Given admin clicks "Tambah Paket", When modal opens, Then form shows all fields
Given admin fills form and submits, When saved, Then package appears in table
Given admin clicks edit on package, When form opens, Then fields pre-filled
Given admin edits and submits, When saved, Then table updates
Given admin clicks delete, When confirmed, Then package removed from table
Given isFeatured checked on new package, When saved, Then other packages auto-unset featured

All tests PASS. Commits exist with message matching `feat(admin): ...`.

Format: DONE

## QUALITY BAR
Must-have:
  - Table view with all columns
  - Add/Edit modal with all form fields
  - Multi-select for items from Firebase menu data
  - Delete with confirmation
  - Auto-unset featured on other packages
  - AdminAuth.requireAuth() protection
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Image upload for packages (out of scope)
  - Modifications to files outside listed scope

Open question risks:
  - None

Rollback note:
  - git revert

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commits created
Escalate when: need to modify files outside scope

---

### Task 3: Visitor Dynamic Rendering [depends: T1]
---

## OBJECTIVE
Replace hardcoded packages HTML with dynamic rendering from Firebase. Visitor page loads packages data and renders cards dynamically. Fallback to hardcoded data if Firebase fails.

Files:
- Modify: `index.html`
- Modify: `js/firebase-config.js` (if needed for visitor-side listener)

Steps:
1. Write failing test for: Dynamic packages rendering
   File: `tests/e2e/customer-packages.spec.js`
   Test verifies: Given visitor opens page, When Firebase connected, Then packages section renders from Firebase data (not hardcoded HTML)

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected failure: packages still rendered from hardcoded HTML

3. Implement minimal code to satisfy the test:
   File: `index.html`
   Implement: Replace hardcoded packages cards with empty container div. Add inline script to load packages from Firebase and render dynamically.

4. Run test — verify PASS:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected: PASS

5. Commit:
   `git add index.html`
   `git commit -m "feat(visitor): dynamic packages rendering from Firebase"`

6. Write failing test for: Fallback when Firebase fails
   File: `tests/e2e/customer-packages.spec.js`
   Test verifies: Given Firebase disconnected, When page loads, Then hardcoded fallback packages displayed

7. Run test — verify FAIL:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected failure: no fallback data shown

8. Implement minimal code to satisfy the test:
   File: `index.html`
   Implement: Add FALLBACK_PACKAGES constant, render fallback if Firebase load fails or times out

9. Run test — verify PASS:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected: PASS

10. Commit:
    `git add index.html`
    `git commit -m "feat(visitor): add fallback packages data for offline mode"`

11. Write failing test for: Real-time updates from admin changes
    File: `tests/e2e/customer-packages.spec.js`
    Test verifies: Given visitor on page, When admin adds/updates package, Then visitor page updates without refresh

12. Run test — verify FAIL:
    `npx playwright test tests/e2e/customer-packages.spec.js`
    Expected failure: visitor page does not update in real-time

13. Implement minimal code to satisfy the test:
    File: `index.html`
    Implement: Register onAllPackagesChange listener to re-render packages when data changes

14. Run test — verify PASS:
    `npx playwright test tests/e2e/customer-packages.spec.js`
    Expected: PASS

15. Commit:
    `git add index.html`
    `git commit -m "feat(visitor): add real-time packages sync"`

## REFERENCES LOADED
- `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md` — Rule 3: Dynamic Data from Firebase
- `index.html` — Current hardcoded packages section (lines 478-566)
- `js/firebase-config.js` — Firebase listener patterns

## WHY THIS APPROACH
Justification: Inline script in index.html follows existing pattern for menu rendering. Fallback ensures resilience.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Must preserve WhatsApp links and data-section attributes]
You are implementing dynamic packages rendering for Mie Ayam Lariska.
Spec: `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md`
Design decision: Dynamic from Firebase with fallback
Files in scope: `index.html`
Test framework: Playwright E2E
Available after: T1 (Firebase packages API)
Architecture rule: Client-side only, preserve existing section structure
[RESTATE: Must preserve WhatsApp links and data-section attributes]

## DELIVERABLE
Verification — task is DONE when all pass:

Given visitor opens page, When Firebase connected, Then packages loaded from packages/ node
Given packages data, When rendering, Then each package card shows: icon, name, tag, items, price, WhatsApp button
Given Firebase fails, When timeout reached, Then fallback packages displayed
Given fallback mode, When rendered, Then indicator shows "offline mode"
Given isFeatured: true, When rendering, Then featured package has packages__card--featured class
Given isActive: false, When rendering, Then package not displayed

All tests PASS. Commits exist with message matching `feat(visitor): ...`.

Format: DONE

## QUALITY BAR
Must-have:
  - Dynamic rendering from Firebase
  - Fallback data for offline resilience
  - Preserve WhatsApp link format
  - Preserve data-section="packages" attribute
  - Only show isActive: true packages
  - Mark isFeatured: true with special class
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - UI redesign (that's T4)
  - Modifications to files outside listed scope

Open question risks:
  - None

Rollback note:
  - git revert

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commits created
Escalate when: need to modify files outside scope

---

### Task 4: Visitor UI Redesign [depends: T3]
---

## OBJECTIVE
Redesign packages section layout: featured card full-width at top, 3 cards in grid below. Replace "Hemat 0k" with "Praktis"/"Lengkap" badge. Visual hierarchy with gradient, shadow, accent bar for featured card.

Files:
- Modify: `index.html` (rendering logic)
- Modify: `css/style.css`

Steps:
1. Write failing test for: Featured card full-width layout
   File: `tests/e2e/customer-packages.spec.js`
   Test verifies: Given packages loaded, When featured package exists, Then featured card renders full-width above other cards

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected failure: all cards in same grid

3. Implement minimal code to satisfy the test:
   File: `index.html`
   Implement: Separate featured card from grid. Featured card in its own container above grid.

4. Run test — verify PASS:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected: PASS

5. Commit:
   `git add index.html`
   `git commit -m "feat(visitor): restructure packages layout with featured card on top"`

6. Write failing test for: Featured card visual styles
   File: `tests/e2e/customer-packages.spec.js`
   Test verifies: Given featured card rendered, When inspected, Then has gradient background, larger shadow, top accent bar

7. Run test — verify FAIL:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected failure: featured card lacks visual differentiation

8. Implement minimal code to satisfy the test:
   File: `css/style.css`
   Implement: .packages__card--featured styles with gradient, shadow-lg, top accent bar, larger padding/font

9. Run test — verify PASS:
   `npx playwright test tests/e2e/customer-packages.spec.js`
   Expected: PASS

10. Commit:
    `git add css/style.css`
    `git commit -m "feat(visitor): add featured card visual styles"`

11. Write failing test for: "Lengkap" badge replaces "Hemat 0k"
    File: `tests/e2e/customer-packages.spec.js`
    Test verifies: Given package card rendered, When no discount, Then "Lengkap" badge shown instead of "Hemat 0k"

12. Run test — verify FAIL:
    `npx playwright test tests/e2e/customer-packages.spec.js`
    Expected failure: "Hemat 0k" still showing or "Lengkap" badge missing

13. Implement minimal code to satisfy the test:
    File: `index.html`, `css/style.css`
    Implement: Replace "Hemat 0k" with "Lengkap" badge in rendering logic. Add .packages__badge--lengkap styles.

14. Run test — verify PASS:
    `npx playwright test tests/e2e/customer-packages.spec.js`
    Expected: PASS

15. Commit:
    `git add index.html css/style.css`
    `git commit -m "feat(visitor): replace discount badge with Lengkap badge"`

16. Write failing test for: Responsive layout
    File: `tests/e2e/customer-packages.spec.js`
    Test verifies: Given viewport < 768px, When rendered, Then 1 column layout. Given viewport >= 1024px, Then 3 column grid.

17. Run test — verify FAIL:
    `npx playwright test tests/e2e/customer-packages.spec.js`
    Expected failure: responsive layout not working

18. Implement minimal code to satisfy the test:
    File: `css/style.css`
    Implement: Responsive breakpoints for packages grid (1 col mobile, 2+1 tablet, 3 col desktop)

19. Run test — verify PASS:
    `npx playwright test tests/e2e/customer-packages.spec.js`
    Expected: PASS

20. Commit:
    `git add css/style.css`
    `git commit -m "feat(visitor): add responsive packages grid layout"`

## REFERENCES LOADED
- `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md` — Rules 1, 2, 3, 8
- `index.html` — Current packages section structure
- `css/style.css` — Current packages styles (lines 659-858), CSS custom properties

## WHY THIS APPROACH
Justification: CSS-only visual changes with minimal HTML restructuring. Follows mobile-first pattern.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Preserve existing CSS custom properties and BEM naming]
You are implementing packages UI redesign for Mie Ayam Lariska.
Spec: `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md`
Design decision: Featured Card Spotlight
Files in scope: `index.html`, `css/style.css`
Test framework: Playwright E2E
Available after: T3 (dynamic rendering)
Architecture rule: BEM naming, CSS custom properties, mobile-first
[RESTATE: Preserve existing CSS custom properties and BEM naming]

## DELIVERABLE
Verification — task is DONE when all pass:

Given packages loaded, When featured exists, Then featured card full-width at top
Given featured card, When rendered, Then gradient background, shadow-lg, top accent bar
Given non-featured cards, When rendered, Then subtle style (shadow-sm, solid background)
Given package card, When rendered, Then "Lengkap" badge instead of "Hemat 0k"
Given viewport < 768px, When rendered, Then 1 column layout
Given viewport 768-1023px, When rendered, Then 2+1 layout
Given viewport >= 1024px, When rendered, Then 3 column grid

All tests PASS. Commits exist with message matching `feat(visitor): ...`.

Format: DONE

## QUALITY BAR
Must-have:
  - Featured card full-width at top
  - Visual hierarchy (gradient, shadow, accent bar)
  - "Lengkap" badge (not "Hemat 0k")
  - Responsive breakpoints
  - Preserve BEM naming
  - Tests written BEFORE implementation (TDD)

Must-not-have:
  - Complex animations
  - Food images
  - Modifications to files outside listed scope

Open question risks:
  - None

Rollback note:
  - git revert

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commits created
Escalate when: need to modify files outside scope

---

### Task 5: E2E Tests [depends: T2, T4]
---

## OBJECTIVE
Comprehensive E2E tests covering admin packages CRUD and visitor packages display. Verify all acceptance criteria from spec.

Files:
- Create: `tests/e2e/admin-packages.spec.js` (if not created in T2)
- Create: `tests/e2e/customer-packages.spec.js` (if not created in T3/T4)

Steps:
1. Review and consolidate existing test files from T2, T3, T4
   File: `tests/e2e/admin-packages.spec.js`, `tests/e2e/customer-packages.spec.js`
   Verify: All test scenarios from acceptance criteria are covered

2. Add missing edge case tests:
   - Admin: duplicate package names, invalid prices, empty required fields
   - Visitor: all packages inactive, Firebase timeout, featured package changes

3. Run full test suite:
   `npx playwright test`
   Expected: All tests PASS

4. Commit:
   `git add tests/e2e/`
   `git commit -m "test(packages): add comprehensive E2E tests for packages CRUD and display"`

## REFERENCES LOADED
- `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md` — All acceptance criteria
- `tests/e2e/admin-dashboard.spec.js` — Test pattern reference
- `tests/e2e/customer-dashboard.spec.js` — Test pattern reference

## WHY THIS APPROACH
Justification: Consolidate tests from T2-T4, add edge cases. Follows existing test patterns.
Complexity: lightweight

## SANDWICH CONTEXT
[CRITICAL: Tests must use real Firebase, not mocks]
You are implementing E2E tests for packages feature.
Spec: `docs/pocket/spec/2026-06-15-paket-rekomendasi-redesign/spec.md`
Design decision: Playwright E2E
Files in scope: `tests/e2e/`
Test framework: Playwright
Available after: T2, T4
Architecture rule: Real Firebase, no mocks
[RESTATE: Tests must use real Firebase, not mocks]

## DELIVERABLE
Verification — task is DONE when all pass:

Given full test suite, When run, Then all tests PASS
Given admin CRUD tests, When run, Then covers: create, read, update, delete, featured logic
Given visitor tests, When run, Then covers: dynamic render, featured layout, responsive, fallback
Given edge case tests, When run, Then covers: validation, error states, boundary conditions

All tests PASS. Commit exists with message matching `test(packages): ...`.

Format: DONE

## QUALITY BAR
Must-have:
  - Coverage for all 8 acceptance criteria rules
  - Edge case coverage
  - Real Firebase (no mocks)
  - Follows existing test patterns

Must-not-have:
  - Unit tests (E2E only per project convention)
  - Modifications to source files

Open question risks:
  - None

Rollback note:
  - git revert

## STOP CONDITIONS
Done when: all tests PASS, commit created
Escalate when: test failures indicate implementation bugs (loop back to T2/T4)

---

*Plan generated by pocket-planning on 2026-06-15*
