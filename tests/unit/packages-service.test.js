import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock FirebaseService
window.FirebaseService = {
  addPackage: vi.fn(() => Promise.resolve('new-id')),
  updatePackage: vi.fn(() => Promise.resolve()),
  deletePackage: vi.fn(() => Promise.resolve()),
  getPackages: vi.fn(() => Promise.resolve({})),
  onAllPackagesChange: vi.fn(),
};

describe('PackagesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export add function', async () => {
      const module = await import('../../js/packages-service.js');
      expect(module).toHaveProperty('add');
      expect(typeof module.add).toBe('function');
    });

    it('should export update function', async () => {
      const module = await import('../../js/packages-service.js');
      expect(module).toHaveProperty('update');
      expect(typeof module.update).toBe('function');
    });

    it('should export delete function', async () => {
      const module = await import('../../js/packages-service.js');
      expect(module).toHaveProperty('delete');
      expect(typeof module.delete).toBe('function');
    });

    it('should export validatePackage function', async () => {
      const module = await import('../../js/packages-service.js');
      expect(module).toHaveProperty('validatePackage');
      expect(typeof module.validatePackage).toBe('function');
    });

    it('should set window.PackagesService for backward compat', async () => {
      await import('../../js/packages-service.js');
      expect(window.PackagesService).toBeDefined();
      expect(window.PackagesService).toHaveProperty('add');
    });
  });

  describe('validatePackage', () => {
    it('should reject package without name', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ price: 15000, items: ['item1'] });
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject package with empty name', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: '', price: 15000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with whitespace-only name', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: '   ', price: 15000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package without price', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: 'Test Package', items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with price 0', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: 'Test Package', price: 0, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with negative price', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: 'Test Package', price: -1000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should accept valid package data', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({
        name: 'Test Package',
        price: 15000,
        items: ['item1', 'item2'],
      });
      expect(result.valid).toBe(true);
    });

    it('should accept package with price 1 (minimum)', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({
        name: 'Cheap Package',
        price: 1,
        items: ['item1'],
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('add', () => {
    it('should call FirebaseService.addPackage with valid data', async () => {
      const { add } = await import('../../js/packages-service.js');
      const pkgData = {
        name: 'Test Package',
        price: 15000,
        items: ['item1'],
        description: 'Test description',
      };
      await add(pkgData);
      expect(window.FirebaseService.addPackage).toHaveBeenCalled();
    });

    it('should reject invalid package data', async () => {
      const { add } = await import('../../js/packages-service.js');
      await expect(add({ name: '', price: 0 })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should call FirebaseService.updatePackage', async () => {
      const { update } = await import('../../js/packages-service.js');
      const pkgData = {
        name: 'Updated Package',
        price: 20000,
        items: ['item1'],
      };
      await update('pkg-1', pkgData);
      expect(window.FirebaseService.updatePackage).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call FirebaseService.deletePackage', async () => {
      const { delete: deletePkg } = await import('../../js/packages-service.js');
      await deletePkg('pkg-1');
      expect(window.FirebaseService.deletePackage).toHaveBeenCalled();
    });
  });
});
