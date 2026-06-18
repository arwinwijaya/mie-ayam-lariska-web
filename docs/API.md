# API Reference

Base URL: `https://mie-ayam-lariska-web.web.app` (Firebase Hosting)
Authentication: None required for customer pages; Admin authentication via hardcoded credentials

---

## Overview

Mie Ayam Lariska Web adalah website statis tanpa server-side API endpoints. Semua operasi data dilakukan di sisi client menggunakan Firebase Realtime Database SDK.

---

## Firebase Realtime Database

### Menu Data

**Path:** `/menu`

**Data Structure:**
```json
{
  "mie_ayam_biasa": {
    "name": "Mie Ayam Biasa",
    "category": "Mie Ayam",
    "price": 12000,
    "description": "Mie ayam dengan topping ayam cincang",
    "status": "available",
    "badge": "bestseller",
    "order": 1
  }
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Menu item name (max 100 chars) |
| `category` | string | "Mie Ayam", "Minuman", or "Topping Tambahan" |
| `price` | number | Price in Rupiah (0-999999) |
| `description` | string | Item description (max 200 chars) |
| `status` | string | "available", "limited", or "sold_out" |
| `badge` | string\|null | "favorit", "baru", "bestseller", "populer", or null |
| `order` | number | Display order position |

### Packages Data

**Path:** `/packages`

**Data Structure:**
```json
{
  "paket_lengkap": {
    "name": "Paket Lengkap",
    "description": "Mie Ayam Komplit + Es Teh Manis",
    "icon": "🍜",
    "items": ["mie_ayam_komplit", "es_teh_manis"],
    "price": 20000,
    "tag": "Best Seller",
    "isFeatured": true,
    "isActive": true,
    "whatsappMessage": "Halo Mie Ayam Lariska, saya mau pesan Paket Lengkap",
    "order": 1
  }
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Package name (max 100 chars) |
| `description` | string | Package description (max 300 chars) |
| `icon` | string | Emoji icon |
| `items` | string[] | Array of menu item IDs |
| `price` | number | Price in Rupiah (1-999999) |
| `tag` | string | "Basic", "Best Seller", "Puas", "Spesial" |
| `isFeatured` | boolean | Show as featured package |
| `isActive` | boolean | Package is active |
| `whatsappMessage` | string | Pre-filled WhatsApp message |
| `order` | number | Display order position |

### Stock Data (Backward Compatibility)

**Path:** `/stock`

**Data Structure:**
```json
{
  "mie_ayam_biasa": { "status": "available" },
  "mie_ayam_pangsit": { "status": "limited" },
  "es_teh_manis": { "status": "sold_out" }
}
```

**Status Values:**
| Status | Description |
|--------|-------------|
| `available` | Item is in stock |
| `limited` | Item has limited stock |
| `sold_out` | Item is out of stock |

---

## JavaScript Services

### FirebaseService

**File:** `js/firebase-config.js`

**Purpose:** Firebase initialization and data management (menu, packages, stock)

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `seedInitialMenu()` | none | `Promise<void>` | Seed initial menu data to Firebase |
| `onMenuItemChange(itemId, callback)` | `string, function` | `function` | Listen to single item changes |
| `onAllMenuChange(callback)` | `function` | `function` | Listen to all menu changes |
| `updateMenuItem(itemId, data)` | `string, object` | `Promise<void>` | Update menu item |
| `deleteMenuItem(itemId)` | `string` | `Promise<void>` | Delete menu item |
| `getMenuItem(itemId)` | `string` | `Promise<object>` | Get single menu item |
| `getAllMenu()` | none | `Promise<object>` | Get all menu items |
| `nameToSlug(name)` | `string` | `string` | Convert name to URL slug |
| `isValidStatus(status)` | `string` | `boolean` | Validate status string |
| `getStatusText(status)` | `string` | `string` | Get status display text |
| `seedInitialPackages()` | none | `Promise<void>` | Seed initial packages data |
| `addPackage(data)` | `object` | `Promise<void>` | Add new package |
| `getPackages()` | none | `Promise<object>` | Get all packages |
| `updatePackage(id, data)` | `string, object` | `Promise<void>` | Update package |
| `deletePackage(id)` | `string` | `Promise<void>` | Delete package |
| `onAllPackagesChange(callback)` | `function` | `function` | Listen to all packages changes |

**Example:**
```javascript
// Get all menu items
FirebaseService.getAllMenu().then(menu => {
  console.log(menu);
});

// Update menu item status
FirebaseService.updateMenuItem('mie_ayam_biasa', { status: 'limited' });

// Get all packages
FirebaseService.getPackages().then(packages => {
  console.log(packages);
});
```

### StockService

**File:** `js/stock-service.js`

**Purpose:** localStorage caching layer for offline resilience

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `normalizeStockStatus(status)` | `string` | `string` | Normalize stock status string |
| `saveStockData(data)` | `Object` | `void` | Save stock data to localStorage |
| `getCachedStockData()` | none | `Object\|null` | Read cached stock data from localStorage |
| `clearStockCache()` | none | `void` | Clear all cached stock data |
| `getStockStatus(itemId, firebaseStatus)` | `string, string` | `string` | Get stock status with fallback |
| `mergeStockData(firebaseData)` | `Object` | `Object` | Merge Firebase data with cached data |
| `processFirebaseData(firebaseData)` | `Object` | `Object` | Normalize Firebase data |
| `processAndCacheFirebaseData(firebaseData)` | `Object` | `void` | Process and save to cache |

**Example:**
```javascript
// Save stock data to localStorage
StockService.saveStockData({
  'mie_ayam_biasa': { status: 'available' },
  'mie_ayam_pangsit': { status: 'limited' }
});

// Get cached stock data
const cached = StockService.getCachedStockData();
console.log(cached);
```

### MenuService

**File:** `js/menu-service.js`

**Purpose:** Menu CRUD operations with validation

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `createMenuItem(data)` | `object` | `Promise<string>` | Create new menu item |
| `updateMenuItem(itemId, data)` | `string, object` | `Promise<void>` | Update menu item |
| `deleteMenuItem(itemId)` | `string` | `Promise<void>` | Delete menu item |
| `getMenuItem(itemId)` | `string` | `Promise<object>` | Get single item by ID |
| `getMenuByCategory(category)` | `string` | `Promise<array>` | Get items by category |
| `getAllMenuItems()` | none | `Promise<array>` | Get all menu items |
| `updateMenuOrder(items)` | `array` | `Promise<void>` | Batch update order field |

**Validation Rules:**
- Name: max 100 characters
- Price: 0-999999
- Description: max 200 characters
- Category: required

**Example:**
```javascript
// Create new menu item
const id = await MenuService.createMenuItem({
  name: 'Mie Ayam Special',
  category: 'Mie Ayam',
  price: 15000,
  description: 'Mie ayam dengan topping special',
  status: 'available'
});

// Update menu item
await MenuService.updateMenuItem('mie_ayam_biasa', {
  price: 13000,
  status: 'limited'
});
```

### PackagesService

**File:** `js/packages-service.js`

**Purpose:** Packages CRUD operations with validation

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getAll()` | none | `Promise<array>` | Get all packages |
| `getById(id)` | `string` | `Promise<object>` | Get package by ID |
| `add(data)` | `object` | `Promise<string>` | Add new package |
| `update(id, data)` | `string, object` | `Promise<void>` | Update package |
| `delete(id)` | `string` | `Promise<void>` | Delete package |
| `onAllChange(callback)` | `function` | `function` | Listen to changes |

**Valid Tags:** Basic, Best Seller, Puas, Custom, Promo, Baru

**Example:**
```javascript
// Add new package
const id = await PackagesService.add({
  name: 'Paket Baru',
  description: 'Deskripsi paket',
  icon: '🍜',
  items: ['mie_ayam_biasa', 'es_teh_manis'],
  price: 15000,
  tag: 'Baru',
  isFeatured: false,
  isActive: true,
  whatsappMessage: 'Halo, saya mau pesan Paket Baru'
});

// Get all packages
const packages = await PackagesService.getAll();
```

### FirebaseConnectionService

**File:** `js/firebase-connection-service.js`

**Purpose:** Real-time Firebase connection monitoring

**Behavior:**
- Listens to `.info/connected` for real-time connection status
- Visual status indicator (green dot = connected, red dot = disconnected)
- Manual reconnect button with debounce protection
- Auto-updates UI when connection state changes

### DescriptionTemplates

**File:** `js/description-templates.js`

**Purpose:** Auto-generate marketing descriptions per category

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `generateDescription(name, category, options)` | `string, string, object` | `string` | Generate description with templates |

**Example:**
```javascript
// Generate description for menu item
const desc = DescriptionTemplates.generateDescription(
  'Mie Ayam Pangsit',
  'Mie Ayam',
  { toppings: ['Pangsit'] }
);
// Returns: "Mie ayam lezat dengan topping pangsit renyah"
```

### DragDropService

**File:** `js/drag-drop-service.js`

**Purpose:** Drag-and-drop reordering for menu items

**Behavior:**
- HTML5 drag-and-drop API for desktop
- Arrow buttons (up/down) for mobile (768px breakpoint)
- Supports menu item reordering within categories
- Supports category reordering
- Visual feedback during drag operations

### ImageUploadService

**File:** `js/image-upload-service.js`

**Purpose:** Image upload with validation and rename

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getImagePath(menuName)` | `string` | `string` | Returns `images/{slug}.jpg` |

**Validation:**
- Allowed types: JPG, PNG, WebP
- Max size: 2MB
- Auto-rename to slug-based filename

**Example:**
```javascript
// Get image path for menu item
const path = ImageUploadService.getImagePath('Mie Ayam Biasa');
// Returns: "images/mie-ayam-biasa.jpg"
```

### AdminAuth

**File:** `js/admin-auth.js`

**Purpose:** Admin authentication and session management

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `isLoggedIn()` | none | `boolean` | Check if admin is currently logged in |
| `login(username, password)` | `string, string` | `Object` | Attempt to login with credentials |
| `logout()` | none | `void` | Logout and clear session |
| `requireAuth()` | none | `void` | Protect a page - redirect if not authenticated |
| `initLoginForm()` | none | `void` | Initialize login form handlers |

**Example:**
```javascript
// Check if admin is logged in
if (AdminAuth.isLoggedIn()) {
  console.log('Admin is logged in');
}

// Login with credentials
const result = AdminAuth.login('lariska', 'lariska123');
console.log(result); // { success: true, message: 'Login berhasil' }
```

---

## External Links

### WhatsApp Ordering

**URL Pattern:** `https://wa.me/6281364856560`

**Pre-filled Messages:**
- Per menu item: `Halo Mie Ayam Lariska, saya mau pesan [Menu Name]`
- Per package: `Halo Mie Ayam Lariska, saya mau pesan [Package Name]`
- Event Catering: `Halo Mie Ayam Lariska, saya mau pesan untuk acara.`

### Google Maps

**URL:** `https://maps.app.goo.gl/YjTAt7H2YGtyGfvN7`

### Instagram

**URL:** `https://www.instagram.com/mieayamlariska`

---

*Generated by vibe-document on 2026-06-15*
*Updated on 2026-06-17*
*Source: vibe/CODEBASE.md*
