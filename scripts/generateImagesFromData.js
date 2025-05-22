// scripts/generateImagesFromData.js
const { join } = require('path');
const { readFile, writeFile, unlink, stat } = require('fs/promises');
const { execSync } = require('child_process');

// --- Configuration ---
const PROJECT_ROOT = process.cwd();
const TEMPLATE_PATH = join(PROJECT_ROOT, 'assets', 'og-template', 'template.html');
const INPUT_JSON_PATH = join(PROJECT_ROOT, 'tmp', 'ogImageData.json');
const DEBUG = false; // Set true for more verbose logging
const DEFAULT_PRIMARY_COLOR_FALLBACK = '#748091';
const OUTPUT_FORMAT = 'jpg'; // <<< Use the same format as in collectOgData.js
const JPEG_QUALITY = 80;     // <<< Adjust JPEG quality (e.g., 75-85)

// --- Helper Functions ---
function debugLog(...messages) {
  if (DEBUG) console.log('[DEBUG generateImages]', ...messages);
}

async function pathExists(path) {
  try { await stat(path); return true; } catch (err) { return err.code !== 'ENOENT'; }
}

// --- Main Image Generation Logic ---
async function generateImages() {
  console.log(`🖼️ Starting OG image generation (Format: ${OUTPUT_FORMAT.toUpperCase()})...`);

  // 1. Verify dependencies
  if (!(await pathExists(TEMPLATE_PATH))) { console.error(`❌ Template not found: ${TEMPLATE_PATH}`); process.exit(1); }
  if (!(await pathExists(INPUT_JSON_PATH))) { console.error(`❌ Data file not found: ${INPUT_JSON_PATH}`); process.exit(1); }
  try { execSync('wkhtmltoimage --version', { stdio: 'ignore' }); debugLog("wkhtmltoimage found."); }
  catch (e) { console.error("❌ wkhtmltoimage not found in PATH."); process.exit(1); }

  // 2. Read template and JSON data
  let templateContent;
  let jsonData;
  try {
    templateContent = await readFile(TEMPLATE_PATH, 'utf8');
    const jsonFileContent = await readFile(INPUT_JSON_PATH, 'utf8');
    jsonData = JSON.parse(jsonFileContent);
    debugLog(`Successfully read template and parsed data for ${jsonData?.pages?.length || 0} pages.`);
  } catch (err) { console.error(`❌ Error reading template or JSON: ${err.message}`); process.exit(1); }

  // 3. Process each page entry from JSON
  let successCount = 0;
  let errorCount = 0;

  if (!jsonData || !jsonData.pages || jsonData.pages.length === 0) { /* ... warning ... */ return; }

  const logoDataUri = jsonData.logoDataUri || '';
  const siteNameForDisplay = jsonData.siteNameForDisplay || 'visioninit.dev';
  const primaryColor = jsonData.colors?.['primary-color'] || DEFAULT_PRIMARY_COLOR_FALLBACK;

  debugLog(`Using Site Name for display: ${siteNameForDisplay}`);
  debugLog(`Using Primary Color: ${primaryColor}`);

  for (const pageData of jsonData.pages) {
    const { title, description, outputPath, tempHtmlPath, type } = pageData;
    const pageIdentifier = type === 'homepage' ? 'Homepage' : `Content (${outputPath.replace(PROJECT_ROOT, '')})`;

    if (!title || !description || !outputPath || !tempHtmlPath) { debugLog(`Skipping invalid page data for ${pageIdentifier}`); errorCount++; continue; }

    debugLog(`\nProcessing ${pageIdentifier}...`);
    debugLog(`  Output: ${outputPath}`);
    debugLog(`  Temp HTML: ${tempHtmlPath}`);

    try {
      const htmlContent = templateContent
        .replace('LOGO_SRC', logoDataUri)
        .replace('PAGE_TITLE', title)
        .replace('PAGE_DESCRIPTION', description)
        .replace('SITE_NAME', siteNameForDisplay)
        .replace('PRIMARY_COLOR_PLACEHOLDER', primaryColor);

      debugLog(`  Writing temp HTML...`);
      await writeFile(tempHtmlPath, htmlContent);

      // <<< MODIFIED COMMAND: Added --format jpg and adjusted quality <<<
      const command = `wkhtmltoimage --enable-local-file-access --quality ${JPEG_QUALITY} --format ${OUTPUT_FORMAT} --width 1200 --height 630 "${tempHtmlPath}" "${outputPath}"`;
      debugLog(`  Executing: ${command}`);
      execSync(command, { stdio: 'pipe' }); // Use 'pipe' to capture potential errors

      // Check file size after generation
      try {
        const stats = await stat(outputPath);
        const fileSizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ Generated OG image for: ${pageIdentifier} (${fileSizeKB} KB)`);
      } catch(statErr) {
        console.log(`✅ Generated OG image for: ${pageIdentifier} (size check failed)`);
      }

      successCount++;

      debugLog(`  Removing temp file: ${tempHtmlPath}`);
      await unlink(tempHtmlPath);

    } catch (err) {
      console.error(`❌ Failed generating image for ${pageIdentifier}:`, err.stderr?.toString() || err.message || err);
      debugLog('Full error object:', err);
      errorCount++;
      if (await pathExists(tempHtmlPath)) {
        try { await unlink(tempHtmlPath); } catch (cleanupErr) { debugLog(`Failed to clean up temp file ${tempHtmlPath} after error.`); }
      }
    }
  } // End page loop

  // 4. Final Summary
  console.log('\n✨ Image generation process complete!');
  console.log(`📊 Summary: ${successCount} generated, ${errorCount} errors.`);
  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

// --- Execution ---
generateImages().catch(err => {
  console.error("🔥 Uncaught error during image generation:", err);
  process.exit(1);
});
