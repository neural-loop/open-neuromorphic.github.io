// postcss.config.mjs
import postcssPurgecssModule from '@fullhuman/postcss-purgecss';
import fs from 'fs';

// Attempt to access the function, trying .default if the import itself isn't the function
const purgeCssFn = typeof postcssPurgecssModule === 'function' ? postcssPurgecssModule : postcssPurgecssModule.default;

if (typeof purgeCssFn !== 'function') {
  console.error('Failed to load purgecss function. Imported module:', postcssPurgecssModule);
  throw new Error('PurgeCSS function not found in the imported module.');
}

const purgecssPlugin = purgeCssFn({
  // Specify the paths to all of the template files in your project
  content: [
    './hugo_stats.json', // Key for dynamic class detection with Hugo
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/js/**/*.js', // If JS adds classes dynamically
    // Add any other file types or paths where CSS classes might be defined or used
  ],

  // Whitelist selectors to prevent them from being removed
  // Useful for classes added by JavaScript, or complex selectors PurgeCSS might miss
  safelist: {
    standard: [
      // Bootstrap specific classes that might be added by JS or are generally needed
      'active', // For carousels, navs, accordions
      'show',   // For modals, dropdowns, collapse
      'collapsing', // For Bootstrap collapse transitions
      'd-none', // Often used by JS to hide/show
      'fade',   // For modal transitions
      'modal-backdrop',
      'modal-open',
      'dropdown-menu-end', // and other dropdown variations if used
      // Navbar specific classes to prevent FOUC with critical CSS
      'navbar',
      'navbar-expand-lg',
      'navbar-toggler',
      'navbar-toggler-icon',
      'navbar-collapse',
      'navbar-nav',
      'nav-link',
      'ms-auto',
      'dropdown',
      'dropdown-toggle',
      'dropdown-menu',
      'dropdown-item',
      // Breadcrumb classes
      'breadcrumb',
      'breadcrumb-item',
      // Custom breadcrumb classes
      // 'sticky-breadcrumbs-wrapper', // Already covered by deep safelist below, but can be kept for explicitness if preferred
      // 'custom-breadcrumb', // Already covered by deep safelist below
      'nasted', // Keep specific custom classes if not directly under the deep safelisted ones or if used elsewhere
      'breadcrumb-home-item',
      'breadcrumb-home-link',
      'breadcrumb-current-page',
      // Regex for any other breadcrumb related classes that might be dynamic
      // /^breadcrumb-.*/, // This is broad; specific classes or deep safelisting is often better. Covered by deep.
      // Add your own classes that are added by JS and might be missed
      // e.g., /^(effect-|animate-effect)/, // Regex for your OG preview effects
      // Specific classes you know are needed:
      'cookie-box-hide',
      'nav-bg', // For sticky header
      'hide',   // For top header
      'body-nav-sticky', // For conditional body padding with sticky nav
      'img-fluid', // For responsive images
      // Regex for accordion classes if needed, though data attributes might be better
      /^accordion-content-.*/, // If content IDs are dynamically generated
    ],
    deep: [
      // Safelist all descendant selectors for custom breadcrumbs
      /\.sticky-breadcrumbs-wrapper/,
      /\.custom-breadcrumb/,
    ], // For selectors like .parent .child
    greedy: [
      // Regex for classes you want to keep regardless, e.g., for dynamic content
      // /^(effect-|animate-effect)/, // Your OG preview effects
    ],
    keyframes: true, // Retain all keyframes by default (safer)
    variables: true, // Retain all CSS custom properties by default (safer)
  },

  // Include any special characters you're using in Custom Extractors
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],

  // You can define custom extractors if PurgeCSS is missing classes
  // For Hugo, using hugo_stats.json is often the most reliable way
  extractors: [
    {
      extractor: (content) => {
        // Parse hugo_stats.json to get a list of classes used in templates
        let hugoStats = {};
        try {
          hugoStats = JSON.parse(fs.readFileSync('./hugo_stats.json', 'utf-8'));
        } catch (e) {
          console.warn("Warning: hugo_stats.json not found or unparseable. PurgeCSS might miss some classes.", e.message);
          return [];
        }
        const classList = hugoStats.htmlElements?.classes || [];
        // Also extract classes from the content itself as a fallback or supplement
        const contentClasses = content.match(/[\w-/:]+(?<!:)/g) || [];
        return [...new Set([...classList, ...contentClasses])]; // Combine and deduplicate
      },
      extensions: ['json'] // This extractor specifically processes hugo_stats.json
    },
    {
      extractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      extensions: ['html', 'md', 'js'] // Default extractor for other file types
    }
  ],
  // Optionally, set to true to see what PurgeCSS is doing (for debugging)
  // rejected: true,
  // rejectedCss: true,
});

export default {
  plugins: [
    // Other PostCSS plugins (like autoprefixer) could go here, usually *before* purgecss
    ...(process.env.HUGO_ENV === 'production' ? [purgecssPlugin] : []) // Only run purgecss in production
  ]
};