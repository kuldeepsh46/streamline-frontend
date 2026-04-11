"use client";

import DynamicScreen from "@/app/components/DynamicScreen";
import TeamDashHeader from "@/app/components/TeamDashboard/TeamDashHeader";
import TopBar from "@/app/components/TopBarComps/TopBar";
import { useAuth } from "@/app/contexts/AuthContext";
import CONFIG from "@/config";
import { useState, useEffect, useRef } from "react";
import LoadingSubScreen from "@/app/components/loadingSubscreen";
import MyCalendar from "@/app/components/TeamDashboard/CalendarComps/Calendar";
import ModalTemplate from "@/app/components/ModalTemplate";
import InfoIcon from "../../../public/InfoIcon.svg"
import LocationIcon from "../../../public/LocationIcon.svg"
import NotifIcon  from "../../../public/NotifIcon.svg"
import PeopleIcon  from "../../../public/PeopleIcon.svg"
import ClockIcon  from "../../../public/ClockIcon.svg"
import CalendarIcon  from "../../../public/CalendarIcon.svg"
import PersonEntry from "@/app/components/TeamDashboard/CalendarComps/PersonEntry";
import EventModal from "@/app/components/TeamDashboard/CalendarComps/EventModal";
import AddAvailibilityModal from "@/app/components/TeamDashboard/CalendarComps/AddAvailabilityModal";
import { getEntriesByMatching } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByMatching";
import { transformImagesListToJsons } from "@/app/hooks/firestoreHooks/retrieving/adjustingRetrievedData";
import { parseAddress } from "@/app/hooks/addressExtraction";
import "react-big-calendar/lib/css/react-big-calendar.css";
import getXWeeksData from "@/app/hooks/calendarHooks/getWeeksData";
import { calculateAge } from "@/app/hooks/miscellaneous";
import LocationThumbnail from "@/app/components/TeamProfileEditorComponents/ProfileLocationComps/LocationThumbnail";

// import ClubScheduler from "@/app/components/TeamDashboard/ScheduleComps/Schedule";

export default function TeamDashboard() {

    const {userInfo,loadingNewPage,setLoadingNewPage}= useAuth();

    const [locationInfo,setLocationInfo]=useState({})
    const [allParsedAddresess,setAllParsedAddresses]=useState([])
    const [currentLocation,setCurrentLocation]=useState([])

    const availableColor = CONFIG.calendar.blockColors.available
    const pendingColor = CONFIG.calendar.blockColors.pending
    const confirmedColor = CONFIG.calendar.blockColors.confirmed

    const statuses = [{"Availability":availableColor},{"Pending Approval":pendingColor},{"Confirmed Lesson":confirmedColor}]

    const triggerTimeRef = useRef(null); // Use a ref instead of state
    const intervalRef = useRef(null);
    const timesOfDay = CONFIG.timesOfDay
    const [isLoading,setIsLoading]=useState(true)
    const [retrievedCoaches,setRetrievedCoaches] = useState(null)
    const [currLocoCoaches,setCurrLocoCoaches] = useState(null)

    const [xWeeks,setXWeeks]=useState(3)
    const [currWeekNum,setCurrWeekNum]=useState(null)

    const [currWeekEvents,setCurrWeekEvents] = useState(null)

    function getMinMaxHours(data) {
        if (!data || data.length === 0) {
          throw new Error("The input list is empty or invalid.");
        }
      
        const hours = data.map(item => item.hour);
      
        const minHour = Math.min(...hours);
        const maxHour = Math.max(...hours);
      
        return {
          minHour,
          maxHour
        };
      }
      
    const [currentDate,setCurrentDate]=useState(new Date())

    function filterItemsByWeekAndStatus(items,currentDate) {
        const now = new Date(currentDate);
        
        // Calculate the start of the current week (Sunday at 12:00 AM)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Adjust to the most recent Sunday
        startOfWeek.setHours(0, 0, 0, 0); // Set time to 12:00 AM
      
        // Calculate the end of the current week (Saturday at 11:59:59 PM)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
        endOfWeek.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
      
        // Filter the list
        return items.filter(item => {
          const startDate = new Date(item.start); // Parse the `start` date
          return (
            startDate >= startOfWeek &&
            startDate <= endOfWeek &&
            item.status.toLowerCase() !== "available"
          );
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
      }    

      
    const [events,setEvents] = useState(null);
    
    const [currDay,setCurrDay]=useState(new Date())
    const [isCalendarLoading,setIsCalendarLoading]=useState(true)
    const [selectedLocation,setSelectedLocation] = useState(null)
    useEffect(()=>{
        const updateCal = async() => {
            setIsCalendarLoading(true)
            const newDate = new Date(currDay)
            newDate.setDate(currDay.getDate()+currWeekNum*7)
            const weekEvents = await getXWeeksData({locationId:currentLocation.id,x:xWeeks,currDay:newDate})
            setCurrWeekEvents(filterItemsByWeekAndStatus(weekEvents,currentDate))
            setEvents(weekEvents)
            setCurrWeekNum(0)
            setCurrDay(newDate)
            setIsCalendarLoading(false)
        }
        
        if (Math.abs(currWeekNum)>xWeeks){
            
            updateCal()
        }else
        if (events) {
            
            setCurrWeekEvents(filterItemsByWeekAndStatus(events,currentDate))
        }
        
    },[currWeekNum])

    

    useEffect(()=>{
        triggerTimeRef.current = Date.now(); // Set trigger time

        // Start an interval to check elapsed time
        intervalRef.current = setInterval(async() => {
                const elapsed = Date.now() - triggerTimeRef.current;

                console.log(`Elapsed time: ${elapsed}ms`);
                if(userInfo.teamInfo){
        
                    await getLocationInfo()
                    clearInterval(intervalRef.current); // Break the interval
                }

                if (elapsed >= 3500) {
                    window.location.reload()
                }
        }, 1000); // Check every second
        // Cleanup on unmount
        return () => clearInterval(intervalRef.current);

        async function getLocationInfo() {
      
            const locationsInfo = await getEntriesByMatching({
              collectionName: "Location",
              fields: { teamId: userInfo.teamInfo.id },
            });
            
            const firestoreCoaches = await getEntriesByMatching({
                collectionName:'Coach',
                fields:{teamId: userInfo.teamInfo.id}
            })

            setRetrievedCoaches(firestoreCoaches)

            const parsedAddresses = []
            const retrievedLocations = {}
            for (const location of locationsInfo) {
              const firestoreLocationImages = await getEntriesByMatching({
                collectionName: "Images",
                fields: {
                  teamId: userInfo.teamInfo.id,
                  locationId: location.id,
                  photoType: "location",
                },
              });
              const firestoreLocationHours = await getEntriesByMatching({
                collectionName: "OperationDayTime",
                fields: {
                  locationId: location.id,
                },
              });

              const transformData = (data) => {
                return data.map(({ category, level }) => ({ [level]: category }));
              };

              const firestoreLocationLessonTypes = await getEntriesByMatching({
                collectionName: "LessonType",
                fields: {
                  locationId: location.id,
                },
              });

              const locationLessonTypes = transformData(firestoreLocationLessonTypes)

              const firestoreLocationLessonSkills = await getEntriesByMatching({
                collectionName: "SkillLevel",
                fields: {
                  locationId: location.id,
                },
              });
              
              const locationLessonSkills = transformData(firestoreLocationLessonSkills)
              
              const formattedLocationImages = transformImagesListToJsons({list:firestoreLocationImages})
              
              const extractKeys = (data) => data.map(Object.keys).flat();
              
              location.images = formattedLocationImages
              location.skillLevels = extractKeys(locationLessonSkills)
              location.lessonTypes = extractKeys(locationLessonTypes)

              const {minHour,maxHour} = getMinMaxHours(firestoreLocationHours)
              
              const parsedAddress = parseAddress({address:location.address})
              parsedAddresses.push(parsedAddress)
              location.parsedAddress = parsedAddress
              location.maxHour = maxHour
              location.minHour = minHour

              retrievedLocations[location.id]=location
            }

            
            const weekEvents = await getXWeeksData({locationId:locationsInfo[0].id,x:xWeeks,currDay:currDay})
            
            setCurrWeekEvents(filterItemsByWeekAndStatus(weekEvents,currentDate))
            setEvents(weekEvents)
            setCurrentLocation(locationsInfo[0])
            setCurrLocoCoaches(
                firestoreCoaches.filter(coach => coach.locationId === locationsInfo[0].id)
              );
              
            setSelectedLocation(locationsInfo[0].id)
            
            setLocationInfo(retrievedLocations)
            setAllParsedAddresses(parsedAddresses)
            setIsCalendarLoading(false)
            setIsLoading(false);
            setLoadingNewPage(false)
          }

    },[userInfo])


    const [pickedEvent, setPickedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    const openEventModal = () => {setIsEventModalOpen(true)};
    const closeEventModal = () => setIsEventModalOpen(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const [addAvailibilityModalKey,setAddAvailibilityModalKey]=useState(0)
    const openAddModal = () => {setIsAddModalOpen(true)};
    const closeAddModal = () => {setIsAddModalOpen(false),setAddAvailibilityModalKey(1+addAvailibilityModalKey)};

    const parentDivRef = useRef(null)

    const [selectedPage,setSelectedPage]=useState("dashboard")

    const handleSelectEvent = (event) => {
        setPickedEvent(event); // Set the picked event
        openEventModal()
      };

    function formatDateCustom(date) {
    // Extract day of the week, month, day, hours, and minutes
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dayPart = new Intl.DateTimeFormat("en-US", options).format(date);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    // Combine into the desired format
    return `${dayPart} @ ${hours}:${minutes}`;
    }
      

    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const openChangeModal = () => {setIsChangeModalOpen(true)};
    const closeChangeModal = () => setIsChangeModalOpen(false);

    const pullLocoInfo = async({locationId}) => {
        const updateCal = async({locationId}) => {
            setIsCalendarLoading(true)
            const newDate = new Date(currDay)
            newDate.setDate(currDay.getDate()+currWeekNum*7)
            const weekEvents = await getXWeeksData({locationId:locationId,x:xWeeks,currDay:newDate})
            setCurrWeekEvents(filterItemsByWeekAndStatus(weekEvents,currentDate))
            setEvents(weekEvents)
            setCurrWeekNum(0)
            setCurrDay(newDate)
            setIsCalendarLoading(false)
        }
        updateCal({locationId:locationId})   
        setCurrentLocation(locationInfo[locationId])
        setCurrLocoCoaches(
            retrievedCoaches.filter(coach => locationId === coach.locationId)
          );
          
        closeChangeModal()
    }

    return(

        <div className="flex flex-col no-scroll overflow-x-hidden justify-center items-center"
        style={{overflow:isEventModalOpen||isAddModalOpen?'hidden':''}}>
      <DynamicScreen className={`${isEventModalOpen||isAddModalOpen?"min-h-screen w-[98%] no-scroll":"w-[99%] min-h-screen no-scroll"}`} style={{overflow:isEventModalOpen||isAddModalOpen?'hidden':''}}>


            <div className="flex flex-col min-h-screen no-scroll" style={{overflow:isEventModalOpen||isAddModalOpen?'hidden':''}}>
            <TeamDashHeader selectedPage={"dashboard"} setSelectedPage={setSelectedPage} setIsLoading={setIsLoading}/>
            {  isLoading || loadingNewPage?
            <div className="items-center min-h-screen">
                <LoadingSubScreen loadingMessage={!loadingNewPage?`Loading team ${selectedPage}`:""}/>
            </div>
            :
            <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center">
                <div className="flex  space-x-[5px] border border-gray-200 rounded-full shadow-[0_5px_6px_rgba(0,0,0,0.1)] py-[8px] px-[16px] items-center">
                    <div className="font-bold">
                        Location:
                    </div>
                    <div>
                        {currentLocation.parsedAddress.streetAddress}
                    </div>
                    {
                        Object.keys(locationInfo).length>1 &&
                        <div className="text-streamlineBlue font-bold pl-[7px] text-[12px] cursor-pointer" onClick={()=>{openChangeModal()}}>
                            Change
                        </div>
                    }

                </div>                
            </div>

         
            <div className="w-full mt-[20px]">
                <div className="">
                    <MyCalendar loading events={events} setPickedEvent={setPickedEvent} openEventModal={openEventModal} setCurrWeekNum={setCurrWeekNum} isCalendarLoading={isCalendarLoading} setIsCalendarLoading={setIsCalendarLoading} currWeekNum={currWeekNum} minHour={currentLocation.minHour} maxHour={currentLocation.maxHour} currentDate={currentDate} setCurrentDate={setCurrentDate} fullAddress={currentLocation.location}/>
                </div>
            </div>

            <ModalTemplate isOpen={isChangeModalOpen} onClose={closeChangeModal}>
                
                <div className="flex-col overflow-y-scroll py-[20px] items-center justiy-center">
                <div className="w-full flex justify-center text-center font-bold mb-[15px] space-y-[20px]">
                    Select location to view schedule
                </div>
                <div className="space-y-[20px] overflow-y-scroll">
                {   
                Object.keys(locationInfo).map((item,index)=>(

                    <LocationThumbnail key={index} location={locationInfo[item]} pullLocoInfo={pullLocoInfo} setSelectedLocation={setSelectedLocation} selectedLocation={selectedLocation}/>
                )
                )
                }
                </div>
                </div>

                
            </ModalTemplate>

            <ModalTemplate isOpen={isEventModalOpen} onClose={closeEventModal}>
                {pickedEvent&&<EventModal pickedEvent={pickedEvent} streetAddress={currentLocation.parsedAddress.streetAddress} onClose={closeEventModal} setCurrWeekEvents={setCurrWeekEvents} setEvents={setEvents} events={events} currWeekEvents={currWeekEvents} athletes={pickedEvent.athletes} fullAddress={currentLocation.address}/>}
            </ModalTemplate>

            {/* add Availability modal */}
            <ModalTemplate onClose={closeAddModal} isOpen={isAddModalOpen} parentDivRef={parentDivRef}>
                <AddAvailibilityModal key={addAvailibilityModalKey}  parentDivRef={parentDivRef} lessonTypes={currentLocation.lessonTypes} lessonSkills={currentLocation.skillLevels} addAvailibilityModalKey={addAvailibilityModalKey} setAddAvailibilityModalKey={setAddAvailibilityModalKey} onClose={closeAddModal} teamId={userInfo.teamInfo.id} 
                retrievedCoaches={currLocoCoaches} locationId={currentLocation.id} events={events} setEvents={setEvents}/>
            </ModalTemplate>

            <div className="flex w-full justify-end">
            <div className="flex space-x-[5px] rounded-full text-white font-bold items-center px-[14px] bg-green-500 py-[8px] mt-[10px] cursor-pointer "
            onClick={()=>{openAddModal()}}>
                <div className="text-[15px]">
                +
                </div>
                <div className="text-[15px]">
                Add Availability
                </div>
            </div>
            </div>


            {/* TRIAL LESSONS LIST */}
            <div className="">
            <div className="flex font-bold text-streamlineBlue text-[17px] mt-[10px]">
                Trial lesson reservations this week
            </div>
            <div className="flex w-full h-[1px] bg-gray-200 mt-[5px] mb-[15px]"/>
            <div className="flex w-full mt-[10px] text-[15px]">
                <div className="w-full">
                    <div className="flex p-[3px] px-[5px]">
                        <div className="font-bold  w-[25%] p-[3px]">
                            {CONFIG.athleteType}
                        </div>
                        <div className="font-bold  w-[15%] p-[3px]">
                            Age
                        </div>
                        <div className="font-bold  w-[20%] p-[3px]">
                            Coach
                        </div>
                        <div className="font-bold  w-[20%] p-[3px]">
                            When
                        </div>
                        <div className="font-bold  w-[90px] flex p-[3px]">
                            Status
                        </div>
                    </div>
                    <div className="w-full h-[0.5px] bg-streamlineBlue mt-[3px] mb-[8px]"/>
                    <div className="flex-col">
                        {currWeekEvents.length===0 ?
                        <div className="w-full p-[20px] items-center h-[150px] flex justify-center font-bold text-gray-400 text-center mt-[30px] text-[16px]">
                            There are no trial lessons requested or scheduled this week
                        </div>
                        :
                        <>
                        {
                        currWeekEvents.map((item,index) => (
                            <div key={index}>
                            {item.athletes.length==1?
                            <div 
                            className={`flex items-center w-full rounded-[10px]
                            py-[10px] px-[5px]
                            ${index != currWeekEvents.length-1 ? "border-b border-gray-200" :""} cursor-pointer
                            hover:bg-gray-200 w-full`} onClick={()=>{handleSelectEvent(item);}}>
                                <div className="w-[25%] p-[5px]">
                                    {item.athletes[0].fullName}
                                </div>            
                                <div className="w-[15%] p-[5px]">
                                    {item.athletes[0].athleteInfo.dateOfBirth?calculateAge(item.athletes[0].athleteInfo.dateOfBirth):"Over 18"} yrs
                                </div>            
                                <div className="w-[20%] p-[5px]">
                                    {item.coachName}
                                </div>            
                                <div className="w-[20%] p-[5px]">
                                    {formatDateCustom(item.start)}
                                </div>            
                                <div className="w-[90px] flex justify-center items-center">
                                    <div className={`flex  text-white font-bold px-[10px] py-[6px] ${item.status==="Confirmed" ? "bg-green-500" : 
                                    item.status==="Pending" ? "bg-yellow-500" : "bg-red-500"} 
                                    rounded-full`}>
                                    {item.status}
                                    </div>
                                </div>            

                            </div> :
                            <>
                            {item.athletes.map((subItem,subIndex)=>(
                            <div key={1000+subIndex}
                            className={`flex items-center w-full rounded-[10px]
                            py-[10px] px-[5px]
                            ${(index != currWeekEvents.length-1 || subIndex!=item.athletes.length-1)? "border-b border-gray-200" :""} cursor-pointer
                            hover:bg-gray-200 w-full`} onClick={()=>{handleSelectEvent(item);}}>
                                <div className="w-[25%] p-[5px]">
                                    {item.athletes[subIndex].fullName}
                                </div>            
                                <div className="w-[15%] p-[5px]">
                                    {item.athletes[subIndex].athleteInfo.dateOfBirth?calculateAge(item.athletes[subIndex].athleteInfo.dateOfBirth):"Over 18"}
                                </div>            
                                <div className="w-[20%] p-[5px]">
                                    {item.coachName}
                                </div>            
                                <div className="w-[20%] p-[5px]">
                                    {formatDateCustom(item.start)}
                                </div>            
                                <div className="w-[90px] flex justify-center items-center">
                                    <div className={`flex  text-white font-bold px-[10px] py-[6px] ${item.status==="Confirmed" ? "bg-green-500" : 
                                    item.status==="Pending" ? "bg-yellow-500" : "bg-red-500"} 
                                    rounded-full`}>
                                    {item.status}
                                    </div>
                                </div>            

                            </div>
                            ))}
                            </>
                        
                            }
                            </div>
                        ))
                        }
                        </>
                        }
    
                    </div>
                </div>
            </div>
            </div>
            </div>
            }
            </div>
            </DynamicScreen>
            </div>


    )
}