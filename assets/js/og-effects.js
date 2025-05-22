document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function initializeOgPreviewEffects() {
    const effectWrappers = document.querySelectorAll(
      '.og-preview-wrapper[data-effect-probability]'
    );
    effectWrappers.forEach((wrapper) => {
      const probability = parseInt(wrapper.dataset.effectProbability, 10) || 0;
      const duration = parseInt(wrapper.dataset.effectDuration, 10) || 750;
      const effectOverlay = wrapper.querySelector('.og-effect-overlay');
      const availableEffects = ['glitch', 'static', 'warble']; // Add more if needed

      if (!effectOverlay || availableEffects.length === 0) {
        return;
      }

      const shouldPlayEffect = Math.random() * 100 < probability;

      if (shouldPlayEffect) {
        const chosenEffect =
          availableEffects[Math.floor(Math.random() * availableEffects.length)];
        const effectClass = `effect-${chosenEffect}`;

        effectOverlay.style.animationDuration = `${duration}ms`;
        effectOverlay.classList.add(effectClass, 'animate-effect');

        const imageElement = wrapper.querySelector('.og-preview-image');
        if (chosenEffect === 'warble' && imageElement) {
          // Applying filter via CSS class might be cleaner if filter setup is complex
          imageElement.style.filter = 'url(#og-warble-filter)';
        }

        effectOverlay.addEventListener(
          'animationend',
          () => {
            effectOverlay.classList.remove(effectClass, 'animate-effect');
            effectOverlay.style.animationDuration = ''; // Reset duration
            if (chosenEffect === 'warble' && imageElement) {
              imageElement.style.filter = ''; // Reset filter
            }
          },
          { once: true }
        );
      }
    });
  }

  // Add a slight delay before initializing effects
  setTimeout(initializeOgPreviewEffects, 150);
});
