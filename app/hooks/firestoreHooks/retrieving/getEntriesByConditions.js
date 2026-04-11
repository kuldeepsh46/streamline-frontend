import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export const getEntriesByConditions = async ({
  collectionName,
  conditions,
}) => {
  try {
    const db = getFirestore(); // Initialize Firestore instance
    const colRef = collection(db, collectionName);

    // Check if searching by `id`
    const idCondition = conditions.find(({ field }) => field === "id");
    if (idCondition) {
      const { value: idValue } = idCondition;
      const docRef = doc(db, collectionName, idValue); // Reference specific document by ID
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Convert specific fields to Date if they are Timestamps
        ["start", "end", "createdOn"].forEach((field) => {
          if (data[field] && typeof data[field].toDate === "function") {
            data[field] = data[field].toDate(); // Convert to Date object
          }
        });

        return [{ id: docSnapshot.id, ...data }]; // Return array with the single matching entry
      }
      return []; // Return empty array if the document does not exist
    }

    // Create query based on conditions (excluding `id` condition)
    let q = query(colRef);
    conditions.forEach(({ field, operator, value }) => {
      
      if (field !== "id") { // Ignore `id` condition
        let queryValue = value;
        if (value instanceof Date) {
          // Handle date-based conditions
          if (operator === "<") {
            queryValue = new Date(value.setHours(23, 59, 59, 999)); // Before end of the day
          } else if (operator === ">") {
            queryValue = new Date(value.setHours(0, 0, 0, 0)); // After start of the day
          }
        }
        q = query(q, where(field, operator, queryValue));
      }
    });

    // Execute the query and retrieve matching documents
    const querySnapshot = await getDocs(q);

    // Map results into an array of data objects
    const results = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Convert specific fields to Date if they are Timestamps
      ["start", "end", "createdOn"].forEach((field) => {
        if (data[field] && typeof data[field].toDate === "function") {
          data[field] = data[field].toDate(); // Convert to Date object
        }
      });

      return {
        id: doc.id, // Include the document ID
        ...data, // Include the updated document data
      };
    });

    return results; // Return the array of matching entries
  } catch (error) {
    console.error("Error fetching entries with conditions:", error);
    throw error; // Rethrow the error for further handling
  }
};
