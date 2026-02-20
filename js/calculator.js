// ===== Dropdown Data =====
const OFFICIAL_LANGUAGES = [
  "English",
  "Afrikaans",
  "isiZulu",
  "isiXhosa",
  "Sesotho",
  "Sepedi",
  "Setswana",
  "Xitsonga",
  "Tshivenda",
  "isiNdebele",
  "siSwati"
];

const SA_SCHOOL_SUBJECTS = [
  // Commerce
  "Accounting",
  "Business Studies",
  "Economics",

  // Sciences
  "Physical Sciences",
  "Life Sciences",
  "Agricultural Sciences",
  "Geography",

  // Humanities
  "History",
  "Religion Studies",

  // Tech
  "Information Technology",
  "Computer Applications Technology",
  "Engineering Graphics and Design",
  "Technical Mathematics",
  "Technical Sciences",

  // Consumer / Services
  "Consumer Studies",
  "Hospitality Studies",
  "Tourism",

  // Arts
  "Visual Arts",
  "Dramatic Arts",
  "Music",
  "Dance Studies",
  "Design",

  // Extra languages if needed
  ...OFFICIAL_LANGUAGES.map(l => `Language: ${l}`)
];

// ===== Helpers =====
function clampMark(n) {
  if (Number.isNaN(n)) return null;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

function markToLevel(mark) {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

function setOptions(selectEl, options, placeholder = "Select") {
  selectEl.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder;
  selectEl.appendChild(opt0);

  options.forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    selectEl.appendChild(o);
  });
}

function fmtAvg(n) {
  return `${n.toFixed(1)}%`;
}

// ===== Elements =====
const form = document.getElementById("calcForm");
const use8 = document.getElementById("use8");
const row8 = document.getElementById("row8");

const lang1 = document.getElementById("lang1");
const lang2 = document.getElementById("lang2");
const mathType = document.getElementById("mathType");

const apsOut = document.getElementById("apsOut");
const avgOut = document.getElementById("avgOut");
const breakdown = document.getElementById("breakdown");
const courseSuggestionsEl = document.getElementById("courseSuggestions");

const resetBtn = document.getElementById("resetBtn");

// ===== Init dropdowns =====
setOptions(lang1, OFFICIAL_LANGUAGES, "Select language");
setOptions(lang2, OFFICIAL_LANGUAGES, "Select language");
["sub5","sub6","sub7","sub8"].forEach(id => setOptions(document.getElementById(id), SA_SCHOOL_SUBJECTS, "Select subject"));

// ===== Live level pills =====
const levelMap = [
  { markId: "lang1Mark", levelId: "lang1Level" },
  { markId: "lang2Mark", levelId: "lang2Level" },
  { markId: "mathMark", levelId: "mathLevel" },
  { markId: "sub5Mark", levelId: "sub5Level" },
  { markId: "sub6Mark", levelId: "sub6Level" },
  { markId: "sub7Mark", levelId: "sub7Level" },
  { markId: "sub8Mark", levelId: "sub8Level" }
];

function updateLevelPill(markInputId, pillId, forceLevel = null) {
  const markEl = document.getElementById(markInputId);
  const pill = document.getElementById(pillId);

  const raw = Number(markEl.value);
  const mark = clampMark(raw);

  if (markEl.value === "" || mark === null) {
    pill.textContent = "Level: -";
    return;
  }

  const lvl = forceLevel != null ? forceLevel : markToLevel(mark);
  pill.textContent = `Level: ${lvl}`;
}

levelMap.forEach(x => {
  const el = document.getElementById(x.markId);
  el.addEventListener("input", () => updateLevelPill(x.markId, x.levelId));
});

// LO always 1
document.getElementById("loMark").addEventListener("input", () => {
  document.getElementById("loLevel").textContent = "Level: 1 (rule)";
});

// Optional subject toggle
function syncOptionalUI() {
  const enabled = use8.checked;
  row8.classList.toggle("dim", !enabled);
  row8.querySelectorAll("select, input").forEach(el => {
    el.disabled = !enabled;
    if (!enabled) el.value = "";
  });
  updateLevelPill("sub8Mark", "sub8Level");
}
use8.addEventListener("change", syncOptionalUI);
syncOptionalUI();

// ===== Calculation + Breakdown =====
function readSubject(name, subject, mark, level) {
  return { name, subject, mark, level };
}

function showError(msg) {
  breakdown.innerHTML = `<div class="calc-alert">${msg}</div>`;
  if (courseSuggestionsEl) courseSuggestionsEl.innerHTML = "";
}

function renderBreakdown(items) {
  breakdown.innerHTML = items.map(it => {
    return `
      <div class="bd-row">
        <div>
          <div class="bd-title">${it.subject}</div>
          <div class="muted small">${it.name}</div>
        </div>
        <div class="bd-right">
          <div class="bd-mark">${it.mark}%</div>
          <div class="bd-level">Level ${it.level}</div>
        </div>
      </div>
    `;
  }).join("");
}

// ===== Smart course suggestion logic =====
function hasPhysicalSciences(items) {
  return items.find(it => it.subject === "Physical Sciences");
}

function hasMaths(mathChoice) {
  return mathChoice === "Mathematics";
}

function getBand(aps) {
  if (aps <= 18) return "7–18";
  if (aps <= 22) return "19–22";
  if (aps <= 27) return "23–27";
  if (aps <= 33) return "28–33";
  if (aps <= 37) return "34–37";
  if (aps <= 42) return "38–42";
  return "43+";
}

function buildSuggestions({ aps, mathChoice, physSciMark }) {
  const band = getBand(aps);
  const isMaths = hasMaths(mathChoice);
  const hasPhysSci = physSciMark != null;

  // Base suggestions by APS band (broad)
  const baseByBand = {
    "7–18": [
      "Higher Certificate in Business Management",
      "Higher Certificate in IT Support",
      "Higher Certificate in Office Administration",
      "Higher Certificate pathways (foundation programmes)",
      "TVET bridging programmes"
    ],
    "19–22": [
      "Higher Certificate in Marketing",
      "Higher Certificate in Public Management",
      "Higher Certificate in Accounting / Bookkeeping",
      "Some Diplomas (depends on subjects)",
      "TVET Diplomas / pathways"
    ],
    "23–27": [
      "Diploma in Human Resource Management",
      "Diploma in Marketing",
      "Diploma in Logistics / Supply Chain",
      "Diploma in Tourism / Hospitality",
      "Diploma in IT (some institutions)"
    ],
    "28–33": [
      "BCom (General) / Business Management",
      "BA / Social Science",
      "BEd (Teaching) (requirements vary)",
      "BSc (General) (depends on Maths & Science)",
      "IT / Computer Science pathways (varies)"
    ],
    "34–37": [
      "BSc IT / Computer Science (many universities, subject dependent)",
      "BCom Accounting / Finance",
      "BSc Life Sciences / Biological Sciences (subject dependent)",
      "Engineering Diplomas and some degrees (subject dependent)",
      "Built Environment degrees (some institutions)"
    ],
    "38–42": [
      "Engineering degrees (subject dependent)",
      "Actuarial Science (very maths-heavy)",
      "BSc Data Science / AI streams",
      "Health Sciences (selection + subject dependent)",
      "Top-tier Computer Science programmes"
    ],
    "43+": [
      "MBChB (Medicine) (highly competitive + selection)",
      "Dentistry (where offered) (selection dependent)",
      "Engineering (all streams) (subject dependent)",
      "Actuarial Science",
      "Top-tier BSc Computer Science / Data Science"
    ]
  };

  // Filters / adds based on subject requirements
  const suggestions = [...(baseByBand[band] || [])];

  // If Maths Literacy, restrict some STEM-heavy suggestions
  if (!isMaths) {
    // Remove some STEM-heavy items if present
    const removeKeywords = ["Engineering", "Actuarial", "Data Science", "AI", "Medicine", "Dentistry", "BSc"];
    for (let i = suggestions.length - 1; i >= 0; i--) {
      if (removeKeywords.some(k => suggestions[i].includes(k))) suggestions.splice(i, 1);
    }
    // Add more Maths Lit-friendly options
    suggestions.push(
      "Diploma / Degree in Public Management (subject dependent)",
      "Diploma in Office Management / Administration",
      "Business / Marketing / HR pathways"
    );
  } else {
    // Maths chosen: add STEM options (APS permitting)
    if (aps >= 28) suggestions.push("BSc Computer Science / IT (subject dependent)");
    if (aps >= 34) suggestions.push("Engineering (subject dependent)");
    if (aps >= 38) suggestions.push("Actuarial Science (maths-heavy)");
  }

  // Physical Sciences requirement boosters
  if (hasPhysSci) {
    if (aps >= 34 && physSciMark >= 50) {
      suggestions.push("Engineering (better chance with Physical Sciences)");
      suggestions.push("BSc Physical Sciences / Engineering Science pathways");
    }
    if (aps >= 28 && physSciMark >= 40) {
      suggestions.push("BSc (Science) degrees (subject dependent)");
    }
  } else {
    // If no Physical Sciences, caution on engineering / some BSc
    if (isMaths && aps >= 34) {
      suggestions.push("Note: Many Engineering programmes require Physical Sciences.");
    }
  }

  // Keep unique
  return Array.from(new Set(suggestions));
}

function renderCourseSuggestions(meta) {
  if (!courseSuggestionsEl) return;

  const items = buildSuggestions(meta);
  const physText = meta.physSciMark != null ? `Physical Sciences: ${meta.physSciMark}%` : "Physical Sciences: Not selected";
  const mathText = `Maths: ${meta.mathChoice || "-"}`;

  courseSuggestionsEl.innerHTML = `
    <div class="sug-card">
      <div class="sug-title">Based on your results</div>
      <div class="muted small">
        APS: <strong>${meta.aps}</strong> · ${mathText} · ${physText}
      </div>

      <ul class="sug-list" style="margin-top:10px;">
        ${items.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <div class="sug-chiprow">
        <span class="sug-chip">Confirm requirements</span>
        <span class="sug-chip">Subjects matter</span>
        <span class="sug-chip">Selection differs</span>
      </div>
    </div>
  `;
}

// ===== Submit calculation =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Required checks for 7 mandatory
  const requiredIds = ["lang1","lang1Mark","lang2","lang2Mark","mathType","mathMark","loMark","sub5","sub5Mark","sub6","sub6Mark","sub7","sub7Mark"];
  for (const id of requiredIds) {
    const el = document.getElementById(id);
    const val = (el.value || "").trim();
    if (!val) {
      apsOut.textContent = "-";
      avgOut.textContent = "-";
      showError("Please complete all 7 mandatory subjects (including marks).");
      return;
    }
  }

  const items = [];

  const l1Mark = clampMark(Number(document.getElementById("lang1Mark").value));
  const l2Mark = clampMark(Number(document.getElementById("lang2Mark").value));
  const mMark  = clampMark(Number(document.getElementById("mathMark").value));
  const loMark = clampMark(Number(document.getElementById("loMark").value));

  const s5Mark = clampMark(Number(document.getElementById("sub5Mark").value));
  const s6Mark = clampMark(Number(document.getElementById("sub6Mark").value));
  const s7Mark = clampMark(Number(document.getElementById("sub7Mark").value));

  const allMarks = [l1Mark,l2Mark,mMark,loMark,s5Mark,s6Mark,s7Mark];
  if (allMarks.some(v => v === null)) {
    apsOut.textContent = "-";
    avgOut.textContent = "-";
    showError("Please enter valid marks between 0 and 100.");
    return;
  }

  items.push(readSubject("Language 1", document.getElementById("lang1").value, l1Mark, markToLevel(l1Mark)));
  items.push(readSubject("Language 2", document.getElementById("lang2").value, l2Mark, markToLevel(l2Mark)));
  items.push(readSubject("Maths", mathType.value, mMark, markToLevel(mMark)));

  // LO forced level = 1
  items.push(readSubject("Life Orientation", "Life Orientation", loMark, 1));

  items.push(readSubject("Subject 5", document.getElementById("sub5").value, s5Mark, markToLevel(s5Mark)));
  items.push(readSubject("Subject 6", document.getElementById("sub6").value, s6Mark, markToLevel(s6Mark)));
  items.push(readSubject("Subject 7", document.getElementById("sub7").value, s7Mark, markToLevel(s7Mark)));

  // Optional 8th (only if enabled AND filled)
  if (use8.checked) {
    const s8Sub = document.getElementById("sub8").value.trim();
    const s8MarkRaw = document.getElementById("sub8Mark").value.trim();
    if (s8Sub && s8MarkRaw !== "") {
      const s8Mark = clampMark(Number(s8MarkRaw));
      if (s8Mark === null) {
        apsOut.textContent = "-";
        avgOut.textContent = "-";
        showError("Your 8th subject mark must be between 0 and 100.");
        return;
      }
      items.push(readSubject("Subject 8 (optional)", s8Sub, s8Mark, markToLevel(s8Mark)));
    }
  }

  const apsTotal = items.reduce((sum, it) => sum + it.level, 0);
  const avg = items.reduce((sum, it) => sum + it.mark, 0) / items.length;

  apsOut.textContent = String(apsTotal);
  avgOut.textContent = fmtAvg(avg);

  renderBreakdown(items);

  // Find Physical Sciences (if selected) and mark
  const ps = hasPhysicalSciences(items);
  const physSciMark = ps ? ps.mark : null;

  renderCourseSuggestions({
    aps: apsTotal,
    mathChoice: mathType.value,
    physSciMark
  });
});

// ===== Reset =====
resetBtn.addEventListener("click", () => {
  form.reset();
  apsOut.textContent = "-";
  avgOut.textContent = "-";
  breakdown.innerHTML = "";
  if (courseSuggestionsEl) courseSuggestionsEl.innerHTML = "";

  document.getElementById("lang1Level").textContent = "Level: -";
  document.getElementById("lang2Level").textContent = "Level: -";
  document.getElementById("mathLevel").textContent = "Level: -";
  document.getElementById("loLevel").textContent = "Level: 1 (rule)";
  document.getElementById("sub5Level").textContent = "Level: -";
  document.getElementById("sub6Level").textContent = "Level: -";
  document.getElementById("sub7Level").textContent = "Level: -";
  document.getElementById("sub8Level").textContent = "Level: -";

  syncOptionalUI();
});