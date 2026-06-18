# Mie Ayam Lariska Web

Website untuk restoran mie ayam rumahan dengan menu lengkap, pemesanan via WhatsApp, dan manajemen stok admin.

---

## For the team

### What this is

Mie Ayam Lariska Web adalah website statis untuk restoran mie ayam di Indonesia. Website ini menyediakan tampilan menu dengan status stok real-time, sistem pemesanan via WhatsApp, dashboard admin untuk manajemen menu dan paket, serta fitur-fitur pendukung seperti upload gambar, drag-drop reordering, dan auto-generate deskripsi. Menggunakan Firebase Realtime Database untuk penyimpanan data dan Firebase Hosting untuk deployment.

### Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Browser (vanilla JS) | ES6+ |
| **Backend** | Firebase Realtime Database | Latest |
| **Hosting** | Firebase Hosting | Latest |
| **Testing** | Playwright | ^1.52.0 |
| **Server** | Node.js (for testing) | >=18 |

### Getting started

```bash
# Install dependencies
npm install

# Development (no build step - direct file editing)
# Open index.html in browser or use live server

# Serve locally (for testing)
npx serve . -l 3000

# Run tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with Playwright UI
npm run test:ui

# Deploy to Firebase
firebase deploy
```

### Project structure

```
mie-ayam-lariska-web/
├── admin/                        # Admin interface
│   ├── login.html                # Admin login page
│   └── index.html                # Admin dashboard (menu & packages CRUD)
├── css/                          # Stylesheets
│   ├── style.css                 # Main brand styles (~1200 lines)
│   └── admin.css                 # Admin-specific styles (~600 lines)
├── js/                           # JavaScript modules
│   ├── firebase-config.js        # Firebase init, menu/packages/stock API
│   ├── stock-service.js          # localStorage caching layer
│   ├── main.js                   # Customer page interactivity
│   ├── admin-auth.js             # Admin authentication
│   ├── menu-service.js           # Menu CRUD operations
│   ├── packages-service.js       # Packages CRUD operations
│   ├── firebase-connection-service.js  # Connection monitoring
│   ├── description-templates.js  # Auto-generate descriptions
│   ├── drag-drop-service.js      # Drag-and-drop reordering
│   └── image-upload-service.js   # Image upload/rename/download
├── images/                       # Menu item photos (25 JPG files)
├── tests/                        # Test files
│   └── e2e/                      # Playwright E2E tests
├── docs/                         # Documentation
│   └── pocket/                   # Pocket workflow docs
├── vibe/                         # Vibe framework docs
├── init-menu.html                # Utility: initialize menu data in Firebase
├── init-stock.html               # Utility: initialize stock data in Firebase
├── index.html                    # Main customer-facing page
├── firebase.json                 # Firebase configuration
├── database.rules.json           # Firebase Realtime DB rules
└── package.json                  # Node.js dependencies
```

### Architecture

Website ini menggunakan arsitektur statis dengan IIFE JavaScript modules. Tidak ada build process atau framework. Firebase Realtime Database digunakan untuk penyimpanan data menu, paket, dan stok dengan client-side SDK saja. Admin authentication menggunakan hardcoded credentials dengan localStorage session.

**Data Model:**
- `menu/` — 24 menu items dengan name, category, price, description, status, badge, order
- `packages/` — 4 paket rekomendasi dengan items selection, price, tag, featured flag
- `stock/` — Backward compatibility alias untuk menu status

**Services Layer:**
- `FirebaseService` — Firebase initialization & CRUD API
- `StockService` — localStorage caching dengan offline fallback
- `MenuService` — Menu validation & CRUD operations
- `PackagesService` — Packages validation & CRUD operations
- `FirebaseConnectionService` — Real-time connection monitoring
- `DescriptionTemplates` — Auto-generate marketing descriptions
- `DragDropService` — Drag-and-drop reordering (desktop & mobile)
- `ImageUploadService` — Image validation, preview, rename
- `AdminAuth` — Authentication & session management

Full detail: `vibe/ARCHITECTURE.md`

### Key decisions

1. **Firebase Realtime Database** — Dipilih karena constraint arsitektur: static files only, no server-side functions
2. **Hardcoded admin authentication** — Implementasi sederhana untuk single-admin use case
3. **WhatsApp-based ordering** — Sistem pemesanan sederhana tanpa integrasi pembayaran
4. **Mobile-first responsive design** — CSS custom properties dengan BEM naming convention
5. **Playwright for E2E testing** — Framework testing modern dengan dukungan browser yang baik
6. **Menu & Packages CRUD** — Full admin dashboard untuk manajemen menu dan paket
7. **Image upload with rename** — Upload gambar dengan auto-rename ke slug format
8. **Drag-drop reordering** — Reorder menu items dan categories via drag-drop atau arrow buttons

### Contributing

**Naming conventions:**
- Files: `kebab-case` (e.g., `firebase-config.js`)
- Variables: `camelCase` (e.g., `stockRef`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `SESSION_KEY`)
- CSS Classes: BEM naming (e.g., `.nav__toggle-bar`)

**Code style:**
- Use `'use strict'` in all IIFE modules
- Document all public functions with JSDoc
- Use CSS custom properties for theming

---

## For the client

### What was built

Mie Ayam Lariska Web adalah website untuk restoran mie ayam rumahan. Website ini menampilkan menu lengkap dengan harga dan gambar, memungkinkan pelanggan memesan langsung via WhatsApp, dan menyediakan dashboard admin untuk mengelola menu, paket, dan stok.

### Features

**Menu Display** — Menampilkan 24 menu item dalam 3 kategori (Mie Ayam, Minuman, Topping Tambahan) dengan gambar, harga, deskripsi, dan status stok real-time.

**Package Recommendations** — 4 paket rekomendasi (Lengkap, Favorit, Kenyang, Spesial) yang ditampilkan secara dinamis dari Firebase dengan featured card highlight.

**WhatsApp Ordering** — Pelanggan dapat memesan langsung via WhatsApp dengan pesan yang sudah diisi otomatis untuk setiap menu item dan paket.

**Admin Dashboard** — Dashboard admin lengkap dengan:
- Manajemen menu (CRUD) dengan validasi dan duplicate detection
- Manajemen paket (CRUD) dengan items selection
- Upload gambar dengan preview dan auto-rename
- Drag-drop reordering untuk menu items dan categories
- Auto-generate deskripsi marketing
- Real-time connection monitoring

**Location & Contact** — Informasi lokasi restoran, jam buka (10:00-18:00 WIB), Google Maps embed, dan kontak WhatsApp/Instagram.

**FAQ Section** — 10 pertanyaan umum tentang jam buka, pemesanan, dan lokasi dalam format accordion.

### How to access

**Customer Website:** [https://mie-ayam-lariska-web.web.app](https://mie-ayam-lariska-web.web.app)

**Admin Dashboard:** [https://mie-ayam-lariska-web.web.app/admin/login.html](https://mie-ayam-lariska-web.web.app/admin/login.html)
- Username: `lariska`
- Password: `lariska123`

### Reporting issues

Untuk masalah teknis, hubungi developer melalui:
- WhatsApp: 081364856560
- Instagram: @mieayamlariska

---

*Last updated: 2026-06-17 · Updated to reflect current codebase state*
