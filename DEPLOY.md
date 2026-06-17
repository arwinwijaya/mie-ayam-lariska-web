# Deploy Guide — Mie Ayam Lariska Web

Panduan untuk deploy website ke Firebase Hosting.

---

## Prerequisites

1. **Node.js** terinstall
2. **Firebase CLI** terinstall:
   ```bash
   npm install -g firebase-tools
   ```

---

## Firebase Token

Token disimpan di file `.firebase-token` (sudah di-`gitignore` untuk keamanan).

### Generate Token Baru (jika expired)

Jalankan di **terminal lokal**:

```bash
firebase login:ci --no-localhost
```

1. Buka URL yang diberikan di browser
2. Login dengan akun Google yang punya akses ke Firebase project
3. Copy token yang muncul
4. Simpan ke `.firebase-token`

---

## Deploy

### Cara 1: Menggunakan Token (dari file)

```bash
FIREBASE_TOKEN=$(cat .firebase-token) firebase deploy --only hosting
```

### Cara 2: Menggunakan Token (manual)

```bash
FIREBASE_TOKEN="your-token-here" firebase deploy --only hosting
```

### Cara 3: Login Interaktif (terminal lokal)

```bash
firebase login
firebase deploy --only hosting
```

### Deploy Semua (hosting + database rules)

```bash
FIREBASE_TOKEN=$(cat .firebase-token) firebase deploy
```

---

## Informasi Project

| Item | Value |
|------|-------|
| **Project ID** | `mie-ayam-lariska-web` |
| **Console** | https://console.firebase.google.com/project/mie-ayam-lariska-web/overview |
| **Hosting URL** | https://mie-ayam-lariska-web.web.app |
| **Public Directory** | `.` (root) |

---

## Troubleshooting

### Token Expired

```
Error: Authentication Error: Invalid token
```

**Solusi**: Generate token baru dengan `firebase login:ci --no-localhost`

### Firebase CLI Tidak Ditemukan

```
firebase: command not found
```

**Solusi**: Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Permission Error

```
Error: Authorization failed
```

**Solusi**: Pastikan akun Google yang login punya akses ke Firebase project `mie-ayam-lariska-web`

---

## File yang Di-deploy

Firebase mengabaikan file/folder berikut (dikonfigurasi di `firebase.json`):

- `firebase.json`
- `database.rules.json`
- `node_modules/`
- `.git/`
- `docs/`
- `tests/`
- `firebase.txt`
- `package.json`
- `playwright.config.js`

---

*Terakhir diperbarui: 2026-06-17*
