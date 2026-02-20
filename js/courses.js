// University links (homepages)
const UNI = {
  UCT: { name: "UCT", url: "https://www.uct.ac.za/" },
  WITS: { name: "Wits", url: "https://www.wits.ac.za/" },
  UP: { name: "University of Pretoria", url: "https://www.up.ac.za/" },
  SUN: { name: "Stellenbosch University", url: "https://www.sun.ac.za/" },
  UJ: { name: "University of Johannesburg", url: "https://www.uj.ac.za/" },
  UKZN: { name: "UKZN", url: "https://www.ukzn.ac.za/" },
  UFS: { name: "UFS", url: "https://www.ufs.ac.za/" },
  NWU: { name: "NWU", url: "https://www.nwu.ac.za/" },
  RU: { name: "Rhodes", url: "https://www.ru.ac.za/" },
  UNISA: { name: "UNISA", url: "https://www.unisa.ac.za/" },
  UWC: { name: "UWC", url: "https://www.uwc.ac.za/" },
  UFH: { name: "UFH", url: "https://www.ufh.ac.za/" },
  UL: { name: "University of Limpopo", url: "https://www.ul.ac.za/" },
  UNIVEN: { name: "UNIVEN", url: "https://www.univen.ac.za/" },
  WSU: { name: "WSU", url: "https://www.wsu.ac.za/" },
  DUT: { name: "DUT", url: "https://www.dut.ac.za/" },
  TUT: { name: "TUT", url: "https://www.tut.ac.za/" },
  CPUT: { name: "CPUT", url: "https://www.cput.ac.za/" },
  VUT: { name: "VUT", url: "https://www.vut.ac.za/" },
  CUT: { name: "CUT", url: "https://www.cut.ac.za/" },
  NMU: { name: "NMU", url: "https://www.mandela.ac.za/" },
  UMP: { name: "UMP", url: "https://www.ump.ac.za/" },
  UNIZULU: { name: "UniZulu", url: "https://www.unizulu.ac.za/" },
  SMU: { name: "SMU", url: "https://www.smu.ac.za/" },
  SPU: { name: "SPU", url: "https://www.spu.ac.za/" },
  MUT: { name: "MUT", url: "https://www.mut.ac.za/" },
};

const COURSES = [
  {
    title: "Computer Science / Software Development",
    aps: "Typical APS: 28–36 (varies by university)",
    note: "High demand across ICT roles (developers, systems, security).",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.RU, UNI.UNISA],
  },
  {
    title: "Data Science / AI / Statistics",
    aps: "Typical APS: 30–40",
    note: "Strong maths focus. Often housed under Science/Maths faculties.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.UFS],
  },
  {
    title: "Cybersecurity / Information Security",
    aps: "Typical APS: 28–38",
    note: "Often offered as IT / Computer Science specialisation or diploma/degree streams.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.UJ, UNI.UKZN, UNI.DUT, UNI.TUT, UNI.CPUT, UNI.UNISA],
  },
  {
    title: "Electrical / Electronic Engineering",
    aps: "Typical APS: 34–42",
    note: "Maths + Physical Sciences are usually required at high levels.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.TUT],
  },
  {
    title: "Civil Engineering",
    aps: "Typical APS: 34–42",
    note: "In demand for infrastructure, construction, and public works.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.CUT, UNI.TUT],
  },
  {
    title: "Mechanical Engineering",
    aps: "Typical APS: 34–42",
    note: "Manufacturing, mining, energy, transport — big demand areas.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.CUT, UNI.TUT],
  },
  {
    title: "Nursing",
    aps: "Typical APS: 24–34",
    note: "Health sector demand remains strong. Requirements differ widely by institution/campus.",
    unis: [UNI.UWC, UNI.UJ, UNI.UKZN, UNI.WSU, UNI.UL, UNI.UNIVEN, UNI.NWU, UNI.UFS],
  },
  {
    title: "Medicine (MBChB) / Health Sciences",
    aps: "Typical APS: 38–45+",
    note: "Highly competitive; selection often includes tests/interviews and strong Maths/Science marks.",
    unis: [UNI.UCT, UNI.WITS, UNI.UP, UNI.UKZN, UNI.UFS, UNI.SUN, UNI.SMU],
  },
  {
    title: "Teaching (Maths / Science / Foundation Phase)",
    aps: "Typical APS: 22–32",
    note: "Education remains a key demand area, especially Maths/Science and foundation teaching.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.UFS, UNI.UNISA],
  },
  {
    title: "Accounting / Chartered Accountant Path",
    aps: "Typical APS: 28–38",
    note: "Strong demand in finance, audit, and public/private sector accounting.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.UFS, UNI.UNISA],
  },
  {
    title: "Actuarial Science",
    aps: "Typical APS: 38–45",
    note: "Very maths-heavy; often among the highest APS requirements.",
    unis: [UNI.UP, UNI.UCT, UNI.WITS, UNI.SUN, UNI.UFS],
  },
  {
    title: "Supply Chain / Logistics",
    aps: "Typical APS: 24–34",
    note: "High demand across retail, manufacturing, ports, and transport.",
    unis: [UNI.UJ, UNI.UKZN, UNI.NMU, UNI.CPUT, UNI.DUT, UNI.TUT, UNI.VUT, UNI.UNISA],
  },
  {
    title: "Renewable Energy / Environmental Science",
    aps: "Typical APS: 26–36",
    note: "Growing demand in sustainability, solar/wind, and environmental management.",
    unis: [UNI.UCT, UNI.WITS, UNI.UP, UNI.SUN, UNI.UJ, UNI.UKZN, UNI.NWU, UNI.UFS],
  },
];

// Render
const wrap = document.getElementById("coursesWrap");
const search = document.getElementById("courseSearch");
const resultsCount = document.getElementById("resultsCount");

function cardTemplate(course) {
  const uniChips = course.unis.map(u =>
    `<a class="chip" href="${u.url}" target="_blank" rel="noopener noreferrer">${u.name}</a>`
  ).join("");

  return `
    <article class="course-card">
      <div class="course-head">
        <h3>${course.title}</h3>
        <div class="course-aps">${course.aps}</div>
      </div>
      <p class="muted">${course.note}</p>
      <div class="chips">${uniChips}</div>
    </article>
  `;
}

function render(list) {
  wrap.innerHTML = list.map(cardTemplate).join("");
  resultsCount.textContent = `${list.length} course categories`;
}

function normalize(s){ return (s || "").toLowerCase().trim(); }

render(COURSES);

search?.addEventListener("input", (e) => {
  const q = normalize(e.target.value);
  if (!q) return render(COURSES);

  const filtered = COURSES.filter(c =>
    normalize(c.title).includes(q) ||
    normalize(c.note).includes(q) ||
    normalize(c.aps).includes(q) ||
    c.unis.some(u => normalize(u.name).includes(q))
  );

  render(filtered);
});