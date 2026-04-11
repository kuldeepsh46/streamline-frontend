import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export const batchedGetEntriesByConditions = async ({queriesWithKeys}) => {
  try {
    const db = getFirestore(); // Initialize Firestore instance
    
    // Helper function to process a single query
    const processQuery = async ({ collectionName, conditions }) => {
      const colRef = collection(db, collectionName);

      // Check if there's an `id` condition
      const idCondition = conditions.find(({ field }) => field === "id");
      if (idCondition) {
        const { value: idValue } = idCondition;
        const docRef = doc(db, collectionName, idValue);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          ["start", "end", "createdOn"].forEach((field) => {
            if (data[field] && typeof data[field].toDate === "function") {
              data[field] = data[field].toDate();
            }
          });
          return [{ id: docSnapshot.id, ...data }];
        }
        return [];
      }

      // Build the query for non-ID conditions
      let q = query(colRef);
      conditions.forEach(({ field, operator, value }) => {
        if (field !== "id") {
          let queryValue = value;
          if (value instanceof Date) {
            if (operator === "<") {
              queryValue = new Date(value.setHours(23, 59, 59, 999));
            } else if (operator === ">") {
              queryValue = new Date(value.setHours(0, 0, 0, 0));
            }
          }
          q = query(q, where(field, operator, queryValue));
        }
      });

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        ["start", "end", "createdOn"].forEach((field) => {
          if (data[field] && typeof data[field].toDate === "function") {
            data[field] = data[field].toDate();
          }
        });
        return { id: doc.id, ...data };
      });
    };

    // Execute all queries in parallel and map results to their keys
    const results = await Promise.all(
      queriesWithKeys.map(async ({ key, queryConfig }) => ({
        key,
        data: await processQuery(queryConfig),
      }))
    );

    // Convert results into an object with keys mapping to their data
    return results.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching entries with batch conditions and keys:", error);
    throw error;
  }
};
