import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/components/firebaseClient";

const getDataWithTeamId = async ({ id }) => {
  try {
    // Step 1: Retrieve data from CollectionA by document ID
    const collectionARef = collection(db, "CollectionA");
    const collectionAQuery = query(collectionARef, where("id", "==", id)); // Query by ID
    const collectionASnapshot = await getDocs(collectionAQuery);

    if (collectionASnapshot.empty) {
      console.log(`No document found in CollectionA with id: ${id}`);
      return null;
    }

    const collectionADoc = collectionASnapshot.docs[0]; // Assuming ID is unique
    const collectionAData = collectionADoc.data();

    // Step 2: Extract teamId from the CollectionA document
    const teamId = collectionAData.teamId;
    if (!teamId) {
      console.log(`No teamId found in document with id: ${id}`);
      return null;
    }

    // Step 3: Fetch data from multiple collections using teamId
    const collectionBRef = collection(db, "CollectionB");
    const collectionCRef = collection(db, "CollectionC");
    const collectionDRef = collection(db, "CollectionD");

    const queries = [
      query(collectionBRef, where("teamId", "==", teamId)),
      query(collectionCRef, where("teamId", "==", teamId)),
      query(collectionDRef, where("teamId", "==", teamId)),
    ];

    // Execute all queries in parallel
    const [collectionBSnapshot, collectionCSnapshot, collectionDSnapshot] = await Promise.all(
      queries.map((q) => getDocs(q))
    );

    // Transform Firestore snapshots into arrays of data
    const collectionBData = collectionBSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const collectionCData = collectionCSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const collectionDData = collectionDSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Step 4: Combine and return the results
    const combinedData = {
      collectionA: { id: collectionADoc.id, ...collectionAData },
      collectionB: collectionBData,
      collectionC: collectionCData,
      collectionD: collectionDData,
    };

    console.log("Combined Data:", combinedData);
    return combinedData;
  } catch (error) {
    console.error("Error retrieving data with teamId:", error);
    throw error;
  }
};

export default getDataWithTeamId;
