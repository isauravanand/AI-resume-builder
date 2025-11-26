# Render Deployment Setup for Puppeteer

This guide helps you configure Puppeteer to work correctly on Render.

## Environment Variables

Set these environment variables in your Render dashboard:

1. **PUPPETEER_CACHE_DIR** (Optional but recommended):
   ```
   /opt/render/.cache/puppeteer
   ```

2. **NODE_ENV**:
   ```
   production
   ```

## How It Works

1. During `npm install`, the `postinstall` script runs `install-puppeteer-chrome.js`
2. This script ensures the cache directory exists and triggers Chrome download
3. Chrome is downloaded to the cache directory specified by `PUPPETEER_CACHE_DIR`
4. On first PDF generation, Puppeteer uses the cached Chrome

## Troubleshooting

If you see "Could not find Chrome" errors:

1. **Check Environment Variables**: Ensure `PUPPETEER_CACHE_DIR` is set in Render dashboard
2. **Check Build Logs**: Look for "Installing Puppeteer Chrome..." in build logs
3. **Verify Cache Directory**: The cache directory should be created during build
4. **First Request**: The first PDF generation may take longer as Chrome downloads

## Alternative: Use System Chrome

If Puppeteer's bundled Chrome doesn't work, you can install system Chrome:

1. Add a build script that installs Chrome
2. Set `PUPPETEER_EXECUTABLE_PATH` to point to system Chrome
3. Common paths: `/usr/bin/google-chrome-stable` or `/usr/bin/chromium`

## Notes

- Render's free tier may have limitations on file system writes
- Ensure your Render plan has enough disk space for Chrome (~200MB)
- The cache directory persists between deployments

