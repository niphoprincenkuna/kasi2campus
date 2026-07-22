import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tableBody = document.getElementById("applications-body");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadMyApplications(user.email);
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

async function loadMyApplications(email) {
  tableBody.innerHTML = "";

  const q = query(collection(db, "applications"), where("learnerEmail", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    tableBody.innerHTML = `<tr><td colspan="4">No applications found yet.</td></tr>`;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.university}</td>
      <td>${data.studentNumber}</td>
      <td>${data.uniPassword}</td>
      <td>${data.status}</td>
    `;
    tableBody.appendChild(row);
  });
}
row.innerHTML = `
      ...
      <td>${data.status}</td>
    `;