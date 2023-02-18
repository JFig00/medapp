import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase app/project config for authentication. 
const firebaseConfig = {
    apiKey: "AIzaSyAURHiWtahS4FpIRmaL_m-ilzyHbUvPaFA",
    authDomain: "palmacology.firebaseapp.com",
    projectId: "palmacology",
    storageBucket: "palmacology.appspot.com",
    messagingSenderId: "768139741786",
    appId: "1:768139741786:web:655e306e64d5418ec9e663",
    measurementId: "G-1MZBK9CH06"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); //exporting so can be used in other components for auth
