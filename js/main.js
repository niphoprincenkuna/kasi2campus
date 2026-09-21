/* ==================================================================
   Kasi2Campus  ·  js/main.js
   ------------------------------------------------------------------
   As you build each new page, add its file name to READY_PAGES below.
   Until then, buttons/links that point to it show a "coming soon"
   message instead of a broken page.
=================================================================== */
(function () {
  "use strict";

  var READY_PAGES = [
    "index.html",
    "institutions.html",
    "courses.html",
    "pricing.html",
    "apply.html",
    "calculator.html",
    "contact.html",
    "about.html",
    "faq.html",
    "deadlines.html",
    "privacy-policy.html"
  ];

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".navbar")) closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1140) closeMenu();
    });
  }

  /* ---------- Highlight the current page in the menu ---------- */
  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (links) {
    links.querySelectorAll("a").forEach(function (a) {
      var isCurrent = (a.getAttribute("href") || "").toLowerCase() === current;
      a.classList.toggle("active", isCurrent);
      if (isCurrent) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Shadow under the header once you scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- "Coming soon" for pages that don't exist yet ---------- */
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3200);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");

    // ignore anchors, email/phone links and external sites
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|https?:|\/\/)/i.test(href)) return;

    var file = href.split("#")[0].split("?")[0].split("/").pop().toLowerCase();
    if (!file || !/\.html?$/.test(file)) return;

    if (READY_PAGES.indexOf(file) === -1) {
      e.preventDefault();
      closeMenu();
      showToast("This page is coming soon. We're still building it.");
    }
  });

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
