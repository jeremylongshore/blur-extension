# Contributing to Blur Extension

## Development Setup

```bash
git clone https://github.com/pabs-ai/blur-extension.git
cd blur-extension
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# With coverage
npm test -- --coverage
```

## Code Quality

```bash
# Lint your code before committing
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting without changes
npm run format:check
```

## Building

```bash
# Validate build
npm run build

# Package for Chrome
npm run package:chrome

# Package for Firefox
npm run package:firefox
```

## Code Standards

- Use ES2022+ features
- Prefer `const` over `let`, never use `var`
- Always use semicolons
- Single quotes for strings
- 2 spaces for indentation
- Write tests for new features
- Keep functions focused and small
- Handle errors explicitly

## Testing Requirements

- All new features must have tests
- Maintain >70% code coverage
- Test edge cases and error conditions
- Mock Chrome APIs properly

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run validate` to ensure everything passes
4. Write clear commit messages
5. Open PR with description of changes
6. Link any related issues

## Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `test`: Adding tests
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `ci`: CI/CD changes
- `perf`: Performance improvements

Examples:
```
feat: add Microsoft Teams detection
fix: handle missing document.body in detector
test: add coverage for screen share detection
refactor: simplify blur intensity calculation
```

## Architecture

```
src/
├── background.js    # Service worker, state management
├── detector.js      # Screen share detection (Meet/Zoom)
├── content.js       # Blur application logic
├── popup.js         # Settings UI
└── blur.css         # Blur effect styles
```

## Key Patterns

### Message Passing
```javascript
// Background to content
chrome.tabs.sendMessage(tabId, { action: 'enableBlur' });

// Content to background
chrome.runtime.sendMessage({ action: 'screenShareStarted' });
```

### Storage
```javascript
// Save settings
await chrome.storage.sync.set({ enabled: true });

// Load settings
const settings = await chrome.storage.sync.get();
```

### Error Handling
```javascript
try {
  await riskyOperation();
} catch (error) {
  console.error('Blur: Operation failed:', error);
  // Handle gracefully
}
```

## Browser Compatibility

- **Chrome/Edge**: Manifest V3, uses `chrome.action`
- **Firefox**: Manifest V2, uses `browser.browserAction`

When adding features, test on both browsers or clearly document Chrome-only features.

## Performance Guidelines

- Debounce DOM mutations (300ms)
- Cache DOM queries where possible
- Use `requestAnimationFrame` for visual updates
- Keep blur intensity calculations lightweight
- Avoid synchronous loops over large datasets

## Common Tasks

### Adding a New Pattern

Edit `src/content.js`:

```javascript
const patterns = {
  newPattern: /your-regex-here/g,
  // ...
};
```

### Adding Platform Detection

Edit `src/detector.js`:

```javascript
if (window.location.host.includes('newplatform.com')) {
  monitorNewPlatform();
}
```

### Adding a Setting

1. Update default settings in `src/background.js`
2. Add UI control in `src/popup.html`
3. Wire up event handler in `src/popup.js`
4. Use setting in `src/content.js`

## Debugging

### Chrome
1. Go to `chrome://extensions`
2. Click "Inspect views: service worker" for background
3. Inspect any page and check Console for content script logs

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Inspect" on the extension
3. Use Browser Console for all logs

## Questions?

Open an issue with:
- Clear description of your question
- What you've already tried
- Relevant code snippets
- Browser and version

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
