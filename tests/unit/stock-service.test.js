import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('StockService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Module structure', () => {
    it('should export normalizeStockStatus function', async () => {
      const module = await import('../../js/stock-service.js');
      expect(module).toHaveProperty('normalizeStockStatus');
      expect(typeof module.normalizeStockStatus).toBe('function');
    });

    it('should export saveStockData function', async () => {
      const module = await import('../../js/stock-service.js');
      expect(module).toHaveProperty('saveStockData');
      expect(typeof module.saveStockData).toBe('function');
    });

    it('should export getCachedStockData function', async () => {
      const module = await import('../../js/stock-service.js');
      expect(module).toHaveProperty('getCachedStockData');
      expect(typeof module.getCachedStockData).toBe('function');
    });

    it('should export mergeStockData function', async () => {
      const module = await import('../../js/stock-service.js');
      expect(module).toHaveProperty('mergeStockData');
      expect(typeof module.mergeStockData).toBe('function');
    });

    it('should set window.StockService for backward compat', async () => {
      await import('../../js/stock-service.js');
      expect(window.StockService).toBeDefined();
      expect(window.StockService).toHaveProperty('normalizeStockStatus');
    });
  });

  describe('normalizeStockStatus', () => {
    it('should return "available" for valid "available"', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus('available')).toBe('available');
    });

    it('should return "limited" for valid "limited"', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus('limited')).toBe('limited');
    });

    it('should return "sold_out" for valid "sold_out"', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus('sold_out')).toBe('sold_out');
    });

    it('should return "sold_out" for invalid status', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus('INVALID')).toBe('sold_out');
    });

    it('should return "sold_out" for null', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus(null)).toBe('sold_out');
    });

    it('should return "sold_out" for undefined', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus(undefined)).toBe('sold_out');
    });

    it('should return "sold_out" for empty string', async () => {
      const { normalizeStockStatus } = await import('../../js/stock-service.js');
      expect(normalizeStockStatus('')).toBe('sold_out');
    });
  });

  describe('saveStockData', () => {
    it('should save data to localStorage', async () => {
      const { saveStockData } = await import('../../js/stock-service.js');
      const data = { item1: { status: 'available' } };
      saveStockData(data);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getCachedStockData', () => {
    it('should return empty object if no cached data', async () => {
      const { getCachedStockData } = await import('../../js/stock-service.js');
      const result = getCachedStockData();
      expect(result).toEqual({});
    });
  });

  describe('mergeStockData', () => {
    it('should merge menu and stock data', async () => {
      const { mergeStockData } = await import('../../js/stock-service.js');
      const menuData = {
        item1: { name: 'Mie Ayam', price: 12000 },
        item2: { name: 'Es Teh', price: 5000 },
      };
      const stockData = {
        item1: { status: 'available' },
        item2: { status: 'sold_out' },
      };
      const result = mergeStockData(menuData, stockData);
      expect(result.item1.status).toBe('available');
      expect(result.item2.status).toBe('sold_out');
    });

    it('should default to available if no stock data', async () => {
      const { mergeStockData } = await import('../../js/stock-service.js');
      const menuData = {
        item1: { name: 'Mie Ayam', price: 12000 },
      };
      const result = mergeStockData(menuData, {});
      expect(result.item1.status).toBe('available');
    });
  });
});
