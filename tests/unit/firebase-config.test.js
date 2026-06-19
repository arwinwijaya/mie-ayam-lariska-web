import { describe, it, expect } from 'vitest';
import { FirebaseService } from '../../js/firebase-config.js';

describe('FirebaseService', () => {
  it('should export all public methods', () => {
    expect(FirebaseService).toBeDefined();
    expect(typeof FirebaseService.getAllMenu).toBe('function');
    expect(typeof FirebaseService.updateMenuItem).toBe('function');
    expect(typeof FirebaseService.deleteMenuItem).toBe('function');
    expect(typeof FirebaseService.getPackages).toBe('function');
    expect(typeof FirebaseService.updatePackage).toBe('function');
    expect(typeof FirebaseService.deletePackage).toBe('function');
  });

  it('should expose FirebaseService on window for backward compatibility', () => {
    expect(window.FirebaseService).toBeDefined();
    expect(window.FirebaseService).toBe(FirebaseService);
  });

  it('should preserve all menu functions', () => {
    expect(typeof FirebaseService.seedInitialMenu).toBe('function');
    expect(typeof FirebaseService.onMenuItemChange).toBe('function');
    expect(typeof FirebaseService.onAllMenuChange).toBe('function');
    expect(typeof FirebaseService.updateMenuItem).toBe('function');
    expect(typeof FirebaseService.deleteMenuItem).toBe('function');
    expect(typeof FirebaseService.getMenuItem).toBe('function');
    expect(typeof FirebaseService.getAllMenu).toBe('function');
    expect(typeof FirebaseService.nameToSlug).toBe('function');
    expect(typeof FirebaseService.isValidStatus).toBe('function');
    expect(typeof FirebaseService.getStatusText).toBe('function');
  });

  it('should preserve all package functions', () => {
    expect(typeof FirebaseService.seedInitialPackages).toBe('function');
    expect(typeof FirebaseService.addPackage).toBe('function');
    expect(typeof FirebaseService.getPackages).toBe('function');
    expect(typeof FirebaseService.updatePackage).toBe('function');
    expect(typeof FirebaseService.deletePackage).toBe('function');
    expect(typeof FirebaseService.onAllPackagesChange).toBe('function');
  });

  it('should preserve backward compatibility stock functions', () => {
    expect(typeof FirebaseService.seedInitialStock).toBe('function');
    expect(typeof FirebaseService.onStockChange).toBe('function');
    expect(typeof FirebaseService.onAllStockChange).toBe('function');
    expect(typeof FirebaseService.updateStock).toBe('function');
    expect(typeof FirebaseService.getStockStatus).toBe('function');
    expect(typeof FirebaseService.getAllStock).toBe('function');
    expect(typeof FirebaseService.nameToStockId).toBe('function');
    expect(typeof FirebaseService.isValidStockStatus).toBe('function');
  });

  it('should have config and data properties', () => {
    expect(FirebaseService.config).toBeDefined();
    expect(FirebaseService.INITIAL_MENU_DATA).toBeDefined();
    expect(FirebaseService.INITIAL_PACKAGES_DATA).toBeDefined();
    expect(FirebaseService.INITIAL_STOCK_DATA).toBeDefined();
  });
});
