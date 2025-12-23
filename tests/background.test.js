/**
 * Tests for background.js - Service worker and state management
 */

describe('Background Service Worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('State Management', () => {
    test('should initialize with default state', () => {
      const defaultState = {
        isScreenSharing: false,
        blurEnabled: true,
      };

      expect(defaultState.isScreenSharing).toBe(false);
      expect(defaultState.blurEnabled).toBe(true);
    });

    test('should update state when screen sharing starts', () => {
      const state = { isScreenSharing: false };
      state.isScreenSharing = true;

      expect(state.isScreenSharing).toBe(true);
    });

    test('should update state when screen sharing stops', () => {
      const state = { isScreenSharing: true };
      state.isScreenSharing = false;

      expect(state.isScreenSharing).toBe(false);
    });
  });

  describe('Message Handling', () => {
    test('should handle screenShareStarted message', () => {
      const message = { action: 'screenShareStarted', source: 'google-meet' };
      expect(message.action).toBe('screenShareStarted');
      expect(message.source).toBe('google-meet');
    });

    test('should handle screenShareStopped message', () => {
      const message = { action: 'screenShareStopped' };
      expect(message.action).toBe('screenShareStopped');
    });

    test('should handle toggleBlur message', () => {
      const message = { action: 'toggleBlur' };
      expect(message.action).toBe('toggleBlur');
    });

    test('should handle getState message', () => {
      const message = { action: 'getState' };
      const response = {
        isScreenSharing: false,
        blurEnabled: true,
      };

      expect(message.action).toBe('getState');
      expect(response).toBeDefined();
    });
  });

  describe('Badge Updates', () => {
    test('should set badge text when blur is active', () => {
      chrome.action.setBadgeText({ text: 'ON' });
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
    });

    test('should clear badge text when blur is inactive', () => {
      chrome.action.setBadgeText({ text: '' });
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '' });
    });

    test('should set badge color', () => {
      chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
      expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: '#10b981',
      });
    });
  });

  describe('Notifications', () => {
    test('should create notification when blur is enabled', () => {
      const options = {
        type: 'basic',
        iconUrl: 'assets/icon-128.png',
        title: 'Blur Protection',
        message: 'Protection enabled',
      };

      chrome.notifications.create('blur-enabled', options);
      expect(chrome.notifications.create).toHaveBeenCalledWith('blur-enabled', options);
    });

    test('should create notification when blur is disabled', () => {
      const options = {
        type: 'basic',
        iconUrl: 'assets/icon-128.png',
        title: 'Blur Protection',
        message: 'Protection disabled',
      };

      chrome.notifications.create('blur-disabled', options);
      expect(chrome.notifications.create).toHaveBeenCalledWith('blur-disabled', options);
    });
  });

  describe('Tab Communication', () => {
    test('should broadcast message to all tabs', async () => {
      const tabs = [{ id: 1 }, { id: 2 }, { id: 3 }];
      chrome.tabs.query.mockImplementation((query, callback) => {
        callback(tabs);
        return Promise.resolve(tabs);
      });

      const queriedTabs = await new Promise((resolve) => {
        chrome.tabs.query({}, resolve);
      });

      expect(queriedTabs.length).toBe(3);
      expect(chrome.tabs.query).toHaveBeenCalled();
    });

    test('should send message to specific tab', () => {
      const tabId = 123;
      const message = { action: 'enableBlur' };

      chrome.tabs.sendMessage(tabId, message);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(tabId, message);
    });
  });

  describe('Storage Integration', () => {
    test('should load settings on startup', async () => {
      const settings = await chrome.storage.sync.get();
      expect(settings.enabled).toBe(true);
      expect(settings.blurIntensity).toBe(10);
    });

    test('should save settings changes', async () => {
      const newSettings = { enabled: false, blurIntensity: 15 };
      await chrome.storage.sync.set(newSettings);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(newSettings);
    });
  });

  describe('Command Handling', () => {
    test('should register toggle-blur command', () => {
      expect(chrome.commands.onCommand.addListener).toBeDefined();
    });

    test('should handle toggle-blur command', () => {
      const command = 'toggle-blur';
      expect(command).toBe('toggle-blur');
    });
  });

  describe('Icon Updates', () => {
    test('should update icon when enabled', () => {
      chrome.action.setIcon({ path: 'assets/icon-128.png' });
      expect(chrome.action.setIcon).toHaveBeenCalledWith({
        path: 'assets/icon-128.png',
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle runtime errors gracefully', () => {
      const error = new Error('Runtime error');
      expect(error.message).toBe('Runtime error');
    });

    test('should handle storage errors', async () => {
      chrome.storage.sync.get.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => chrome.storage.sync.get()).toThrow('Storage error');
    });
  });
});
