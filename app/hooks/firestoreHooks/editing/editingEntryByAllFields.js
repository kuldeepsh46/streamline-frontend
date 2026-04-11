import { getFirestore, collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";

/**
 * Edits entries in a Firestore collection based on matching parameters, batching updates into a single request.
 * @param {string} collectionName - The Firestore collection name.
 * @param {Object} matchParams - An object with key-value pairs to match entries.
 * @param {Object} updateData - An object with key-value pairs to update the matched entries.
 */
export const editingMatchingEntriesByAllFields = async ({collectionName, matchParams, updateData}) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, collectionName);

    // If we're querying by ID, handle it differently
    if (matchParams.id) {
      console.log("HININI",matchParams)
      const docRef = doc(db, collectionName, matchParams.id);
      await writeBatch(db).update(docRef, updateData).commit();
      console.log(`Document with ID ${matchParams.id} updated successfully.`);
      return;
    }

    // Build the query based on matchParams
    let q = query(colRef);
    for (const [key, value] of Object.entries(matchParams)) {
      q = query(q, where(key, "==", value));
    }

    // Execute the query to find matching documents
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents found.");
      return;
    }

    // Initialize a write batch
    const batch = writeBatch(db);

    // Add each matching document update to the batch
    querySnapshot.forEach((docSnapshot) => {
      const docRef = doc(db, collectionName, docSnapshot.id);
      batch.update(docRef, updateData);
    });

    // Commit the batch
    await batch.commit();
    console.log(`${querySnapshot.size} document(s) updated successfully.`);
  } catch (error) {
    console.error("Error updating Firestore entries:", error);
  }
};
