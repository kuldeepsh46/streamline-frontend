import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export const getEntriesByMatching = async({collectionName,fields}) => {

    try {
        const db = getFirestore(); // Initialize Firestore instance
        const colRef = collection(db, collectionName);
    
        // Create query based on fields
        let q = query(colRef);
        for (const [key, value] of Object.entries(fields)) {
          q = query(q, where(key, "==", value));
        }
    
        // Execute the query and retrieve matching documents
        const querySnapshot = await getDocs(q);
    
        // Map results into an array of data objects
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Include the document data
        }));
    
        return results; // Return the array of matching entries
      } catch (error) {
        console.error("Error fetching matching entries:", error);
        throw error; // Rethrow the error for further handling
      }
}