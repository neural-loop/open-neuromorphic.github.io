document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const contactForm = document.getElementById('contact-message-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitButton = contactForm
    ? contactForm.querySelector('button[type="submit"]')
    : null;

  if (contactForm && formFeedback && submitButton) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(contactForm);
      const submitButtonOriginalText = submitButton.innerHTML;
      const formActionUrl = contactForm.action; // Get the URL from the form's action attribute

      // Disable button and show spinner
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

      // Clear previous feedback
      formFeedback.innerHTML = '';
      formFeedback.className = 'mt-3 small'; // Reset classes

      // Use Fetch API for submission
      fetch(formActionUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // Headers often required by form processing endpoints
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json', // Expect JSON response
        },
      })
        .then((response) => {
          // Check if response status is ok (e.g., 2xx)
          if (!response.ok) {
            // Try to parse error JSON, otherwise use status text
            return response.json().then(errData => {
              throw new Error(errData.message || `Server error: ${response.status} ${response.statusText}`);
            }).catch(() => { // If parsing JSON fails
              throw new Error(`Server error: ${response.status} ${response.statusText}`);
            });
          }
          // If response is OK, parse the JSON body
          return response.json();
        })
        .then((data) => {
          // Handle success or specific errors returned in JSON
          if (data.status === 'success') {
            formFeedback.textContent = data.message || 'Message sent successfully!';
            formFeedback.className = 'mt-3 small alert alert-success'; // Add success classes
            contactForm.reset(); // Clear the form fields
          } else {
            // Handle errors indicated by the server's JSON response
            formFeedback.textContent = data.message || 'An error occurred submitting the form.';
            formFeedback.className = 'mt-3 small alert alert-danger'; // Add error classes
          }
        })
        .catch((error) => {
          // Handle network errors or errors thrown above
          console.error('Form submission error:', error);
          formFeedback.textContent = error.message || 'A network error occurred. Please try again.';
          formFeedback.className = 'mt-3 small alert alert-danger'; // Add error classes
        })
        .finally(() => {
          // Re-enable button and restore text regardless of success/failure
          submitButton.disabled = false;
          submitButton.innerHTML = submitButtonOriginalText;
        });
    });
  } else {
    // Optional: Log if essential form elements are missing
    if (!contactForm) console.warn("AJAX Form: Contact form (#contact-message-form) not found.");
    if (!formFeedback) console.warn("AJAX Form: Feedback div (#form-feedback) not found.");
    if (!submitButton) console.warn("AJAX Form: Submit button not found within the form.");
  }
});
