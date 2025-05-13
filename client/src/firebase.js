// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvQ3SE9P67yPdq04N3HDn-Ouniv7UbpIc",
  authDomain: "parvaaz-eb580.firebaseapp.com",
  projectId: "parvaaz-eb580",
  storageBucket: "parvaaz-eb580.firebasestorage.app",
  messagingSenderId: "539663195939",
  appId: "1:539663195939:web:1fc1dadac1281b6778b696",
  measurementId: "G-5PZTM0LW35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the Firebase Auth instance
export const auth = getAuth(app);
