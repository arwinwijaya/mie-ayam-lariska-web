# Execution Plan — Web App Comprehensive Improvement

> Spec: docs/pocket/spec/2026-06-18-web-app-comprehensive-improvement/comprehensive-improvement.md
> Created: 2026-06-18
> Tasks: 12 | TDD-structured

---

## Overview

Incremental migration plan to address all audit findings:
1. Security (blocker)
2. ES Modules migration
3. Unit tests
4. SEO
5. Accessibility

---

### Task 1: Tighten Firebase Security Rules [prereq]

## OBJECTIVE
Restrict Firebase write access to authenticated admin sessions only, while maintaining public read access for customers. Add data validation rules to reject invalid data.

Files:
- Modify: `database.rules.json`
- Modify: `js/admin-auth.js` (add session token generation)
- Test: `tests/e2e/admin-dashboard.spec.js` (update auth tests)

Steps:
1. Write failing test for: Public user cannot write to Firebase
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given a user without authentication, when they attempt to write to Firebase, then write is rejected with permission denied error

2. Write failing test for: Invalid data rejected by Firebase rules
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given invalid menu data (negative price, empty name), when writing to Firebase, then write is rejected

3. Run tests — verify FAIL:
   `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected failure: Tests pass (currently public can write, no validation)

4. Implement minimal code to satisfy the tests:
   File: `database.rules.json`
   Implement: Add auth validation rules AND data validation rules
   ```json
   {
     "rules": {
       "menu": {
         ".read": true,
         ".write": "root.child('admin_sessions').child(auth.uid).exists()",
         "$item_id": {
           ".validate": "newData.hasChildren(['name', 'category', 'price', 'status']) && newData.child('name').isString() && newData.child('name').val().length > 0 && newData.child('price').isNumber() && newData.child('price').val() >= 0 && newData.child('price').val() <= 999999"
         }
       },
       "packages": {
         ".read": true,
         ".write": "root.child('admin_sessions').child(auth.uid).exists()",
         "$package_id": {
           ".validate": "newData.hasChildren(['name', 'price']) && newData.child('name').isString() && newData.child('name').val().length > 0 && newData.child('price').isNumber() && newData.child('price').val() >= 1"
         }
       },
       "stock": {
         ".read": true,
         ".write": "root.child('admin_sessions').child(auth.uid).exists()",
         "$item_id": {
           ".validate": "newData.hasChildren(['status']) && (newData.child('status').val() === 'available' || newData.child('status').val() === 'limited' || newData.child('status').val() === 'sold_out')"
         }
       },
       "admin_sessions": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

5. Run tests — verify PASS:
   `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

6. Commit:
   `git add database.rules.json`
   `git commit -m "fix(security): tighten Firebase write rules with data validation"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-18-web-app-comprehensive-improvement/comprehensive-improvement.md — rule: Firebase Rules
- database.rules.json — current wide-open rules
- js/admin-auth.js — current auth implementation

## WHY THIS APPROACH
Justification: Firebase rules are the first line of defense. Tightening them prevents data destruction while maintaining customer read access.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Static files only constraint — no server-side validation possible]
You are implementing Firebase Security Rules for Mie Ayam Lariska Web.
Spec: docs/pocket/spec/2026-06-18-web-app-comprehensive-improvement/comprehensive-improvement.md
Design decision: No Firebase Auth — use rules with custom validation
Files in scope: database.rules.json, js/admin-auth.js
Test framework: Playwright E2E
Available after: None (prereq)
Architecture rule: Static files only, Firebase client-side SDK
[RESTATE: No server-side functions — all validation must be in Firebase rules]

## DELIVERABLE
Verification — task is DONE when all pass:

Given a public user, when they try to write to Firebase menu node, then write is rejected
Given a public user, when they read menu data, then data is returned
Given admin with valid session, when they write to Firebase, then write succeeds

All tests PASS. Commit exists with message matching `fix(security): tighten Firebase write rules to admin-only`.

## QUALITY BAR
Must-have:
  - Public read access maintained for customers
  - Write access restricted to authenticated sessions
  - Rules don't break existing functionality

Must-not-have:
  - Breaking customer read access
  - Adding Firebase Authentication SDK (out of scope)
  - Server-side validation

Open question risks:
  - How to generate valid admin session tokens without Firebase Auth → use custom token approach

Rollback note:
  - If rules break admin access, revert database.rules.json

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Uncertain when: Custom token approach doesn't work with Firebase rules
Escalate when: Firebase rules syntax errors or auth model incompatibility

---

### Task 2: Add Session Expiry Mechanism [depends: T1]

## OBJECTIVE
Implement 24-hour session expiry for admin authentication using localStorage timestamp.

Files:
- Modify: `js/admin-auth.js`
- Test: `tests/e2e/admin-dashboard.spec.js`

Steps:
1. Write failing test for: Admin session expires after 24 hours
   File: `tests/e2e/admin-dashboard.spec.js`
   Test verifies: Given admin logged in 25 hours ago, when they try to access dashboard, then redirect to login page

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected failure: Session never expires (currently just stores 'true')

3. Implement minimal code to satisfy the test:
   File: `js/admin-auth.js`
   Implement: Store `{value: 'true', timestamp: Date.now()}` and check expiry in `requireAuth()`

4. Run test — verify PASS:
   `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: PASS

5. Commit:
   `git add js/admin-auth.js`
   `git commit -m "fix(auth): add 24-hour session expiry mechanism"`

## REFERENCES LOADED
- js/admin-auth.js — current auth with localStorage boolean
- tests/e2e/admin-dashboard.spec.js — existing auth tests

## WHY THIS APPROACH
Justification: localStorage timestamp is simple, no server required, works with static site constraint.
Complexity: lightweight

## SANDWICH CONTEXT
[CRITICAL: Static files only — no server-side session management]
You are implementing session expiry for admin authentication.
Spec: docs/pocket/spec/2026-06-18-web-app-comprehensive-improvement/comprehensive-improvement.md
Design decision: localStorage with timestamp for 24-hour expiry
Files in scope: js/admin-auth.js
Test framework: Playwright E2E
Available after: T1
Architecture rule: No server-side functions
[RESTATE: All session management must be client-side]

## DELIVERABLE
Verification — task is DONE when all pass:

Given admin logs in, when 24 hours pass, then session expires and redirect to login
Given admin logs in, when checking within 24 hours, then session is valid
Given hardcoded fallback, when Firebase unavailable, then fallback credentials work

All tests PASS. Commit exists with message matching `fix(auth): add 24-hour session expiry mechanism`.

## QUALITY BAR
Must-have:
  - 24-hour expiry implemented
  - Hardcoded fallback preserved
  - Backward compatible with existing sessions

Must-not-have:
  - Firebase Authentication SDK
  - Server-side session storage

Open question risks:
  - Existing sessions without timestamp will be treated as expired → acceptable tradeoff

## STOP CONDITIONS
Done when: all DELIVERABLE scenarios pass, tests green, commit created
Escalate when: localStorage timestamp approach doesn't work in target browsers

---

### Task 3: Setup Vitest Framework [prereq]

## OBJECTIVE
Install and configure Vitest for unit testing JavaScript services.

Files:
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `tests/unit/setup.js`

Steps:
1. Install Vitest:
   `npm install -D vitest`

2. Create vitest.config.js:
   ```javascript
   import { defineConfig } from 'vitest/config';
   export default defineConfig({
     test: {
       environment: 'jsdom',
       setupFiles: ['./tests/unit/setup.js'],
       include: ['tests/unit/**/*.test.js'],
     },
   });
   ```

3. Create tests/unit/setup.js with mocks:
   ```javascript
   // Mock localStorage
   const localStorageMock = {
     getItem: vi.fn(),
     setItem: vi.fn(),
     removeItem: vi.fn(),
     clear: vi.fn(),
   };
   global.localStorage = localStorageMock;

   // Mock Firebase
   global.firebase = {
     initializeApp: vi.fn(),
     database: vi.fn(() => ({
       ref: vi.fn(),
     })),
   };
   ```

4. Add test script to package.json:
   ```json
   "scripts": {
     "test:unit": "vitest run",
     "test:unit:watch": "vitest"
   }
   ```

5. Verify setup:
   `npm run test:unit`
   Expected: Tests run (even if no tests exist yet)

6. Commit:
   `git add package.json vitest.config.js tests/unit/setup.js`
   `git commit -m "chore(testing): setup Vitest framework with mocks"`

7. Deduplicate getStatusText function:
   - Remove duplicate from main.js and admin inline script
   - Keep only in firebase-config.js on FirebaseService namespace
   - Import from FirebaseService where needed

8. Deduplicate BADGE_CONFIG:
   - Extract to shared config file or expose via FirebaseService
   - Remove duplicate from main.js and admin inline script

9. Commit deduplication:
   `git add js/firebase-config.js js/main.js`
   `git commit -m "refactor(dedup): centralize getStatusText and BADGE_CONFIG"`

## REFERENCES LOADED
- package.json — current dependencies
- tests/e2e/ — existing test patterns

## WHY THIS APPROACH
Justification: Vitest is fast, ESM-native, compatible with vanilla JS, and has good jsdom support.
Complexity: lightweight

## SANDWICH CONTEXT
You are setting up Vitest for Mie Ayam Lariska Web.
Spec: docs/pocket/spec/2026-06-18-web-app-comprehensive-improvement/comprehensive-improvement.md
Design decision: Vitest for unit testing
Files in scope: package.json, vitest.config.js, tests/unit/
Test framework: Vitest (being added)
Available after: None (prereq)
Architecture rule: DevDependency only

## DELIVERABLE
Verification — task is DONE when all pass:

Given Vitest installed, when running `npm run test:unit`, then test runner executes
Given test mocks, when running tests, then localStorage and Firebase are mocked

## QUALITY BAR
Must-have:
  - Vitest installed as devDependency
  - jsdom environment configured
  - localStorage and Firebase mocks ready

Must-not-have:
  - Production dependencies added
  - Changes to existing test files

## STOP CONDITIONS
Done when: Vitest runs successfully with mocks
Escalate when: Vitest incompatible with project setup

---

### Task 4: Convert firebase-config.js to ES Module [depends: T3]

## OBJECTIVE
Convert firebase-config.js from IIFE pattern to ES module with import/export. Maintain backward compatibility via window.FirebaseService alias.

Files:
- Modify: `js/firebase-config.js`
- Create: `tests/unit/firebase-config.test.js`

Steps:
1. Write failing test for: FirebaseService exports correctly
   File: `tests/unit/firebase-config.test.js`
   Test verifies: Given firebase-config.js loaded, when importing FirebaseService, then all public methods exist

2. Write failing test for: Backward compatibility
   File: `tests/unit/firebase-config.test.js`
   Test verifies: Given firebase-config.js loaded, when accessing window.FirebaseService, then still works

3. Run tests — verify FAIL:
   `npm run test:unit`
   Expected failure: Cannot import from IIFE module

4. Implement conversion:
   File: `js/firebase-config.js`
   - Remove IIFE wrapper
   - Change `window.FirebaseService = {...}` to `export const FirebaseService = {...}`
   - Add backward compatibility: `window.FirebaseService = FirebaseService`
   - Add `export default FirebaseService`

5. Run tests — verify PASS:
   `npm run test:unit`
   Expected: PASS

6. Commit:
   `git add js/firebase-config.js tests/unit/firebase-config.test.js`
   `git commit -m "refactor(modules): convert firebase-config.js to ES module with backward compat"`

## REFERENCES LOADED
- js/firebase-config.js — current IIFE pattern with window.FirebaseService

## WHY THIS APPROACH
Justification: firebase-config.js is the core module — converting it first establishes the pattern for other modules.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: All other modules depend on FirebaseService]
You are converting firebase-config.js to ES module.
Spec: docs/pocket/spec/2026-06-18-web-app-comprehensive-improvement/comprehensive-improvement.md
Design decision: ES modules with import/export
Files in scope: js/firebase-config.js
Test framework: Vitest
Available after: T3
Architecture rule: Maintain backward compatibility during transition
[RESTATE: Other modules depend on FirebaseService — must be accessible]

## DELIVERABLE
Verification — task is DONE when all pass:

Given firebase-config.js converted, when importing FirebaseService, then all methods available
Given other modules, when using window.FirebaseService, then still works (backward compat)

All tests PASS. Commit exists.

## QUALITY BAR
Must-have:
  - ES module export syntax
  - All public methods preserved
  - Backward compatibility via window.FirebaseService alias

Must-not-have:
  - Breaking other modules that depend on FirebaseService
  - Removing public API methods

## STOP CONDITIONS
Done when: module exports correctly, tests pass
Escalate when: Firebase SDK incompatible with ES modules

---

### Task 5: Convert stock-service.js to ES Module [depends: T4]

## OBJECTIVE
Convert stock-service.js from IIFE to ES module.

Files:
- Modify: `js/stock-service.js`
- Create: `tests/unit/stock-service.test.js`

Steps:
1. Write failing tests for: StockService normalization and caching
   File: `tests/unit/stock-service.test.js`
   Tests verify:
   - normalizeStockStatus('INVALID') returns 'sold_out'
   - saveStockData stores in localStorage
   - getCachedStockData retrieves from localStorage

2. Run test — verify FAIL:
   `npm run test:unit`

3. Implement conversion:
   - Remove IIFE wrapper
   - Add `import { FirebaseService } from './firebase-config.js'`
   - Change to `export const StockService = {...}`

4. Run test — verify PASS:
   `npm run test:unit`

5. Commit:
   `git add js/stock-service.js tests/unit/stock-service.test.js`
   `git commit -m "refactor(modules): convert stock-service.js to ES module"`

## REFERENCES LOADED
- js/stock-service.js — current IIFE with normalization logic

## WHY THIS APPROACH
Justification: StockService has good logic for testing — normalization, caching, merge.
Complexity: standard

## SANDWICH CONTEXT
You are converting stock-service.js to ES module.
Files in scope: js/stock-service.js
Available after: T4

## DELIVERABLE
Given stock-service.js converted, when importing StockService, then all methods available
Given normalization test, when invalid status, then returns 'sold_out'

All tests PASS. Commit exists.

## QUALITY BAR
Must-have:
  - ES module export syntax
  - Import FirebaseService correctly
  - All public methods preserved
  - Backward compatibility via window.StockService alias

Must-not-have:
  - Breaking main.js that depends on StockService
  - Removing normalization logic

## STOP CONDITIONS
Done when: module exports correctly, tests pass
Escalate when: Import cycle detected with firebase-config.js

---

### Task 6: Convert menu-service.js to ES Module [depends: T4]

## OBJECTIVE
Convert menu-service.js from IIFE to ES module.

Files:
- Modify: `js/menu-service.js`
- Create: `tests/unit/menu-service.test.js`

Steps:
1. Write failing tests for: MenuService validation
   File: `tests/unit/menu-service.test.js`
   Tests verify:
   - createMenuItem with missing name throws error
   - createMenuItem with valid data succeeds
   - Price validation (0-999999)

2. Run test — verify FAIL

3. Implement conversion + ensure validation logic

4. Run test — verify PASS

5. Commit:
   `git add js/menu-service.js tests/unit/menu-service.test.js`
   `git commit -m "refactor(modules): convert menu-service.js to ES module"`

## DELIVERABLE
Given menu-service.js converted, when importing MenuService, then all methods available
Given validation tests, when invalid input, then proper errors thrown

All tests PASS. Commit exists.

## QUALITY BAR
Must-have:
  - ES module export syntax
  - Import FirebaseService correctly
  - Validation logic preserved
  - Backward compatibility via window.MenuService alias

Must-not-have:
  - Breaking admin dashboard that depends on MenuService
  - Weakening validation rules

## STOP CONDITIONS
Done when: module exports correctly, tests pass
Escalate when: Validation logic breaks after conversion

---

### Task 7: Convert packages-service.js to ES Module [depends: T4]

## OBJECTIVE
Convert packages-service.js from IIFE to ES module.

Files:
- Modify: `js/packages-service.js`
- Create: `tests/unit/packages-service.test.js`

Steps:
1. Write failing tests for: PackagesService validation
   File: `tests/unit/packages-service.test.js`
   Tests verify:
   - add with price 0 throws error (MIN_PRICE = 1)
   - add with valid data succeeds
   - items array validation

2. Run test — verify FAIL

3. Implement conversion

4. Run test — verify PASS

5. Commit:
   `git add js/packages-service.js tests/unit/packages-service.test.js`
   `git commit -m "refactor(modules): convert packages-service.js to ES module"`

## DELIVERABLE
Given packages-service.js converted, when importing PackagesService, then all methods available
Given validation tests, when invalid price, then proper error thrown

All tests PASS. Commit exists.

## QUALITY BAR
Must-have:
  - ES module export syntax
  - Import FirebaseService correctly
  - MIN_PRICE = 1 constraint preserved
  - Backward compatibility via window.PackagesService alias

Must-not-have:
  - Breaking admin dashboard that depends on PackagesService
  - Changing validation rules (MIN_PRICE stays 1)

## STOP CONDITIONS
Done when: module exports correctly, tests pass
Escalate when: Validation inconsistency between services

---

### Task 8: Convert Remaining Services to ES Modules [depends: T5, T6, T7]

## OBJECTIVE
Convert remaining 6 service files to ES modules with backward compatibility.

Files:
- Modify: `js/main.js`
- Modify: `js/admin-auth.js`
- Modify: `js/firebase-connection-service.js`
- Modify: `js/description-templates.js`
- Modify: `js/drag-drop-service.js`
- Modify: `js/image-upload-service.js`
- Create: `tests/unit/description-templates.test.js`
- Create: `tests/unit/admin-auth.test.js`

Steps:
1. Write failing test for: DescriptionTemplates exports correctly
   File: `tests/unit/description-templates.test.js`
   Test verifies: Given description-templates.js loaded, when importing, then generateDescription function exists

2. Write failing test for: AdminAuth exports correctly
   File: `tests/unit/admin-auth.test.js`
   Test verifies: Given admin-auth.js loaded, when importing, then login/logout functions exist

3. Run tests — verify FAIL

4. Convert each file from IIFE to ES module:
   - Remove IIFE wrapper
   - Add import statements for dependencies
   - Add export statements
   - Add backward compatibility via window.* alias

5. Run tests — verify PASS

6. Commit:
   `git add js/*.js tests/unit/description-templates.test.js tests/unit/admin-auth.test.js`
   `git commit -m "refactor(modules): convert remaining services to ES modules"`

## QUALITY BAR
Must-have:
  - All 6 files converted to ES modules
  - Backward compatibility via window.* alias
  - Import dependencies correctly

Must-not-have:
  - Breaking existing functionality
  - Removing public API methods

## STOP CONDITIONS
Done when: all files converted, tests pass
Escalate when: circular dependency detected between modules

## DELIVERABLE
All 9 service files use ES module syntax

---

### Task 9: Extract Inline Scripts [depends: T8]

## OBJECTIVE
Extract all inline scripts from HTML files to separate JS files.

Files:
- Modify: `index.html` (remove ~200 lines inline script for packages rendering)
- Create: `js/packages-renderer.js`
- Modify: `admin/index.html` (remove ~800 lines inline script for admin CRUD)
- Create: `js/admin-dashboard.js`
- Create: `tests/unit/packages-renderer.test.js`
- Create: `tests/unit/admin-dashboard.test.js`

Steps:
1. Write failing test for: Packages renderer loads correctly
   File: `tests/unit/packages-renderer.test.js`
   Test verifies: Given packages-renderer.js loaded, when importing, then renderPackages function exists

2. Write failing test for: Admin dashboard loads correctly
   File: `tests/unit/admin-dashboard.test.js`
   Test verifies: Given admin-dashboard.js loaded, when importing, then initDashboard function exists

3. Run tests — verify FAIL

4. Extract packages renderer from index.html:
   - Identify the ~200 line IIFE block that renders packages from Firebase
   - Move to js/packages-renderer.js with ES module syntax
   - Add `import { FirebaseService } from './firebase-config.js'`
   - Update index.html to use `<script type="module" src="js/packages-renderer.js"></script>`

5. Extract admin CRUD from admin/index.html:
   - Identify the ~800 line inline script for menu/packages CRUD
   - Move to js/admin-dashboard.js with ES module syntax
   - Add imports for FirebaseService, MenuService, PackagesService
   - Update admin/index.html to use `<script type="module" src="js/admin-dashboard.js"></script>`

6. Run tests — verify PASS

7. Commit:
   `git add index.html admin/index.html js/packages-renderer.js js/admin-dashboard.js tests/unit/packages-renderer.test.js tests/unit/admin-dashboard.test.js`
   `git commit -m "refactor(modules): extract inline scripts to separate files"`

## QUALITY BAR
Must-have:
  - No inline <script> blocks in HTML files
  - All JavaScript in external files with ES module syntax
  - Functionality preserved after extraction

Must-not-have:
  - Breaking existing functionality
  - Inline event handlers (onclick, onerror) — these are acceptable

## STOP CONDITIONS
Done when: inline scripts extracted, tests pass
Escalate when: inline script has tight coupling to HTML that prevents extraction

## DELIVERABLE
No inline <script> blocks in HTML files
All JavaScript in external files with ES module syntax

---

### Task 10: Write Unit Tests for All Services [depends: T8, T9]

## OBJECTIVE
Write comprehensive unit tests for all service modules including extracted inline scripts.

Files:
- Expand: `tests/unit/firebase-config.test.js`
- Expand: `tests/unit/stock-service.test.js`
- Expand: `tests/unit/menu-service.test.js`
- Expand: `tests/unit/packages-service.test.js`
- Expand: `tests/unit/description-templates.test.js`
- Expand: `tests/unit/admin-auth.test.js`
- Create: `tests/unit/firebase-connection-service.test.js`
- Create: `tests/unit/drag-drop-service.test.js`
- Create: `tests/unit/image-upload-service.test.js`
- Expand: `tests/unit/packages-renderer.test.js`
- Expand: `tests/unit/admin-dashboard.test.js`
- Create: `tests/unit/main.test.js`

Steps:
1. Write tests for firebase-connection-service:
   - Connection status monitoring
   - Reconnect logic

2. Write tests for drag-drop-service:
   - Drag start/end handlers
   - Mobile arrow button fallback

3. Write tests for image-upload-service:
   - File type validation (JPG/PNG/WebP)
   - File size validation (max 2MB)
   - getImagePath slug generation

4. Write tests for main.js:
   - initApp function
   - Navigation toggle
   - FAQ accordion

5. Write edge case tests for all services:
   - Price as string vs number
   - Name with whitespace only
   - Description with HTML tags (XSS prevention)
   - Unicode characters
   - Empty arrays
   - Null/undefined inputs

6. Run full test suite:
   `npm run test:unit`
   Expected: All tests pass in < 10 seconds

7. Commit:
   `git add tests/unit/`
   `git commit -m "test(unit): add comprehensive tests for all services"`

## QUALITY BAR
Must-have:
  - All 9 services have unit tests
  - Edge cases covered for validation functions
  - Test suite runs in < 10 seconds
  - Tests can run without Firebase connection

Must-not-have:
  - Tests that depend on real Firebase
  - Flaky tests with hardcoded timeouts

## STOP CONDITIONS
Done when: all services tested, suite passes in < 10s
Escalate when: jsdom limitations prevent testing certain features

## DELIVERABLE
All services have unit tests
Edge cases covered
Test suite runs in < 10 seconds

---

### Task 11: Add SEO Meta Tags & Structured Data [prereq]

## OBJECTIVE
Add complete SEO meta tags, JSON-LD structured data, robots.txt, and sitemap.xml.

Files:
- Modify: `index.html`
- Modify: `admin/login.html`
- Modify: `admin/index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Modify: `tests/e2e/customer-dashboard.spec.js`

Steps:
1. Write failing test for: og:image meta tag exists
   File: `tests/e2e/customer-dashboard.spec.js`
   Test verifies: Given index.html loaded, when checking meta tags, then og:image exists with valid URL

2. Write failing test for: JSON-LD structured data exists
   File: `tests/e2e/customer-dashboard.spec.js`
   Test verifies: Given index.html loaded, when checking for JSON-LD, then Restaurant schema exists

3. Run tests — verify FAIL

4. Add og:image, og:url, twitter:card to index.html:
   ```html
   <meta property="og:image" content="https://mie-ayam-lariska-web.web.app/images/hero-mie-ayam.jpg">
   <meta property="og:url" content="https://mie-ayam-lariska-web.web.app/">
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="Mie Ayam Lariska">
   <meta name="twitter:description" content="Mie Ayam Enak, Topping Bisa Mix Suka-Suka">
   <meta name="twitter:image" content="https://mie-ayam-lariska-web.web.app/images/hero-mie-ayam.jpg">
   ```

5. Add JSON-LD Restaurant schema to index.html:
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Restaurant",
     "name": "Mie Ayam Lariska",
     "image": "https://mie-ayam-lariska-web.web.app/images/hero-mie-ayam.jpg",
     "address": {
       "@type": "PostalAddress",
       "addressLocality": "...",
       "addressCountry": "ID"
     },
     "openingHours": "Mo-Sa 10:00-18:00",
     "priceRange": "$$",
     "telephone": "+6281364856560",
     "servesCuisine": "Indonesian",
     "menu": "https://mie-ayam-lariska-web.web.app/#menu"
   }
   </script>
   ```

6. Add canonical URLs to all pages
7. Add `<meta name="robots" content="noindex">` to admin pages
8. Create robots.txt:
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /init-menu.html
   Disallow: /init-stock.html
   Sitemap: https://mie-ayam-lariska-web.web.app/sitemap.xml
   ```

9. Create sitemap.xml

10. Run tests — verify PASS

11. Commit:
   `git add index.html admin/login.html admin/index.html robots.txt sitemap.xml tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(seo): add complete SEO meta tags and structured data"`

## QUALITY BAR
Must-have:
  - og:image, og:url, twitter:card meta tags
  - JSON-LD Restaurant schema
  - robots.txt with admin pages excluded
  - sitemap.xml
  - Canonical URLs

Must-not-have:
  - Broken links in sitemap
  - Admin pages indexable by search engines

## STOP CONDITIONS
Done when: all SEO elements present, tests pass
Escalate when: JSON-LD validation fails in Google Rich Results Test

## DELIVERABLE
WhatsApp/Facebook share shows image + title + description
Google Search shows rich results
Admin pages excluded from search

---

### Task 12: Add Accessibility Improvements [depends: T9]

## OBJECTIVE
Add skip-to-content link, ARIA live regions, error states, and accessibility improvements.

Files:
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`
- Modify: `tests/e2e/customer-dashboard.spec.js`

Steps:
1. Write failing test for: Skip-to-content link exists
   File: `tests/e2e/customer-dashboard.spec.js`
   Test verifies: Given index.html loaded, when checking first child of body, then skip-link exists

2. Write failing test for: Error state shown when Firebase fails
   File: `tests/e2e/customer-dashboard.spec.js`
   Test verifies: Given Firebase fails, when 5 seconds pass, then error banner shown with "Menampilkan data tersimpan"

3. Run tests — verify FAIL

4. Add skip-to-content link as first child of body:
   ```html
   <a href="#menu" class="skip-link">Langsung ke menu</a>
   ```

5. Add CSS for skip-link (visually hidden, visible on focus):
   ```css
   .skip-link {
     position: absolute;
     top: -40px;
     left: 0;
     background: var(--color-primary);
     color: white;
     padding: 8px;
     z-index: 100;
     transition: top 0.3s;
   }
   .skip-link:focus {
     top: 0;
   }
   ```

6. Add aria-live="polite" to menu section:
   ```html
   <section id="menu" data-section="menu" class="menu" aria-live="polite">
   ```

7. Add prefers-reduced-motion media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

8. Add aria-controls to FAQ buttons:
   ```html
   <button class="faq__question" aria-expanded="false" aria-controls="faq-answer-1">
   ```

9. Add error state for Firebase failure in main.js:
   ```javascript
   // After 5 seconds, if no data, show error banner
   setTimeout(() => {
     if (!dataLoaded) {
       showErrorBanner('Menampilkan data tersimpan');
     }
   }, 5000);
   ```

10. Ensure touch targets >= 44x44px for order buttons

11. Add defer attribute to Firebase SDK scripts in index.html:
    ```html
    <script defer src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script defer src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
    ```

12. Move admin scripts from <head> to end of <body> with defer:
    ```html
    <!-- Before </body> -->
    <script defer src="../js/firebase-config.js"></script>
    <script defer src="../js/menu-service.js"></script>
    ```

13. Run tests — verify PASS

14. Commit:
   `git add index.html css/style.css js/main.js tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(a11y): add accessibility improvements and error states"`

## QUALITY BAR
Must-have:
  - Skip-to-content link works
  - ARIA live regions for dynamic updates
  - prefers-reduced-motion support
  - Error state for Firebase failure
  - Touch targets >= 44x44px

Must-not-have:
  - Excessive screen reader announcements
  - Breaking existing layout

## STOP CONDITIONS
Done when: all accessibility features work, tests pass
Escalate when: ARIA implementation conflicts with existing JavaScript

## DELIVERABLE
Skip-to-content link works
Screen readers announce stock updates
Reduced motion respected
Keyboard navigation works

---

## Execution Order

```
T1 (Security Rules) ──→ T2 (Session Expiry)
        ↓
T3 (Vitest Setup) ──→ T4 (firebase-config.js) ──→ T5, T6, T7 (parallel)
                                                        ↓
                                                    T8 (remaining)
                                                        ↓
                                                    T9 (extract inline)
                                                        ↓
                                                    T10 (unit tests)

T11 (SEO) ──→ (independent, can run anytime)
T12 (Accessibility) ──→ (depends on T9)
```

---

*Plan created: 2026-06-18*
*12 tasks, TDD-structured*
