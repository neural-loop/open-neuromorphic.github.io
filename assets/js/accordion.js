// assets/js/accordion.js
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(accordion => {
    const button = accordion.querySelector('.accordion-header[data-accordion]');
    const content = accordion.querySelector('.accordion-content');

    if (button && content) {
      // Initialize ARIA attributes
      button.setAttribute('aria-expanded', 'false');

      let contentId = content.id;
      if (!contentId) {
        // Simple unique ID generator for aria-controls
        contentId = `accordion-content-${Math.random().toString(36).substring(2, 11)}`;
        content.id = contentId;
      }
      button.setAttribute('aria-controls', contentId);

      button.addEventListener('click', () => {
        const isActive = accordion.classList.contains('active');

        // Toggle active class on the main accordion container
        accordion.classList.toggle('active');

        // Update ARIA expanded state on the button
        button.setAttribute('aria-expanded', String(!isActive));
      });
    } else {
      if (!button) console.warn('Accordion button not found in an accordion element:', accordion);
      if (!content) console.warn('Accordion content not found in an accordion element:', accordion);
    }
  });
});
