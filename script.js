// =====================
// COOKIE POPUP
// =====================
const COOKIE_CONSENT_KEY = "juliePortfolioCookieConsent";
const popUp = document.getElementById("cookiePopup");
const acceptCookieBtn = document.getElementById("acceptCookie");
const rejectCookieBtn = document.getElementById("rejectCookie");
const saveCookieSettingsBtn = document.getElementById("saveCookieSettings");
const externalCookiesToggle = document.getElementById("externalCookiesToggle");
const cookieSettingsLink = document.getElementById("cookieSettingsLink");
const translateConsentMessage = document.getElementById("translateConsentMessage");
const scrollProgressBar = document.getElementById("scrollProgressBar");

// =====================
// SCROLL PROGRESS
// =====================
function updateScrollProgress() {
  if (!scrollProgressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

function readCookieConsent() {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY));
  } catch {
    return null;
  }
}

function saveCookieConsent(allowExternalServices) {
  const consent = {
    essential: true,
    externalServices: allowExternalServices,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  return consent;
}

function showCookiePopup() {
  if (!popUp) return;

  const savedConsent = readCookieConsent();
  if (externalCookiesToggle) {
    externalCookiesToggle.checked = Boolean(savedConsent?.externalServices);
  }

  popUp.classList.remove("hide", "cookie-hide");
  popUp.classList.add("cookie-show");
}

function hideCookiePopup() {
  popUp?.classList.add("hide");
  popUp?.classList.remove("cookie-show");
}

function deleteLegacyCookie() {
  document.cookie = "myCookieName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

function deleteGoogleTranslateCookie() {
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
}

function loadGoogleTranslate() {
  if (translateConsentMessage) {
    translateConsentMessage.textContent = "Google Translate is enabled.";
    translateConsentMessage.classList.add("is-hidden");
  }

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate) return;

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  if (window.google?.translate) {
    window.googleTranslateElementInit();
    return;
  }

  if (document.getElementById("googleTranslateScript")) return;

  const translateScript = document.createElement("script");
  translateScript.id = "googleTranslateScript";
  translateScript.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  translateScript.async = true;
  document.body.appendChild(translateScript);
}

function disableGoogleTranslate() {
  deleteGoogleTranslateCookie();

  const translateElement = document.getElementById("google_translate_element");
  if (translateElement) translateElement.innerHTML = "";

  if (translateConsentMessage) {
    translateConsentMessage.textContent =
      "Google Translate loads only after you allow optional external services.";
    translateConsentMessage.classList.remove("is-hidden");
  }
}

function applyCookieConsent(consent) {
  if (consent?.externalServices) loadGoogleTranslate();
  else disableGoogleTranslate();
}

function handleConsentChoice(allowExternalServices) {
  const consent = saveCookieConsent(allowExternalServices);
  applyCookieConsent(consent);
  hideCookiePopup();
}

acceptCookieBtn?.addEventListener("click", () => handleConsentChoice(true));
rejectCookieBtn?.addEventListener("click", () => handleConsentChoice(false));

saveCookieSettingsBtn?.addEventListener("click", () => {
  handleConsentChoice(Boolean(externalCookiesToggle?.checked));
});

cookieSettingsLink?.addEventListener("click", showCookiePopup);

// =====================
// TAB SYSTEM
// =====================
function openTab(evt, tabName) {
  // Hide all tab contents
  const tabContent = document.getElementsByClassName("tabContent");
  for (let i = 0; i < tabContent.length; i++) tabContent[i].style.display = "none";

  // Remove active from all tab buttons
  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");

  // Show selected tab
  const current = document.getElementById(tabName);
  if (current) current.style.display = "block";

  // Active state
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");

  // Close dropdown after selection (nice UX)
  closeProjectsMenu();

  // Scroll to content smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("load", () => {
  // Default tab
  const home = document.getElementById("HomePage");
  if (home) home.style.display = "block";

  const homeBtn = document.getElementById("buttonHome");
  if (homeBtn) homeBtn.classList.add("active");

  deleteLegacyCookie();

  const savedConsent = readCookieConsent();
  if (savedConsent) {
    applyCookieConsent(savedConsent);
    hideCookiePopup();
  } else {
    setTimeout(showCookiePopup, 600);
  }

  updateScrollProgress();
});

// =====================
// BUBBLY BUTTON ANIMATION
// =====================
const animateButton = (e) => {
  e.preventDefault();
  e.target.classList.remove("animate");
  e.target.classList.add("animate");
  setTimeout(() => e.target.classList.remove("animate"), 700);
};

const bubblyButtons = document.getElementsByClassName("bubbly-button");
for (let i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener("click", animateButton, false);
}

// =====================
// MODERN DROPDOWN MENU (Projects)
// =====================
const projectsBtn = document.getElementById("projectsBtn");
const projectsMenu = document.getElementById("projectsMenu");

const projectsMenuIsOpen = () => projectsMenu?.classList.contains("show");

function openProjectsMenu({ focusFirst = false } = {}) {
  if (!projectsBtn || !projectsMenu) return;

  projectsMenu.classList.add("show");
  projectsBtn.setAttribute("aria-expanded", "true");

  if (focusFirst) {
    const firstItem = projectsMenu.querySelector('button[role="menuitem"]');
    firstItem?.focus();
  }
}

function closeProjectsMenu({ focusButton = false } = {}) {
  if (!projectsBtn || !projectsMenu) return;

  projectsMenu.classList.remove("show");
  projectsBtn.setAttribute("aria-expanded", "false");

  if (focusButton) projectsBtn.focus();
}

function toggleProjectsMenu() {
  if (!projectsBtn || !projectsMenu) return;

  if (projectsMenuIsOpen()) closeProjectsMenu();
  else openProjectsMenu();
}

// Button click toggles menu
projectsBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleProjectsMenu();
});

// Click inside menu: selecting an item closes menu nicely
projectsMenu?.addEventListener("click", (e) => {
  const item = e.target.closest('button[role="menuitem"]');
  if (!item) return;
  closeProjectsMenu();
});

// Click outside closes
document.addEventListener("click", (e) => {
  if (!projectsMenuIsOpen()) return;
  const clickedInside =
    projectsMenu.contains(e.target) || projectsBtn.contains(e.target);
  if (!clickedInside) closeProjectsMenu();
});

// Keyboard support: Esc closes, arrows navigate
document.addEventListener("keydown", (e) => {
  if (!projectsMenuIsOpen()) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeProjectsMenu({ focusButton: true });
    return;
  }

  const items = Array.from(
    projectsMenu.querySelectorAll('button[role="menuitem"]')
  );
  if (!items.length) return;

  const currentIndex = items.indexOf(document.activeElement);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = items[(currentIndex + 1 + items.length) % items.length];
    next.focus();
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = items[(currentIndex - 1 + items.length) % items.length];
    prev.focus();
  }

  if (e.key === "Home") {
    e.preventDefault();
    items[0].focus();
  }

  if (e.key === "End") {
    e.preventDefault();
    items[items.length - 1].focus();
  }
});

// Open menu with Enter/Space when focused on button
projectsBtn?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleProjectsMenu();
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!projectsMenuIsOpen()) openProjectsMenu({ focusFirst: true });
  }
});

// =====================
// PROJECT FILTERS
// =====================
const filterButtons = document.querySelectorAll(".filterBtn");
const projectCards = document.querySelectorAll(".projectCard");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category?.split(" ") || [];
      const showCard = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !showCard);
    });
  });
});

// =====================
// COPY EMAIL BUTTONS
// =====================
const copyEmailButtons = document.querySelectorAll(".copyEmailBtn");

async function copyEmail(button) {
  const email = button.dataset.email;
  if (!email) return;

  const originalText = button.textContent;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(email);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    button.textContent = "Copied";
    button.classList.add("is-copied");
  } catch {
    button.textContent = "Copy failed";
  }

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("is-copied");
  }, 1800);
}

copyEmailButtons.forEach((button) => {
  button.addEventListener("click", () => copyEmail(button));
});
