"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { monitorAuthState } from '../hooks/authHooks/firebaseAuth'; // Ensure this is correctly imported
import { getUserByFirebaseId, getDependantsByFirebaseId } from '../hooks/firestoreHooks/user/getUser';
import { getEntriesByMatching } from '../hooks/firestoreHooks/retrieving/getEntriesByMatching';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetchingUserInfo,setIsFetchingUserInfo]=useState(true)
  const [userInfo, setUserInfo] = useState({"userData":null, "otherAthletes":null});
  const [loadingNewPage,setLoadingNewPage]=useState(false)
  const [loadingNewPageMessage,setLoadingNewPageMessage]=useState("")
  const [noLoading,setNoLoading]=useState(false)
  useEffect(() => {
    const unsubscribe = monitorAuthState(async(currentUser) => {
      setUser(currentUser || null);

      if (currentUser){
      const userData = await getUserByFirebaseId({firebaseId:currentUser.uid})
      const otherAthletes = await getDependantsByFirebaseId({firebaseId:currentUser.uid})
        console.log("OTHER ATHLS", otherAthletes)
        if(otherAthletes){
        setUserInfo((prevInfo) => ({
        ...prevInfo, // Retain existing keys in the state object
        userData: userData,
        otherAthletes: otherAthletes,
        }))
        } else{
          setUserInfo((prevInfo) => ({
            ...prevInfo, // Retain existing keys in the state object
            userData: userData,
            otherAthletes:["nothing"]
            }))
        }
        
        if (userData.accountType=="team"){
          const teamInfo = await getEntriesByMatching({collectionName:"Team",fields:{firebaseId:currentUser.uid}})
          setUserInfo((prevInfo) => ({
            ...prevInfo, // Retain existing keys in the state object
            teamInfo: teamInfo[0],
            }))
        }
        setIsFetchingUserInfo(false)
      }else{
        setIsFetchingUserInfo(false)
      }
      
    });


    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userInfo, setUserInfo ,isFetchingUserInfo,loadingNewPage,setLoadingNewPage,loadingNewPageMessage,setLoadingNewPageMessage,noLoading,setNoLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
