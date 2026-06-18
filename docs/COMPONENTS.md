# Component Library

All reusable components in this project.
Generated from source — props match actual implementation.

---

## Customer Interface Components

### Navigation

**File:** `index.html`

Main navigation bar with responsive hamburger menu for mobile devices.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.nav` | Main navigation container |
| `.nav__brand` | Brand name display |
| `.nav__toggle` | Mobile menu toggle button |
| `.nav__toggle-bar` | Hamburger menu bars |
| `.nav__menu` | Navigation menu list |

**Usage:**
```html
<nav class="nav" role="navigation" aria-label="Navigasi utama">
  <div class="nav__brand">Mie Ayam Lariska</div>
  <button class="nav__toggle" aria-label="Buka menu" aria-expanded="false">
    <span class="nav__toggle-bar"></span>
    <span class="nav__toggle-bar"></span>
    <span class="nav__toggle-bar"></span>
  </button>
  <ul class="nav__menu">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#packages">Paket</a></li>
    <li><a href="#events">Acara</a></li>
    <li><a href="#location">Lokasi</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
</nav>
```

**States:**
| State | When | What renders |
|-------|------|--------------|
| Default | Desktop viewport | Horizontal menu items |
| Mobile | Mobile viewport | Hamburger menu with toggle |
| Expanded | Menu toggled | Full menu visible |

---

### Hero Section

**File:** `index.html`

Hero section with brand name, tagline, description, and call-to-action buttons.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.hero` | Hero section container |
| `.hero__content` | Text content container |
| `.hero__brand` | Brand name |
| `.hero__tagline` | Tagline text |
| `.hero__description` | Description text |
| `.hero__cta-group` | CTA buttons container |
| `.hero__cta-primary` | Primary CTA button |
| `.hero__cta-secondary` | Secondary CTA button |
| `.hero__image` | Image container |
| `.hero__image-placeholder` | Image placeholder |

**Usage:**
```html
<section data-section="hero" class="hero">
  <div class="hero__content">
    <h1 class="hero__brand">Mie Ayam Lariska</h1>
    <p class="hero__tagline">Mie Ayam Enak, Topping Bisa Mix Suka-Suka</p>
    <p class="hero__description">Nikmati mie ayam hangat dengan banyak pilihan topping...</p>
    <div class="hero__cta-group">
      <a href="https://wa.me/6281364856560" class="btn btn--whatsapp hero__cta-primary">
        Pesan Sekarang via WhatsApp
      </a>
      <a href="https://maps.app.goo.gl/YjTAt7H2YGtyGfvN7" class="btn btn--secondary hero__cta-secondary">
        Lihat Lokasi di Maps
      </a>
    </div>
  </div>
</section>
```

---

### Why Choose Us Section

**File:** `index.html`

Value proposition cards explaining why customers should choose Mie Ayam Lariska.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.why` | Section container |
| `.why__grid` | Cards grid layout |
| `.why__card` | Individual card |
| `.why__icon` | Card icon |
| `.why__card-title` | Card title |
| `.why__card-text` | Card description |

**Cards:**
1. Banyak Pilihan Menu
2. Topping Bisa Mix
3. Harga Ramah Kantong
4. Bisa Pesan untuk Acara

---

### Menu Section

**File:** `index.html`

Menu display with categories, items, images, prices, and stock badges.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.menu` | Section container |
| `.menu__category` | Category container |
| `.menu__category-title` | Category title |
| `.menu__grid` | Items grid layout |
| `.menu__item-card` | Item card |
| `.menu__item-image` | Item image container |
| `.menu__item-image-placeholder` | Image placeholder |
| `.menu__item-info` | Item info container |
| `.menu__item-name` | Item name |
| `.menu__item-description` | Item description |
| `.menu__item-price` | Item price |
| `.menu__item-badge` | Badge (favorit/baru/bestseller/populer) |
| `.menu__stock-badge` | Stock status badge |
| `.menu__order-btn` | WhatsApp order button |

**Categories:**
1. Mie Ayam (11 items)
2. Minuman (5 items)
3. Topping Tambahan (8 items)

**Stock Badge States:**
| Status | Class | Text |
|--------|-------|------|
| Available | `.menu__stock-badge--available` | Tersedia |
| Limited | `.menu__stock-badge--limited` | Terbatas |
| Sold Out | `.menu__stock-badge--sold_out` | Habis |

---

### Packages Section

**File:** `index.html`

Recommended packages with pre-filled WhatsApp messages. Dynamic display from Firebase.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.packages` | Section container |
| `.packages__featured` | Featured package card |
| `.packages__grid` | Cards grid layout |
| `.packages__card` | Package card |
| `.packages__card-header` | Card header with icon and tag |
| `.packages__card-icon` | Package icon (emoji) |
| `.packages__card-tag` | Package tag badge |
| `.packages__card-name` | Package name |
| `.packages__card-items` | Package items list |
| `.packages__card-price` | Package price |
| `.packages__card-description` | Package description |
| `.packages__card-btn` | WhatsApp order button |

**Packages:**
1. Paket Lengkap (Featured)
2. Paket Favorit
3. Paket Kenyang
4. Paket Spesial

---

### Events Section

**File:** `index.html`

Event catering information and WhatsApp contact.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.events` | Section container |
| `.events__content` | Content container |
| `.events__text` | Description text |
| `.events__cta` | CTA button |

---

### Location Section

**File:** `index.html`

Location information with Google Maps embed.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.location` | Section container |
| `.location__content` | Content container |
| `.location__info` | Info container |
| `.location__address` | Address text |
| `.location__name` | Business name |
| `.location__hours` | Business hours |
| `.location__map` | Map container |
| `.location__map-placeholder` | Map placeholder |

**Business Hours:** 10:00-18:00 WIB

---

### FAQ Section

**File:** `index.html`

Accordion-style FAQ display with 10 questions.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.faq` | Section container |
| `.faq__list` | FAQ items list |
| `.faq__item` | FAQ item container |
| `.faq__question` | Question button |
| `.faq__icon` | Toggle icon |
| `.faq__answer` | Answer container |

**FAQ Items:**
1. Jam buka Mie Ayam Lariska jam berapa?
2. Bisa pesan lewat WhatsApp?
3. Bisa pesan untuk acara?
4. Lokasinya di mana?
5. Bisa tambah topping?
6. Apakah ada paket hemat?
7. Berapa harga mie ayamnya?
8. Apakah bisa delivery?
9. Apakah ada menu minuman?
10. Bagaimana cara pesan untuk acara?

---

### Footer

**File:** `index.html`

Footer with contact information and links.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.footer` | Footer container |
| `.footer__grid` | Content grid |
| `.footer__brand` | Brand info |
| `.footer__brand-name` | Brand name |
| `.footer__brand-tagline` | Brand tagline |
| `.footer__brand-since` | Since year |
| `.footer__contact` | Contact info |
| `.footer__info` | Additional info |
| `.footer__heading` | Section heading |
| `.footer__list` | Links list |
| `.footer__bottom` | Copyright |

---

### Skeleton Loading

**File:** `index.html`

Shimmer animation placeholders while Firebase loads.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.skeleton` | Skeleton container |
| `.skeleton__card` | Skeleton card |
| `.skeleton__image` | Skeleton image placeholder |
| `.skeleton__text` | Skeleton text line |
| `.skeleton__text--short` | Short text line |
| `.skeleton__text--long` | Long text line |

**Behavior:**
- Shows while Firebase data is loading
- Smooth transition when data arrives
- Optimistic "Tersedia" badges before Firebase data

---

### Image Popup

**File:** `index.html`

Hover preview on desktop (non-touch devices).

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.image-popup` | Popup container |
| `.image-popup__img` | Popup image |

**Behavior:**
- 300ms delay before showing
- Responsive positioning
- Disabled on mobile devices (touch)

---

## Admin Interface Components

### Login Form

**File:** `admin/login.html`

Admin login form with username and password fields.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.admin-login` | Login page container |
| `.admin-login__card` | Login card |
| `.admin-login__header` | Header section |
| `.admin-login__brand` | Brand name |
| `.admin-login__title` | Login title |
| `.form-group` | Form field group |
| `.form-label` | Field label |
| `.form-input` | Input field |
| `.login-button` | Submit button |
| `.error-message` | Error display |

**HTML Elements:**
| Element | ID | Purpose |
|---------|-----|---------|
| Form | `#login-form` | Login form container |
| Input | `#username` | Username field |
| Input | `#password` | Password field |
| Button | `#login-button` | Submit button |
| Div | `#error-message` | Error message display |

**States:**
| State | When | What renders |
|-------|------|--------------|
| Default | Page load | Empty form |
| Error | Invalid credentials | Error message displayed |
| Success | Valid credentials | Redirect to admin dashboard |

---

### Admin Dashboard Header

**File:** `admin/index.html`

Dashboard header with brand, connection status, and controls.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.admin-header` | Header container |
| `.admin-header__brand` | Brand name |
| `.admin-header__subtitle` | "Dashboard Admin" subtitle |
| `.admin-header__status` | Connection status indicator |
| `.admin-header__status-dot` | Status dot (green/red) |
| `.admin-header__status-text` | Status text |
| `.admin-header__reconnect` | Reconnect button |
| `.admin-header__logout` | Logout button |

---

### Tab Navigation

**File:** `admin/index.html`

Tab navigation between Menu and Paket sections.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.tab-nav` | Tab navigation container |
| `.tab-nav__item` | Tab item |
| `.tab-nav__item--active` | Active tab |

**Tabs:**
1. Menu — Menu items management
2. Paket — Packages management

---

### Menu Grid (Admin)

**File:** `admin/index.html`

Menu items displayed in grid cards matching visitor layout.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.admin-menu` | Menu section container |
| `.admin-menu__header` | Section header with Add button |
| `.admin-menu__grid` | Items grid layout |
| `.admin-menu__card` | Item card |
| `.admin-menu__card-image` | Item image |
| `.admin-menu__card-info` | Item info |
| `.admin-menu__card-name` | Item name |
| `.admin-menu__card-category` | Item category |
| `.admin-menu__card-price` | Item price |
| `.admin-menu__card-status` | Status badge |
| `.admin-menu__card-badge` | Item badge |
| `.admin-menu__card-actions` | Edit/Delete/Arrow buttons |
| `.admin-menu__card-edit` | Edit button |
| `.admin-menu__card-delete` | Delete button |
| `.admin-menu__card-arrow` | Arrow buttons for reordering |

---

### Packages Table (Admin)

**File:** `admin/index.html`

Packages displayed in table format with Edit/Delete actions.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.admin-packages` | Packages section container |
| `.admin-packages__header` | Section header with Add button |
| `.admin-packages__table` | Table container |
| `.admin-packages__row` | Table row |
| `.admin-packages__cell` | Table cell |
| `.admin-packages__actions` | Edit/Delete buttons |

---

### Add/Edit Menu Modal

**File:** `admin/index.html`

Modal form for adding/editing menu items.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.modal` | Modal container |
| `.modal__overlay` | Modal overlay |
| `.modal__content` | Modal content |
| `.modal__header` | Modal header |
| `.modal__title` | Modal title |
| `.modal__close` | Close button |
| `.modal__body` | Modal body |
| `.modal__footer` | Modal footer |

**Form Fields:**
| Field | Type | Validation |
|-------|------|------------|
| Name | text | max 100 chars |
| Category | datalist | required |
| Price | number | 0-999999 |
| Description | textarea | max 200 chars, auto-generate button |
| Image | file | JPG/PNG/WebP, max 2MB |
| Status | select | available/limited/sold_out |
| Badge | select | favorit/baru/bestseller/populer/none |
| Position | number | for ordering |

---

### Add/Edit Package Modal

**File:** `admin/index.html`

Modal form for adding/editing packages.

**Form Fields:**
| Field | Type | Validation |
|-------|------|------------|
| Name | text | max 100 chars |
| Description | textarea | max 300 chars |
| Icon | text | emoji |
| Items | checkboxes | from menu items |
| Price | number | 1-999999 |
| Tag | select | Basic/Best Seller/Puas/Spesial |
| Featured | checkbox | isFeatured flag |
| Status | checkbox | isActive flag |
| WhatsApp Message | textarea | pre-filled message |

---

### Delete Confirmation Modal

**File:** `admin/index.html`

Confirmation dialog for delete actions.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.modal--delete` | Delete modal variant |
| `.modal__confirm` | Confirm button |
| `.modal__cancel` | Cancel button |

---

### Stock Error Indicator

**File:** `index.html`

Error indicator banner shown when displaying cached (stale) data.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.stock-error` | Error container |
| `.stock-error__text` | Error text |

**HTML Elements:**
| Element | ID | Purpose |
|---------|-----|---------|
| Div | `#stock-error-indicator` | Error indicator container |

**States:**
| State | When | What renders |
|-------|------|--------------|
| Hidden | Normal operation | Element hidden |
| Visible | Firebase connection failure | Error message shown |

---

## Button Components

### WhatsApp Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn` | Base button |
| `.btn--whatsapp` | WhatsApp styled button |

### Primary Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn--primary` | Primary action button |

### Secondary Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn--secondary` | Secondary action button |

### Disabled Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn--disabled` | Disabled state button |

---

## Utility Classes

### Container

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.container` | Max-width container with padding |

### Section Title

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.section__title` | Section heading |

### Price

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.price` | Price display |

---

*Generated by vibe-document on 2026-06-15*
*Updated on 2026-06-17*
*Source: index.html, admin/login.html, admin/index.html*
