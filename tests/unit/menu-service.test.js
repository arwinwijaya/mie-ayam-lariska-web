import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock FirebaseService before importing menu-service
vi.mock('../../js/firebase-config.js', () => ({
  FirebaseService: {
    nameToSlug: vi.fn((name) => name.toLowerCase().replace(/\s+/g, '_')),
    getMenuItem: vi.fn(),
    getAllMenu: vi.fn(),
    deleteMenuItem: vi.fn(),
    updateMenuItem: vi.fn(),
    menuRef: {
      child: vi.fn(() => ({
        set: vi.fn(() => Promise.resolve()),
        update: vi.fn(() => Promise.resolve()),
      })),
      update: vi.fn(() => Promise.resolve()),
    },
  },
}));

import {
  MenuService,
  validateName,
  validatePrice,
  validateDescription,
  validateCategory,
  validateMenuItem,
  createMenuItem,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_PRICE,
  MAX_PRICE,
} from '../../js/menu-service.js';

describe('MenuService', () => {
  describe('Constants', () => {
    it('should have correct constant values', () => {
      expect(MAX_NAME_LENGTH).toBe(100);
      expect(MAX_DESCRIPTION_LENGTH).toBe(200);
      expect(MIN_PRICE).toBe(0);
      expect(MAX_PRICE).toBe(999999);
    });

    it('should expose constants on MenuService object', () => {
      expect(MenuService.MAX_NAME_LENGTH).toBe(100);
      expect(MenuService.MAX_DESCRIPTION_LENGTH).toBe(200);
      expect(MenuService.MIN_PRICE).toBe(0);
      expect(MenuService.MAX_PRICE).toBe(999999);
    });
  });

  describe('validateName', () => {
    it('should return error for empty name', () => {
      const result = validateName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Nama menu wajib diisi');
    });

    it('should return error for null name', () => {
      const result = validateName(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Nama menu wajib diisi');
    });

    it('should return error for undefined name', () => {
      const result = validateName(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Nama menu wajib diisi');
    });

    it('should return error for whitespace-only name', () => {
      const result = validateName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Nama menu wajib diisi');
    });

    it('should return error for name exceeding max length', () => {
      const longName = 'a'.repeat(101);
      const result = validateName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('terlalu panjang');
    });

    it('should accept name at max length', () => {
      const maxName = 'a'.repeat(100);
      const result = validateName(maxName);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid name', () => {
      const result = validateName('Mie Ayam Biasa');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should trim whitespace before validation', () => {
      const result = validateName('  Mie Ayam  ');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validatePrice', () => {
    it('should return error for non-numeric price', () => {
      const result = validatePrice('abc');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Harga harus berupa angka');
    });

    it('should return error for negative price', () => {
      const result = validatePrice(-1);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Harga tidak boleh negatif');
    });

    it('should return error for price exceeding max', () => {
      const result = validatePrice(1000000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Harga terlalu besar');
    });

    it('should accept zero price', () => {
      const result = validatePrice(0);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept price at max boundary', () => {
      const result = validatePrice(999999);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid price', () => {
      const result = validatePrice(15000);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept numeric string price', () => {
      const result = validatePrice('15000');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept float price', () => {
      const result = validatePrice(15000.5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateDescription', () => {
    it('should accept empty description', () => {
      const result = validateDescription('');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept undefined description', () => {
      const result = validateDescription(undefined);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept null description', () => {
      const result = validateDescription(null);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return error for description exceeding max length', () => {
      const longDesc = 'a'.repeat(201);
      const result = validateDescription(longDesc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('terlalu panjang');
    });

    it('should accept description at max length', () => {
      const maxDesc = 'a'.repeat(200);
      const result = validateDescription(maxDesc);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept valid description', () => {
      const result = validateDescription('Mie ayam dengan topping ayam suwir');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateCategory', () => {
    it('should return error for empty category', () => {
      const result = validateCategory('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Kategori wajib diisi');
    });

    it('should return error for null category', () => {
      const result = validateCategory(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Kategori wajib diisi');
    });

    it('should return error for undefined category', () => {
      const result = validateCategory(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Kategori wajib diisi');
    });

    it('should return error for whitespace-only category', () => {
      const result = validateCategory('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Kategori wajib diisi');
    });

    it('should accept valid category', () => {
      const result = validateCategory('Mie Ayam');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateMenuItem', () => {
    it('should return valid for complete valid data', () => {
      const data = {
        name: 'Mie Ayam Biasa',
        price: 10000,
        description: 'Mie ayam klasik',
        category: 'Mie Ayam',
      };
      const result = validateMenuItem(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return all errors for completely invalid data', () => {
      const data = {
        name: '',
        price: -1,
        description: 'a'.repeat(201),
        category: '',
      };
      const result = validateMenuItem(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(4);
    });

    it('should collect multiple errors', () => {
      const data = {
        name: '',
        price: 'abc',
        category: 'Mie Ayam',
      };
      const result = validateMenuItem(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('createMenuItem', () => {
    it('should reject with missing name', async () => {
      const data = {
        name: '',
        price: 10000,
        category: 'Mie Ayam',
      };
      const result = await createMenuItem(data);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Nama menu wajib diisi');
      expect(result.itemId).toBeNull();
    });

    it('should reject with missing category', async () => {
      const data = {
        name: 'Mie Ayam Biasa',
        price: 10000,
        category: '',
      };
      const result = await createMenuItem(data);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Kategori wajib diisi');
    });

    it('should reject with invalid price', async () => {
      const data = {
        name: 'Mie Ayam Biasa',
        price: -1,
        category: 'Mie Ayam',
      };
      const result = await createMenuItem(data);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Harga tidak boleh negatif');
    });

    it('should succeed with valid data', async () => {
      const { FirebaseService } = await import('../../js/firebase-config.js');
      FirebaseService.getMenuItem.mockResolvedValue(null);
      FirebaseService.getAllMenu.mockResolvedValue({
        item1: { order: 1 },
        item2: { order: 2 },
      });

      const data = {
        name: 'Mie Ayam Baru',
        price: 12000,
        category: 'Mie Ayam',
        description: 'Mie ayam baru yang lezat',
      };
      const result = await createMenuItem(data);
      expect(result.success).toBe(true);
      expect(result.itemId).toBe('mie_ayam_baru');
      expect(result.error).toBeNull();
    });

    it('should reject duplicate menu item', async () => {
      const { FirebaseService } = await import('../../js/firebase-config.js');
      FirebaseService.getMenuItem.mockResolvedValue({ name: 'Mie Ayam Biasa' });

      const data = {
        name: 'Mie Ayam Biasa',
        price: 10000,
        category: 'Mie Ayam',
      };
      const result = await createMenuItem(data);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Menu dengan nama ini sudah ada');
    });
  });

  describe('MenuService object', () => {
    it('should expose all validation functions', () => {
      expect(typeof MenuService.validateName).toBe('function');
      expect(typeof MenuService.validatePrice).toBe('function');
      expect(typeof MenuService.validateDescription).toBe('function');
      expect(typeof MenuService.validateCategory).toBe('function');
      expect(typeof MenuService.validateMenuItem).toBe('function');
    });

    it('should expose all CRUD functions', () => {
      expect(typeof MenuService.createMenuItem).toBe('function');
      expect(typeof MenuService.updateMenuItem).toBe('function');
      expect(typeof MenuService.deleteMenuItem).toBe('function');
      expect(typeof MenuService.getMenuItem).toBe('function');
      expect(typeof MenuService.getMenuByCategory).toBe('function');
      expect(typeof MenuService.getAllMenuItems).toBe('function');
      expect(typeof MenuService.updateMenuOrder).toBe('function');
    });

    it('should expose MenuService on window for backward compatibility', () => {
      expect(window.MenuService).toBeDefined();
      expect(window.MenuService).toBe(MenuService);
    });
  });
});
