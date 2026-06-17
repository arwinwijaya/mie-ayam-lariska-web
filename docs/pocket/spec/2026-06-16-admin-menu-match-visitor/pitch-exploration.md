# Pitch Exploration: Admin Menu Match Visitor Layout

> Date: 2026-06-16
> Status: Pitch Complete

---

## Problem Statement

Menu di admin dashboard memiliki layout yang berbeda dengan visitor dashboard, menyulitkan admin untuk preview tampilan yang dilihat pelanggan dan menciptakan inkonsistensi visual.

**User request:** "Menu yang di dashboard admin sama dengan menu yang di dashboard pengunjung dari letaknya, gambarnya, dll"

---

## Current State

### Visitor (index.html)
- Card grid dengan gambar besar di atas
- Badge: Baru, Favorit, Best Seller, Populer
- Nama, deskripsi, harga
- CSS classes: `.menu__item-card`, `.menu__item-image`, `.menu__item-info`, `.menu__item-footer`

### Admin (admin/index.html)
- Card grid dengan rank badge (#1, #2, #3)
- Gambar lebih kecil
- Nama, harga, deskripsi
- Status badge (Tersedia/Terbatas/Habis)
- Tombol Edit/Hapus
- CSS classes: `.admin-menu__card`, `.admin-menu__card-image`, `.admin-menu__card-rank`

---

## Brainstorming Results

### Key Insights
1. Data dan gambar sudah sama (dari Firebase + /images/)
2. Konsistensi layout = preview capability untuk admin
3. Kontrol admin bisa diintegrasikan di bawah card
4. Rank badge bisa diganti dengan drag handle

### Ideas Worth Pursuing
1. Clone visitor card layout untuk admin
2. Tambah admin controls (Edit/Hapus/status) di bawah card
3. Status stok ditampilkan sebagai badge (sama dengan visitor)
4. Menu badge (Favorit/Baru/Best Seller) juga tampil di admin

### Discarded
- Completely different layout (user wants "sama persis")
- Hide admin controls (admin perlu akses cepat)

---

## Approach Directions

### Direction A: Clone Visitor Card + Admin Controls di Bawah (RECOMMENDED)
Render admin menu menggunakan visitor card layout (gambar besar, badge, nama, deskripsi, harga), tambah baris Edit/Hapus/status di bawah card.

**\+** Konsistensi 100%, admin bisa preview persis seperti visitor
**\+** Straightforward implementation
**−** Card lebih tinggi (perlu scroll lebih banyak)

### Direction B: Shared Component dengan Conditional Rendering
Buat shared rendering function yang dipakai visitor dan admin, dengan parameter showAdminControls.

**\+** DRY code, single source of truth
**\+** Future-proof untuk perubahan layout
**−** Lebih kompleks, perlu refactor besar
**−** Bisa overkill untuk static site

### Direction C: Refactor CSS Classes ke Visitor Style
Ubah admin CSS classes agar match dengan visitor style, tanpa ubah HTML structure.

**\+** Minimal code change
**\+** Quick implementation
**−** Bukan "sama persis", hanya mirip
**−** Tetap ada perbedaan HTML structure

---

## Recommendation

**Direction A** — Clone visitor card layout + admin controls di bawah.

**Reasoning:**
1. User explicitly wants "sama persis" — Direction A paling mendekati
2. Implementation straightforward — copy visitor rendering logic, tambah admin controls
3. Admin bisa preview persis seperti yang visitor lihat
4. Minimal risk — tidak mengubah visitor code

---

## Technical Constraints

1. Visitor card rendering ada di `index.html` (inline script)
2. Admin card rendering ada di `admin/index.html` (inline script)
3. CSS visitor di `css/style.css`, admin di `css/admin.css`
4. Gambar dari `/images/` — perlu path adjustment di admin (`../images/`)
5. Admin perlu: Edit button, Delete button, Status badge, Drag handle

---

## Next Steps

1. Confirm approach direction dengan user
2. Invoke pocket-grinding untuk detailed spec
3. Implement perubahan di admin/index.html dan css/admin.css
