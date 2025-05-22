document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const cookieBox = document.getElementById('js-cookie-box');
  const cookieButton = document.getElementById('js-cookie-button');

  // Check if Cookies library is loaded
  if (typeof Cookies === 'undefined') {
    console.warn('js-cookie library not found. Cookie consent functionality disabled.');
    if (cookieBox) cookieBox.style.display = 'none'; // Hide the box if library missing
    return;
  }

  if (cookieBox && cookieButton) {
    if (!Cookies.get('cookie-box')) {
      cookieBox.classList.remove('cookie-box-hide');
      cookieButton.onclick = function () {
        const expireDaysAttr = cookieBox.getAttribute('data-expire-days');
        const expireDays = parseInt(expireDaysAttr) || 30;
        // Set the cookie
        Cookies.set('cookie-box', true, { expires: expireDays, path: '/' });
        // Hide the box
        cookieBox.classList.add('cookie-box-hide');
      };
    }
  }
});
