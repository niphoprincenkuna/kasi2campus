import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { decryptPassword } from "./crypto-helper.js";

const tableBody = document.getElementById("applications-body");
const updatesList = document.getElementById("updates-list");
const unreadCount = document.getElementById("unread-count");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadMyApplications(user.email);
  loadMyUpdates(user.email);
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
      <td>${decryptPassword(data.uniPassword)}</td>
      <td><span class="status-badge status-${data.status}">${data.status}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

async function loadMyUpdates(email) {
  updatesList.innerHTML = "";

  let snapshot;
  try {
    const q = query(collection(db, "updates"), where("learnerEmail", "==", email), orderBy("createdAt", "desc"));
    snapshot = await getDocs(q);
  } catch (error) {
    console.error(error);
    const q = query(collection(db, "updates"), where("learnerEmail", "==", email));
    snapshot = await getDocs(q);
  }

  if (snapshot.empty) {
    updatesList.innerHTML = `<p class="no-updates">No updates right now.</p>`;
    unreadCount.style.display = "none";
    return;
  }

  let unread = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;
    if (!data.read) unread++;

    const card = document.createElement("div");
    card.className = "update-card" + (data.read ? "" : " unread");
    card.innerHTML = `
      <div class="update-top">
        <span class="update-university">${data.university ? data.university : "General"}</span>
        ${data.read ? "" : '<span class="new-dot"></span>'}
      </div>
      <p class="update-message">${data.message}</p>
      <span class="update-date">${new Date(data.createdAt).toLocaleDateString()}</span>
    `;

    card.addEventListener("click", async () => {
      if (!data.read) {
        await updateDoc(doc(db, "updates", id), { read: true });
        loadMyUpdates(email);
      }
    });

    updatesList.appendChild(card);
  });

  if (unread > 0) {
    unreadCount.textContent = unread;
    unreadCount.style.display = "inline-block";
  } else {
    unreadCount.style.display = "none";
  }
}
