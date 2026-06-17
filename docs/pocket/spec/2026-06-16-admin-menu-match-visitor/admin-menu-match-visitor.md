# Admin Menu Layout Match Visitor

**Date:** 2026-06-16
**Status:** draft
**Author:** brainstorm session
**Spec path:** docs/pocket/spec/2026-06-16-admin-menu-match-visitor/admin-menu-match-visitor.md

---

## Summary

Redesign admin dashboard menu card layout to match visitor layout exactly. Goal is preview consistency — admin can see exactly what visitors see. Admin controls (Edit/Hapus/status) are added inside the card below the visitor-style content.

---

## Context

### Current State
- **Visitor (index.html)**: Cards with large image on top, badge on image (top-left), name, description, price in "12k" format, stock badge on image (bottom-right)
- **Admin (admin/index.html)**: Cards with rank badge (#1, #2, #3), smaller image, name, price in "Rp 12.000" format, description, status badge below card, Edit/Hapus buttons
- **CSS**: Visitor uses `css/style.css`, admin uses `css/admin.css`
- **Rendering**: Admin uses `createMenuCard()` function in inline script

### Problem / Motivation
Admin menu layout differs significantly from visitor layout, making it impossible to preview how menu appears to customers. This creates:
- Inconsistency between admin view and customer view
- Difficulty reviewing menu appearance before it goes live
- Confusion when admin expects to see what customers see

### Related Areas
- `admin/index.html` — main file to modify (rendering function)
- `css/admin.css` — styles to update
- `css/style.css` — reference for visitor card styles
- `js/firebase-config.js` — data source (no changes needed)
- `js/menu-service.js` — menu service (no changes needed)

---

## Scope

### In-Scope
- Redesign admin menu card layout to match visitor card layout
- Visitor card structure: large image on top → badge on image → name → description → price (12k format)
- Admin controls (Edit/Hapus) inside card, below price, with border-top separator
- Status badge (Tersedia/Terbatas/Habis) on top-right of image
- Menu badge (Favorit/Baru/Best Seller/Populer) on top-left of image (same as visitor)
- Grid layout follows visitor CSS exactly (4 cols ≥1280px, 3 cols ≥768px, 2 cols <768px)
- Arrow buttons for reorder (items and categories) on all screen sizes
- Fix renderMenu function to include badge field

### Out-of-Scope
- Changes to visitor page (index.html) — admin adapts to visitor, not vice versa
- Changes to Firebase data structure — existing model is sufficient
- New features — only layout alignment

---

## Architecture Constraints

- **Layers this work may touch**: `admin/index.html` (rendering), `css/admin.css` (styling)
- **Layers this work must NOT touch**: `index.html`, `css/style.css`, `js/firebase-config.js`, Firebase rules
- **Patterns that must be followed**: IIFE modules, BEM CSS naming, static files only
- **Architecture validation result**: PASS

---

## Stories + Scenarios

### Story: Admin views menu with visitor-matching layout
> As an admin, I want to see menu with the same layout as visitors, so that I can preview how customers see the menu.

**Rule 1: Card structure matches visitor**
- Example A: Menu item with image → shows: large image on top, badge on image, name, description, price in "12k" format
- Example B: Menu item without image → shows: gray placeholder with "No Image" text, same as visitor

**Rule 2: Admin controls inside card**
- Example C: After price → border-top separator → Edit button, Delete button, arrow buttons (up/down)

**Rule 3: Badge display matches visitor**
- Example D: Menu badge (Favorit/Baru/Best Seller) on top-left of image
- Example E: Status badge (Tersedia/Terbatas/Habis) on top-right of image

**Rule 4: Grid layout follows visitor CSS**
- Example F: Desktop (1440px) → 4 columns
- Example G: Tablet (1024px) → 3 columns
- Example H: Mobile (480px) → 2 columns

**Rule 5: Reorder with arrow buttons**
- Example I: Arrow buttons for items on all screen sizes (no drag-drop)
- Example J: Arrow buttons for categories on all screen sizes

**Rule 6: Badge persists after Firebase update**
- Example K: Badge field included in renderMenu function

```gherkin
Scenario: Admin views menu with visitor-matching layout
  Given admin is logged in and on dashboard
  When menu items load from Firebase
  Then each card shows: image (large, on top) → badge on image → name → description → price (12k format)
  And card structure matches visitor layout exactly

Scenario: Admin views menu item with no image
  Given menu item "Mie Ayam Baru" has no image file
  When admin views dashboard
  Then card shows gray placeholder with "No Image" text
  And placeholder matches visitor fallback style

Scenario: Admin views menu item with badge and status
  Given menu item "Mie Ayam Komplit" has badge "bestseller" and status "sold_out"
  When admin views dashboard
  Then "Best Seller" badge appears on top-left of image
  And "Habis" badge appears on top-right of image

Scenario: Admin edits menu item
  Given admin is viewing menu dashboard
  When admin clicks "Edit" button on card
  Then edit modal opens with current item data

Scenario: Admin deletes menu item
  Given admin is viewing menu dashboard
  When admin clicks "Hapus" button on card
  Then delete confirmation modal appears

Scenario: Admin reorders menu item with arrow buttons
  Given menu items in "Mie Ayam" category are: [Mini, Biasa, Pangsit]
  When admin clicks up arrow on "Pangsit"
  Then "Pangsit" moves to position #2
  And "Biasa" moves to position #3
  And order is updated in Firebase
  And arrow buttons work on ALL screen sizes (no drag-drop)

Scenario: Admin reorders category with arrow buttons
  Given categories are: [Mie Ayam, Topping Tambahan, Minuman]
  When admin clicks down arrow on "Mie Ayam"
  Then "Mie Ayam" moves to position #2
  And "Topping Tambahan" moves to position #1
  And category order updates in Firebase

Scenario: Admin views menu on different screen sizes
  Given admin opens dashboard
  When screen width is 1440px
  Then grid shows 4 columns
  When screen width is 1024px
  Then grid shows 3 columns
  When screen width is 768px
  Then grid shows 3 columns
  When screen width is 480px
  Then grid shows 2 columns

Scenario: Badge persists after Firebase real-time update
  Given menu item "Mie Ayam Pangsit" has badge "favorit"
  When Firebase pushes real-time update
  Then "Favorit" badge still appears on card
  And renderMenu function includes badge field
```

---

## Acceptance Criteria

```
Rule: Card structure matches visitor
  ✓ Given admin views dashboard, When menu loads, Then card shows: large image → badge on image → name → description → price (12k format)
  ✓ Given menu item has no image, When admin views dashboard, Then gray placeholder with "No Image" appears
  ✗ Given admin views dashboard, When menu loads, Then card shows rank badge (#1, #2) — RANK BADGE REMOVED

Rule: Admin controls inside card
  ✓ Given admin views card, When looking below price, Then border-top separator + Edit + Delete + arrow buttons visible
  ✓ Given admin clicks Edit, When modal opens, Then current item data pre-filled
  ✓ Given admin clicks Delete, When confirmation appears, Then item name shown

Rule: Badge display matches visitor
  ✓ Given menu item has badge "bestseller", When admin views dashboard, Then "Best Seller" badge on top-left of image
  ✓ Given menu item has status "sold_out", When admin views dashboard, Then "Habis" badge on top-right of image
  ✓ Given menu item has no badge, When admin views dashboard, Then no badge shown on image

Rule: Grid layout follows visitor CSS
  ✓ Given screen width 1440px, When admin views dashboard, Then 4 columns
  ✓ Given screen width 1024px, When admin views dashboard, Then 3 columns
  ✓ Given screen width 480px, When admin views dashboard, Then 2 columns

Rule: Reorder with arrow buttons
  ✓ Given menu items [Mini, Biasa, Pangsit], When click up on Pangsit, Then order becomes [Mini, Pangsit, Biasa]
  ✓ Given menu items [Mini, Biasa, Pangsit], When click down on Mini, Then order becomes [Biasa, Mini, Pangsit]
  ✓ Given single item in category, When admin views card, Then both arrow buttons disabled
  ✓ Given categories [Mie Ayam, Topping, Minuman], When click down on Mie Ayam, Then order becomes [Topping, Mie Ayam, Minuman]

Rule: Badge persists after Firebase update
  ✓ Given menu item has badge "favorit", When Firebase pushes update, Then badge still appears
  ✓ Given renderMenu function called, When building grouped data, Then badge field included
```

---

## Design Decision

**Chosen option:** Option A — Direct CSS/HTML Refactor

**Summary:** Rewrite `createMenuCard()` function to match visitor HTML structure, update CSS in `admin.css` to match visitor card styles. Add admin controls (Edit/Delete/arrow buttons) inside card below the visitor-style content.

**Rejected options:**
- Option B (Shared Component): Rejected because it requires changes to visitor code (out of scope)
- Option C (CSS-Only): Rejected because HTML structure would still differ, not "sama persis"

**Key tradeoffs accepted:**
- Card height increases (admin controls add ~60px)
- Arrow buttons replace drag-drop (simpler but less intuitive for some users)
- Price format changes from "Rp 12.000" to "12k" (less precise but consistent with visitor)

---

## Open Questions / Assumptions

| Question | Resolution | Risk if Wrong |
|----------|------------|---------------|
| Category reorder method | assumed: arrow buttons for categories too | Low — can revert to drag-drop if needed |
| Empty category display | assumed: show empty grid with category header | Low — cosmetic only |
| Long name overflow | assumed: CSS text-overflow handles gracefully | Low — can add max-height if needed |

---

## Implementation Notes

1. **renderMenu fix**: Add `badge` field to grouped data in `renderMenu` function
2. **CSS classes**: Map admin card classes to visitor card classes (`.menu__item-card`, `.menu__item-image`, etc.)
3. **Image path**: Admin uses `../images/` prefix (adjust from visitor's `images/`)
4. **Arrow buttons**: Replace DragDropService calls with arrow button event handlers
5. **Category reorder**: Add arrow buttons to category headers, replace drag-drop

---

## Rollback Plan

1. Git revert to previous commit
2. No database changes to rollback
3. No Firebase deployment needed (static files)
