# Spec — Paket Rekomendasi: Redesign + Admin CRUD

> **Date:** 2026-06-15
> **Project:** Mie Ayam Lariska Web
> **Status:** Spec Approved — Ready for Planning

---

## Problem Statement

1. **Visitor Side:** Section Paket Rekomendasi flat tanpa hierarki — 4 kartu sejajar tanpa guidance visual. Badge "Hemat 0k" memberikan kesan diskon padahal tidak ada selisih harga.

2. **Admin Side:** Tidak ada cara untuk mengelola paket rekomendasi — data hardcoded di HTML. Admin harus edit kode untuk mengubah harga, item, atau menambah paket baru.

---

## Scope

### IN-SCOPE

**Visitor Side (UI Redesign):**
- Restructur layout: "Paket Favorit" sebagai featured card full-width di atas
- Hapus badge "Hemat 0k", ganti dengan badge "Praktis" / "Lengkap"
- Visual polish: hierarki warna, spacing, shadow untuk featured card
- Responsive: mobile (1 col), tablet (2+1), desktop (3 col)
- Topping Suka-Suka tetap di grid dengan style khusus
- **Dynamic rendering dari Firebase** (bukan hardcoded HTML)

**Admin Side (CRUD):**
- Table view untuk manage paket di admin dashboard
- Form add/edit paket dengan field lengkap:
  - Nama paket
  - Deskripsi
  - Icon emoji
  - Daftar item (multi-select dari menu yang ada)
  - Harga paket
  - Tag (Basic/Best Seller/Custom/etc)
  - Status featured (ya/tidak)
  - Status aktif/nonaktif
  - Urutan tampil
- Delete paket dengan konfirmasi
- Drag-drop untuk reorder paket

**Firebase Integration:**
- Struktur data `packages/` di Firebase Realtime Database
- Real-time sync antara admin dan visitor page

### OUT-OF-SCOPE
- Penambahan gambar untuk paket
- Perubahan WhatsApp link logic
- Perubahan pada menu items (sudah ada)
- Stock status untuk paket (hanya untuk individual items)

---

## Architecture Constraints

- HTML + CSS + JS (vanilla, no framework)
- Firebase Realtime Database (client-side SDK)
- BEM naming convention
- CSS custom properties (brand tokens)
- Mobile-first responsive
- No build process
- IIFE pattern untuk JS modules

---

## Firebase Data Structure

```
packages/
├── {package_id}/
│   ├── name: "Paket Favorit"
│   ├── description: "Mie Ayam Pangsit + Es Teh Manis"
│   ├── icon: "🔥"
│   ├── items: ["mie_ayam_pangsit", "es_teh_manis"]  // references to menu items
│   ├── price: 15000
│   ├── tag: "Best Seller"
│   ├── isFeatured: true
│   ├── isActive: true
│   ├── whatsappMessage: "Halo Mie Ayam Lariska, saya mau pesan Paket Favorit"
│   └── order: 2
```

---

## Admin Dashboard — Packages Section

### Layout
```
┌─────────────────────────────────────────────────┐
│  Dashboard Admin — Mie Ayam Lariska             │
├─────────────────────────────────────────────────┤
│  [Menu Management Tab] [Packages Management Tab]│
├─────────────────────────────────────────────────┤
│  [+ Tambah Paket]                               │
├─────────────────────────────────────────────────┤
│  │ # │ Icon │ Nama Paket │ Harga │ Items │ Tag  │
│  │ 1 │  🔥  │ Favorit    │ 15k   │ 2     │ Best │
│  │ 2 │  🍜  │ Hemat      │ 13k   │ 2     │ Basic│
│  │ 3 │  😋  │ Kenyang    │ 18k   │ 2     │ Puas │
│  │ 4 │  ✨  │ Topping    │ +2k   │ -     │Custom│
└─────────────────────────────────────────────────┘
```

### Form Fields (Add/Edit)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Nama Paket | text | ✓ | Contoh: "Paket Favorit" |
| Deskripsi | textarea | ✓ | Maks 200 karakter |
| Icon | emoji picker / text | ✓ | Contoh: 🔥 |
| Items | multi-select checkbox | ✓ | Select dari menu yang ada di Firebase |
| Harga | number | ✓ | Dalam Rupiah |
| Tag | select | ✓ | Basic / Best Seller / Puas / Custom / etc |
| Featured | checkbox | | Hanya 1 paket yang bisa featured |
| Aktif | toggle | ✓ | Nonaktif = tidak tampil di visitor |
| Urutan | number | ✓ | Untuk ordering |
| WA Message | text | ✓ | Pre-filled WhatsApp message |

---

## Acceptance Criteria

### Rule 1: Featured Card Dominance (Visitor)
✓ Given pengunjung scroll ke section Paket, When section terlihat, Then paket dengan `isFeatured: true` tampil full-width di atas
✓ Given featured card, When rendered, Then card lebih besar (padding, font, shadow) dari kartu lain
✓ Given featured card, When rendered, Then tag paket tampil sebagai badge di bagian atas

### Rule 2: Value Proposition — Convenience (Visitor)
✓ Given pengunjung melihat card paket, When melihat pricing, Then harga tanpa strikethrough palsu
✓ Given card paket aktif, When rendered, Then badge "Lengkap" tampil sebagai value indicator
✓ Given semua kartu, When rendered, Then tidak ada badge "Hemat 0k"

### Rule 3: Dynamic Data from Firebase (Visitor)
✓ Given halaman visitor dimuat, When Firebase connected, Then packages di-load dari `packages/` node
✓ Given Firebase error, When fallback diperlukan, Then tampilkan hardcoded fallback data
✓ Given admin mengubah data paket, When visitor refresh, Then data ter-update

### Rule 4: Admin CRUD — Read
✓ Given admin buka dashboard, When klik tab "Paket", Then tampilkan table dengan semua paket
✓ Given table loaded, When melihat kolom, Then tampilkan: Icon, Nama, Harga, Items count, Tag, Status

### Rule 5: Admin CRUD — Create
✓ Given admin klik "Tambah Paket", When form muncul, Then semua field tersedia
✓ Given admin isi form lengkap, When submit, Then paket tersimpan ke Firebase
✓ Given admin pilih items, When multi-select, Then hanya menu dari Firebase yang tersedia

### Rule 6: Admin CRUD — Update
✓ Given admin klik "Edit" pada paket, When form muncul, Then field pre-filled dengan data existing
Given admin ubah field, When submit, Then data ter-update di Firebase
Given admin set "Featured", When ada paket featured lain, Then paket lain otomatis unset featured

### Rule 7: Admin CRUD — Delete
✓ Given admin klik "Hapus", When konfirmasi muncul, Then tampilkan nama paket
✓ Given admin konfirmasi hapus, When confirmed, Then paket terhapus dari Firebase

### Rule 8: Responsive Layout (Visitor)
✓ Given layar < 768px, When rendered, Then featured full-width, lainnya 1 kolom
✓ Given layar 768-1023px, When rendered, Then featured full-width, lainnya 2+1 grid
✓ Given layar >= 1024px, When rendered, Then featured full-width, lainnya 3 kolom

---

## GWT Scenarios (Detailed)

### Scenario: Load Packages from Firebase
```
Given pengunjung buka halaman utama
When Firebase terhubung
Then packages di-load dari node 'packages/'
And packages di-render sesuai layout (featured di atas, lainnya di grid)
And packages yang isActive: false tidak tampil
```

### Scenario: Admin Create Package
```
Given admin login ke dashboard
When klik "Tambah Paket" dan isi form lengkap
Then data tersimpan ke Firebase dengan auto-generated ID
And table refresh dengan paket baru
And visitor page akan menampilkan paket baru setelah refresh
```

### Scenario: Admin Edit Package
```
Given admin klik edit pada "Paket Favorit"
When ubah harga dari 15000 ke 14000 dan submit
Then data ter-update di Firebase
And visitor page menampilkan harga baru setelah refresh
```

### Scenario: Admin Set Featured
```
Given "Paket Hemat" adalah featured saat ini
When admin set "Paket Favorit" sebagai featured
Then "Paket Favorit" isFeatured = true
And "Paket Hemat" isFeatured = false (otomatis)
And visitor page menampilkan "Paket Favorit" sebagai featured card
```

### Scenario: Admin Delete Package
```
Given admin klik hapus pada "Paket Kenyang"
When konfirmasi "Ya, Hapus"
Then data terhapus dari Firebase
And table refresh tanpa paket tersebut
And visitor page tidak menampilkan paket tersebut
```

### Scenario: Fallback When Firebase Error
```
Given Firebase tidak terhubung
When visitor buka halaman
Then tampilkan hardcoded fallback packages
And tampilkan indicator "Menggunakan data offline"
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Restructur packages section, hapus hardcoded cards, tambah container untuk dynamic render |
| `js/firebase-config.js` | Tambah packages API: getPackages, addPackage, updatePackage, deletePackage |
| `js/packages-service.js` | **BARU** — Service untuk packages CRUD + caching |
| `admin/index.html` | Tambah tab "Paket", table view, form modal untuk CRUD |
| `css/style.css` | Tambah styles: .packages__card--featured, .packages__badge--praktis |
| `css/admin.css` | Tambah styles untuk packages table dan form |

---

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Pricing comparison format | Tidak ada diskon → fokus "Praktis/Lengkap" |
| Topping card placement | Tetap di grid bawah |
| Featured card badge | Pakai tag paket (Best Seller, etc) |
| Mobile layout | 1 kolom stacked |
| Admin view | Table view dengan tabs |
| Item selection | Multi-select dari Firebase menu data |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Multiple featured packages | Logic: auto-unset featured lain saat set featured baru |
| Firebase sync delay | Real-time listener untuk update instan |
| Menu items berubah | Package items reference ke menu ID, bukan nama |
| Breaking change ke visitor | Fallback hardcoded data jika Firebase error |

---

*Spec generated by pocket-grinding on 2026-06-15*
