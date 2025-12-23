#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Chrome Extension...\n');

const distDir = 'dist';
const outputFile = path.join(distDir, 'blur-extension-chrome.zip');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Remove old package if exists
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
  console.log('🗑️  Removed old package');
}

// Files to include in package
const filesToInclude = [
  'manifest.json',
  'src/',
  'assets/',
];

// Files to exclude
const excludePatterns = [
  '*.git*',
  'node_modules/*',
  'tests/*',
  'dist/*',
  'scripts/*',
  '*.test.js',
  '.DS_Store',
  'package.json',
  'package-lock.json',
  'eslint.config.js',
  '.prettierrc.json',
  'BUGFIXES*.md',
  'PROJECT_SUMMARY.md',
  'GETTING_STARTED.md',
];

try {
  // Build zip command
  const excludeArgs = excludePatterns.map((p) => `-x "${p}"`).join(' ');
  const command = `zip -r "${outputFile}" ${filesToInclude.join(' ')} ${excludeArgs}`;

  console.log('📦 Creating package...');
  execSync(command, { stdio: 'inherit' });

  // Get file size
  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n✅ Chrome package created successfully!`);
  console.log(`📍 Location: ${outputFile}`);
  console.log(`📏 Size: ${sizeMB} MB`);

  // Verify package contents
  console.log('\n📋 Package contents:');
  execSync(`unzip -l "${outputFile}" | head -20`, { stdio: 'inherit' });
} catch (error) {
  console.error(`\n❌ Packaging failed: ${error.message}`);
  process.exit(1);
}
