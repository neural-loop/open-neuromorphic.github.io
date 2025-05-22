// assets/js/main.js
'use strict';

// Import your ES6 module-based scripts first.
// esbuild will resolve their internal imports.
import './accordion.js'; // <<< ADD THIS LINE

// Import other "classic" scripts.
// Their DOMContentLoaded or jQuery(function(){}) wrappers will still function correctly
// when the bundled script is executed.
import './background-images.js'; // Ensure jQuery is loaded globally before this bundle executes
import './cookie-consent.js';
import './og-effects.js';

// You can keep or integrate the original console log for initialization.
document.addEventListener('DOMContentLoaded', function () {
  console.log("ONM (Bundled with esbuild via Hugo Pipes) Initialized");

  // If you had any other global initializations in the old main.js, put them here.
  // e.g., const lightbox = GLightbox({ selector: '.glightbox' });
});
