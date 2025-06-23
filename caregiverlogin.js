import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDDsTfFdss-jes9NQx8GdFmrNkIfoMvqvk",
  authDomain: "carecue-eaeab.firebaseapp.com",
  projectId: "carecue-eaeab",
  storageBucket: "carecue-eaeab.firebasestorage.app",
  messagingSenderId: "1005001160049",
  appId: "1:1005001160049:web:a7374dfe3a13fcc60332d0",
  measurementId: "G-30F2XNYXNC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence).then(() => {
  console.log("Session persistence enabled");
}).catch((error) => {
  console.error("Persistence error:", error);
});


const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const registerForm = document.getElementById('registerForm');
const signInFormElement = document.getElementById('signInForm');

signUpButton.addEventListener('click', () => {
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
});

signInButton.addEventListener('click', () => {
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
});


registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fName = document.getElementById("fName").value.trim();
  const lName = document.getElementById("lName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const linkedUserEmail = document.getElementById("linkedUserEmail").value.trim();

  if (!fName || !lName || !email || !password || !linkedUserEmail) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Caregiver registered successfully!");

   
    window.location.href = "caregiver.html";

  } catch (error) {
    console.error("Signup error:", error.code, error.message);
    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already registered.");
    } else {
      alert("Error signing up: " + error.message);
    }
  }
});


signInFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Signed in successfully!");
    window.location.href = "caregiver.html"; 
  } catch (error) {
    console.error("Signin error:", error.code, error.message);
    alert("Error signing in: " + error.message);
  }
});
