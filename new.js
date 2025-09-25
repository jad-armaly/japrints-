// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPxXppSkqEoH7F4fEHSzRwjCIrAttTndo",
  authDomain: "japrints-6f754.firebaseapp.com",
  projectId: "japrints-6f754",
  storageBucket: "japrints-6f754.firebasestorage.app",
  messagingSenderId: "292756405814",
  appId: "1:292756405814:web:bde4f61caef7c23e732297",
  measurementId: "G-NNQDV3HSXN"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const referrer = urlParams.get("ref") || "none";

  if (!email) return alert("Please enter a valid email.");

  try {
    // Check if user already exists
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Save new user
      await setDoc(userRef, {
        email: email,
        referrer: referrer,
        referrals: 0,
        joinedAt: new Date().toISOString()
      });

      // If referred, increment referrer's count
      if (referrer !== "none") {
        const referrerRef = doc(db, "users", referrer);
        await updateDoc(referrerRef, { referrals: increment(1) });
      }
    }

    // Fetch updated user data
    const updatedUserSnap = await getDoc(userRef);
    const userData = updatedUserSnap.data();

    // Show referral link & count
    const referralLink = `${window.location.origin}?ref=${encodeURIComponent(email)}`;
    document.getElementById("referralLink").innerText = referralLink;
    document.getElementById("referralCount").innerText = userData.referrals;
    document.getElementById("referralBox").style.display = "block";

    alert("Thanks for signing up! Share your referral link.");
  } catch (err) {
    console.error("Error: ", err);
    alert("Something went wrong. Try again.");
  }
});
