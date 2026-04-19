"use client"

import { db } from "@/app/components/firebaseClient";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    updateDoc, 
    getDoc,
    writeBatch // Added for efficiency
} from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeletePage() {
    const pathName = usePathname();
    const router = useRouter();
    const teamId = pathName.split("/")[2];
    
    const [status, setStatus] = useState("Initializing deactivation...");
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const softDeleteTeam = async () => {
            if (!teamId) return;

            try {
                const batch = writeBatch(db);

                // 1. Handle the Team Document
                const teamRef = doc(db, "Team", teamId);
                const teamSnap = await getDoc(teamRef);

                if (!teamSnap.exists()) {
                    setStatus("Error: Team not found.");
                    setIsProcessing(false);
                    return;
                }

                const teamData = teamSnap.data();
                batch.update(teamRef, {
                    status: "inactive",
                    deactivatedAt: new Date().toISOString()
                });

                // 2. Handle the Account Document (linked via firebaseId)
                if (teamData.firebaseId) {
                    const accountQuery = query(collection(db, "Account"), where("firebaseId", "==", teamData.firebaseId));
                    const accountSnap = await getDocs(accountQuery);
                    accountSnap.forEach((accDoc) => {
                        batch.update(doc(db, "Account", accDoc.id), { status: "inactive" });
                    });
                }

                // 3. Handle Locations and Sub-collections
                const locationsQuery = query(collection(db, "Location"), where("teamId", "==", teamId));
                const locationsSnap = await getDocs(locationsQuery);

                for (const lDoc of locationsSnap.docs) {
                    const locoId = lDoc.id;
                    
                    // Mark Location as inactive
                    batch.update(doc(db, "Location", locoId), { status: "inactive" });

                    // IMPORTANT: To be thorough, mark related functional data as inactive 
                    // This prevents these coaches or lessons from appearing in search filters
                    const subCollections = ["Coach", "LessonType", "TimeBlock", "SkillLevel"];
                    
                    for (const colName of subCollections) {
                        const subQuery = query(collection(db, colName), where("locationId", "==", locoId));
                        const subSnap = await getDocs(subQuery);
                        subSnap.forEach((subDoc) => {
                            batch.update(doc(db, colName, subDoc.id), { status: "inactive" });
                        });
                    }
                }

                // 4. Commit all changes at once
                await batch.commit();

                setStatus("Success: Team and all associated data deactivated.");
                setIsProcessing(false);
                
                // Redirect to homepage
                setTimeout(() => router.push("/"), 3000);

            } catch (error) {
                console.error("Deactivation Error:", error);
                setStatus("Deactivation Failed: Check console for details.");
                setIsProcessing(false);
            }
        };

        softDeleteTeam();
    }, [teamId, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md mx-4">
                {isProcessing && (
                    <div className="flex justify-center mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-streamlineBlue"></div>
                    </div>
                )}
                
                <div className={`font-bold text-[22px] mb-2 ${status.includes("Error") || status.includes("Failed") ? "text-red-500" : "text-streamlineBlue"}`}>
                    {status.includes("Success") ? "Deactivation Complete" : "Processing Request"}
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                    {status}
                </p>

                {status.includes("Success") && (
                    <div className="mt-6 flex flex-col items-center">
                        <p className="text-sm text-gray-400 animate-pulse">
                            Redirecting you to the home page...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}