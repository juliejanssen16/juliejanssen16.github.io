// =====================
// COOKIE POPUP
// =====================
const popUp = document.getElementById("cookiePopup");

document.getElementById("acceptCookie")?.addEventListener("click", () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 2);
  document.cookie =
    "myCookieName=thisIsMyCookie; expires=" + d.toUTCString() + "; path=/";

  popUp?.classList.add("hide");
  popUp?.classList.remove("cookie-show");
});

const checkCookie = () => {
  const hasCookie = document.cookie.includes("myCookieName=thisIsMyCookie");
  if (!popUp) return;

  if (hasCookie) {
    popUp.classList.add("cookie-hide");
    popUp.classList.remove("cookie-show");
  } else {
    popUp.classList.add("cookie-show");
    popUp.classList.remove("cookie-hide");
  }
};

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

  setTimeout(checkCookie, 600);
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
