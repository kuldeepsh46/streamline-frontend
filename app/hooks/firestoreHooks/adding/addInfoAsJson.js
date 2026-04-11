import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/components/firebaseClient";

export const addInfoAsJson = async ({ jsonInfo, collectionName }) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...jsonInfo,
    });
    console.log(`${collectionName} info added successfully with ID: ${docRef.id}`);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding account info: ", error);
    throw error; // Re-throw the error for caller to handle if needed
  }
};
