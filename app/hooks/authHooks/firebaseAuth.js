import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  sendPasswordResetEmail 
} from "firebase/auth";

// IMPORT ONLY ONCE: Using the client path which is usually the primary init file
import { auth } from "../../components/firebaseClient"; 

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Signup
export const emailSignUp = async ({ email, password, setLoadingNewPage, noLoading }) => {
  try {
    if (!noLoading) { setLoadingNewPage(true); }
    const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
    return userCredential.user;
  } catch (error) {
    if (setLoadingNewPage) setLoadingNewPage(false);
    console.error("Signup Error: ", error.message);
    throw error;
  }
};

// Reset Password
export const resetPasword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset ok!", email);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Login
export const emailLogin = async ({ email, password, setLoadingNewPage, noLoading }) => {
  try {
    if (!noLoading) { setLoadingNewPage(true); }
    const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
    return userCredential.user;
  } catch (error) {
    if (setLoadingNewPage) setLoadingNewPage(false);
    console.error("Login Error: ", error.message);
    throw error;
  }
};

// Logout
export const logout = async (router, setLoadingNewPage) => {
  try {
    if (setLoadingNewPage) setLoadingNewPage(true);

    // 1. Perform the sign out first and wait for it to finish
    await signOut(auth);

    // 2. Redirect to the home page using href to force a full state clear
    // This solves the issue of being "stuck" on a dashboard domain
    window.location.href = "/"; 
    
  } catch (error) {
    if (setLoadingNewPage) setLoadingNewPage(false);
    console.error("Logout Error: ", error.message);
    throw error;
  }
};

// Monitor Auth State
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};