import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginBtn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  errorMsg.textContent = "";

  if (!email || !password) {
    errorMsg.textContent = "Please enter both email and password.";
    errorMsg.style.color = "#F4511E";
    return;
  }

  try {
    // Step A: sign the user in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Step B: look up their role in Firestore (admin or learner)
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      errorMsg.textContent = "No profile found for this account. Contact admin.";
      errorMsg.style.color = "#F4511E";
      return;
    }

    const userData = userDocSnap.data();

    // Step C: redirect based on role
    if (userData.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "learner.html";
    }

  } catch (error) {
    console.error(error);
    errorMsg.textContent = "Invalid email or password.";
    errorMsg.style.color = "#F4511E";
  }
});

// ---------- Forgot password ----------

document.getElementById("forgot-password-link").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    errorMsg.textContent = "Enter your email above first, then click 'Forgot password?'";
    errorMsg.style.color = "#F4511E";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    errorMsg.textContent = "Password reset email sent! Check your inbox.";
    errorMsg.style.color = "green";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      // For privacy, don't reveal whether the email exists or not
      errorMsg.textContent = "If that email is registered, a reset link has been sent.";
      errorMsg.style.color = "green";
    } else {
      errorMsg.textContent = "Something went wrong. Please try again.";
      errorMsg.style.color = "#F4511E";
    }
  }
});