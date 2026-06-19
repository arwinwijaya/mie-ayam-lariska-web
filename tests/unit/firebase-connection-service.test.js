import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockStatusElement = {
  classList: { add: vi.fn(), remove: vi.fn() },
  textContent: '',
};

const mockReconnectButton = {
  addEventListener: vi.fn(),
  style: { display: '' },
};

describe('FirebaseConnectionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStatusElement.textContent = '';
    mockReconnectButton.style.display = '';
  });

  describe('Module structure', () => {
    it('should export init function', async () => {
      const module = await import('../../js/firebase-connection-service.js');
      expect(module).toHaveProperty('init');
      expect(typeof module.init).toBe('function');
    });

    it('should export isOnline function', async () => {
      const module = await import('../../js/firebase-connection-service.js');
      expect(module).toHaveProperty('isOnline');
      expect(typeof module.isOnline).toBe('function');
    });

    it('should set window.FirebaseConnectionService for backward compat', async () => {
      await import('../../js/firebase-connection-service.js');
      expect(window.FirebaseConnectionService).toBeDefined();
      expect(window.FirebaseConnectionService).toHaveProperty('init');
    });
  });

  describe('init', () => {
    it('should accept config object with DOM elements', async () => {
      const { init } = await import('../../js/firebase-connection-service.js');
      expect(() => {
        init({
          statusElement: mockStatusElement,
          reconnectButton: mockReconnectButton,
        });
      }).not.toThrow();
    });

    it('should handle missing DOM elements gracefully', async () => {
      const { init } = await import('../../js/firebase-connection-service.js');
      expect(() => {
        init({
          statusElement: null,
          reconnectButton: null,
        });
      }).not.toThrow();
    });
  });

  describe('isOnline', () => {
    it('should return boolean', async () => {
      const { isOnline } = await import('../../js/firebase-connection-service.js');
      expect(typeof isOnline()).toBe('boolean');
    });
  });
});
