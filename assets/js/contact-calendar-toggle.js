// assets/js/contact-calendar-toggle.js
import { showFormBtn, showCalendarBtn } from './lib/contact-calendar/domElements.js';
import { initializeViews, showFormView, showCalendarView } from './lib/contact-calendar/viewToggle.js';

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Initialize views: This will validate elements and set the initial form view.
  initializeViews();

  // Add Event Listeners
  // initializeViews already checks for the presence of these buttons via validateElements.
  // If they weren't found, initializeViews would have logged warnings and
  // showFormView/showCalendarView would not proceed.
  if (showFormBtn) {
    showFormBtn.addEventListener('click', showFormView);
  } else {
    // This case should ideally be caught by initializeViews -> validateElements
    console.warn("Contact/Calendar Toggle: Show Form Button not found after initialization. Listeners not attached.");
  }

  if (showCalendarBtn) {
    showCalendarBtn.addEventListener('click', showCalendarView);
  } else {
    // This case should ideally be caught by initializeViews -> validateElements
    console.warn("Contact/Calendar Toggle: Show Calendar Button not found after initialization. Listeners not attached.");
  }
});
