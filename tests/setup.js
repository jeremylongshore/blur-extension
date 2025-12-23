// Jest setup file for browser extension testing

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    getURL: jest.fn((path) => `chrome-extension://mock-id/${path}`),
  },
  storage: {
    sync: {
      get: jest.fn((keys, callback) => {
        const mockData = {
          enabled: true,
          blurIntensity: 10,
          autoEnable: true,
          showIndicator: true,
          dataTypes: {
            email: true,
            creditCard: true,
            apiKey: true,
            revenue: true,
            accountNumber: true,
            pii: true,
          },
        };
        callback(mockData);
        return Promise.resolve(mockData);
      }),
      set: jest.fn((data, callback) => {
        if (callback) {
          callback();
        }
        return Promise.resolve();
      }),
    },
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
    setIcon: jest.fn(),
  },
  notifications: {
    create: jest.fn(),
  },
  commands: {
    onCommand: {
      addListener: jest.fn(),
    },
  },
};

// Mock DOM APIs
global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Mock navigator.mediaDevices
global.navigator.mediaDevices = {
  getDisplayMedia: jest.fn(),
};
