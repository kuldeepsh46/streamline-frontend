import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../components/firebaseClient"; // Adjust the import path to your Firebase config file
  
const addAccountDetails = async ({accountData}) => {
    try {
      // Validate fields in accountData
      const accountCollection = collection(db, "Account"); // Change 'accounts' to your desired collection name
      const newDocRef = doc(accountCollection); // Auto-generate a document ID
      
      
      await setDoc(newDocRef, {
        accountType: accountData.accountType,
        dateJoined: accountData.dateJoined,
        emailAddress: accountData.emailAddress.toLowerCase(),
        firebaseId: accountData.firebaseId,
        fullName: accountData.fullName,
        phoneNumber: accountData.phoneNumber,
        smsAgreement: accountData.smsAgreement
      });
  
    } catch (error) {
      console.error("Error adding account: ", error);
    }
  };
  
  const addAccountDependants = async (
    {dependantsList, firebaseId}
  ) => {
    try {
  
      const dependantsCollection = collection(db, "accountDependants"); // Adjust the collection name as needed
  
      const addPromises = dependantsList.map(async (dependant) => {
        await addDoc(dependantsCollection, {
          accountFirebaseId: firebaseId,
          dateOfBirth: dependant.dateOfBirth, // Ensure this is a Date object
          fullName: dependant.fullName,
          isMinor: dependant.isMinor, // Boolean value
        });
      });
  
      await Promise.all(addPromises); // Wait for all additions to complete
      console.log("All dependants added successfully!");
    } catch (error) {
      console.error("Error adding dependants: ", error);
    }
  };

export {addAccountDetails, addAccountDependants}