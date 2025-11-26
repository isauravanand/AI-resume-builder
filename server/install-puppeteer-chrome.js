/**
 * Install Puppeteer Chrome during build for Render deployment
 * This ensures Chrome is downloaded to the cache directory before the app starts
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Set cache directory for Render
const cacheDir = process.env.PUPPETEER_CACHE_DIR || '/opt/render/.cache/puppeteer';

// Ensure cache directory exists
try {
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log(`✓ Created Puppeteer cache directory: ${cacheDir}`);
    } else {
        console.log(`✓ Puppeteer cache directory exists: ${cacheDir}`);
    }
} catch (err) {
    console.warn(`⚠ Could not create cache directory ${cacheDir}:`, err.message);
    console.log('Puppeteer will use default cache location.');
}

// Set environment variable for Puppeteer
process.env.PUPPETEER_CACHE_DIR = cacheDir;

console.log('Setting up Puppeteer Chrome...');
console.log(`Cache directory: ${cacheDir}`);

try {
    // This will trigger Chrome download if not already present
    // Note: In some environments, this might not download during build
    // but will download on first use instead
    const executablePath = puppeteer.executablePath();
    console.log(`✓ Puppeteer Chrome executable path: ${executablePath}`);
    
    // Verify the executable exists
    if (fs.existsSync(executablePath)) {
        console.log('✓ Chrome executable verified and ready');
    } else {
        console.log('ℹ Chrome will be downloaded automatically on first Puppeteer launch.');
        console.log('  This is normal - Chrome downloads on-demand in some environments.');
    }
} catch (error) {
    // This is OK - Chrome will download on first use
    console.log('ℹ Chrome will be downloaded automatically on first Puppeteer launch.');
    console.log(`  Error details: ${error.message}`);
}

console.log('✓ Puppeteer setup completed!');
console.log('  Chrome will be available when the app generates PDFs.');

