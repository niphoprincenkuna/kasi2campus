import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const signupBtn = document.getElementById("signup-btn");
const errorMsg = document.getElementById("error-msg");

signupBtn.addEventListener("click", async () => {
  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  errorMsg.textContent = "";

  if (!fullName || !email || !password || !confirmPassword) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords don't match.";
    return;
  }

  try {
    // 1. Create the login account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Create their profile document - role is hardcoded to "learner" here,
    // and our Firestore rules will also enforce this server-side so nobody
    // can sign up as an admin by editing the request.
    await setDoc(doc(db, "users", uid), {
      fullName,
      email,
      role: "learner",
      createdAt: new Date().toISOString()
    });

    // 3. Send them straight to their dashboard
    window.location.href = "learner.html";

  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      errorMsg.textContent = "An account with this email already exists.";
    } else if (error.code === "auth/invalid-email") {
      errorMsg.textContent = "Please enter a valid email address.";
    } else {
      errorMsg.textContent = "Something went wrong. Please try again.";
    }
  }
});