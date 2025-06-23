import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

//firebase ko config
const firebaseConfig = {
  apiKey: "AIzaSyDDsTfFdss-jes9NQx8GdFmrNkIfoMvqvk",
  authDomain: "carecue-eaeab.firebaseapp.com",
  projectId: "carecue-eaeab",
  storageBucket: "carecue-eaeab.appspot.com",
  messagingSenderId: "1005001160049",
  appId: "1:1005001160049:web:a7374dfe3a13fcc60332d0",
  measurementId: "G-30F2XNYXNC"
};

//firebase initialize huncha
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


setPersistence(auth, browserSessionPersistence)
.then (()=> {
    console.log("Session persistence enabled");
})
.catch((error) => {
    console.error ("Persistence error:",error);
});

//elements haru
const signUpButton = document.getElementById ('signUpButton');
const signInButton = document.getElementById ('signInButton');
const signUpForm = document.getElementById ('signUp');
const signInForm = document.getElementById ('signIn');
const registerForm = document.getElementById ('registerForm');
const signInFormElement = document.getElementById ('signInForm');


//form ko lagi toggle

signUpButton.addEventListener ('click', () => {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});


signInButton.addEventListener ('click', () => {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});


//sign up

registerForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const fName = document.getElementById("fName").value.trim();
    const lName = document.getElementById("lName").value.trim();
    const email = document.getElementById ("email").value.trim();
    const password = document.getElementsById("password").value;

    if (!fName || lName || !email || !password){
        alert("Please fill in all fields");
        return ;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then ((userCredential)=> {
        alert("User registered successfully!");
        window.location.href = "welcome.html";
    });
    .catch((error) => {
        console.error("Signup error:", error.code);
        alert("Error signing up: " + error.message);
    });
});

//sign in

signInFormElement.addEventListener('submit', (e)=> {
    e.preventDefault();
    const email= document.getElementById ("signInEmail").value.trim();
    const password = document.getElementById("signInPassword").value;

    if (!email || !password){
        alert ("please enter email and password");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        alert("Signed in successfully!");
        window.location.href = "welcone.html";
    })
    .catch((error) => {
        console.error("Signin error:",error.code,error.message);
        alert("Error signing in: " + error.message);
    });

});








