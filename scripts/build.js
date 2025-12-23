#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Blur Extension...\n');

// Validate source files exist
const requiredFiles = [
  'manifest.json',
  'src/background.js',
  'src/content.js',
  'src/detector.js',
  'src/popup.js',
  'src/popup.html',
  'src/popup.css',
  'src/blur.css',
  'assets/icon-16.png',
  'assets/icon-32.png',
  'assets/icon-48.png',
  'assets/icon-128.png',
];

let allFilesExist = true;

requiredFiles.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ ${file}`);
  }
});

if (!allFilesExist) {
  console.error('\n❌ Build failed: Missing required files');
  process.exit(1);
}

// Validate manifest.json
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  console.log(`\n✅ Manifest valid - Version ${manifest.version}`);

  if (!manifest.manifest_version) {
    throw new Error('Missing manifest_version');
  }
  if (!manifest.name) {
    throw new Error('Missing name');
  }
  if (!manifest.version) {
    throw new Error('Missing version');
  }
} catch (error) {
  console.error(`❌ Invalid manifest.json: ${error.message}`);
  process.exit(1);
}

// Check file sizes
console.log('\n📊 File Sizes:');
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ${file}: ${sizeKB} KB`);
  }
});

console.log('\n✅ Build validation complete!\n');
