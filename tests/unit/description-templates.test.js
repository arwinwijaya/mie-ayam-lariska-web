import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DescriptionTemplates,
  generateDescription,
  generateBulkDescriptions,
  getTemplatesForCategory,
  addTemplate,
  TEMPLATES,
  TOPPING_MAP,
} from '../../js/description-templates.js';

describe('DescriptionTemplates', () => {
  describe('Module exports', () => {
    it('should export DescriptionTemplates object', () => {
      expect(DescriptionTemplates).toBeDefined();
      expect(typeof DescriptionTemplates).toBe('object');
    });

    it('should export standalone functions', () => {
      expect(typeof generateDescription).toBe('function');
      expect(typeof generateBulkDescriptions).toBe('function');
      expect(typeof getTemplatesForCategory).toBe('function');
      expect(typeof addTemplate).toBe('function');
    });

    it('should export TEMPLATES and TOPPING_MAP', () => {
      expect(TEMPLATES).toBeDefined();
      expect(TOPPING_MAP).toBeDefined();
    });

    it('should expose DescriptionTemplates on window for backward compatibility', () => {
      expect(window.DescriptionTemplates).toBeDefined();
      expect(window.DescriptionTemplates).toBe(DescriptionTemplates);
    });

    it('should expose all functions on DescriptionTemplates object', () => {
      expect(typeof DescriptionTemplates.generateDescription).toBe('function');
      expect(typeof DescriptionTemplates.generateBulkDescriptions).toBe('function');
      expect(typeof DescriptionTemplates.getTemplatesForCategory).toBe('function');
      expect(typeof DescriptionTemplates.addTemplate).toBe('function');
    });
  });

  describe('TEMPLATES', () => {
    it('should have templates for Mie Ayam category', () => {
      expect(TEMPLATES['Mie Ayam']).toBeDefined();
      expect(Array.isArray(TEMPLATES['Mie Ayam'])).toBe(true);
      expect(TEMPLATES['Mie Ayam'].length).toBeGreaterThan(0);
    });

    it('should have templates for Minuman category', () => {
      expect(TEMPLATES['Minuman']).toBeDefined();
      expect(Array.isArray(TEMPLATES['Minuman'])).toBe(true);
      expect(TEMPLATES['Minuman'].length).toBeGreaterThan(0);
    });

    it('should have templates for Topping Tambahan category', () => {
      expect(TEMPLATES['Topping Tambahan']).toBeDefined();
      expect(Array.isArray(TEMPLATES['Topping Tambahan'])).toBe(true);
      expect(TEMPLATES['Topping Tambahan'].length).toBeGreaterThan(0);
    });

    it('should contain {name} placeholder in all templates', () => {
      Object.values(TEMPLATES).forEach((templates) => {
        templates.forEach((template) => {
          expect(template).toContain('{name}');
        });
      });
    });

    it('should contain {topping} placeholder in at least one Mie Ayam template', () => {
      const hasTopping = TEMPLATES['Mie Ayam'].some((template) => template.includes('{topping}'));
      expect(hasTopping).toBe(true);
    });
  });

  describe('TOPPING_MAP', () => {
    it('should have topping for mie_ayam_mini', () => {
      expect(TOPPING_MAP['mie_ayam_mini']).toBe('ayam suwir');
    });

    it('should have topping for mie_ayam_komplit', () => {
      expect(TOPPING_MAP['mie_ayam_komplit']).toBe('ceker, pangsit, dan bakso');
    });

    it('should have topping for mie_ayam_bakso', () => {
      expect(TOPPING_MAP['mie_ayam_bakso']).toBe('bakso sapi kenyal');
    });

    it('should have 11 toppings total', () => {
      expect(Object.keys(TOPPING_MAP).length).toBe(11);
    });
  });

  describe('generateDescription', () => {
    it('should generate description for Mie Ayam category', () => {
      const result = generateDescription('Mie Ayam Biasa', 'Mie Ayam');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Mie Ayam Biasa');
    });

    it('should generate description for Minuman category', () => {
      const result = generateDescription('Es Teh Manis', 'Minuman');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Es Teh Manis');
    });

    it('should generate description for Topping Tambahan category', () => {
      const result = generateDescription('Bakso', 'Topping Tambahan');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Bakso');
    });

    it('should use topping from TOPPING_MAP when itemId is provided', () => {
      // Run multiple times to account for random template selection
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        const result = generateDescription('Mie Ayam Bakso', 'Mie Ayam', { itemId: 'mie_ayam_bakso' });
        results.add(result);
      }
      // At least one result should contain the topping
      const hasTopping = Array.from(results).some(r => r.includes('bakso sapi kenyal'));
      expect(hasTopping).toBe(true);
    });

    it('should use default topping when itemId is not in TOPPING_MAP', () => {
      // Run multiple times to account for random template selection
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        const result = generateDescription('Mie Ayam Custom', 'Mie Ayam', { itemId: 'nonexistent' });
        results.add(result);
      }
      // All results should contain the item name
      const allContainName = Array.from(results).every(r => r.includes('Mie Ayam Custom'));
      expect(allContainName).toBe(true);
      // At least some results should contain a topping (either mapped or default)
      const hasAnyTopping = Array.from(results).some(r => 
        r.includes('ayam suwir') || r.includes('ayam cincang') || r.includes('topping')
      );
      expect(hasAnyTopping).toBe(true);
    });

    it('should fallback to Mie Ayam templates for unknown category', () => {
      const result = generateDescription('Test Item', 'Unknown Category');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Test Item');
    });

    it('should respect maxLength option', () => {
      const result = generateDescription('Mie Ayam Biasa', 'Mie Ayam', { maxLength: 30 });
      expect(result.length).toBeLessThanOrEqual(33); // 30 + '...'
    });

    it('should truncate with ellipsis when exceeding maxLength', () => {
      const result = generateDescription('Mie Ayam Biasa', 'Mie Ayam', { maxLength: 20 });
      if (result.length > 20) {
        expect(result).toMatch(/\.\.\.$/);
      }
    });

    it('should not truncate when within maxLength', () => {
      const result = generateDescription('Test', 'Mie Ayam', { maxLength: 500 });
      expect(result).not.toContain('...');
    });

    it('should handle missing options gracefully', () => {
      const result = generateDescription('Test', 'Mie Ayam');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty options object', () => {
      const result = generateDescription('Test', 'Mie Ayam', {});
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateBulkDescriptions', () => {
    it('should generate descriptions for multiple items', () => {
      const items = [
        { itemId: 'mie_ayam_biasa', name: 'Mie Ayam Biasa', category: 'Mie Ayam' },
        { itemId: 'es_teh_manis', name: 'Es Teh Manis', category: 'Minuman' },
      ];
      const results = generateBulkDescriptions(items);
      expect(results).toHaveLength(2);
      expect(results[0].itemId).toBe('mie_ayam_biasa');
      expect(results[0].description).toContain('Mie Ayam Biasa');
      expect(results[1].itemId).toBe('es_teh_manis');
      expect(results[1].description).toContain('Es Teh Manis');
    });

    it('should pass maxLength option to generateDescription', () => {
      const items = [
        { itemId: 'test', name: 'Test Item', category: 'Mie Ayam' },
      ];
      const results = generateBulkDescriptions(items, { maxLength: 20 });
      expect(results).toHaveLength(1);
      if (results[0].description.length > 20) {
        expect(results[0].description).toMatch(/\.\.\.$/);
      }
    });

    it('should handle empty array', () => {
      const results = generateBulkDescriptions([]);
      expect(results).toHaveLength(0);
    });

    it('should handle single item', () => {
      const items = [
        { itemId: 'test', name: 'Test', category: 'Minuman' },
      ];
      const results = generateBulkDescriptions(items);
      expect(results).toHaveLength(1);
      expect(results[0].itemId).toBe('test');
    });
  });

  describe('getTemplatesForCategory', () => {
    it('should return templates for valid category', () => {
      const templates = getTemplatesForCategory('Mie Ayam');
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown category', () => {
      const templates = getTemplatesForCategory('Nonexistent');
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBe(0);
    });

    it('should return all category templates', () => {
      expect(getTemplatesForCategory('Mie Ayam').length).toBeGreaterThan(0);
      expect(getTemplatesForCategory('Minuman').length).toBeGreaterThan(0);
      expect(getTemplatesForCategory('Topping Tambahan').length).toBeGreaterThan(0);
    });
  });

  describe('addTemplate', () => {
    it('should add template to existing category', () => {
      const initialLength = TEMPLATES['Mie Ayam'].length;
      addTemplate('Mie Ayam', 'Test template {name}');
      expect(TEMPLATES['Mie Ayam'].length).toBe(initialLength + 1);
      expect(TEMPLATES['Mie Ayam']).toContain('Test template {name}');
      // Cleanup
      TEMPLATES['Mie Ayam'].pop();
    });

    it('should create new category if it does not exist', () => {
      expect(TEMPLATES['New Category']).toBeUndefined();
      addTemplate('New Category', 'Test {name}');
      expect(TEMPLATES['New Category']).toBeDefined();
      expect(TEMPLATES['New Category']).toContain('Test {name}');
      // Cleanup
      delete TEMPLATES['New Category'];
    });
  });
});
