import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockContainer = {
  querySelectorAll: vi.fn(() => []),
  querySelector: vi.fn(),
  addEventListener: vi.fn(),
};

describe('DragDropService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export init function', async () => {
      const module = await import('../../js/drag-drop-service.js');
      expect(module).toHaveProperty('init');
      expect(typeof module.init).toBe('function');
    });

    it('should export enableDragDrop function', async () => {
      const module = await import('../../js/drag-drop-service.js');
      expect(module).toHaveProperty('enableDragDrop');
      expect(typeof module.enableDragDrop).toBe('function');
    });

    it('should set window.DragDropService for backward compat', async () => {
      await import('../../js/drag-drop-service.js');
      expect(window.DragDropService).toBeDefined();
      expect(window.DragDropService).toHaveProperty('init');
    });
  });

  describe('init', () => {
    it('should accept callbacks object', async () => {
      const { init } = await import('../../js/drag-drop-service.js');
      const callbacks = {
        onReorder: vi.fn(),
        getItems: vi.fn(() => []),
      };
      expect(() => {
        init(callbacks);
      }).not.toThrow();
    });

    it('should handle missing callbacks gracefully', async () => {
      const { init } = await import('../../js/drag-drop-service.js');
      expect(() => {
        init({});
      }).not.toThrow();
    });
  });

  describe('enableDragDrop', () => {
    it('should accept container element and options', async () => {
      const { enableDragDrop } = await import('../../js/drag-drop-service.js');
      expect(() => {
        enableDragDrop(mockContainer, {
          itemSelector: '.draggable-item',
          onReorder: vi.fn(),
        });
      }).not.toThrow();
    });
  });
});
