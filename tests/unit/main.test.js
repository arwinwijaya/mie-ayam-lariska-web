import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockNavToggle = {
  classList: { toggle: vi.fn(), contains: vi.fn() },
  setAttribute: vi.fn(),
  addEventListener: vi.fn(),
};

const mockNavMenu = {
  classList: { toggle: vi.fn(), contains: vi.fn() },
  querySelectorAll: vi.fn(() => []),
  addEventListener: vi.fn(),
};

const mockFaqButtons = [
  { addEventListener: vi.fn(), getAttribute: vi.fn(() => 'faq-answer-1'), classList: { toggle: vi.fn() } },
  { addEventListener: vi.fn(), getAttribute: vi.fn(() => 'faq-answer-2'), classList: { toggle: vi.fn() } },
];

const mockFaqAnswers = [
  { classList: { toggle: vi.fn(), contains: vi.fn(() => false) }, style: { maxHeight: '' } },
  { classList: { toggle: vi.fn(), contains: vi.fn(() => false) }, style: { maxHeight: '' } },
];

document.getElementById = vi.fn((id) => {
  if (id === 'nav-toggle') return mockNavToggle;
  if (id === 'nav-menu') return mockNavMenu;
  return null;
});

document.querySelectorAll = vi.fn((selector) => {
  if (selector === '.faq__question') return mockFaqButtons;
  if (selector === '.faq__answer') return mockFaqAnswers;
  if (selector === '.nav__link') return [];
  if (selector === 'a[href^="#"]') return [];
  if (selector === 'section[data-section]') return [];
  return [];
});

// Mock FirebaseService
window.FirebaseService = {
  onMenuChange: vi.fn(),
  onStockChange: vi.fn(),
  onAllStockChange: vi.fn(),
  getAllMenu: vi.fn(() => Promise.resolve({})),
  getStockStatus: vi.fn(() => Promise.resolve({})),
  seedInitialMenu: vi.fn(() => Promise.resolve()),
  seedInitialStock: vi.fn(() => Promise.resolve()),
  getMenu: vi.fn(() => Promise.resolve({})),
};

window.StockService = {
  getCachedStockData: vi.fn(() => ({})),
  saveStockData: vi.fn(),
  normalizeStockStatus: vi.fn((status) => status),
  mergeStockData: vi.fn((menu, stock) => menu),
};

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export initApp function', async () => {
      const module = await import('../../js/main.js');
      expect(module).toHaveProperty('initApp');
      expect(typeof module.initApp).toBe('function');
    });

    it('should export renderMenu function', async () => {
      const module = await import('../../js/main.js');
      expect(module).toHaveProperty('renderMenu');
      expect(typeof module.renderMenu).toBe('function');
    });

    it('should export getStatusText function', async () => {
      const module = await import('../../js/main.js');
      expect(module).toHaveProperty('getStatusText');
      expect(typeof module.getStatusText).toBe('function');
    });

    it('should export BADGE_CONFIG', async () => {
      const module = await import('../../js/main.js');
      expect(module).toHaveProperty('BADGE_CONFIG');
      expect(typeof module.BADGE_CONFIG).toBe('object');
    });
  });

  describe('getStatusText', () => {
    it('should return "Tersedia" for available', async () => {
      const { getStatusText } = await import('../../js/main.js');
      expect(getStatusText('available')).toBe('Tersedia');
    });

    it('should return "Terbatas" for limited', async () => {
      const { getStatusText } = await import('../../js/main.js');
      expect(getStatusText('limited')).toBe('Terbatas');
    });

    it('should return "Habis" for sold_out', async () => {
      const { getStatusText } = await import('../../js/main.js');
      expect(getStatusText('sold_out')).toBe('Habis');
    });

    it('should return "Tersedia" for unknown status', async () => {
      const { getStatusText } = await import('../../js/main.js');
      expect(getStatusText('unknown')).toBe('Tersedia');
    });

    it('should return "Tersedia" for null/undefined', async () => {
      const { getStatusText } = await import('../../js/main.js');
      expect(getStatusText(null)).toBe('Tersedia');
      expect(getStatusText(undefined)).toBe('Tersedia');
    });
  });

  describe('BADGE_CONFIG', () => {
    it('should have 4 badge types', async () => {
      const { BADGE_CONFIG } = await import('../../js/main.js');
      expect(Object.keys(BADGE_CONFIG)).toHaveLength(4);
    });

    it('should have icon, label, and class for each badge', async () => {
      const { BADGE_CONFIG } = await import('../../js/main.js');
      Object.values(BADGE_CONFIG).forEach((badge) => {
        expect(badge).toHaveProperty('icon');
        expect(badge).toHaveProperty('label');
        expect(badge).toHaveProperty('class');
      });
    });

    it('should have favorit badge', async () => {
      const { BADGE_CONFIG } = await import('../../js/main.js');
      expect(BADGE_CONFIG).toHaveProperty('favorit');
      expect(BADGE_CONFIG.favorit.icon).toBe('⭐');
    });

    it('should have bestseller badge', async () => {
      const { BADGE_CONFIG } = await import('../../js/main.js');
      expect(BADGE_CONFIG).toHaveProperty('bestseller');
      expect(BADGE_CONFIG.bestseller.icon).toBe('🔥');
    });
  });

  describe('initApp', () => {
    it('should initialize without errors', async () => {
      const { initApp } = await import('../../js/main.js');
      expect(() => initApp()).not.toThrow();
    });
  });
});
