# Changelog

All notable changes to this project are documented here.
Generated from vibe/DECISIONS.md — updated by vibe-document.

---

## Features

### Customer Menu Display — 2026-06-15
Display 24 menu items with images, prices, and descriptions, categorized into Mie Ayam (11 items), Minuman (5 items), and Topping Tambahan (8 items). Real-time stock status updates from Firebase Realtime Database. Responsive grid layout with mobile-first design.
[Source: D-001 in vibe/DECISIONS.md]

### Package Recommendations — 2026-06-16
Dynamic package display from Firebase with 4 packages (Lengkap, Favorit, Kenyang, Spesial). Featured card highlight for featured package. Package ordering via WhatsApp with pre-filled messages. Admin can manage packages through dashboard.
[Source: D-010 in vibe/DECISIONS.md]

### WhatsApp Ordering System — 2026-06-15
Direct links to WhatsApp with pre-filled messages for ordering. Available for each menu item and package. Event catering inquiries supported.
[Source: D-005 in vibe/DECISIONS.md]

### Admin Dashboard — 2026-06-16
Full admin dashboard with tab navigation (Menu & Paket). Menu management with CRUD operations, validation, duplicate detection. Package management with items selection and featured toggle. Real-time connection monitoring with status indicator.
[Source: D-008 in vibe/DECISIONS.md]

### Admin Menu Management — 2026-06-16
Create, read, update, and delete menu items with validation. Auto-generate slug from menu name. Badge management (favorit/baru/bestseller/populer). Position control with drag-drop reordering and arrow buttons. Category management with reordering.
[Source: D-009 in vibe/DECISIONS.md]

### Admin Package Management — 2026-06-16
Create, read, update, and delete packages. Items selection from menu items. Featured toggle and tag selection (Basic/Best Seller/Puas/Spesial). Custom WhatsApp message per package.
[Source: D-010 in vibe/DECISIONS.md]

### Image Upload Service — 2026-06-16
Image upload with validation (JPG/PNG/WebP, max 2MB). Preview with FileReader. Auto-rename to slug-based filename for download. Image path helper for consistent naming.
[Source: D-011 in vibe/DECISIONS.md]

### Drag-Drop Reordering — 2026-06-16
HTML5 drag-and-drop for desktop. Arrow buttons for mobile (768px breakpoint). Support for menu item and category reordering. Visual feedback during drag operations.
[Source: D-012 in vibe/DECISIONS.md]

### Auto-Generate Descriptions — 2026-06-16
Template-based marketing descriptions per category. Random template selection with placeholders. Topping mapping for Mie Ayam items. Truncation to max length without breaking words.
[Source: D-008 in vibe/DECISIONS.md]

### Real-time Stock Management — 2026-06-15
Firebase Realtime Database integration for stock data storage. Three status levels: available, limited, sold_out. localStorage caching for offline resilience. Automatic retry on update failure.
[Source: D-003 in vibe/DECISIONS.md]

### Firebase Connection Monitoring — 2026-06-16
Real-time connection status via .info/connected. Visual indicator with green/red dot and text. Manual reconnect with debounce protection. Auto-hide when connection restored.
[Source: D-008 in vibe/DECISIONS.md]

### Location & Contact Information — 2026-06-15
Google Maps integration for location display. WhatsApp contact link. Instagram social links. Business hours display (10:00-18:00 WIB).
[Source: D-001 in vibe/DECISIONS.md]

### FAQ Section — 2026-06-15
Accordion-style FAQ display with 10 common questions about hours, ordering, and location. Accessible with ARIA attributes. Two-column layout on desktop.
[Source: D-001 in vibe/DECISIONS.md]

### Skeleton Loading — 2026-06-16
Shimmer animation placeholders while Firebase loads. Smooth transition when data arrives. Optimistic "Tersedia" badges before Firebase data.
[Source: D-008 in vibe/DECISIONS.md]

### Image Popup — 2026-06-16
Hover preview on desktop (non-touch devices). 300ms delay before showing. Responsive positioning. Disabled on mobile devices.
[Source: D-008 in vibe/DECISIONS.md]

---

## Decisions

### Firebase Realtime Database chosen for data storage — 2026-06-15
Selected Firebase Realtime Database for stock data storage due to architecture constraint (static files only, no server-side functions). Client-side SDK only with public read/write rules. Real-time synchronization across clients.
[Source: D-003 in vibe/DECISIONS.md]

### Hardcoded admin authentication — 2026-06-15
Implemented admin authentication with hardcoded credentials (lariska/lariska123). Simple implementation for single-admin use case. Session stored in localStorage.
[Source: D-004 in vibe/DECISIONS.md]

### WhatsApp-based ordering system — 2026-06-15
Chose WhatsApp wa.me links for ordering system. Pre-filled messages for each menu item and packages. Direct links to WhatsApp. No cart or checkout system.
[Source: D-005 in vibe/DECISIONS.md]

### Mobile-first responsive design — 2026-06-15
Adopted CSS custom properties with mobile-first approach. BEM naming convention. CSS Grid and Flexbox layouts. Responsive breakpoints at 768px, 1024px, 1280px.
[Source: D-006 in vibe/DECISIONS.md]

### Playwright for E2E testing — 2026-06-15
Selected Playwright for E2E testing framework. Chromium and mobile-chrome projects. Local server with `npx serve`. HTML reporter.
[Source: D-007 in vibe/DECISIONS.md]

### Admin dashboard with full CRUD — 2026-06-16
Built comprehensive admin dashboard with menu and packages management. Tab navigation between sections. Validation, duplicate detection, and position control. Real-time connection monitoring.
[Source: D-008 in vibe/DECISIONS.md]

### Menu data model expanded — 2026-06-16
Expanded from stock-only model to full menu management. Added name, category, price, description, badge, and order fields. Slug-based ID generation for consistent naming.
[Source: D-009 in vibe/DECISIONS.md]

### Packages data model added — 2026-06-16
Added dynamic packages from Firebase. Includes items selection, featured toggle, tag system, and custom WhatsApp messages. Admin control over all package offerings.
[Source: D-010 in vibe/DECISIONS.md]

### Image upload with slug-based rename — 2026-06-16
Implemented ImageUploadService with validation and auto-rename. Consistent image naming for menu items. Download renamed file for manual upload to images/ folder.
[Source: D-011 in vibe/DECISIONS.md]

### Drag-drop reordering with mobile fallback — 2026-06-16
HTML5 drag-and-drop for desktop with arrow button fallback for mobile. Support for both menu item and category reordering. 768px breakpoint for mobile detection.
[Source: D-012 in vibe/DECISIONS.md]

---

## Project start — 2026-06-15
Project onboarded via vibe-init. Stack confirmed: Vanilla JS + Firebase Realtime Database + Firebase Hosting. Pattern: Static HTML with IIFE JavaScript modules. 63 files analyzed across 10 directories.
[Source: D-001 in vibe/DECISIONS.md]

---

## Documentation update — 2026-06-17
Updated all documentation files to reflect current codebase state. README.md, vibe/CODEBASE.md, vibe/ARCHITECTURE.md, vibe/DECISIONS.md, vibe/TASKS.md, and CHANGELOG.md updated with new features, services, and architecture changes.
[Source: Documentation maintenance]

---

*Generated by vibe-document on 2026-06-15*
*Updated on 2026-06-17*
*Source: vibe/DECISIONS.md*
