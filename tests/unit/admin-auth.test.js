import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AdminAuth,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  SESSION_KEY,
  SESSION_DURATION,
} from '../../js/admin-auth.js';

describe('AdminAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset firebase mock
    global.firebase = {
      auth: vi.fn(() => ({
        signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
        signOut: vi.fn(() => Promise.resolve()),
      })),
      database: vi.fn(() => ({
        ref: vi.fn(() => ({
          set: vi.fn(() => Promise.resolve()),
          remove: vi.fn(() => Promise.resolve()),
        })),
        ServerValue: { TIMESTAMP: 1234567890 },
      })),
    };
  });

  describe('Module exports', () => {
    it('should export AdminAuth object', () => {
      expect(AdminAuth).toBeDefined();
      expect(typeof AdminAuth).toBe('object');
    });

    it('should export constants', () => {
      expect(ADMIN_USERNAME).toBe('lariska');
      expect(ADMIN_PASSWORD).toBe('lariska123');
      expect(SESSION_KEY).toBe('admin_session');
      expect(SESSION_DURATION).toBe(24 * 60 * 60 * 1000);
    });

    it('should expose AdminAuth on window for backward compatibility', () => {
      expect(window.AdminAuth).toBeDefined();
      expect(window.AdminAuth).toBe(AdminAuth);
    });

    it('should expose all methods on AdminAuth', () => {
      expect(typeof AdminAuth.isSessionExpired).toBe('function');
      expect(typeof AdminAuth.isLoggedIn).toBe('function');
      expect(typeof AdminAuth.getSession).toBe('function');
      expect(typeof AdminAuth.login).toBe('function');
      expect(typeof AdminAuth.logout).toBe('function');
      expect(typeof AdminAuth.requireAuth).toBe('function');
      expect(typeof AdminAuth.initLoginForm).toBe('function');
    });
  });

  describe('isSessionExpired', () => {
    it('should return true for null session', () => {
      expect(AdminAuth.isSessionExpired(null)).toBe(true);
    });

    it('should return true for undefined session', () => {
      expect(AdminAuth.isSessionExpired(undefined)).toBe(true);
    });

    it('should return true for session without timestamp', () => {
      expect(AdminAuth.isSessionExpired({ value: true })).toBe(true);
    });

    it('should return true for session older than 24 hours', () => {
      const oldSession = {
        value: true,
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
      };
      expect(AdminAuth.isSessionExpired(oldSession)).toBe(true);
    });

    it('should return false for session within 24 hours', () => {
      const recentSession = {
        value: true,
        timestamp: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago
      };
      expect(AdminAuth.isSessionExpired(recentSession)).toBe(false);
    });

    it('should return false for fresh session', () => {
      const freshSession = {
        value: true,
        timestamp: Date.now(),
      };
      expect(AdminAuth.isSessionExpired(freshSession)).toBe(false);
    });

    it('should return true for session exactly at 24 hours', () => {
      const exactSession = {
        value: true,
        timestamp: Date.now() - SESSION_DURATION - 1, // Just over 24 hours
      };
      expect(AdminAuth.isSessionExpired(exactSession)).toBe(true);
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no session exists', () => {
      expect(AdminAuth.isLoggedIn()).toBe(false);
    });

    it('should return true for valid session', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: true,
        timestamp: Date.now(),
      }));
      expect(AdminAuth.isLoggedIn()).toBe(true);
    });

    it('should return false for expired session', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: true,
        timestamp: Date.now() - (25 * 60 * 60 * 1000),
      }));
      expect(AdminAuth.isLoggedIn()).toBe(false);
    });

    it('should clear expired session from localStorage', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: true,
        timestamp: Date.now() - (25 * 60 * 60 * 1000),
      }));
      AdminAuth.isLoggedIn();
      expect(localStorage.removeItem).toHaveBeenCalledWith(SESSION_KEY);
    });

    it('should return false for legacy format "true"', () => {
      localStorage.setItem(SESSION_KEY, 'true');
      expect(AdminAuth.isLoggedIn()).toBe(false);
    });

    it('should clear legacy format from localStorage', () => {
      localStorage.setItem(SESSION_KEY, 'true');
      AdminAuth.isLoggedIn();
      expect(localStorage.removeItem).toHaveBeenCalledWith(SESSION_KEY);
    });

    it('should return false for session with value !== true', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: false,
        timestamp: Date.now(),
      }));
      expect(AdminAuth.isLoggedIn()).toBe(false);
    });

    it('should return false for invalid JSON', () => {
      localStorage.setItem(SESSION_KEY, 'invalid-json');
      expect(AdminAuth.isLoggedIn()).toBe(false);
    });
  });

  describe('getSession', () => {
    it('should return null when no session exists', () => {
      expect(AdminAuth.getSession()).toBeNull();
    });

    it('should return session object for valid session', () => {
      const session = {
        value: true,
        timestamp: Date.now(),
        uid: 'test-uid',
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      const result = AdminAuth.getSession();
      expect(result).toEqual(session);
    });

    it('should return null for expired session', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: true,
        timestamp: Date.now() - (25 * 60 * 60 * 1000),
      }));
      expect(AdminAuth.getSession()).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem(SESSION_KEY, 'invalid');
      expect(AdminAuth.getSession()).toBeNull();
    });
  });

  describe('login', () => {
    it('should return success for correct credentials', () => {
      const result = AdminAuth.login('lariska', 'lariska123');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Login berhasil');
    });

    it('should return failure for incorrect username', () => {
      const result = AdminAuth.login('wrong', 'lariska123');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Username atau password salah');
    });

    it('should return failure for incorrect password', () => {
      const result = AdminAuth.login('lariska', 'wrong');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Username atau password salah');
    });

    it('should return failure for empty credentials', () => {
      const result = AdminAuth.login('', '');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Username atau password salah');
    });

    it('should store session in localStorage on successful login', async () => {
      AdminAuth.login('lariska', 'lariska123');
      // Wait for async Firebase auth to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(localStorage.setItem).toHaveBeenCalled();
      const setItemCall = localStorage.setItem.mock.calls.find(
        call => call[0] === SESSION_KEY
      );
      expect(setItemCall).toBeDefined();
      const session = JSON.parse(setItemCall[1]);
      expect(session.value).toBe(true);
      expect(session.timestamp).toBeDefined();
    });

    it('should set uid from Firebase when auth succeeds', async () => {
      AdminAuth.login('lariska', 'lariska123');
      // Wait for async Firebase auth to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      const setItemCall = localStorage.setItem.mock.calls.find(
        call => call[0] === SESSION_KEY
      );
      expect(setItemCall).toBeDefined();
      const session = JSON.parse(setItemCall[1]);
      // Firebase auth succeeded, so uid should be set
      expect(session.uid).toBe('test-uid');
    });
  });

  describe('logout', () => {
    it('should clear session from localStorage', () => {
      // Setup a session first
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: true,
        timestamp: Date.now(),
        uid: 'test-uid',
      }));

      // Mock window.location.href
      const originalHref = window.location.href;
      delete window.location;
      window.location = { href: '' };

      AdminAuth.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith(SESSION_KEY);
      expect(window.location.href).toBe('login.html');

      // Restore
      window.location = { href: originalHref };
    });

    it('should redirect to login.html', () => {
      const originalHref = window.location.href;
      delete window.location;
      window.location = { href: '' };

      AdminAuth.logout();

      expect(window.location.href).toBe('login.html');

      window.location = { href: originalHref };
    });
  });

  describe('requireAuth', () => {
    it('should redirect to login.html when not logged in', () => {
      const originalHref = window.location.href;
      delete window.location;
      window.location = { href: '' };

      AdminAuth.requireAuth();

      expect(window.location.href).toBe('login.html');

      window.location = { href: originalHref };
    });

    it('should not redirect when logged in', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        value: true,
        timestamp: Date.now(),
      }));

      const originalHref = window.location.href;
      delete window.location;
      window.location = { href: 'admin.html' };

      AdminAuth.requireAuth();

      expect(window.location.href).toBe('admin.html');

      window.location = { href: originalHref };
    });
  });
});
