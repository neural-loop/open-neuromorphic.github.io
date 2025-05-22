document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- Background-images ---
  const elementsWithDataBackground = document.querySelectorAll('[data-background]');
  
  elementsWithDataBackground.forEach(function (element) {
    const backgroundUrl = element.dataset.background; // Or element.getAttribute('data-background');
    if (backgroundUrl) {
      element.style.backgroundImage = 'url(' + backgroundUrl + ')';
    }
  });
});
