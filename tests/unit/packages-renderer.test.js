import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM
const mockContainer = {
  innerHTML: '',
  getElementById: vi.fn(),
};

document.getElementById = vi.fn((id) => {
  if (id === 'packages-container') return mockContainer;
  return null;
});

// Mock FirebaseService
window.FirebaseService = {
  seedInitialPackages: vi.fn(() => Promise.resolve()),
  getPackages: vi.fn(() => Promise.resolve({})),
  getAllMenu: vi.fn(() => Promise.resolve({})),
  onAllPackagesChange: vi.fn(),
};

describe('PackagesRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContainer.innerHTML = '';
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', async () => {
      const { escapeHtml } = await import('../../js/packages-renderer.js');
      expect(escapeHtml('<script>alert("xss")</script>')).not.toContain('<script>');
      expect(escapeHtml('Hello & World')).toContain('&amp;');
    });

    it('should handle normal text', async () => {
      const { escapeHtml } = await import('../../js/packages-renderer.js');
      expect(escapeHtml('Mie Ayam')).toBe('Mie Ayam');
    });
  });

  describe('resolveItemNames', () => {
    it('should return itemNames if available', async () => {
      const { resolveItemNames } = await import('../../js/packages-renderer.js');
      const pkg = { itemNames: ['Mie Ayam', 'Es Teh'], items: ['item1', 'item2'] };
      expect(resolveItemNames(pkg, {})).toEqual(['Mie Ayam', 'Es Teh']);
    });

    it('should resolve from menuData if itemNames not available', async () => {
      const { resolveItemNames } = await import('../../js/packages-renderer.js');
      const pkg = { items: ['item1', 'item2'] };
      const menuData = {
        item1: { name: 'Mie Ayam Biasa' },
        item2: { name: 'Es Teh Manis' },
      };
      expect(resolveItemNames(pkg, menuData)).toEqual(['Mie Ayam Biasa', 'Es Teh Manis']);
    });

    it('should return item id if not found in menuData', async () => {
      const { resolveItemNames } = await import('../../js/packages-renderer.js');
      const pkg = { items: ['item1', 'item2'] };
      expect(resolveItemNames(pkg, {})).toEqual(['item1', 'item2']);
    });

    it('should return empty array if no items', async () => {
      const { resolveItemNames } = await import('../../js/packages-renderer.js');
      expect(resolveItemNames({}, null)).toEqual([]);
    });
  });

  describe('buildWhatsAppLink', () => {
    it('should build WhatsApp link with custom message', async () => {
      const { buildWhatsAppLink } = await import('../../js/packages-renderer.js');
      const pkg = { whatsappMessage: 'Test message', name: 'Paket Test' };
      const link = buildWhatsAppLink(pkg);
      expect(link).toContain('wa.me/6281364856560');
      expect(link).toContain(encodeURIComponent('Test message'));
    });

    it('should use default message if whatsappMessage not provided', async () => {
      const { buildWhatsAppLink } = await import('../../js/packages-renderer.js');
      const pkg = { name: 'Paket Test' };
      const link = buildWhatsAppLink(pkg);
      expect(link).toContain(encodeURIComponent('Halo Mie Ayam Lariska, saya mau pesan Paket Test'));
    });
  });

  describe('FALLBACK_PACKAGES', () => {
    it('should have 4 fallback packages', async () => {
      const { FALLBACK_PACKAGES } = await import('../../js/packages-renderer.js');
      expect(Object.keys(FALLBACK_PACKAGES)).toHaveLength(4);
    });

    it('should have required fields for each package', async () => {
      const { FALLBACK_PACKAGES } = await import('../../js/packages-renderer.js');
      Object.values(FALLBACK_PACKAGES).forEach((pkg) => {
        expect(pkg).toHaveProperty('name');
        expect(pkg).toHaveProperty('price');
        expect(pkg).toHaveProperty('items');
        expect(pkg).toHaveProperty('isActive');
        expect(pkg.price).toBeGreaterThan(0);
      });
    });
  });

  describe('renderPackages', () => {
    it('should render active packages', async () => {
      const { renderPackages } = await import('../../js/packages-renderer.js');
      const packagesData = {
        'pkg1': {
          name: 'Test Package',
          price: 15000,
          isActive: true,
          items: ['item1'],
          itemNames: ['Item 1'],
          icon: '🍜',
          tag: 'Basic',
          isFeatured: false,
        },
      };

      renderPackages(packagesData, null, mockContainer);
      expect(mockContainer.innerHTML).toContain('Test Package');
      expect(mockContainer.innerHTML).toContain('15k');
    });

    it('should not render inactive packages', async () => {
      const { renderPackages } = await import('../../js/packages-renderer.js');
      const packagesData = {
        'pkg1': {
          name: 'Inactive Package',
          price: 15000,
          isActive: false,
        },
      };

      renderPackages(packagesData, null, mockContainer);
      expect(mockContainer.innerHTML).not.toContain('Inactive Package');
    });

    it('should highlight featured packages', async () => {
      const { renderPackages } = await import('../../js/packages-renderer.js');
      const packagesData = {
        'pkg1': {
          name: 'Featured Package',
          price: 15000,
          isActive: true,
          isFeatured: true,
          items: [],
          icon: '🔥',
          tag: 'Best Seller',
        },
      };

      renderPackages(packagesData, null, mockContainer);
      expect(mockContainer.innerHTML).toContain('packages__card--featured');
      expect(mockContainer.innerHTML).toContain('Paling Laris');
    });
  });
});
