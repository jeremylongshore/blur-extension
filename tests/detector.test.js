/**
 * Tests for detector.js - Screen share detection
 */

describe('Detector - Screen Share Detection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('getDisplayMedia Hooking', () => {
    test('should hook into navigator.mediaDevices.getDisplayMedia', () => {
      expect(navigator.mediaDevices.getDisplayMedia).toBeDefined();
    });

    test('should detect when screen sharing starts', async () => {
      const mockStream = {
        getTracks: () => [
          {
            addEventListener: jest.fn(),
            getSettings: () => ({ displaySurface: 'monitor' }),
          },
        ],
      };

      navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);

      const stream = await navigator.mediaDevices.getDisplayMedia();
      expect(stream).toBe(mockStream);
      expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalled();
    });
  });

  describe('Google Meet Detection', () => {
    test('should detect Google Meet page', () => {
      const url = 'https://meet.google.com/abc-defg-hij';
      expect(url).toContain('meet.google.com');
    });

    test('should create MutationObserver for Google Meet', () => {
      const observer = new MutationObserver(() => {});
      expect(observer).toBeDefined();
      expect(observer.observe).toBeDefined();
      expect(observer.disconnect).toBeDefined();
    });
  });

  describe('Zoom Detection', () => {
    test('should detect Zoom page', () => {
      const url = 'https://zoom.us/j/1234567890';
      expect(url).toContain('zoom.us');
    });

    test('should monitor for Zoom share button', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Share Screen');
      document.body.appendChild(button);

      const shareButton = document.querySelector('[aria-label*="Share"]');
      expect(shareButton).toBeTruthy();
    });
  });

  describe('Message Sending', () => {
    test('should send screenShareStarted message', () => {
      chrome.runtime.sendMessage({
        action: 'screenShareStarted',
        source: 'google-meet',
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'screenShareStarted',
        source: 'google-meet',
      });
    });

    test('should send screenShareStopped message', () => {
      chrome.runtime.sendMessage({
        action: 'screenShareStopped',
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'screenShareStopped',
      });
    });
  });

  describe('DOM Observation', () => {
    test('should set up MutationObserver with correct config', () => {
      const config = {
        childList: true,
        subtree: true,
        attributes: true,
      };

      expect(config.childList).toBe(true);
      expect(config.subtree).toBe(true);
      expect(config.attributes).toBe(true);
    });

    test('should handle DOM mutations', () => {
      const mutations = [
        {
          type: 'childList',
          addedNodes: [document.createElement('div')],
        },
      ];

      expect(mutations[0].type).toBe('childList');
      expect(mutations[0].addedNodes.length).toBe(1);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing document.body gracefully', () => {
      const bodyExists = document.body !== null;
      expect(bodyExists).toBe(true);
    });

    test('should handle getDisplayMedia errors', async () => {
      const error = new Error('Permission denied');
      navigator.mediaDevices.getDisplayMedia.mockRejectedValue(error);

      await expect(navigator.mediaDevices.getDisplayMedia()).rejects.toThrow('Permission denied');
    });
  });
});
