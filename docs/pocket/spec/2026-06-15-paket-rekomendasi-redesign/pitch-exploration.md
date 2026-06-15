# Pitch Exploration: Paket Rekomendasi UI Fix
Date: 2026-06-16 | Project: Mie Ayam Lariska Web | Status: pitch-approved

---

## Problem Statement
Section Paket Rekomendasi punya 3 masalah visual spesifik: (1) badge "⭐ Paling Laris" posisinya rotated 45° di pojok kanan atas, tidak center dan tidak profesional; (2) gradient background (#FFF5F5 → #FFFBF0) nabrak dengan teks merah (#C40000), contrast ratio rendah; (3) featured card tidak cukup beda dari kartu biasa — hierarki visual tidak jelas.

## Root Tension
Ingin premium feel (gradient, ribbon badge) tapi eksekusi bikin tidak clean dan tidak profesional. Ribbon badge era 2015 + gradient low-contrast = kesan "murahan" bukan "premium".

## Key Constraints
- Mobile-first: 70%+ user dari HP, semua harus terbaca jelas
- No build process: HTML + CSS only, vanilla JavaScript
- Brand colors: primary #C40000 (merah), secondary #FFD033 (kuning)
- Consistency: harus cocok dengan style section lain
- Test safety: jangan break existing Playwright tests

---

## Brainstorming Methods Used

### Question Storming — deep
Key insights:
- "Warna nabrak" = gradient background bentrok dengan teks merah (contrast rendah)
- Badge "Paling Laris" rotated 45° = tidak center, tidak clean
- Tujuan utama = konversi (klik WA), user harus "get" hierarki dalam 3 detik
- Item list di kartu harus terbaca di mobile (min 14px)

### First Principles Thinking — creative
Key insights:
- Ribbon badge di pojok ≠ cara terbaik highlight (bikin layout tidak rapi)
- Gradient background ≠ premium feel (bisa bikin contrast rendah)
- "Hemat 0k" erodes trust (dari pitch sebelumnya)
- Rebuild: badge centered, warna high contrast, featured card lebih dominant

### Six Thinking Hats — structured
Key insights:
- **White (Fakta)**: 4 kartu, 1 featured, gradient #FFF5F5 → #FFFBF0, teks #C40000
- **Red (Emosi)**: "Warna nabrak" = tidak nyaman, "gak rapi" = tidak profesional
- **Yellow (Benefits)**: Badge idea bagus, gradient idea bagus, spacing sudah cukup
- **Black (Risks)**: Perubahan layout bisa break test, warna baru bisa nabrak juga
- **Green (Kreativitas)**: Badge pill-shaped centered, gradient subtle, border tebal + shadow
- **Blue (Proses)**: Fix badge position dulu → adjust warna → test mobile → verify user

### Reverse Brainstorming — creative
Key insights:
- Warna saling nabrak = chaos visual → hindari gradient bold, gunakan warna solid/subtle
- Badge random position = tidak profesional → badge harus centered
- Tidak ada hierarki = user bingung → featured card harus lebih dominant
- Teks terlalu kecil = tidak terbaca di mobile → min 14px

---

## Advisor Synthesis
[Advisor call terminated — synthesis from manual curation]
- Semua masalah berakar di CSS styling, bukan struktur HTML
- Badge positioning dan warna contrast adalah 2 masalah utama
- Layout sudah benar (featured di atas, grid di bawah), eksekusi visual kurang
- Fix minimal (CSS only) cukup untuk resolve semua masalah

---

## Approach Directions

### Direction A: Clean Minimal Fix ⭐ RECOMMENDED
Fokus perbaiki 3 masalah utama tanpa mengubah layout besar.
- Badge → pill-shaped, centered di atas kartu (bukan ribbon rotated)
- Gradient → warna solid atau gradient sangat subtle (high contrast)
- Featured card → border lebih tebal + shadow lebih besar
+ Effort rendah — hanya CSS changes, tidak ubah HTML structure
+ Tidak break existing tests
− Perubahan incremental, bukan redesign besar

### Direction B: Visual Overhaul
Redesign ulang styling section dengan pendekatan baru.
- Badge → floating badge dengan background warna solid
- Card → flat design dengan accent color border
- Featured → ukuran lebih besar + warna background berbeda
+ Hasil lebih polished dan modern
− Effort medium — perlu adjust beberapa CSS properties

### Direction C: Structural Redesign
Ubah layout dan hierarchy secara fundamental.
- Badge → dihapus, ganti tag inline
- Featured → full-width horizontal layout
- Regular → grid 3 kolom desktop
+ Hierarki paling jelas
− Effort tinggi, risk break tests, overkill

---

## Open Questions for pocket-grinding
- [ ] Apakah badge pill-shaped cukup menarik dibanding ribbon rotated?
- [ ] Warna apa yang cocok untuk badge? (kuning #FFD033 atau merah #C40000?)
- [ ] Apakah perlu adjust spacing antara featured card dan grid?

---

## Recommended Direction
Direction A — Clean Minimal Fix. Masalah utama spesifik (badge position, warna contrast), effort rendah (CSS only), tidak break tests, bisa diiterate kalau kurang cukup.

---

## Handoff Context (for pocket-grinding)
When pocket-grinding reads this doc:
- Start with this problem statement (3 masalah visual spesifik)
- Use Direction A as the working hypothesis
- Treat Open Questions as Phase 3 Discovery targets
- Focus pada CSS property changes, bukan HTML restructure
