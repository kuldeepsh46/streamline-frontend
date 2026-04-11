import { useAuth } from "@/app/contexts/AuthContext";
import { auth } from "../../components/firebaseClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation"
// Signup
export const emailSignUp = async ({email, password,setLoadingNewPage,noLoading}) => {
  try {
    if(!noLoading){setLoadingNewPage(true)}
    const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
    return userCredential.user;
  } catch (error) {
    setLoadingNewPage(false)
    console.error("Signup Error: ", error.message);
    throw error;
  }
};

export const resetPasword = async(email) => {
  try{

    await sendPasswordResetEmail(auth,email)
    console.log("Password reset ok!",email)
    return(true)
  }catch(error){
    console.log(error)
    return(false)
  }
}

// Login
export const emailLogin = async ({email, password,setLoadingNewPage,noLoading}) => {
  
  try {
    if(!noLoading){setLoadingNewPage(true)}
    const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
    return userCredential.user;
  } catch (error) {
    setLoadingNewPage(false)
    console.error("Login Error: ", error.message);
    throw error;
  }
};

// Logout
export const logout = async (router,setLoadingNewPage) => {
  try {
    setLoadingNewPage(true)
    router.push("/")
    window.location.reload()
    await signOut(auth);
  } catch (error) {
    setLoadingNewPage(false)
    console.error("Logout Error: ", error.message);
    throw error;
  }
};

// Monitor Auth State
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};
