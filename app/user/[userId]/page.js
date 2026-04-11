"use client";

import DynamicScreen from "@/app/components/DynamicScreen";
import TeamDashHeader from "@/app/components/TeamDashboard/TeamDashHeader";
import TopBar from "@/app/components/TopBarComps/TopBar";
import { useAuth } from "@/app/contexts/AuthContext";
import EmailIcon from '../../../public/emailIcon.svg'

import CONFIG from "@/config";
import { useEffect, useState,useRef } from "react";
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
import {  transformImagesListToJsons } from "@/app/hooks/firestoreHooks/retrieving/adjustingRetrievedData";
import deleteS3Objects from "@/app/hooks/awsHooks/deleteFromS3";
import { uploadImagesToS3 } from "@/app/hooks/awsHooks/uploadToS3";
import { batchedGetEntriesByConditions } from "@/app/hooks/firestoreHooks/retrieving/batchedGetEntriesByConditions";
import UserDashHeader from "@/app/components/UserProfilePage/UserDashHeader";
import PersonEntry from "@/app/components/TeamDashboard/CalendarComps/PersonEntry";
import { calculateAge } from "@/app/hooks/miscellaneous";
import ViewUserInfo from "@/app/components/UserProfilePage/ViewUserInfo";
import { getEntriesByConditions } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByConditions";
import { useRouter } from "next/navigation";
import ModalTemplate from "@/app/components/ModalTemplate";
import EventModal from "@/app/components/TeamDashboard/CalendarComps/EventModal";

export default function UserProfilePage() {

    const {userInfo,
      loadingNewPage,setLoadingNewPage
      ,user}= useAuth();

    const router = useRouter()

    //CONTACT INFO STATES
    const [accountPhoneNumber, setAccountPhoneNumber] = useState({phoneNumber:"", isValid:null})
    const [accountFullname,setAccountFullname]=useState("")
    const [accountEmailAddress,setAccountEmailAddress]=useState("")
    const [otherAthletes,setOtherAthletes]=useState([])
    const [bookingInfo,setBookingInfo]=useState({})
    const [allParsedAddresess,setAllParsedAddresses]=useState([])
    const intervalRef = useRef(null);
    const triggerTimeRef = useRef(null);
    const [stillLoading,setStillLoading] = useState(true)
    const [orderedLessons,setOrderedLessons]=useState([])
      useEffect(()=>{
        setLoadingNewPage(true)
      },[])

      function formatEventTime({startTime, endTime}) {
        // Days of the week and months for formatting
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
        // Extracting components for the start time
        const startDay = daysOfWeek[startTime.getDay()];
        const startMonth = months[startTime.getMonth()];
        const startDate = startTime.getDate();
      
        // Formatting hours and minutes for start and end time
        const formatTime = (date) => {
          const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const amPm = date.getHours() >= 12 ? "PM" : "AM";
          return `${hours}${minutes !== "00" ? `:${minutes}` : ""} ${amPm}`;
        };
      
        const startFormattedTime = formatTime(startTime);
        const endFormattedTime = formatTime(endTime);
      
        // Return formatted string
        return `${startDay}, ${startMonth} ${startDate} · ${startFormattedTime} –${endFormattedTime}`;
    }

    useEffect(() => {
        triggerTimeRef.current = Date.now(); // Set trigger time

        // Start an interval to check elapsed time
        intervalRef.current = setInterval(() => {

                const elapsed = Date.now() - triggerTimeRef.current;

                    if (userInfo.userData&&userInfo.otherAthletes) {
                        clearInterval(intervalRef.current); // Break the interval
                        // TEAM INFO
                        
                        // CONTACT INFO
                        changeField({ setDict: setAccountPhoneNumber, field: "phoneNumber", value: userInfo.userData.phoneNumber });
                        changeField({ setDict: setAccountPhoneNumber, field: "isValid", value: true });
                        setAccountEmailAddress(userInfo.userData.emailAddress)
                        setAccountFullname(userInfo.userData.fullName);
                        
                        
                        setOtherAthletes(userInfo.otherAthletes)
                        getLocationInfo(); // Call after it's defined
                        
                    }
                if (elapsed >= 5000) {
                    window.location.reload()
                }
            
        }, 1000); // Check every second
        // Cleanup on unmount
        return () => clearInterval(intervalRef.current);

      
        // Define the function BEFORE calling it
        async function getLocationInfo() {
      
          const lessonEntries = await getEntriesByMatching({
            collectionName: "LessonBookings",
            fields: { userId: user.uid },
          });

          const lessonIds = new Set()
          const bookingsInfo = {}
          

          if (lessonEntries.length>0){

            lessonEntries.forEach(async(item)=>{

                if(!lessonIds.has(item.lessonId)){
                  
                  lessonIds.add(item.lessonId)
  
                  const eventInfo = await getEntriesByConditions({collectionName:"TimeBlock",conditions:[{'field':'id',operator:"==",value:item.lessonId}]})

                  const currEvent = eventInfo[0]
                  console.log("WTF HAPPENED",currEvent,item)
                  const locoInfo = await batchedGetEntriesByConditions({
                      queriesWithKeys:[{
                          key:`locationInfo`,
                          queryConfig:{
                            collectionName:'Location',
                            conditions:[{'field':"id",'operator':'==',value:currEvent.locationId}]
                          }
                      },{
                          key:`skillMapping`,
                          queryConfig:{
                            collectionName:'SkillLevel',
                            conditions:[{'field':"locationId",'operator':'==',value:currEvent.locationId}]
                          }
                      },{
                          key:`lessonTypeMapping`,
                          queryConfig:{
                            collectionName:'LessonType',
                            conditions:[{'field':"locationId",'operator':'==',value:currEvent.locationId}]
                          }
                      },{
                          key:`locationImgs`,
                          queryConfig:{
                            collectionName:'Images',
                            conditions:[{'field':"locationId",'operator':'==',value:currEvent.locationId}]
                          }
                      },{
                        key:`teamInfo`,
                        queryConfig:{
                          collectionName:'Team',
                          conditions:[{'field':"id",'operator':'==',value:currEvent.teamId}]
                        }
                    }
                  ]
                  })
  
                  const lessonTypesMapping = {}
                  locoInfo.lessonTypeMapping.forEach((itemType)=>{
                    lessonTypesMapping[itemType.level]=itemType.category
                  })
  
                  const skillLevelsMapping = {}
                  locoInfo.skillMapping.forEach((itemSkill)=>{
                    skillLevelsMapping[itemSkill.level]=itemSkill.category
                  })
  
                  const currentBooking = {}
  
                  const eventTypesInfo = currEvent.lessonType[0].split('`')
                  currentBooking["locationInfo"]=locoInfo.locationInfo[0]
                  currentBooking["skillLevel"]=skillLevelsMapping[eventTypesInfo[0]]
                  currentBooking["lessonType"]=lessonTypesMapping[eventTypesInfo[1]]
                  currentBooking["locationImgs"]=locoInfo.locationImgs
                  currentBooking["teamInfo"]=locoInfo.teamInfo[0]
                  currentBooking['status']=currEvent.status
                  currentBooking['athletes']=currEvent.athletes.length>0?currEvent.athletes.filter(item => (item.athleteInfo.accountFirebaseId === user.uid) || (item.athleteInfo.firebaseId === user.uid)):[]
                  currentBooking['eventInfo']=currEvent
                  currentBooking['eventId']=item.lessonId

                  bookingsInfo[item.lessonId]=currentBooking
                  changeField({setDict:setBookingInfo,field:item.lessonId,value:currentBooking})
                  console.log("HEIRHEIHRE",bookingInfo)
                }

            })
          }

          
          setLoadingNewPage(false)
          setStillLoading(false)
        }
      }, [userInfo]);
      
    useEffect(()=>{
      const unorderedLessons = Object.values(bookingInfo)
      console.log("UNORDERED",bookingInfo)
      setOrderedLessons(unorderedLessons.sort((b,a)=>new Date(a.eventInfo.start).getTime() - new Date(b.eventInfo.start).getTime()));
    },[bookingInfo])

    const [selectedEventId,setSelectedEventId]=useState(null)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    const openEventModal = () => {setIsEventModalOpen(true)};
    const closeEventModal = () => setIsEventModalOpen(false);

    return(

        <div className="flex overflow-x-hidden justify-center items-center w-full">
          <DynamicScreen className="flex min-h-screen w-[98%] md:w-[85%] lg:w-[72%]">
            <div className="min-h-screen">
            <UserDashHeader />
            {  loadingNewPage||stillLoading?
            <div className="items-center">
                <LoadingSubScreen loadingMessage={!loadingNewPage?`Loading your profile`:""}/>
            </div>
            :
            <div className="">
                
                {/* TEAM INFO SECTION */}

                <div className="h-[8px]"/>

                <ViewUserInfo
                userEmail={accountEmailAddress}
                setUserEmail={setAccountEmailAddress}
                userName={accountFullname}
                setUserName={setAccountFullname}
                userPhone={accountPhoneNumber}
                setUserPhone={setAccountPhoneNumber}
                otherAthletes={otherAthletes}
                setOtherAthletes={setOtherAthletes}
                />

                <div className="w-full h-[1px] bg-gray-200 mt-[30px] mb-[18px]"/>

                {/* CONTACT INFO SECTION */}
                <div className="flex flex-col">
                  <div className="font-bold text-[18px] text-streamlineBlue" onClick={()=>{
                    console.log(bookingInfo)
                  }}>
                    Trial lessons 
                  </div>
                  {Object.keys(bookingInfo).length>0&&<div className="font-bold text-[14px] text-gray-400 leading-[12px] pb-[18px]">
                    Click on lesson for more details/contact info
                  </div>}

                  <div className="w-full flex flex-col space-y-[16px] md:grid md:grid-cols-2 sm:space-y-[0px] md:gap-4 py-[10px]">
                  {orderedLessons.map((item,index)=> 
                  
                  <div className="flex w-full justify-center" key={index}>
                  <div className=" py-[20px] px-[20px] w-[100%] sm:w-[100%] border border-gray-300 rounded-xl
                          shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-streamlineBlue cursor-pointer transition-shadow duration-300" onClick={()=>{setSelectedEventId(item.eventId);openEventModal();console.log(bookingInfo[selectedEventId])}}>  
                              <div className="flex items-center  mb-[10px] space-x-[4px] items-end">
                                      <img
                                          src={bookingInfo[item.eventId].locationImgs[0].imageUrl}
                                          className=
                                          " w-[110px] h-[110px] sm:h-[140px] sm:w-[140px] rounded-[10px]"
                                      />
                                  <div className="pl-[10px]">
                                  
                                  <div className="font-bold text-streamlineBlue">
                                  {bookingInfo[item.eventId].teamInfo.teamName}
                                  </div>
                                  <div className=" flex  text-[12px] leading-[12px] pb-[4px]">
                                  {formatEventTime({startTime:bookingInfo[item.eventId].eventInfo.start,endTime:bookingInfo[item.eventId].eventInfo.end})}
                                  </div>

                                  <div className="flex-col leading-1.25 text-[14px] flex">
                                  <div className="flex">
                                  <div className="flex font-bold mr-[3px]">{CONFIG.athleteType}{bookingInfo[item.eventId].athletes.length>1?"s":""}: 
                                  {/* </div> */}
                                  {/* <div className=" mr-[3px]"> */}
                                    {bookingInfo[item.eventId].athletes.map((item,index)=>`${index==0?" ":", "}${item.athleteInfo.fullName}`)}
                                  </div>
                                  </div>
                                  <div className="flex">
                                  <div className="flex font-bold mr-[3px]">Skill level: </div> {bookingInfo[item.eventId].skillLevel}
                                  </div>
                                  <div className="flex">
                                  <div className="flex font-bold mr-[3px]">Lesson type: </div> {bookingInfo[item.eventId].lessonType}
                                  </div>
                                  <div className="flex-col itext-[14px]">
                                    <div className="flex items-center">
                                      <div className="mr-2 font-bold">Status:</div>
                                      <div
                                        className={`font-bold mt-[1px] ${
                                          bookingInfo[item.eventId].status === "Pending"
                                            ? "text-yellow-500"
                                            : (bookingInfo[item.eventId].status === "Confirmed")
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {bookingInfo[item.eventId].status}
                                      </div>
                                    </div>
                                  </div>
                                  </div>

                                  </div>
                              </div>

                          </div>
                  </div>)}
                  </div>

                  {
                    Object.keys(bookingInfo).length==0&&
                    <div className="flex flex-col justify-center">

                      <div className="w-full text-center pt-[45px] text-gray-400 font-bold">
                        You have no reserved trial lessons
                      </div>      

                      <div className="flex justify-center">
                        <div className=" text-center mt-[25px] rounded-full px-[16px] py-[8px] text-white bg-streamlineBlue cursor-pointer font-bold" onClick={()=>{router.push('/'); setLoadingNewPage(true)}}>
                          Find your perfect swim club!
                        </div>      
                      </div>      

                    </div>
                  }


                </div>
                {/* LOCATION SECTION */}

                <ModalTemplate isOpen={isEventModalOpen} onClose={closeEventModal}>
                {selectedEventId&&<EventModal pickedEvent={bookingInfo[selectedEventId].eventInfo} athletes={bookingInfo[selectedEventId].athletes} streetAddress={bookingInfo[selectedEventId].locationInfo.address} onClose={closeEventModal}/>}
                </ModalTemplate>

            </div>
            }
           
           </div>
            </DynamicScreen>
         </div>


    )
}