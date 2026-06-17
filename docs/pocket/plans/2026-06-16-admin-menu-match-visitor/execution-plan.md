# EXECUTION PLAN — Admin Menu Layout Match Visitor

**Date:** 2026-06-16
**Spec:** docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md
**Status:** draft
**Total tasks:** 4

---

## Execution Overview

### Recommended Order
```
T1 → T2 → T3, T4 (parallel)
```

### Parallelizable Groups
| Group | Tasks | Unblocked After |
|-------|-------|-----------------|
| Group A | T3, T4 | T2 completes |

### Constraints Reminder
**Architecture:** Static files only, no build process, vanilla JS, Firebase client-side SDK
**Out-of-scope:** Changes to visitor page (index.html), changes to Firebase data structure, new features
**Assumptions at risk:** None — all questions resolved
**Sequencing:** T1 is prerequisite for T2 (badge fix needed before card redesign). T3 and T4 can run in parallel after T2.

### File Structure Map
```
Rule: Card structure matches visitor
  Modify: admin/index.html (createMenuCard function)
  Test:   tests/e2e/admin-dashboard.spec.js

Rule: Admin controls inside card
  Modify: admin/index.html (createMenuCard function)
  Test:   tests/e2e/admin-dashboard.spec.js

Rule: Badge display matches visitor
  Modify: admin/index.html (createMenuCard function)
  Test:   tests/e2e/admin-dashboard.spec.js

Rule: Grid layout follows visitor CSS
  Modify: css/admin.css
  Test:   tests/e2e/admin-dashboard.spec.js

Rule: Reorder with arrow buttons
  Modify: admin/index.html (createMenuCard, category headers, event handlers)
  Test:   tests/e2e/admin-dashboard.spec.js

Rule: Badge persists after Firebase update
  Modify: admin/index.html (renderMenu function)
  Test:   tests/e2e/admin-dashboard.spec.js
```

---

## Pocket Packets

---

### Task 1: Fix renderMenu to include badge field [prereq]

## OBJECTIVE
Fix the `renderMenu` function in `admin/index.html` to include the `badge` field when building grouped data. Currently, `renderMenu` omits `badge`, causing menu badges (Favorit/Baru/Best Seller/Populer) to disappear after Firebase real-time updates.

Files:
- Modify: `admin/index.html` (renderMenu function, ~line 350-380)

Steps:
1. Write failing test for: Badge persists after Firebase real-time update
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given menu item has badge "favorit", When Firebase pushes update, Then badge still appears on card

2. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Badge not found on card after update

3. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add `badge: item.badge` to the grouped data object in `renderMenu` function

4. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

5. Commit:
   `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
   `git commit -m "fix(admin): include badge field in renderMenu function"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md — Rule 6: Badge persists after Firebase update
- admin/index.html — renderMenu function at ~line 350-380, currently omits badge field
- tests/e2e/admin-dashboard.spec.js — existing test patterns for admin dashboard

## WHY THIS APPROACH
Justification: Simple one-line fix to add missing field to data object
Complexity: lightweight

## SANDWICH CONTEXT
[CRITICAL: Badge field must be included in renderMenu for real-time updates to work]
You are fixing the renderMenu function for Admin Menu Layout Match Visitor.
Spec: docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md
Design decision: Option A — Direct CSS/HTML Refactor
Files in scope: admin/index.html
Test framework: Playwright (E2E tests)
Available after: None (prerequisite task)
Architecture rule: Static files only, vanilla JS, IIFE modules
[RESTATE: Badge field must be included in renderMenu for real-time updates to work]

## DELIVERABLE
Verification — task is DONE when all pass:

Given menu item has badge "favorit", When Firebase pushes real-time update, Then "Favorit" badge still appears on card
Given menu item has no badge, When Firebase pushes update, Then no badge shown
[must-not] Given menu item has badge, When renderMenu builds grouped data, Then badge field must NOT be omitted

All tests PASS. Commit exists with message matching `fix(admin): include badge field in renderMenu function`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Badge field included in renderMenu grouped data
  - Tests written BEFORE implementation (TDD)
  - Commit message follows conventional commits format

Must-not-have:
  - Changes to visitor page (index.html)
  - Changes to Firebase data structure
  - Modifications to files outside listed scope

Open question risks:
  - None — this is a straightforward bug fix

Rollback note:
  - Git revert to previous commit

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: Never — this is a simple fix
Escalate when: Never — no constraint violations possible

---

### Task 2: Redesign admin menu card to match visitor layout [depends: T1]

## OBJECTIVE
Rewrite the `createMenuCard` function in `admin/index.html` to match the visitor card HTML structure: large image on top → badge on image → name → description → price in "12k" format. Add admin controls (Edit/Delete/arrow buttons) inside the card below the price with border-top separator.

Files:
- Modify: `admin/index.html` (createMenuCard function, ~line 400-500)
- Modify: `admin/index.html` (renderMenuByCategory function, ~line 300-350)

Steps:
1. Write failing test for: Admin views menu with visitor-matching layout
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given admin is logged in, When menu loads, Then card shows: image (large) → badge on image → name → description → price (12k format) → Edit/Hapus/arrow buttons

2. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Card structure does not match visitor layout

3. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Rewrite createMenuCard to generate HTML matching visitor structure:
   - `.menu__item-card` wrapper
   - `.menu__item-image` with img (use `../images/` prefix for path) and badge inside
   - `.menu__item-info` with name and description
   - `.menu__item-footer` with price in "12k" format
   - `.admin-menu__card-actions` with Edit/Delete/arrow buttons
   Note: Image path must use `../images/` prefix (not `images/` like visitor)

4. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

5. Commit:
   `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): redesign menu card to match visitor layout"`

6. Write failing test for: Admin edits menu item
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given admin is viewing menu dashboard, When admin clicks "Edit" button on card, Then edit modal opens with current item data pre-filled

7. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Edit button not found or modal doesn't open

8. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add Edit button to admin controls section, attach click handler to call openEditModal(itemId)

9. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

10. Commit:
    `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
    `git commit -m "feat(admin): add edit button to card with modal integration"`

11. Write failing test for: Admin deletes menu item
    File: `tests/e2e/admin-dashboard.spec.js`
    Test verifies: Given admin is viewing menu dashboard, When admin clicks "Hapus" button on card, Then delete confirmation modal appears with item name

12. Run test — verify FAIL:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected failure: Delete button not found or modal doesn't appear

13. Implement minimal code to satisfy the test:
    File: `admin/index.html`
    Implement: Add Delete button to admin controls section, attach click handler to call openDeleteModal(itemId, itemName)

14. Run test — verify PASS:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected: PASS

15. Commit:
    `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
    `git commit -m "feat(admin): add delete button to card with confirmation modal"`

16. Write failing test for: Admin views menu item with no image
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given menu item has no image, When admin views dashboard, Then gray placeholder with "No Image" appears

17. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: No placeholder shown

18. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add onerror handler to show placeholder, use `.menu__item-image-placeholder` class

19. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

20. Commit:
   `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): add image placeholder for menu items without images"`

21. Write failing test for: Admin views menu item with badge and status
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given menu item has badge "bestseller" and status "sold_out", When admin views dashboard, Then "Best Seller" badge on top-left, "Habis" badge on top-right

22. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Badges not positioned correctly

23. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add badge rendering with correct classes (`.menu__item-badge`, `.menu__item-stock`)

24. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

25. Commit:
   `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): add menu badge and status badge to card"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md — Rules 1, 2, 3
- admin/index.html — createMenuCard function at ~line 400-500
- css/style.css — visitor card classes: .menu__item-card, .menu__item-image, .menu__item-info, .menu__item-footer
- index.html — visitor card HTML structure reference

## WHY THIS APPROACH
Justification: Core task — rewrite card rendering to match visitor exactly
Complexity: standard (multiple related changes in one function)

## SANDWICH CONTEXT
[CRITICAL: Card structure must match visitor exactly for preview consistency]
You are redesigning admin menu card for Admin Menu Layout Match Visitor.
Spec: docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md
Design decision: Option A — Direct CSS/HTML Refactor
Files in scope: admin/index.html
Test framework: Playwright (E2E tests)
Available after: T1 (renderMenu badge fix)
Architecture rule: Static files only, vanilla JS, IIFE modules, no visitor page changes
[RESTATE: Card structure must match visitor exactly for preview consistency]

## DELIVERABLE
Verification — task is DONE when all pass:

Given admin is logged in, When menu loads, Then card shows: image (large) → badge on image → name → description → price (12k format)
Given menu item has no image, When admin views dashboard, Then gray placeholder with "No Image" appears
Given menu item has badge "bestseller" and status "sold_out", When admin views dashboard, Then "Best Seller" badge on top-left, "Habis" badge on top-right
Given admin clicks Edit, When modal opens, Then current item data pre-filled
Given admin clicks Delete, When confirmation appears, Then item name shown
[must-not] Given admin views card, When looking at card, Then card must NOT show rank badge (#1, #2)

All tests PASS. Commit exists with message matching `feat(admin): redesign menu card to match visitor layout`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Card HTML structure matches visitor exactly
  - Badge on top-left of image, status on top-right
  - Price in "12k" format with pill badge
  - Admin controls (Edit/Delete/arrow) inside card below price
  - Tests written BEFORE implementation (TDD)
  - Commit message follows conventional commits format

Must-not-have:
  - Rank badge (#1, #2, #3) — removed per spec
  - Changes to visitor page (index.html)
  - Changes to Firebase data structure
  - Changes to CSS file (separate task)
  - New features (only layout alignment)
  - Modifications to files outside listed scope

Open question risks:
  - Category reorder still uses drag-drop in spec GWT, but user confirmed arrow buttons → implement arrow buttons for categories too

Rollback note:
  - Git revert to previous commit

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: Card structure doesn't match visitor due to CSS differences
Escalate when: Task touches css/admin.css (should be T3)

---

### Task 3: Update admin CSS to match visitor card styles [depends: T2]

## OBJECTIVE
Update `css/admin.css` to style the admin menu cards to match visitor card appearance. This includes card styling, image sizing, badge positioning, price format, grid breakpoints, and admin controls styling.

Files:
- Modify: `css/admin.css` (admin menu card styles, grid styles, badge styles)

Steps:
1. Write failing test for: Admin views menu on different screen sizes
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given screen width 1440px, When admin views dashboard, Then 4 columns; Given 1024px, Then 3 columns; Given 480px, Then 2 columns

2. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Grid columns don't match expected breakpoints

3. Implement minimal code to satisfy the test:
   File: `css/admin.css`
   Implement: Update `.admin-menu__grid` to match visitor breakpoints:
   - Default: 2 columns
   - ≥768px: 3 columns
   - ≥1280px: 4 columns

4. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

5. Commit:
   `git add css/admin.css tests/e2e/admin-dashboard.spec.js`
   `git commit -m "style(admin): update grid breakpoints to match visitor"`

[Additional test→implement→commit cycles for card styles]

6. Write failing test for: Card styling matches visitor
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given admin views card, When inspecting styles, Then card has border-radius, shadow, and hover effects matching visitor

7. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Card styles don't match visitor

8. Implement minimal code to satisfy the test:
   File: `css/admin.css`
   Implement: Update `.admin-menu__card` styles to match `.menu__item-card`:
   - border-radius: var(--radius-xl)
   - box-shadow: var(--shadow-sm)
   - hover: box-shadow: var(--shadow-lg), transform: translateY(-4px)
   - Image height: 160px (mobile), 200px (desktop)

9. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

10. Commit:
    `git add css/admin.css tests/e2e/admin-dashboard.spec.js`
    `git commit -m "style(admin): update card styles to match visitor design"`

11. Write failing test for: Badge positioning matches visitor
    File: `tests/e2e/admin-dashboard.spec.js`
    Test verifies: Given menu item has badge, When inspecting position, Then badge is on top-left of image with correct styling

12. Run test — verify FAIL:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected failure: Badge position doesn't match visitor

13. Implement minimal code to satisfy the test:
    File: `css/admin.css`
    Implement: Add/update badge styles to match visitor:
    - `.menu__item-badge` positioning (absolute, top-left)
    - Status badge positioning (absolute, bottom-right → top-right per spec)
    - Badge colors and gradients matching visitor

14. Run test — verify PASS:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected: PASS

15. Commit:
    `git add css/admin.css tests/e2e/admin-dashboard.spec.js`
    `git commit -m "style(admin): update badge positioning to match visitor"`

16. Write failing test for: Price format matches visitor
    File: `tests/e2e/admin-dashboard.spec.js`
    Test verifies: Given menu item, When admin views card, Then price shows in "12k" format with pill badge styling

17. Run test — verify FAIL:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected failure: Price format doesn't match visitor

18. Implement minimal code to satisfy the test:
    File: `css/admin.css`
    Implement: Add `.price` class styles matching visitor (gradient background, pill shape, centered)

19. Run test — verify PASS:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected: PASS

20. Commit:
    `git add css/admin.css tests/e2e/admin-dashboard.spec.js`
    `git commit -m "style(admin): update price format to match visitor pill style"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md — Rules 1, 3, 4
- css/style.css — visitor card styles: .menu__item-card, .menu__item-image, .menu__item-badge, .menu__grid, .price
- css/admin.css — current admin styles to be updated

## WHY THIS APPROACH
Justification: CSS updates to match visitor visual design
Complexity: standard (multiple related style changes)

## SANDWICH CONTEXT
[CRITICAL: Admin card styles must visually match visitor for preview consistency]
You are updating admin CSS for Admin Menu Layout Match Visitor.
Spec: docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md
Design decision: Option A — Direct CSS/HTML Refactor
Files in scope: css/admin.css
Test framework: Playwright (E2E tests)
Available after: T2 (card HTML restructured)
Architecture rule: Static files only, vanilla CSS, BEM naming
[RESTATE: Admin card styles must visually match visitor for preview consistency]

## DELIVERABLE
Verification — task is DONE when all pass:

Given screen width 1440px, When admin views dashboard, Then 4 columns
Given screen width 1024px, When admin views dashboard, Then 3 columns
Given screen width 480px, When admin views dashboard, Then 2 columns
Given admin views card, When inspecting styles, Then card has visitor-matching border-radius, shadow, hover effects
Given menu item has badge, When inspecting position, Then badge is on top-left of image
Given menu item has status, When inspecting position, Then status is on top-right of image
Given menu item, When admin views card, Then price shows in "12k" format with pill badge
[must-not] Given admin views card, When inspecting, Then card must NOT have admin-specific styling that differs from visitor

All tests PASS. Commit exists with message matching `style(admin): update card styles to match visitor design`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Grid breakpoints match visitor (2/3/4 columns)
  - Card styles match visitor (border-radius, shadow, hover)
  - Badge positioning matches visitor (top-left image)
  - Price format matches visitor ("12k" pill)
  - Tests written BEFORE implementation (TDD)
  - Commit message follows conventional commits format

Must-not-have:
  - Changes to visitor CSS (css/style.css)
  - Changes to HTML structure (should be T2)
  - Changes to Firebase data structure
  - New features (only layout alignment)
  - Modifications to files outside listed scope

Open question risks:
  - Status badge position changed from bottom-right to top-right per spec → verify visual alignment

Rollback note:
  - Git revert to previous commit

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: Visual differences persist despite matching CSS values
Escalate when: Task touches admin/index.html (should be T2)

---

### Task 4: Replace drag-drop with arrow buttons for reorder [depends: T2]

## OBJECTIVE
Replace the drag-drop reorder functionality with arrow buttons (up/down) for both menu items and categories. Arrow buttons should be placed at the bottom of each card, in the same row as Edit/Delete buttons.

Files:
- Modify: `admin/index.html` (createMenuCard function, category header rendering, event handlers)
- Modify: `admin/index.html` (DragDropService usage, replace with arrow button handlers)

Steps:
1. Write failing test for: Admin reorders menu item with arrow buttons
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given menu items [Mini, Biasa, Pangsit], When click up on Pangsit, Then order becomes [Mini, Pangsit, Biasa]

2. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Arrow buttons not found or reorder doesn't work

3. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add arrow buttons (up/down) to createMenuCard, add click handlers for reorder

4. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

5. Commit:
   `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): add arrow buttons for menu item reorder"`

[Additional test→implement→commit cycles for edge cases]

6. Write failing test for: Arrow buttons disabled at boundaries
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given single item in category, When admin views card, Then both arrow buttons disabled; Given first item, Then up arrow disabled; Given last item, Then down arrow disabled

7. Run test — verify FAIL:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected failure: Arrow buttons not disabled at boundaries

8. Implement minimal code to satisfy the test:
   File: `admin/index.html`
   Implement: Add disabled state logic for arrow buttons based on item position

9. Run test — verify PASS:
   `npm test -- tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

10. Commit:
    `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
    `git commit -m "feat(admin): disable arrow buttons at boundaries"`

11. Write failing test for: Admin reorders category with arrow buttons
    File: `tests/e2e/admin-dashboard.spec.js`
    Test verifies: Given categories [Mie Ayam, Topping, Minuman], When click down on Mie Ayam, Then order becomes [Topping, Mie Ayam, Minuman]

12. Run test — verify FAIL:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected failure: Category arrow buttons not found or reorder doesn't work

13. Implement minimal code to satisfy the test:
    File: `admin/index.html`
    Implement: Add arrow buttons to category headers, add click handlers for category reorder, remove DragDropService usage

14. Run test — verify PASS:
    `npm test -- tests/e2e/admin-dashboard.spec.js`
    Expected: PASS

15. Commit:
    `git add admin/index.html tests/e2e/admin-dashboard.spec.js`
    `git commit -m "feat(admin): replace category drag-drop with arrow buttons"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md — Rule 5
- admin/index.html — DragDropService usage, createMenuCard function, category header rendering
- js/drag-drop-service.js — current drag-drop implementation to be replaced

## WHY THIS APPROACH
Justification: Arrow buttons are simpler and more consistent across devices
Complexity: standard (replace one interaction pattern with another)

## SANDWICH CONTEXT
[CRITICAL: Arrow buttons must work on all screen sizes, replacing drag-drop completely]
You are replacing drag-drop with arrow buttons for Admin Menu Layout Match Visitor.
Spec: docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md
Design decision: Option A — Direct CSS/HTML Refactor
Files in scope: admin/index.html
Test framework: Playwright (E2E tests)
Available after: T2 (card HTML restructured)
Architecture rule: Static files only, vanilla JS, IIFE modules
[RESTATE: Arrow buttons must work on all screen sizes, replacing drag-drop completely]

## DELIVERABLE
Verification — task is DONE when all pass:

Given menu items [Mini, Biasa, Pangsit], When click up on Pangsit, Then order becomes [Mini, Pangsit, Biasa]
Given menu items [Mini, Biasa, Pangsit], When click down on Mini, Then order becomes [Biasa, Mini, Pangsit]
Given single item in category, When admin views card, Then both arrow buttons disabled
Given first item, When admin views card, Then up arrow disabled
Given last item, When admin views card, Then down arrow disabled
Given categories [Mie Ayam, Topping, Minuman], When click down on Mie Ayam, Then order becomes [Topping, Mie Ayam, Minuman]
[must-not] Given admin views dashboard, When inspecting, Then drag-drop functionality must NOT be present for items

All tests PASS. Commit exists with message matching `feat(admin): add arrow buttons for menu item reorder`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Arrow buttons for items on all screen sizes
  - Arrow buttons for categories on all screen sizes
  - Boundary disabled states (first/last item, single item)
  - Order updates in Firebase on arrow click
  - Tests written BEFORE implementation (TDD)
  - Commit message follows conventional commits format

Must-not-have:
  - Drag-drop for items (removed)
  - Changes to visitor page (index.html)
  - Changes to Firebase data structure
  - Changes to CSS file (should be T3)
  - New features (only layout alignment)
  - Modifications to files outside listed scope

Open question risks:
  - DragDropService may still be needed for other features → verify before removing import

Rollback note:
  - Git revert to previous commit

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: DragDropService removal breaks other functionality
Escalate when: Task touches css/admin.css (should be T3)
