"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { monitorAuthState, logout } from '../hooks/authHooks/firebaseAuth'; 
import { getUserByFirebaseId, getDependantsByFirebaseId } from '../hooks/firestoreHooks/user/getUser';
import { getEntriesByMatching } from '../hooks/firestoreHooks/retrieving/getEntriesByMatching';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(true);
  const [userInfo, setUserInfo] = useState({ "userData": null, "otherAthletes": null });
  const [loadingNewPage, setLoadingNewPage] = useState(false);
  const [loadingNewPageMessage, setLoadingNewPageMessage] = useState("");
  const [noLoading, setNoLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = monitorAuthState(async (currentUser) => {
      if (currentUser) {
        try {
          // 1. Fetch the user profile from Firestore
          const userData = await getUserByFirebaseId({ firebaseId: currentUser.uid });

          // 🛡️ CRITICAL DEACTIVATION CHECK
          // If the account is Inactive, clear EVERYTHING and redirect.
          if (userData?.status === "Inactive") {
             console.warn("Access Denied: Account is Inactive.");
             setUser(null);
             setUserInfo({ "userData": null, "otherAthletes": null });
             setIsFetchingUserInfo(false);
             await logout(); // Logs out of Firebase
             window.location.href = "/"; // Force redirect to homepage
             return; 
          }

          // 2. Process Team Specific Data
          if (userData?.accountType === "team") {
            const teamInfo = await getEntriesByMatching({
              collectionName: "Team",
              fields: { firebaseId: currentUser.uid }
            });

            // Secondary Check: If the team record itself is Inactive
            if (teamInfo[0]?.status === "Inactive") {
              setUser(null);
              setUserInfo({ "userData": null, "otherAthletes": null });
              setIsFetchingUserInfo(false);
              await logout();
              window.location.href = "/";
              return;
            }

            // Set User Info for Team
            const otherAthletes = await getDependantsByFirebaseId({ firebaseId: currentUser.uid });
            setUser(currentUser);
            setUserInfo({
              userData: userData,
              otherAthletes: otherAthletes || ["nothing"],
              teamInfo: teamInfo[0],
            });
          } else {
            // 3. Process Regular User Data
            const otherAthletes = await getDependantsByFirebaseId({ firebaseId: currentUser.uid });
            setUser(currentUser);
            setUserInfo({
              userData: userData,
              otherAthletes: otherAthletes || ["nothing"],
            });
          }

          setIsFetchingUserInfo(false);

        } catch (error) {
          console.error("Error in AuthProvider:", error);
          setIsFetchingUserInfo(false);
        }
      } else {
        // No current user (logged out)
        setUser(null);
        setUserInfo({ "userData": null, "otherAthletes": null });
        setIsFetchingUserInfo(false);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
        user, setUser, userInfo, setUserInfo, 
        isFetchingUserInfo, loadingNewPage, setLoadingNewPage, 
        loadingNewPageMessage, setLoadingNewPageMessage, 
        noLoading, setNoLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};