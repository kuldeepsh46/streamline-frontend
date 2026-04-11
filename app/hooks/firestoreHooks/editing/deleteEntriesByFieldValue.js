import { getFirestore, collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";

/**
 * Deletes entries in a Firestore collection based on a list of field values.
 * @param {string} collectionName - The Firestore collection name.
 * @param {string} fieldName - The name of the field to match.
 * @param {Array} values - The list of field values to delete.
 */
export const deleteEntriesByFieldValues = async ({ collectionName, fieldName, values }) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, collectionName);

    // Split the values into batches to handle Firestore's query limitations
    const batchSize = 10; // Firestore allows "in" queries with up to 10 values
    const batches = [];
    for (let i = 0; i < values.length; i += batchSize) {
      batches.push(values.slice(i, i + batchSize));
    }

    const batch = writeBatch(db);

    for (const valueBatch of batches) {
      // Build the query with "where in" clause
      const q = query(colRef, where(fieldName, "in", valueBatch));

      // Execute the query to find matching documents
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((docSnapshot) => {
          const docRef = doc(db, collectionName, docSnapshot.id);
          batch.delete(docRef);
        });
      }
    }

    // Commit the batch
    await batch.commit();
    console.log(`Documents matching ${fieldName} values deleted successfully.`);
  } catch (error) {
    console.error("Error deleting Firestore entries:", error);
  }
};
