"use client";

import DynamicScreen from "@/app/components/DynamicScreen";
import TeamDashHeader from "@/app/components/TeamDashboard/TeamDashHeader";
import TopBar from "@/app/components/TopBarComps/TopBar";
import { useAuth } from "@/app/contexts/AuthContext";
import EmailIcon from '../../../public/emailIcon.svg'

import CONFIG from "@/config";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/app/components/loadingScreen";
import LoadingSubScreen from "@/app/components/loadingSubscreen";
import TeamInfoWrapper from "@/app/components/TeamProfileEditorComponents/EditorWrappers/TeamInfoWrapper";
import SwimClubDescription from "@/app/components/SwimClubDescription";
import { changeField } from "@/app/hooks/changeField";
import ContactInfoWrapper from "@/app/components/TeamProfileEditorComponents/EditorWrappers/ContactInfoWrapper";
import { editingMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/editingEntryByAllFields";
import validateFields from "@/app/hooks/firestoreHooks/validateFields";
import TeamProfileLocationsSection from "@/app/components/TeamProfileEditorComponents/ProfileLocationComps/TeamProfileLocationsSection";
import { getEntriesByMatching } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByMatching";
import { parseAddress } from "@/app/hooks/addressExtraction";
import AmenitiesSection from "@/app/components/TeamPageComps/AmenitiesSection";
import { transformImagesListToJsons } from "@/app/hooks/firestoreHooks/retrieving/adjustingRetrievedData";
import deleteS3Objects from "@/app/hooks/awsHooks/deleteFromS3";
import { uploadImagesToS3 } from "@/app/hooks/awsHooks/uploadToS3";

export default function TeamProfilePage() {
    const { userInfo, loadingNewPage, setLoadingNewPage, user } = useAuth();
    
    // TEAMINFO STATES
    const [newTeamName, setNewTeamName] = useState("")
    const [teamDescription, setTeamDescription] = useState("")
    const [teamLogo, setTeamLogo] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    // CONTACT INFO STATES
    const [phoneNumberObj, setPhoneNumberObj] = useState({ phoneNumber: "", isValid: null })
    const [emailAddress, setEmailAddress] = useState("")
    const [contactName, setContactName] = useState("")

    const [enableSaveTeamInfoChanges, setEnableSaveTeamInfoChanges] = useState(false)
    const [mustFixTeamInfo, setMustFixTeamInfo] = useState(false)
    const [mustFixContactInfo, setMustFixContactInfo] = useState(false)

    const [enableSaveContactInfoChanges, setEnableContactInfoChanges] = useState(false)
    const [locationInfo, setLocationInfo] = useState([])
    const [allParsedAddresess, setAllParsedAddresses] = useState([])
    const intervalRef = useRef(null);
    const triggerTimeRef = useRef(null);

    useEffect(() => {
        if (editingTeamInfo) setEnableSaveTeamInfoChanges(true)
        setMustFixTeamInfo(false)
    }, [newTeamName, teamDescription, teamLogo])

    useEffect(() => {
        if (editingContactInfo) setEnableContactInfoChanges(true)
        setMustFixContactInfo(false)
    }, [emailAddress, contactName, phoneNumberObj])

    useEffect(() => {
        triggerTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - triggerTimeRef.current;

            if (userInfo?.teamInfo) {
                clearInterval(intervalRef.current);
                setNewTeamName(userInfo.teamInfo.teamName);
                setTeamDescription(userInfo.teamInfo.teamDescription);
                setTeamLogo([{ id: userInfo.teamInfo.logoPhotoURL, url: userInfo.teamInfo.logoPhotoURL }]);
                
                changeField({ setDict: setPhoneNumberObj, field: "phoneNumber", value: userInfo.teamInfo.phoneNumber });
                changeField({ setDict: setPhoneNumberObj, field: "isValid", value: true });
                setEmailAddress(userInfo.teamInfo.contactEmail);
                setContactName(userInfo.teamInfo.contactName);
                
                getLocationInfo();
            }

            if (elapsed >= 5000 && !userInfo?.teamInfo) {
                window.location.reload()
            }
        }, 1000);

        return () => clearInterval(intervalRef.current);

        async function getLocationInfo() {
            if (!userInfo?.teamInfo?.id) return;
            const locationsInfo = await getEntriesByMatching({
                collectionName: "Location",
                fields: { teamId: userInfo.teamInfo.id },
            });
            
            const parsedAddresses = []
            for (const location of locationsInfo) {
                const firestoreLocationImages = await getEntriesByMatching({
                    collectionName: "Images",
                    fields: {
                        teamId: userInfo.teamInfo.id,
                        locationId: location.id,
                        photoType: "location",
                    },
                });
                
                location.images = transformImagesListToJsons({ list: firestoreLocationImages })
                const parsedAdd = parseAddress({ address: location.address })
                parsedAddresses.push(parsedAdd)
                location.parsedAddress = parsedAdd
            }
            setLocationInfo(locationsInfo)
            setAllParsedAddresses(parsedAddresses)
            setIsLoading(false);
            setLoadingNewPage(false)
        }
    }, [userInfo]);

    const [editingTeamInfo, setEditingTeamInfo] = useState(false)
    const [editingContactInfo, setEditingContactInfo] = useState(false)
    const [selectedPage, setSelectedPage] = useState("profile")

    return (
        <div className="relative flex overflow-x-hidden justify-center items-center">
            
            {/* --- MULTI-TAB DEACTIVATION OVERLAY --- */}
            {(!userInfo || !userInfo.userData) && !isLoading && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md border border-gray-100 mx-4">
                        <LoadingSubScreen loadingMessage="" />
                        <h2 className="text-xl font-bold text-streamlineBlue mt-4">Verifying session...</h2>
                        <p className="text-gray-500 mt-2 mb-6">Your session is no longer active. Redirecting...</p>
                        <div 
                            className="px-6 py-2 bg-streamlineBlue text-white rounded-full font-bold cursor-pointer"
                            onClick={() => window.location.href = "/"}
                        >
                            Go to Homepage
                        </div>
                    </div>
                </div>
            )}

            <DynamicScreen className={`min-h-screen w-[99%] ${(!userInfo || !userInfo.userData) ? "blur-sm pointer-events-none" : ""}`}>
                <div className="min-h-screen">
                    <TeamDashHeader selectedPage={selectedPage} setSelectedPage={setSelectedPage} setIsLoading={setIsLoading} />
                    
                    {isLoading || loadingNewPage ? (
                        <div className="items-center">
                            <LoadingSubScreen loadingMessage={!loadingNewPage ? `Loading team ${selectedPage}` : ""} />
                        </div>
                    ) : (
                        <div>
                            {/* TEAM INFO SECTION */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-[16px]">
                                    <div className="text-[18px] font-bold text-streamlineBlue">Team Info</div>
                                    {!editingTeamInfo && (
                                        <div className="mt-[1px] text-[13px] ml-[8px] bg-streamlineBlue text-white font-bold px-[10px] py-[6px] rounded-full cursor-pointer"
                                            onClick={() => { setEditingTeamInfo(!editingTeamInfo) }}>
                                            Edit team info/logo
                                        </div>
                                    )}
                                </div>
                                {!editingTeamInfo ? (
                                    <div className="space-y-[3px]">
                                        <div className="flex items-center space-x-[10px]">
                                            <img src={teamLogo[0]?.url} className="w-[60px]" alt="logo" />
                                            <div className="text-[16px]">{newTeamName}</div>
                                        </div>
                                        <div className="font-bold text-[16px] pt-[8px]">Team description</div>
                                        <SwimClubDescription swimClubDescription={teamDescription} />
                                    </div>
                                ) : (
                                    <div className="space-y-[8px] mt-[8px]">
                                        <TeamInfoWrapper newTeamName={newTeamName} setNewTeamName={setNewTeamName} teamDescription={teamDescription} setTeamDescription={setTeamDescription} logoImg={teamLogo} setLogoImg={setTeamLogo} />
                                        {mustFixTeamInfo && (
                                            <div className="text-red-500 font-bold text-[14px]">Please ensure all fields are completed correctly and try again</div>
                                        )}
                                        <div className="flex justify-end space-x-[12px] items-center pb-[8px]">
                                            <div className="text-streamlineBlue px-[10px] py-[6px] border border-streamlineBlue text-[14px] rounded-full font-bold cursor-pointer"
                                                onClick={() => {
                                                    setNewTeamName(userInfo?.teamInfo?.teamName)
                                                    setTeamDescription(userInfo?.teamInfo?.teamDescription)
                                                    setTeamLogo([{ id: userInfo?.teamInfo?.logoPhotoURL, url: userInfo?.teamInfo?.logoPhotoURL }])
                                                    setMustFixTeamInfo(false)
                                                    setEditingTeamInfo(false)
                                                }}>
                                                Cancel
                                            </div>
                                            <div className={`px-[10px] py-[6px] text-[14px] font-bold text-white bg-streamlineBlue rounded-full ${enableSaveTeamInfoChanges ? "cursor-pointer" : "opacity-50"}`}
                                                onClick={async () => {
                                                    if (enableSaveTeamInfoChanges && user?.uid) {
                                                        setEnableSaveTeamInfoChanges(false)
                                                        try {
                                                            validateFields({ data: { teamName: newTeamName, teamDescription: teamDescription, logoPhotoURL: teamLogo[0]?.url } })
                                                            setEditingTeamInfo(false)
                                                            if (teamLogo[0]?.url != userInfo?.teamInfo?.logoPhotoURL) {
                                                                await deleteS3Objects({ urls: [userInfo.teamInfo.logoPhotoURL] })
                                                                const desiredURLs = await uploadImagesToS3({ files: teamLogo, s3Uri: "s3://streamlineplatform/logoImgs/" })
                                                                await editingMatchingEntriesByAllFields({
                                                                    collectionName: "Team",
                                                                    matchParams: { firebaseId: user.uid },
                                                                    updateData: { teamName: newTeamName, logoPhotoURL: desiredURLs[0], teamDescription: teamDescription }
                                                                })
                                                                window.location.reload()
                                                            } else {
                                                                await editingMatchingEntriesByAllFields({
                                                                    collectionName: "Team",
                                                                    matchParams: { firebaseId: user.uid },
                                                                    updateData: { teamName: newTeamName, teamDescription: teamDescription }
                                                                })
                                                                if (newTeamName != userInfo?.teamInfo?.teamName) window.location.reload()
                                                            }
                                                        } catch (error) {
                                                            setMustFixTeamInfo(true)
                                                        }
                                                    }
                                                }}>
                                                Save changes
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-[1px] bg-gray-200 mt-[5px] mb-[18px]" />

                            {/* CONTACT INFO SECTION */}
                            <div>
                                <div className="flex items-center justify-between mb-[14px]">
                                    <div className="text-[18px] font-bold text-streamlineBlue">Team Contact Info</div>
                                    <div className="mt-[1px] text-[13px] ml-[8px] bg-streamlineBlue text-white font-bold px-[10px] py-[6px] rounded-full cursor-pointer"
                                        onClick={() => { setEditingContactInfo(!editingContactInfo) }}>
                                        Edit contact info
                                    </div>
                                </div>
                                {!editingContactInfo ? (
                                    <div className="space-y-[3px]">
                                        <div className="flex"><div className="flex text-[16px] font-bold">Contact name:</div><div className="ml-[4px]">{contactName}</div></div>
                                        <div className="flex text-[16px] items-center space-x-[6px]"><EmailIcon /><div className="mt-[1px] text-[16px]">{emailAddress}</div></div>
                                        <div className="flex text-[16px] items-center space-x-[6px]">
                                            <img src="/PhoneIcon.png" className="w-[30px]" alt="phone" />
                                            <div className="mt-[1px]">{phoneNumberObj.phoneNumber}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-[6px]">
                                        <ContactInfoWrapper emailAddress={emailAddress} setEmailAddress={setEmailAddress} fullName={contactName} setFullName={setContactName} phoneNumberObj={phoneNumberObj} setPhoneNumberObj={setPhoneNumberObj} />
                                        {mustFixContactInfo && <div className="text-red-500 font-bold text-[14px] pb-[5px]">Please ensure all fields are completed correctly and try again</div>}
                                        <div className="flex justify-end space-x-[12px] items-center pb-[8px]">
                                            <div className="text-streamlineBlue px-[10px] py-[6px] border border-streamlineBlue text-[14px] rounded-full font-bold cursor-pointer"
                                                onClick={() => {
                                                    setContactName(userInfo?.teamInfo?.contactName)
                                                    setEmailAddress(userInfo?.teamInfo?.contactEmail)
                                                    changeField({ setDict: setPhoneNumberObj, field: "phoneNumber", value: userInfo?.teamInfo?.phoneNumber })
                                                    setMustFixContactInfo(false)
                                                    setEditingContactInfo(false)
                                                }}>
                                                Cancel
                                            </div>
                                            <div className={`px-[10px] py-[6px] text-[14px] font-bold text-white bg-streamlineBlue rounded-full ${enableSaveContactInfoChanges ? "cursor-pointer" : "opacity-50"}`}
                                                onClick={async () => {
                                                    if (enableSaveContactInfoChanges && user?.uid) {
                                                        setEnableContactInfoChanges(false)
                                                        try {
                                                            if (!phoneNumberObj.isValid) throw new Error("invalid phone number")
                                                            validateFields({ data: { contactName: contactName, phoneNumber: phoneNumberObj.phoneNumber, contactEmail: emailAddress } })
                                                            setEditingContactInfo(false)
                                                            await editingMatchingEntriesByAllFields({
                                                                collectionName: "Team",
                                                                matchParams: { firebaseId: user.uid },
                                                                updateData: { contactName: contactName, phoneNumber: phoneNumberObj.phoneNumber, contactEmail: emailAddress }
                                                            })
                                                        } catch (error) {
                                                            setMustFixContactInfo(true)
                                                        }
                                                    }
                                                }}>
                                                Save changes
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-[1px] bg-gray-200 mt-[18px] mb-[18px]" />

                            {/* LOCATION SECTION */}
                            {userInfo?.teamInfo && (
                                <TeamProfileLocationsSection 
                                    locationsInfo={locationInfo} 
                                    parsedAddresses={allParsedAddresess} 
                                    teamId={userInfo.teamInfo.id} 
                                    teamName={userInfo.teamInfo.teamName} 
                                />
                            )}
                        </div>
                    )}
                </div>
            </DynamicScreen>
        </div>
    )
}