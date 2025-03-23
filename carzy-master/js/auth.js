import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, updateProfile, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDxxKFwj3K8xXfhR8Z_NDzkbbT-3LgSPBg", 
    authDomain: "carzy-7b6e3.firebaseapp.com",
    projectId: "carzy-7b6e3",
    storageBucket: "carzy-7b6e3.appspot.com",
    messagingSenderId: "765217283133",
    appId: "1:765217283133:web:7b6b1dbf1276c5d8191e54",
    measurementId: "G-XS3EYFWM36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User signed in:", user.email);
        await updateUIForSignedInUser(user);
    } else {
        console.log("User signed out");
        updateUIForSignedOutUser();
    }
});

// Handle login
const loginForm = document.getElementById("login-form");
loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user.email);
        window.location.href = "../index.html";
    } catch (error) {
        handleAuthError(error, errorMessage);
    }
});

// Handle signup
const signupForm = document.getElementById("signup-form");
signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        console.log("User signed up and profile updated");
        window.location.href = "../index.html";
    } catch (error) {
        handleAuthError(error, errorMessage);
    }
});

// Google Sign-In
const googleLoginBtn = document.getElementById("google-login");
const googleSignupBtn = document.getElementById("google-signup");

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google sign-in successful:", result.user.email);
        window.location.href = "../index.html";
    } catch (error) {
        console.error("Google sign-in error:", error);
        document.getElementById("error-message").textContent = "Google sign-in failed. Please try again.";
    }
};

googleLoginBtn?.addEventListener("click", signInWithGoogle);
googleSignupBtn?.addEventListener("click", signInWithGoogle);

// Forgot Password
const forgotPasswordLink = document.getElementById("forgot-password");
forgotPasswordLink?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (!email) {
        errorMessage.textContent = "Please enter your email address.";
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showNotification("Password reset email sent. Check your inbox.", "success");
    } catch (error) {
        console.error("Password reset error:", error);
        errorMessage.textContent = "Failed to send password reset email. Please try again.";
    }
});

// Update UI when user signs in
async function updateUIForSignedInUser(user) {
    const nav = document.querySelector(".nav ul");
    if (nav && !document.querySelector(".user-profile-link")) {
        const profileLi = document.createElement("li");
        profileLi.classList.add("user-profile-link");
        profileLi.innerHTML = `<a href="#"><i class="fas fa-user"></i> ${user.displayName || user.email.split("@")[0]}</a>`;
        nav.appendChild(profileLi);
    }
    localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email, displayName: user.displayName }));
}

// Update UI when user signs out
function updateUIForSignedOutUser() {
    document.querySelector(".user-profile-link")?.remove();
    localStorage.removeItem("user");
}

// Handle Authentication Errors
function handleAuthError(error, errorMessageElement) {
    const errorMessages = {
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/user-not-found": "No account found with this email. Please sign up.",
        "auth/invalid-email": "Invalid email address.",
        "auth/email-already-in-use": "This email is already in use. Try logging in.",
        "auth/weak-password": "Password is too weak. Use at least 6 characters.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
        "auth/popup-closed-by-user": "Google sign-in popup closed before authentication.",
    };
    errorMessageElement.textContent = errorMessages[error.code] || "An error occurred. Please try again.";
    console.error("Auth error:", error);
}
