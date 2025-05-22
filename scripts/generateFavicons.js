// scripts/generateFavicons.js
const { join } = require('path');
const { execSync } = require('child_process');
const { mkdir, stat } = require('fs/promises');

// --- Configuration ---
const SOURCE_LOGO = join(process.cwd(), 'assets', 'images', 'logo-source.png');
const STATIC_OUTPUT_DIR = join(process.cwd(), 'static');
const DEFAULT_LOGO_HEIGHT = 80; // Define the default display height

// Desired output files, sizes, and subdirectories within static/
const IMAGE_CONFIG = [
  // Favicons (output to static root)
  { filename: 'favicon-16x16.png', size: 16, outputSubDir: '', forceSquare: true },
  { filename: 'favicon-32x32.png', size: 32, outputSubDir: '', forceSquare: true },
  { filename: 'apple-touch-icon.png', size: 180, outputSubDir: '', forceSquare: true },
  { filename: 'favicon.png', size: 96, outputSubDir: '', forceSquare: true },
  { filename: 'favicon.ico', size: 32, outputSubDir: '', forceSquare: true },

  // Main Logo Versions (1x and 2x based on default height)
  {
    filename: 'logo.png', // 1x version
    height: DEFAULT_LOGO_HEIGHT, // Target height 80px
    outputSubDir: '',
    forceSquare: false
  },
  // *** ADD THIS OBJECT ***
  {
    filename: 'logo@2x.png', // 2x version
    height: DEFAULT_LOGO_HEIGHT * 2, // Target height 160px
    outputSubDir: '',
    forceSquare: false
  },
  // ***********************
];

// --- Helper Functions (Keep as they are) ---
async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err; // Re-throw other errors
  }
}

async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

// --- Main Generation Logic (Keep as it is) ---
async function generateImagesWithImageMagick() {
  console.log('🚀 Starting image generation using ImageMagick...');

  // 1. Check if ImageMagick (convert command) is available
  try {
    execSync('convert -version', { stdio: 'ignore' });
    console.log('✅ ImageMagick (convert) found.');
  } catch (err) {
    console.error('❌ Error: ImageMagick `convert` command not found.');
    console.error('   Please install ImageMagick or ensure it is in your PATH.');
    process.exit(1);
  }

  // 2. Check if source logo exists
  if (!(await fileExists(SOURCE_LOGO))) {
    console.error(`❌ Error: Source logo not found at ${SOURCE_LOGO}`);
    process.exit(1);
  }
  console.log(`🔍 Found source logo: ${SOURCE_LOGO}`);

  // 3. Ensure base static output directory exists
  await ensureDir(STATIC_OUTPUT_DIR);
  console.log(`✅ Base output directory ensured: ${STATIC_OUTPUT_DIR}`);

  // 4. Generate each image
  let successCount = 0;
  let errorCount = 0;

  for (const config of IMAGE_CONFIG) {
    const outputDir = join(STATIC_OUTPUT_DIR, config.outputSubDir || '');
    await ensureDir(outputDir);
    const outputPath = join(outputDir, config.filename);

    let resizeOption = '';
    let extentOption = '';
    let sizeLabel = '';

    if (config.size) {
      sizeLabel = `${config.size}x${config.size}`;
      resizeOption = `-resize ${sizeLabel}`;
      if (config.forceSquare) {
        extentOption = `-background none -gravity center -extent ${sizeLabel}`;
      }
    } else if (config.height) {
      sizeLabel = `height ${config.height}px`;
      resizeOption = `-resize x${config.height}`;
    } else {
      console.warn(`   ⚠️ Skipping ${config.filename}: No size or height specified.`);
      continue;
    }

    console.log(`   Generating ${config.filename} (${sizeLabel})...`);
    const command = `convert "${SOURCE_LOGO}" ${resizeOption} ${extentOption} "${outputPath}"`;

    try {
      console.log(`   Executing: ${command}`);
      execSync(command, { stdio: 'inherit' });
      console.log(`   ✅ Saved ${outputPath}`);
      successCount++;
    } catch (err) {
      console.error(`   ❌ Error generating ${config.filename}: ${err.message || 'ImageMagick command failed'}`);
      errorCount++;
    }
  }

  // 5. Summary
  console.log('\n✨ Image generation complete!');
  console.log(`📊 Summary: ${successCount} generated, ${errorCount} errors.`);
  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

// --- Execution ---
generateImagesWithImageMagick().catch((err) => {
  console.error('\n🔥 Critical error during image generation script execution:', err);
  process.exit(1);
});
