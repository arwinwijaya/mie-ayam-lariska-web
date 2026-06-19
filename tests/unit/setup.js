import { vi } from 'vitest';

// Mock localStorage with actual storage behavior
const storage = {};
const localStorageMock = {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, value) => { storage[key] = String(value); }),
  removeItem: vi.fn((key) => { delete storage[key]; }),
  clear: vi.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); }),
  get length() { return Object.keys(storage).length; },
  key: vi.fn((index) => Object.keys(storage)[index] || null),
};
global.localStorage = localStorageMock;

// Mock Firebase
global.firebase = {
  initializeApp: vi.fn(),
  database: vi.fn(() => ({
    ref: vi.fn(() => ({
      set: vi.fn(() => Promise.resolve()),
      remove: vi.fn(() => Promise.resolve()),
      on: vi.fn(),
      off: vi.fn(),
      once: vi.fn(() => Promise.resolve({ val: () => null })),
    })),
    ServerValue: { TIMESTAMP: 1234567890 },
  })),
  auth: vi.fn(() => ({
    signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
    signOut: vi.fn(() => Promise.resolve()),
    onAuthStateChanged: vi.fn((callback) => { callback(null); return vi.fn(); }),
  })),
};
