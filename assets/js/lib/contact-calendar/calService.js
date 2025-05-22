// assets/js/lib/contact-calendar/calService.js
import { calEmbedDiv, calErrorMessageDiv } from './domElements.js';

let calScriptLoaded = false;
let calInitialized = false; // Tracks if the *inline embed* was initialized

function displayCalError(message, type = 'danger') {
  if (calErrorMessageDiv) {
    calErrorMessageDiv.className = `text-${type} text-center small mt-4`;
    calErrorMessageDiv.textContent = message;
  }
  if (calEmbedDiv) {
    const loadingMsg = calEmbedDiv.querySelector('p');
    if (loadingMsg && loadingMsg.textContent.includes('Loading Calendar')) {
      loadingMsg.remove();
    }
  }
}

export function clearCalError() {
  if (calErrorMessageDiv) {
    calErrorMessageDiv.textContent = '';
    calErrorMessageDiv.className = 'text-center small mt-4'; // Reset class
  }
}

function loadAndInitCalBase() {
  return new Promise((resolve, reject) => {
    if (calScriptLoaded) {
      console.log('Cal.com script already processed.');
      if (typeof Cal === 'function') {
        resolve();
      } else {
        reject(new Error("Cal script marked loaded, but Cal function not found."));
      }
      return;
    }

    console.log('Loading and initializing Cal.com base...');
    displayCalError('Loading calendar...', 'info');

    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const script = d.createElement("script");
          script.src = A;
          script.async = true;
          script.onload = () => {
            console.log('Cal.com embed.js script loaded successfully.');
            calScriptLoaded = true;
            resolve();
          };
          script.onerror = (err) => {
            console.error('Failed to load Cal.com embed.js script:', err);
            displayCalError('Failed to load calendar script. Please refresh or use the message form.', 'danger');
            reject(err);
          };
          d.head.appendChild(script);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if(typeof namespace === "string"){
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    try {
      if (typeof Cal === 'function') {
        Cal("init", "30min", {origin:"https://cal.com"});
        console.log('Cal("init") command queued/executed.');
      } else {
        throw new Error("Cal function was not created by the IIFE.");
      }
    } catch (initError) {
      console.error("Error during initial Cal setup:", initError);
      displayCalError('Failed to setup calendar components.', 'danger');
      reject(initError);
    }
  });
}

function initializeInlineEmbed() {
  if (calInitialized || !calEmbedDiv || typeof Cal !== 'function' || !Cal.ns || !Cal.ns["30min"]) {
    console.log('Skipping inline initialization (already done, div missing, or Cal base not ready).');
    if (!calEmbedDiv) console.warn("CalService: calEmbedDiv is missing for inline embed.");
    return false; // Indicate failure or skip
  }
  const calLink = calEmbedDiv.dataset.calLink;
  if (!calLink) {
    displayCalError('Calendar configuration error (missing data-cal-link).', 'danger');
    return false; // Indicate failure
  }

  clearCalError();
  const loadingMsg = calEmbedDiv.querySelector('p');
  if (loadingMsg) loadingMsg.remove();

  console.log('Initializing Cal.com *inline* embed...');
  try {
    Cal.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline",
      calLink: calLink,
      config: { "layout": "month_view" }
    });
    Cal.ns["30min"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    console.log('Cal.com inline embed initialized.');
    calInitialized = true;
    return true; // Indicate success
  } catch (error) {
    console.error('Error initializing Cal.com inline embed:', error);
    displayCalError('Failed to initialize calendar view. Please refresh or use the message form.', 'danger');
    return false; // Indicate failure
  }
}

export async function ensureCalendarReadyAndEmbed() {
  if (!calEmbedDiv) {
    console.warn("CalService: Cannot ensure calendar readiness, calEmbedDiv is missing.");
    return false;
  }
  try {
    if (!calScriptLoaded) {
      await loadAndInitCalBase();
    }
    if (typeof Cal === 'function' && Cal.ns && Cal.ns["30min"]) {
      return initializeInlineEmbed();
    } else {
      console.error('Cal function or namespace not available after script load.');
      if (!calErrorMessageDiv || !calErrorMessageDiv.textContent) {
        displayCalError('Calendar components failed to initialize correctly.', 'danger');
      }
      return false;
    }
  } catch (error) {
    console.error('Error occurred during calendar setup:', error);
    if (!calErrorMessageDiv || !calErrorMessageDiv.textContent) {
      displayCalError('An error occurred loading the calendar.', 'danger');
    }
    return false;
  }
}

export function isCalInitialized() {
    return calInitialized;
}