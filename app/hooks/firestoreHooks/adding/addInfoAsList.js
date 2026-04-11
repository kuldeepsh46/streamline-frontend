import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/app/components/firebaseClient";

export const addListOfJsons = async ({ jsonList, collectionName }) => {
  try {
    // Initialize a write batch
    const batch = writeBatch(db);

    // Reference the collection
    const collRef = collection(db, collectionName);

    // Add each JSON to the batch
    const docRefs = jsonList.map((jsonInfo) => {
      const docRef = doc(collRef); // Auto-generate a document ID
      batch.set(docRef, jsonInfo); // Add the document to the batch
      return docRef;
    });

    // Commit the batch
    await batch.commit();

    console.log(`${collectionName} info added successfully with IDs:`, docRefs.map((ref) => ref.id));

    // Return the list of document IDs
    return docRefs.map((ref) => ref.id);
  } catch (error) {
    console.error("Error adding list of JSONs: ", error);
    throw error; // Re-throw the error for caller to handle if needed
  }
};


export function generateJsonList (iterableList, listName, ...manualFields) {
  const manualFieldsObject = Object.assign({}, ...manualFields);
  
  return iterableList.map(item => ({
    ...manualFieldsObject,
    [listName]: item
  }));
}

export function generateJsonListGivenJsons (iterableList, ...manualFields) {
  const manualFieldsObject = Object.assign({}, ...manualFields);
  
  return iterableList.map(item => ({
    ...manualFieldsObject,
    ...item
  }));
}

