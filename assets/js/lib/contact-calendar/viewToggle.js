// assets/js/lib/contact-calendar/viewToggle.js
import {
  showFormBtn,
  showCalendarBtn,
  formContainer,
  calendarContainer,
  calEmbedDiv, // calEmbedDiv is used by calService, but good to have its presence checked by domElements.validateElements
  validateElements
} from './domElements.js';
import { ensureCalendarReadyAndEmbed, clearCalError, isCalInitialized } from './calService.js';

let elementsValid = false; // To store the result of validateElements

export function initializeViews() {
  elementsValid = validateElements();
  if (!elementsValid) {
    console.warn("ViewToggle: Cannot initialize views due to missing critical DOM elements.");
    return;
  }
  // Set initial state (show form by default)
  showFormView();
}

export function showFormView() {
  if (!elementsValid) return;

  formContainer.classList.remove('d-none');
  calendarContainer.classList.add('d-none');
  showFormBtn.classList.add('btn-primary');
  showFormBtn.classList.remove('btn-outline-primary');
  showCalendarBtn.classList.add('btn-outline-primary');
  showCalendarBtn.classList.remove('btn-primary');
  clearCalError(); // Clear any lingering calendar errors
  console.log("ViewToggle: Switched to Form View.");
}

export async function showCalendarView() {
  if (!elementsValid) return;

  formContainer.classList.add('d-none');
  calendarContainer.classList.remove('d-none');
  showCalendarBtn.classList.add('btn-primary');
  showCalendarBtn.classList.remove('btn-outline-primary');
  showFormBtn.classList.add('btn-outline-primary');
  showFormBtn.classList.remove('btn-primary');
  clearCalError(); // Clear previous errors before attempting to load

  console.log("ViewToggle: Attempting to switch to Calendar View.");
  // Only attempt to initialize and embed if not already done.
  // ensureCalendarReadyAndEmbed handles its own logging for success/failure.
  if (!isCalInitialized()) {
    const calendarReady = await ensureCalendarReadyAndEmbed();
    if (calendarReady) {
      console.log("ViewToggle: Calendar is ready and embedded.");
    } else {
      console.warn("ViewToggle: Calendar setup failed or was skipped. Check calService logs.");
      // Optionally, switch back to form view or display a persistent error here
    }
  } else {
    console.log("ViewToggle: Calendar was already initialized. Showing existing instance.");
  }
}