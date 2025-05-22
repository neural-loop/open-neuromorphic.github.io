// scripts/collectOgData.js
const { join } = require('path');
const { readdir, readFile, stat, mkdir, writeFile } = require('fs/promises');
const toml = require('toml');

// --- Configuration ---
const PROJECT_ROOT = process.cwd();
const CONTENT_ROOT_DIR = join(PROJECT_ROOT, 'content');
const DEFAULT_CONFIG_PATH = join(PROJECT_ROOT, 'config', '_default', 'config.toml');
const PROD_CONFIG_PATH = join(PROJECT_ROOT, 'config', 'production', 'config.toml');
const VARIABLES_SCSS_PATH = join(PROJECT_ROOT, 'assets', 'scss', '_variables.scss');
const LOGO_PATH_RELATIVE_TO_ROOT = 'assets/images/logo-source.png';
const STATIC_DIR = join(PROJECT_ROOT, 'static');
const TMP_DIR = join(PROJECT_ROOT, 'tmp');
const OUTPUT_JSON_PATH = join(TMP_DIR, 'ogImageData.json');
const OUTPUT_FORMAT = 'jpg'; // <<< CHANGED: Specify output format
const DEBUG = false;

// Colors to extract from SCSS
const COLORS_TO_EXTRACT = [
  'primary-color',
  'primary-contrast-color',
  'secondary-color',
  'text-color',
  'text-color-light',
  'dark-accent',
  'text-color-dark',
  'body-color',
  'border-color',
  'black',
  'white',
  'light',
  'gray',
  'text-lighten',
];
const DEFAULT_COLORS = { // Fallbacks if SCSS parsing fails
  'primary-color': '#748091',
  'text-color-dark': '#1e1e4b',
  'text-color': '#5c5c77',
};


// --- Helper Functions ---
function debugLog(...messages) {
  if (DEBUG) console.log('[DEBUG collectOgData]', ...messages);
}

async function pathExists(path) {
  try { await stat(path); return true; } catch (err) { return err.code !== 'ENOENT'; }
}

async function isDirectory(path) {
  try { return (await stat(path)).isDirectory(); } catch { return false; }
}

async function ensureDir(dirPath) {
  try { await mkdir(dirPath, { recursive: true }); debugLog(`Directory ensured: ${dirPath}`); }
  catch (err) { if (err.code !== 'EEXIST') throw err; debugLog(`Directory already exists: ${dirPath}`); }
}

// --- NEW: Slugify function ---
function slugify(text) {
  if (!text) return 'untitled'; // Fallback for empty titles
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars (alphanumeric, underscore, hyphen)
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
// --- END: Slugify function ---

async function findMarkdownFiles(dir) {
  let entries;
  try { entries = await readdir(dir); } catch (err) { console.warn(`Could not read directory ${dir}: ${err.message}`); return []; }
  const markdownFiles = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (await isDirectory(fullPath)) {
      if (entry.toLowerCase() === 'dev') { debugLog(`Skipping 'dev' directory: ${fullPath}`); continue; }
      const nestedFiles = await findMarkdownFiles(fullPath);
      markdownFiles.push(...nestedFiles);
    } else if (entry === 'index.md' || entry === '_index.md') {
      markdownFiles.push(fullPath);
    }
  }
  return markdownFiles;
}

function extractFrontMatter(content) {
  const frontMatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  let title = null, description = null, isDraft = false, excludeSitemap = false;
  if (frontMatterMatch && frontMatterMatch[1]) {
    const fm = frontMatterMatch[1];
    const titleMatch = fm.match(/^(?:title|Title):\s*(.*)\s*$/m);
    const descMatch = fm.match(/^(?:description|Description):\s*([\s\S]*?)\s*$/m);
    const draftMatch = fm.match(/^draft:\s*(true)\s*$/im);
    const excludeMatch = fm.match(/^exclude_sitemap:\s*(true)\s*$/im);
    if (titleMatch) title = titleMatch[1].split('#')[0].trim().replace(/^['"]|['"]$/g, '').replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
    if (descMatch) {
      let raw = descMatch[1].replace(/\\"/g, '"').replace(/\\'/g, "'");
      const lines = raw.split('\n');
      if (lines.length > 0) lines[lines.length - 1] = lines[lines.length - 1].split('#')[0];
      description = lines.join(' ').replace(/\s+/g, ' ').trim().replace(/^['"]|['"]$/g, '').trim();
    }
    if (draftMatch) isDraft = true;
    if (excludeMatch) excludeSitemap = true;
  }
  return { title, description, isDraft, excludeSitemap };
}

async function getImageDataUri(filePath) {
  try {
    const buffer = await readFile(filePath);
    const base64 = buffer.toString('base64');
    const mime = require('mime-types').lookup(filePath) || 'image/png';
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.error(`❌ Error reading image file at ${filePath}: ${err.message}`);
    return null;
  }
}

// --- NEW: Function to read and merge configs ---
async function getMergedHugoConfig() {
  let config = {};
  try {
    debugLog(`Reading default Hugo config from: ${DEFAULT_CONFIG_PATH}`);
    if (await pathExists(DEFAULT_CONFIG_PATH)) {
      const defaultContent = await readFile(DEFAULT_CONFIG_PATH, 'utf8');
      config = toml.parse(defaultContent);
      debugLog(`Default Hugo config parsed.`);
    } else {
      console.warn(`⚠️ Default config file not found at ${DEFAULT_CONFIG_PATH}`);
    }
  } catch (err) { /* ... error handling ... */ }

  try {
    debugLog(`Reading production Hugo config from: ${PROD_CONFIG_PATH}`);
    if (await pathExists(PROD_CONFIG_PATH)) {
      const prodContent = await readFile(PROD_CONFIG_PATH, 'utf8');
      const prodConfig = toml.parse(prodContent);
      debugLog(`Production Hugo config parsed.`);
      config = { ...config, ...prodConfig };
      if (config.params && prodConfig.params) {
        config.params = { ...config.params, ...prodConfig.params };
      }
      debugLog(`Merged production config over default.`);
    } else { /* ... warning ... */ }
  } catch (err) { /* ... error handling ... */ }

  return {
    siteName: config.title || 'Missing Site Title',
    siteDescription: config.params?.description || 'Missing site description.',
    siteURL: config.URL || null
  };
}


// --- NEW: Function to get the full color palette ---
async function getPaletteFromScss() {
  const palette = { ...DEFAULT_COLORS };
  try {
    debugLog(`Attempting to read SCSS variables from: ${VARIABLES_SCSS_PATH}`);
    if (!(await pathExists(VARIABLES_SCSS_PATH))) { /* ... warning ... */ return palette; }
    const scssContent = await readFile(VARIABLES_SCSS_PATH, 'utf8');

    COLORS_TO_EXTRACT.forEach(colorVarName => {
      const regex = new RegExp(`^\\$${colorVarName}:\\s*([^;]+?)\\s*;.*$`, 'm');
      const match = scssContent.match(regex);
      if (match && match[1]) {
        const colorValue = match[1].trim();
        palette[colorVarName] = colorValue;
        debugLog(`Found color ${colorVarName}: ${colorValue}`);
      } else { /* ... debug log ... */ }
    });
    console.log(`🎨 Extracted ${Object.keys(palette).length} colors from SCSS.`);
    return palette;
  } catch (err) { /* ... error handling ... */ return palette; }
}

// --- Main Data Collection Logic ---
async function collectData() {
  console.log('📊 Starting OG image data collection...');
  await ensureDir(TMP_DIR);

  const hugoConfig = await getMergedHugoConfig();
  const colorPalette = await getPaletteFromScss();
  const absoluteLogoPath = join(PROJECT_ROOT, LOGO_PATH_RELATIVE_TO_ROOT);
  const logoDataUri = await getImageDataUri(absoluteLogoPath);

  if (!hugoConfig.siteURL) { /* ... warning ... */ }
  if (!logoDataUri) { /* ... warning ... */ }

  const outputData = {
    siteNameForDisplay: hugoConfig.siteURL || 'visioninit.dev',
    logoDataUri: logoDataUri,
    colors: colorPalette,
    pages: [],
  };

  // 1. Add Homepage Data
  console.log('🏠 Processing Homepage...');
  if (hugoConfig.siteName && hugoConfig.siteDescription) {
    outputData.pages.push({
      type: 'homepage',
      title: hugoConfig.siteName,
      description: hugoConfig.siteDescription,
      outputPath: join(STATIC_DIR, `og.${OUTPUT_FORMAT}`), // Homepage keeps simple og.jpg
      tempHtmlPath: join(PROJECT_ROOT, `temp-homepage-og.html`),
    });
    debugLog('Added homepage data.');
  } else { /* ... warning ... */ }


  // 2. Process Content Pages
  console.log('📄 Processing content pages...');
  const markdownFiles = await findMarkdownFiles(CONTENT_ROOT_DIR);
  let processedCount = 0;
  let skippedCount = 0;

  for (const mdFile of markdownFiles) {
    const pageDirectory = join(mdFile, '..');
    const relativeMdPath = mdFile.replace(PROJECT_ROOT, '');

    try {
      const mdContent = await readFile(mdFile, 'utf8');
      const { title, description, isDraft, excludeSitemap } = extractFrontMatter(mdContent);

      if (isDraft || excludeSitemap || !title || !description) {
        debugLog(`Skipping ${relativeMdPath} (Draft: ${isDraft}, Exclude: ${excludeSitemap}, NoTitle: ${!title}, NoDesc: ${!description})`);
        skippedCount++;
        continue;
      }

      outputData.pages.push({
        type: 'content',
        sourceMdPath: mdFile,
        title: title,
        description: description,
        outputPath: join(pageDirectory, `${slugify(title)}-og.${OUTPUT_FORMAT}`), // Use slugified title
        tempHtmlPath: join(pageDirectory, `temp-og.html`),
      });
      processedCount++;
      debugLog(`Added data for: ${relativeMdPath}`);

    } catch (err) { /* ... error handling ... */ }
  }

  // 3. Write JSON Output
  console.log(`💾 Writing data for ${outputData.pages.length} pages to ${OUTPUT_JSON_PATH}...`);
  try {
    await writeFile(OUTPUT_JSON_PATH, JSON.stringify(outputData, null, 2));
    console.log('✅ Data collection complete.');
    console.log(`📊 Processed ${processedCount} content pages, skipped ${skippedCount}.`);
  } catch (err) { /* ... error handling ... */ process.exit(1); }
}

// --- Execution ---
try {
  require.resolve('toml');
  require.resolve('mime-types');
  debugLog('Required packages (toml, mime-types) found.');
  collectData().catch(err => {
    console.error("🔥 Uncaught error during data collection:", err);
    process.exit(1);
  });
} catch (e) { /* ... error handling ... */ process.exit(1); }
