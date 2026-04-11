import { getFirestore, collection, getDocs } from "firebase/firestore";

export const getAllEntries = async ({ collectionName }) => {
    try {
        const db = getFirestore(); // Initialize Firestore instance
        const colRef = collection(db, collectionName);
    
        // Execute the query and retrieve all documents
        const querySnapshot = await getDocs(colRef);
    
        // Map results into an array of data objects
        const results = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID
            ...doc.data(), // Include the document data
        }));
    
        return results; // Return the array of all entries
    } catch (error) {
        console.error("Error fetching entries:", error);
        throw error; // Rethrow the error for further handling
    }
};
