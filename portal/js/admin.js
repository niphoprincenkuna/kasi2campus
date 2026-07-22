import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { encryptPassword, decryptPassword } from "./crypto-helper.js";

const formMsg = document.getElementById("form-msg");
const tableBody = document.getElementById("applications-body");
const addBtn = document.getElementById("add-btn");
const learnerList = document.getElementById("learner-list");
const learnerSearch = document.getElementById("learner-search");
const showAllBtn = document.getElementById("show-all-btn");
const dashboardTitle = document.getElementById("dashboard-title");

const updateMsg = document.getElementById("update-msg");
const sendUpdateBtn = document.getElementById("send-update-btn");
const updatesBody = document.getElementById("updates-body");

let editingId = null;
let allLearners = [];
let activeLearnerEmail = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  if (!userDocSnap.exists() || userDocSnap.data().role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  loadLearners();
  loadApplications();
  loadUpdates();
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// ---------- Learner sidebar ----------

async function loadLearners() {
  const q = query(collection(db, "users"), where("role", "==", "learner"));
  const snapshot = await getDocs(q);

  allLearners = [];
  snapshot.forEach((docSnap) => {
    allLearners.push(docSnap.data());
  });

  renderLearnerList(allLearners);
}

function renderLearnerList(learners) {
  learnerList.innerHTML = "";

  if (learners.length === 0) {
    learnerList.innerHTML = `<li style="cursor: default;">No learners yet.</li>`;
    return;
  }

  learners.forEach((learner) => {
    const li = document.createElement("li");
    li.classList.toggle("active", learner.email === activeLearnerEmail);
    li.innerHTML = `
      <span class="learner-name">${learner.fullName || "(no name)"}</span>
      <span class="learner-email">${learner.email}</span>
    `;
    li.addEventListener("click", () => {
      activeLearnerEmail = learner.email;
      document.getElementById("learner-email").value = learner.email;
      document.getElementById("update-learner-email").value = learner.email;
      dashboardTitle.textContent = `Applications - ${learner.fullName || learner.email}`;
      loadApplications(learner.email);
      loadUpdates(learner.email);
      renderLearnerList(allLearners);
    });
    learnerList.appendChild(li);
  });
}

learnerSearch.addEventListener("input", () => {
  const term = learnerSearch.value.toLowerCase();
  const filtered = allLearners.filter((l) =>
    (l.fullName || "").toLowerCase().includes(term) ||
    l.email.toLowerCase().includes(term)
  );
  renderLearnerList(filtered);
});

showAllBtn.addEventListener("click", () => {
  activeLearnerEmail = null;
  dashboardTitle.textContent = "Admin Dashboard";
  loadApplications();
  loadUpdates();
  renderLearnerList(allLearners);
});

// ---------- Add / Update application ----------

addBtn.addEventListener("click", async () => {
  const learnerEmail = document.getElementById("learner-email").value.trim();
  const university = document.getElementById("university").value.trim();
  const studentNumber = document.getElementById("student-number").value.trim();
  const uniPasswordInput = document.getElementById("uni-password").value.trim();
  const status = document.getElementById("status").value;

  if (!learnerEmail || !university || !studentNumber || !uniPasswordInput) {
    formMsg.textContent = "Please fill in all fields.";
    formMsg.style.color = "red";
    return;
  }

  try {
    const encryptedPassword = encryptPassword(uniPasswordInput);

    if (editingId) {
      await updateDoc(doc(db, "applications", editingId), {
        learnerEmail,
        university,
        studentNumber,
        uniPassword: encryptedPassword,
        status
      });
      formMsg.textContent = "Application updated!";
      exitEditMode();
    } else {
      await addDoc(collection(db, "applications"), {
        learnerEmail,
        university,
        studentNumber,
        uniPassword: encryptedPassword,
        status,
        createdAt: new Date().toISOString()
      });
      formMsg.textContent = "Application added!";
    }

    formMsg.style.color = "green";
    clearForm();
    loadApplications(activeLearnerEmail);

  } catch (error) {
    console.error(error);
    formMsg.textContent = "Something went wrong.";
    formMsg.style.color = "red";
  }
});

function clearForm() {
  document.getElementById("learner-email").value = activeLearnerEmail || "";
  document.getElementById("university").value = "";
  document.getElementById("student-number").value = "";
  document.getElementById("uni-password").value = "";
  document.getElementById("status").value = "pending";
}

function exitEditMode() {
  editingId = null;
  addBtn.textContent = "Add Application";
}

// ---------- Applications table ----------

async function loadApplications(filterEmail = null) {
  tableBody.innerHTML = "";

  let snapshot;
  if (filterEmail) {
    const q = query(collection(db, "applications"), where("learnerEmail", "==", filterEmail));
    snapshot = await getDocs(q);
  } else {
    snapshot = await getDocs(collection(db, "applications"));
  }

  if (snapshot.empty) {
    tableBody.innerHTML = `<tr><td colspan="5">No applications found.</td></tr>`;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.learnerEmail}</td>
      <td>${data.university}</td>
      <td>${data.studentNumber}</td>
      <td><span class="status-badge status-${data.status}">${data.status}</span></td>
      <td>
        <button class="edit-btn" data-id="${id}">Edit</button>
        <button class="delete-btn" data-id="${id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const docSnap = await getDoc(doc(db, "applications", id));
      const data = docSnap.data();

      document.getElementById("learner-email").value = data.learnerEmail;
      document.getElementById("university").value = data.university;
      document.getElementById("student-number").value = data.studentNumber;
      document.getElementById("uni-password").value = decryptPassword(data.uniPassword);
      document.getElementById("status").value = data.status;

      editingId = id;
      addBtn.textContent = "Update Application";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmed = confirm("Delete this application? This can't be undone.");
      if (!confirmed) return;

      await deleteDoc(doc(db, "applications", id));
      loadApplications(activeLearnerEmail);
    });
  });
}

// ---------- Send update / alert to learner ----------

sendUpdateBtn.addEventListener("click", async () => {
  const learnerEmail = document.getElementById("update-learner-email").value.trim();
  const university = document.getElementById("update-university").value.trim();
  const message = document.getElementById("update-message").value.trim();

  if (!learnerEmail || !message) {
    updateMsg.textContent = "Please enter the learner's email and a message.";
    updateMsg.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "updates"), {
      learnerEmail,
      university: university || null,
      message,
      read: false,
      createdAt: new Date().toISOString()
    });

    updateMsg.textContent = "Update sent!";
    updateMsg.style.color = "green";

    document.getElementById("update-university").value = "";
    document.getElementById("update-message").value = "";

    loadUpdates(activeLearnerEmail);

  } catch (error) {
    console.error(error);
    updateMsg.textContent = "Something went wrong.";
    updateMsg.style.color = "red";
  }
});

async function loadUpdates(filterEmail = null) {
  updatesBody.innerHTML = "";

  let snapshot;
  try {
    if (filterEmail) {
      const q = query(collection(db, "updates"), where("learnerEmail", "==", filterEmail), orderBy("createdAt", "desc"));
      snapshot = await getDocs(q);
    } else {
      const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));
      snapshot = await getDocs(q);
    }
  } catch (error) {
    // Fallback in case a composite index hasn't been created yet for the filtered query
    console.error(error);
    const q = collection(db, "updates");
    snapshot = await getDocs(q);
  }

  if (snapshot.empty) {
    updatesBody.innerHTML = `<tr><td colspan="5">No updates sent yet.</td></tr>`;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.learnerEmail}</td>
      <td>${data.university || "-"}</td>
      <td>${data.message}</td>
      <td>${data.read ? '<span class="status-badge status-accepted">Read</span>' : '<span class="status-badge status-pending">Unread</span>'}</td>
      <td><button class="delete-update-btn" data-id="${id}">Delete</button></td>
    `;
    updatesBody.appendChild(row);
  });

  document.querySelectorAll(".delete-update-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmed = confirm("Delete this update?");
      if (!confirmed) return;

      await deleteDoc(doc(db, "updates", id));
      loadUpdates(activeLearnerEmail);
    });
  });
}
