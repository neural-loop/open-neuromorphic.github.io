// assets/js/lib/contact-calendar/domElements.js
export const showFormBtn = document.getElementById('show-form-btn');
export const showCalendarBtn = document.getElementById('show-calendar-btn');
export const formContainer = document.getElementById('contact-form-container');
export const calendarContainer = document.getElementById('calendar-container');
export const calEmbedDiv = document.getElementById('my-cal-inline');
export const calErrorMessageDiv = document.getElementById('cal-error-message');

export function validateElements() {
  if (!showFormBtn) console.warn("Contact Calendar: showFormBtn not found.");
  if (!showCalendarBtn) console.warn("Contact Calendar: showCalendarBtn not found.");
  if (!formContainer) console.warn("Contact Calendar: formContainer not found.");
  if (!calendarContainer) console.warn("Contact Calendar: calendarContainer not found.");
  if (!calEmbedDiv) console.warn("Contact Calendar: calEmbedDiv (#my-cal-inline) not found.");
  // calErrorMessageDiv is optional for basic functionality but good to check if expected
  if (!calErrorMessageDiv) console.warn("Contact Calendar: calErrorMessageDiv not found (optional).");

  return showFormBtn && showCalendarBtn && formContainer && calendarContainer && calEmbedDiv;
}