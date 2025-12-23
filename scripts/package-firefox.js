#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🦊 Packaging Firefox Extension...\n');

const distDir = 'dist';
const firefoxDir = path.join(distDir, 'firefox-temp');
const outputFile = path.join(distDir, 'blur-extension-firefox.zip');

// Create directories
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
if (fs.existsSync(firefoxDir)) {
  fs.rmSync(firefoxDir, { recursive: true });
}
fs.mkdirSync(firefoxDir, { recursive: true });

// Remove old package if exists
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}

console.log('📝 Converting manifest to V2 for Firefox...');

// Read Chrome manifest (V3)
const chromeManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

// Create Firefox manifest (V2)
const firefoxManifest = {
  manifest_version: 2,
  name: chromeManifest.name,
  version: chromeManifest.version,
  description: chromeManifest.description,

  permissions: [
    'activeTab',
    'storage',
    'tabs',
    'notifications',
    'https://mail.google.com/*',
    'https://dashboard.stripe.com/*',
    'https://*.salesforce.com/*',
    'https://*.lightning.force.com/*',
    'https://meet.google.com/*',
    'https://*.zoom.us/*',
  ],

  background: {
    scripts: ['src/background.js'],
    persistent: false,
  },

  content_scripts: [
    {
      matches: [
        'https://mail.google.com/*',
        'https://dashboard.stripe.com/*',
        'https://*.salesforce.com/*',
        'https://*.lightning.force.com/*',
      ],
      js: ['src/content.js'],
      css: ['src/blur.css'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://meet.google.com/*', 'https://*.zoom.us/*'],
      js: ['src/detector.js'],
      run_at: 'document_start',
    },
  ],

  browser_action: {
    default_popup: 'src/popup.html',
    default_icon: {
      16: 'assets/icon-16.png',
      32: 'assets/icon-32.png',
      48: 'assets/icon-48.png',
      128: 'assets/icon-128.png',
    },
  },

  icons: {
    16: 'assets/icon-16.png',
    32: 'assets/icon-32.png',
    48: 'assets/icon-48.png',
    128: 'assets/icon-128.png',
  },

  web_accessible_resources: ['assets/*.png'],

  commands: {
    'toggle-blur': {
      suggested_key: {
        default: 'Ctrl+Shift+B',
      },
      description: 'Toggle blur on/off',
    },
  },

  browser_specific_settings: {
    gecko: {
      id: 'blur@pabs-ai.github.io',
      strict_min_version: '91.0',
    },
  },
};

// Write Firefox manifest
fs.writeFileSync(
  path.join(firefoxDir, 'manifest.json'),
  JSON.stringify(firefoxManifest, null, 2)
);

// Copy other files
console.log('📁 Copying files...');
const filesToCopy = ['src', 'assets'];

filesToCopy.forEach((item) => {
  const src = path.resolve(item);
  const dest = path.join(firefoxDir, item);
  execSync(`cp -r "${src}" "${dest}"`);
});

// Create Firefox-compatible background.js
console.log('🔧 Adapting background.js for Firefox...');
let backgroundContent = fs.readFileSync('src/background.js', 'utf8');
// Replace chrome.action with browser.browserAction for Firefox compatibility
backgroundContent = backgroundContent.replace(/chrome\.action/g, 'chrome.browserAction');
fs.writeFileSync(path.join(firefoxDir, 'src', 'background.js'), backgroundContent);

try {
  // Create package
  console.log('📦 Creating Firefox package...');
  execSync(`cd "${firefoxDir}" && zip -r "../blur-extension-firefox.zip" .`, {
    stdio: 'inherit',
  });

  // Clean up temp directory
  fs.rmSync(firefoxDir, { recursive: true });

  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n✅ Firefox package created successfully!`);
  console.log(`📍 Location: ${outputFile}`);
  console.log(`📏 Size: ${sizeMB} MB`);
  console.log('\n⚠️  Note: Firefox extension uses Manifest V2');
} catch (error) {
  console.error(`\n❌ Packaging failed: ${error.message}`);
  if (fs.existsSync(firefoxDir)) {
    fs.rmSync(firefoxDir, { recursive: true });
  }
  process.exit(1);
}
