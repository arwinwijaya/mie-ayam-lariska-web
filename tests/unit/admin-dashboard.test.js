import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockElements = {
  'admin-menu': { innerHTML: '', querySelectorAll: vi.fn(() => []) },
  'admin-packages': { innerHTML: '', querySelectorAll: vi.fn(() => []) },
  'connection-status': { classList: { add: vi.fn(), remove: vi.fn() } },
  'reconnect-button': { addEventListener: vi.fn() },
  'tab-menu': { classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() }, addEventListener: vi.fn() },
  'tab-packages': { classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() }, addEventListener: vi.fn() },
  'content-menu': { classList: { add: vi.fn(), remove: vi.fn() } },
  'content-packages': { classList: { add: vi.fn(), remove: vi.fn() } },
  'add-menu-btn': { addEventListener: vi.fn() },
  'add-package-btn': { addEventListener: vi.fn() },
  'menu-modal': { classList: { add: vi.fn(), remove: vi.fn() }, querySelectorAll: vi.fn(() => []) },
  'package-modal': { classList: { add: vi.fn(), remove: vi.fn() }, querySelectorAll: vi.fn(() => []) },
  'delete-modal': { classList: { add: vi.fn(), remove: vi.fn() }, querySelectorAll: vi.fn(() => []) },
  'package-delete-modal': { classList: { add: vi.fn(), remove: vi.fn() }, querySelectorAll: vi.fn(() => []) },
  'menu-form': { addEventListener: vi.fn(), reset: vi.fn(), querySelectorAll: vi.fn(() => []) },
  'package-form': { addEventListener: vi.fn(), reset: vi.fn(), querySelectorAll: vi.fn(() => []) },
  'modal-close': { addEventListener: vi.fn() },
  'modal-cancel': { addEventListener: vi.fn() },
  'package-modal-close': { addEventListener: vi.fn() },
  'package-modal-cancel': { addEventListener: vi.fn() },
  'delete-modal-close': { addEventListener: vi.fn() },
  'delete-cancel': { addEventListener: vi.fn() },
  'delete-confirm': { addEventListener: vi.fn() },
  'package-delete-modal-close': { addEventListener: vi.fn() },
  'package-delete-cancel': { addEventListener: vi.fn() },
  'package-delete-confirm': { addEventListener: vi.fn() },
  'menu-image-input': { addEventListener: vi.fn() },
  'image-preview': { src: '', style: { display: '' } },
  'image-upload-area': { classList: { add: vi.fn(), remove: vi.fn() }, addEventListener: vi.fn() },
  'package-image-input': { addEventListener: vi.fn() },
  'package-image-preview': { src: '', style: { display: '' } },
  'package-image-upload-area': { classList: { add: vi.fn(), remove: vi.fn() }, addEventListener: vi.fn() },
};

document.getElementById = vi.fn((id) => mockElements[id] || { 
  innerHTML: '', 
  classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
  addEventListener: vi.fn(),
  querySelectorAll: vi.fn(() => []),
});

// Mock services
window.AdminAuth = {
  requireAuth: vi.fn(),
};

window.FirebaseService = {
  seedInitialMenu: vi.fn(() => Promise.resolve()),
  seedInitialPackages: vi.fn(() => Promise.resolve()),
  onAllMenuChange: vi.fn(),
  onAllPackagesChange: vi.fn(),
  getMenu: vi.fn(() => Promise.resolve({})),
  getPackages: vi.fn(() => Promise.resolve({})),
  updateMenuItem: vi.fn(() => Promise.resolve()),
  deleteMenuItem: vi.fn(() => Promise.resolve()),
  addPackage: vi.fn(() => Promise.resolve()),
  updatePackage: vi.fn(() => Promise.resolve()),
  deletePackage: vi.fn(() => Promise.resolve()),
};

window.MenuService = {
  getMenuByCategory: vi.fn(() => Promise.resolve({})),
  createMenuItem: vi.fn(() => Promise.resolve('new-id')),
  updateMenuItem: vi.fn(() => Promise.resolve()),
  deleteMenuItem: vi.fn(() => Promise.resolve()),
};

window.PackagesService = {
  add: vi.fn(() => Promise.resolve('new-id')),
  update: vi.fn(() => Promise.resolve()),
  delete: vi.fn(() => Promise.resolve()),
};

window.FirebaseConnectionService = {
  init: vi.fn(),
};

window.ImageUploadService = {
  init: vi.fn(() => ({
    showImagePreview: vi.fn(),
    uploadImage: vi.fn(() => Promise.resolve('image-url')),
    deleteImage: vi.fn(() => Promise.resolve()),
  })),
};

window.DragDropService = {
  init: vi.fn(),
};

window.DescriptionTemplates = {
  generate: vi.fn(() => 'Generated description'),
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module exports', () => {
    it('should export initDashboard function', async () => {
      const module = await import('../../js/admin-dashboard.js');
      expect(module).toHaveProperty('initDashboard');
      expect(typeof module.initDashboard).toBe('function');
    });

    it('should export loadAndRenderMenu function', async () => {
      const module = await import('../../js/admin-dashboard.js');
      expect(module).toHaveProperty('loadAndRenderMenu');
      expect(typeof module.loadAndRenderMenu).toBe('function');
    });

    it('should export loadAndRenderPackages function', async () => {
      const module = await import('../../js/admin-dashboard.js');
      expect(module).toHaveProperty('loadAndRenderPackages');
      expect(typeof module.loadAndRenderPackages).toBe('function');
    });

    it('should export switchTab function', async () => {
      const module = await import('../../js/admin-dashboard.js');
      expect(module).toHaveProperty('switchTab');
      expect(typeof module.switchTab).toBe('function');
    });
  });

  describe('Backward compatibility', () => {
    it('should expose AdminDashboard on window', async () => {
      await import('../../js/admin-dashboard.js');
      expect(window.AdminDashboard).toBeDefined();
      expect(window.AdminDashboard).toHaveProperty('initDashboard');
    });
  });

  describe('initDashboard', () => {
    it('should call AdminAuth.requireAuth', async () => {
      const { initDashboard } = await import('../../js/admin-dashboard.js');
      initDashboard();
      expect(window.AdminAuth.requireAuth).toHaveBeenCalled();
    });

    it('should initialize FirebaseConnectionService', async () => {
      const { initDashboard } = await import('../../js/admin-dashboard.js');
      initDashboard();
      expect(window.FirebaseConnectionService.init).toHaveBeenCalled();
    });
  });
});
