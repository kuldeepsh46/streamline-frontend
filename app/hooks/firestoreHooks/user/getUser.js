import { collection, query, where, getDocs, QueryStartAtConstraint } from "firebase/firestore";
import { db } from "@/app/components/firebaseClient";

const getUserByFirebaseId = async ({firebaseId}) => {
  try {
    const accountCollection = collection(db, "Account"); // Reference the 'Account' collection
    const q = query(accountCollection, where("firebaseId", "==", firebaseId)); // Query by firebaseId

    const querySnapshot = await getDocs(q); // Execute the query

    if (!querySnapshot.empty) {
      // Extract the document data
      const userDoc = querySnapshot.docs[0]; // Assuming firebaseId is unique
      const userData = userDoc.data();
      console.log("User found:", userData);
      return userData; // Return user data
    } else {
      console.log("No user found with the given firebaseId.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user by firebaseId:", error);
    throw error; // Re-throw error for further handling
  }
};

const getDependantsByFirebaseId = async ({ firebaseId }) => {
  try {
    const accountCollection = collection(db, "accountDependants"); // Reference the collection
    const q = query(accountCollection, where("accountFirebaseId", "==", firebaseId)); // Query by firebaseId

    const querySnapshot = await getDocs(q); // Execute the query

    if (!querySnapshot.empty) {
      // Extract data and include the auto-assigned Firebase document ID
      const dependants = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include Firebase auto-generated ID
        ...doc.data() // Spread the rest of the document fields
      }));
      
      console.log("Dependants found:", dependants);
      return dependants; // Return an array with document IDs included
    } else {
      console.log("No dependants found with the given firebaseId.");
      return []; // Return an empty array if no matches
    }
  } catch (error) {
    console.error("Error retrieving dependants by firebaseId:", error);
    throw error; // Re-throw error for further handling
  }
};


  export async function checkAccountExists({ value, valueType, accountType })  {
    try {
      // Reference the Account collection
      const accountCollection = collection(db, "Account");
      // Construct Firestore query based on valueType
      let q;
      if (accountType!="team")
      {
        q = query(
        accountCollection,
        where(valueType, "==", value), // Check for email or phone
        where("accountType", "in", ["guardian","individual"]) // Check for accountType
      );
      }else{
        q = query(
          accountCollection,
          where(valueType, "==", value), // Check for email or phone
          where("accountType", "==", accountType) // Check for accountType
        );
      }
  
      // Execute the query
      const querySnapshot = await getDocs(q);
      console.log("QUERY SNAPS", querySnapshot)
      // Return true if at least one document matches, otherwise false
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking account:", error);
      throw error;
    }
  }

export {getUserByFirebaseId, getDependantsByFirebaseId};