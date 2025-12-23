# Blur - Smart Privacy Protection for Screen Sharing

![CI](https://github.com/pabs-ai/blur-extension/workflows/CI%2FCD%20Pipeline/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-brightgreen.svg)

Browser extension that automatically detects and blurs sensitive information during screen sharing sessions on Zoom, Google Meet, and other platforms.

## Features

- **Automatic Detection**: Monitors when you're sharing your screen
- **Pattern Recognition**: Blurs emails, credit cards, API keys, financial data
- **Site-Specific**: Pre-configured for Gmail, Stripe, Salesforce
- **Adjustable Intensity**: 5px to 20px blur levels
- **Local Processing**: No data leaves your browser
- **Keyboard Shortcut**: `Ctrl/Cmd + Shift + B` to toggle

## Installation

### Development

```bash
git clone https://github.com/pabs-ai/blur-extension.git
cd blur-extension
npm install
```

### Chrome/Edge

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `blur-extension` folder

### Firefox

```bash
npm run package:firefox
```

Then load the generated `.xpi` file from `dist/` in `about:debugging`.

## Development

### Running Tests

```bash
npm test                # Run once
npm run test:watch      # Watch mode
```

### Code Quality

```bash
npm run lint            # Check linting
npm run lint:fix        # Auto-fix issues
npm run format          # Format code
npm run validate        # Run all checks
```

### Building

```bash
npm run build                # Validate
npm run package:chrome       # Package for Chrome
npm run package:firefox      # Package for Firefox
```

## Architecture

```
src/
├── background.js    # Service worker, state management
├── detector.js      # Screen share detection (Meet/Zoom)
├── content.js       # Blur application logic
├── popup.js         # Settings UI logic
├── popup.html       # Settings UI
├── popup.css        # UI styles
└── blur.css         # Blur effect styles
```

## How It Works

1. **Detection**: Hooks into `getDisplayMedia()` to detect screen sharing
2. **State Management**: Background service worker coordinates state
3. **Content Scripts**: Scan DOM for sensitive patterns
4. **Blur Application**: CSS `filter: blur()` applied to matches
5. **Dynamic Monitoring**: MutationObserver handles new content

## Supported Patterns

- Email addresses: `user@example.com`
- Credit cards: `4532-1234-5678-9010`
- API keys: `sk_live_...`, `pk_test_...`
- Revenue: `$1,234.56`
- Account numbers: `#ACC-123456`

## Supported Platforms

### Detection
- Google Meet
- Zoom (web)

### Protection
- Gmail
- Stripe Dashboard
- Salesforce (Classic & Lightning)
- Any site via custom patterns

## Configuration

Click the extension icon to access:

- Enable/disable protection
- Adjust blur intensity (5-20px)
- Select data types to blur
- Add custom protected sites
- Toggle auto-enable
- Show/hide on-screen indicator

## Browser Compatibility

| Browser | Support | Manifest | Status |
|---------|---------|----------|--------|
| Chrome  | ✅ 88+  | V3       | Tested |
| Edge    | ✅ 88+  | V3       | Tested |
| Firefox | ✅ 91+  | V2       | Working |

## Performance

- **Idle**: 0% CPU
- **Active**: 1-3% CPU
- **Memory**: ~5MB
- **Large pages**: <300ms initial scan

## Privacy

- 100% local processing
- No external requests
- No analytics or telemetry
- No data collection

## Testing

The extension includes comprehensive tests:

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
```

Test files:
- `tests/content.test.js` - Blur logic and pattern detection
- `tests/detector.test.js` - Screen share detection
- `tests/background.test.js` - State management

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

### Quick Start

```bash
git clone https://github.com/pabs-ai/blur-extension.git
cd blur-extension
npm install
npm run validate      # Ensure everything works
```

### Before Submitting

```bash
npm run lint          # Fix linting issues
npm run format        # Format code
npm test              # Ensure tests pass
```

## Troubleshooting

### Extension won't load
- Check `chrome://extensions` for errors
- Verify all files present, especially `manifest.json`
- Check console for error messages

### Blur not activating
- Confirm screen sharing is active
- Check extension is enabled in settings
- Open console (F12) and look for "Blur:" messages
- Try manual toggle: `Ctrl+Shift+B`

### Performance issues
- Reduce blur intensity to 5px
- Disable unused data type detection
- Check CPU usage in Task Manager

## License

MIT

## Links

- [Report Bug](https://github.com/pabs-ai/blur-extension/issues/new?template=bug_report.md)
- [Request Feature](https://github.com/pabs-ai/blur-extension/issues/new?template=feature_request.md)
- [Changelog](BUGFIXES.md)
