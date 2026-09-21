/* ==================================================================
   Kasi2Campus  ·  js/institutions.js
   Search + province filter for the Institutions page
=================================================================== */
(function () {
  "use strict";

  var input = document.getElementById("instSearch");
  var clearBtn = document.getElementById("instClear");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".prov"));
  var cards = document.querySelectorAll(".inst-card");
  var countEl = document.getElementById("resultCount");
  var empty = document.getElementById("instEmpty");
  var emptyTitle = document.getElementById("instEmptyTitle");
  var resetBtn = document.getElementById("instReset");
  var results = document.getElementById("results");
  if (!input || !sections.length) return;

  var state = { q: "", prov: "all" };

  function norm(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function provinceName(slug) {
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].dataset.prov === slug) return chips[i].firstChild.textContent.trim();
    }
    return "";
  }

  function apply() {
    var q = norm(state.q.trim());
    var shown = 0;

    sections.forEach(function (sec) {
      var inProvince = state.prov === "all" || sec.id === state.prov;
      var items = sec.querySelectorAll(".inst-card");
      var visible = 0;

      items.forEach(function (c) {
        var match = !q || c.getAttribute("data-search").indexOf(q) > -1;
        c.hidden = !match;
        if (match) visible++;
      });

      sec.hidden = !inProvince || visible === 0;
      if (inProvince) shown += visible;

      var total = items.length;
      var word = total === 1 ? "university" : "universities";
      sec.querySelector(".count").textContent = (visible < total ? visible + " of " + total : total) + " " + word;
    });

    chips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.dataset.prov === state.prov ? "true" : "false");
    });

    clearBtn.hidden = !state.q;

    var where = state.prov === "all" ? "" : " in " + provinceName(state.prov);
    var what = shown === 1 ? "university" : "universities";
    if (!q && state.prov === "all") countEl.textContent = "Showing all " + cards.length + " universities";
    else countEl.textContent = "Showing " + shown + " of " + cards.length + " " + what + where;

    empty.hidden = shown > 0;
    if (shown === 0) {
      emptyTitle.textContent = state.q.trim()
        ? "No universities match “" + state.q.trim() + "”" + where
        : "No universities found";
    }
  }

  function setHash() {
    try {
      var url = state.prov === "all" ? location.pathname + location.search : "#" + state.prov;
      history.replaceState(null, "", url);
    } catch (err) { /* ignore (e.g. sandboxed preview) */ }
  }

  function reveal() {
    if (results.getBoundingClientRect().top < 0) results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  input.addEventListener("input", function () { state.q = input.value; apply(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && input.value) { input.value = ""; state.q = ""; apply(); }
  });
  clearBtn.addEventListener("click", function () { input.value = ""; state.q = ""; apply(); input.focus(); });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.prov = chip.dataset.prov;
      apply(); setHash(); reveal();
    });
  });

  resetBtn.addEventListener("click", function () {
    input.value = ""; state.q = ""; state.prov = "all";
    apply(); setHash();
  });

  function fromHash() {
    var h = location.hash.replace("#", "");
    if (h && chips.some(function (c) { return c.dataset.prov === h; })) state.prov = h;
  }
  window.addEventListener("hashchange", function () { fromHash(); apply(); });

  fromHash();
  apply();
})();
