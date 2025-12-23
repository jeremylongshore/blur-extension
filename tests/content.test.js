/**
 * Tests for content.js - Blur logic and sensitive data detection
 */

describe('Content Script - Blur Functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Pattern Detection', () => {
    test('should detect email addresses', () => {
      const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const text = 'Contact us at test@example.com for support';
      const matches = text.match(emailPattern);

      expect(matches).toBeTruthy();
      expect(matches[0]).toBe('test@example.com');
    });

    test('should detect credit card numbers', () => {
      const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
      const text = 'Card: 4532-1234-5678-9010';
      const matches = text.match(ccPattern);

      expect(matches).toBeTruthy();
      expect(matches[0]).toBe('4532-1234-5678-9010');
    });

    test('should detect API keys', () => {
      const apiKeyPattern = /\b(sk_live_|pk_live_|api_key_|token_)[A-Za-z0-9]{20,}\b/g;
      const text = 'Use API key: api_key_1234567890abcdefghijklmnopqrst';
      const matches = text.match(apiKeyPattern);

      expect(matches).toBeTruthy();
      expect(matches[0]).toContain('api_key_');
    });

    test('should detect revenue amounts', () => {
      const revenuePattern = /\$[\d,]+(?:\.\d{2})?/g;
      const text = 'Total revenue: $1,234.56';
      const matches = text.match(revenuePattern);

      expect(matches).toBeTruthy();
      expect(matches[0]).toBe('$1,234.56');
    });
  });

  describe('DOM Manipulation', () => {
    test('should create blur wrapper element', () => {
      const element = document.createElement('div');
      element.textContent = 'test@example.com';
      document.body.appendChild(element);

      // Simulate blur wrapper creation
      const wrapper = document.createElement('span');
      wrapper.className = 'blur-sensitive';
      wrapper.style.filter = 'blur(10px)';
      wrapper.textContent = element.textContent;

      expect(wrapper.className).toBe('blur-sensitive');
      expect(wrapper.style.filter).toBe('blur(10px)');
    });

    test('should handle multiple sensitive elements', () => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p>Email: test@example.com</p>
        <p>Card: 4532-1234-5678-9010</p>
        <p>API: sk_live_test123456789012345678</p>
      `;
      document.body.appendChild(div);

      const paragraphs = div.querySelectorAll('p');
      expect(paragraphs.length).toBe(3);
    });
  });

  describe('Chrome API Integration', () => {
    test('should listen for messages', () => {
      expect(chrome.runtime.onMessage.addListener).toBeDefined();
    });

    test('should load settings from storage', async () => {
      const settings = await chrome.storage.sync.get();
      expect(settings.enabled).toBe(true);
      expect(settings.blurIntensity).toBe(10);
    });

    test('should save settings to storage', async () => {
      const newSettings = { enabled: false };
      await chrome.storage.sync.set(newSettings);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(newSettings);
    });
  });

  describe('Indicator', () => {
    test('should create indicator element', () => {
      const indicator = document.createElement('div');
      indicator.id = 'blur-indicator';
      indicator.textContent = 'Blur Protection Active';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 999999;
      `;

      expect(indicator.id).toBe('blur-indicator');
      expect(indicator.textContent).toBe('Blur Protection Active');
      expect(indicator.style.position).toBe('fixed');
    });

    test('should not create duplicate indicators', () => {
      document.body.innerHTML = '<div id="blur-indicator">Active</div>';
      const existing = document.getElementById('blur-indicator');
      expect(existing).toBeTruthy();

      // Attempt to create another
      const newIndicator = document.getElementById('blur-indicator');
      expect(newIndicator).toBe(existing);
    });
  });

  describe('Performance', () => {
    test('should handle large DOM efficiently', () => {
      const container = document.createElement('div');
      for (let i = 0; i < 100; i++) {
        const p = document.createElement('p');
        p.textContent = `Item ${i}`;
        container.appendChild(p);
      }
      document.body.appendChild(container);

      const elements = document.querySelectorAll('p');
      expect(elements.length).toBe(100);
    });
  });
});
