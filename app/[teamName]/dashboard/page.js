"use client";

import { getEntriesByMatching } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByMatching";
import DynamicScreen from "@/app/components/DynamicScreen";
import TeamDashHeader from "@/app/components/TeamDashboard/TeamDashHeader";
import TopBar from "@/app/components/TopBarComps/TopBar";
import { useAuth } from "@/app/contexts/AuthContext";
import CONFIG from "@/config";
import { useState, useEffect, useRef, useMemo } from "react";
import LoadingSubScreen from "@/app/components/loadingSubscreen";
import MyCalendar from "@/app/components/TeamDashboard/CalendarComps/Calendar";
import ModalTemplate from "@/app/components/ModalTemplate";
// import InfoIcon from "../../../public/InfoIcon.svg"
// import LocationIcon from "../../../public/LocationIcon.svg"
// import NotifIcon  from "../../../public/NotifIcon.svg"
// import PeopleIcon  from "../../../public/PeopleIcon.svg"
// import ClockIcon  from "../../../public/ClockIcon.svg"
// import CalendarIcon  from "../../../public/CalendarIcon.svg"
// import PersonEntry from "@/app/components/TeamDashboard/CalendarComps/PersonEntry";
import EventModal from "@/app/components/TeamDashboard/CalendarComps/EventModal";
import AddAvailibilityModal from "@/app/components/TeamDashboard/CalendarComps/AddAvailabilityModal";
import { transformImagesListToJsons } from "@/app/hooks/firestoreHooks/retrieving/adjustingRetrievedData";
import { parseAddress } from "@/app/hooks/addressExtraction";
import "react-big-calendar/lib/css/react-big-calendar.css";
import getXWeeksData from "@/app/hooks/calendarHooks/getWeeksData";
// import { calculateAge } from "@/app/hooks/miscellaneous";
import LocationThumbnail from "@/app/components/TeamProfileEditorComponents/ProfileLocationComps/LocationThumbnail";

export default function TeamDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const [isDeactivated, setIsDeactivated] = useState(false); 
    const {userInfo, loadingNewPage, setLoadingNewPage} = useAuth();

    const [locationInfo, setLocationInfo] = useState({})
    const [allParsedAddresess, setAllParsedAddresses] = useState([])
    const [currentLocation, setCurrentLocation] = useState([])

    const availableColor = CONFIG.calendar.blockColors.available
    const pendingColor = CONFIG.calendar.blockColors.pending
    const confirmedColor = CONFIG.calendar.blockColors.confirmed

    const statuses = [{"Availability":availableColor}, {"Pending Approval":pendingColor}, {"Confirmed Lesson":confirmedColor}]

    const triggerTimeRef = useRef(null); 
    const intervalRef = useRef(null);
    const timesOfDay = CONFIG.timesOfDay
    const [retrievedCoaches, setRetrievedCoaches] = useState(null)
    const [currLocoCoaches, setCurrLocoCoaches] = useState(null)

    const [xWeeks, setXWeeks] = useState(3)
    const [currWeekNum, setCurrWeekNum] = useState(0) 

    const [currWeekEvents, setCurrWeekEvents] = useState(null)

    const calendarBounds = useMemo(() => {
        const minDate = new Date();
        const maxDate = new Date();
        minDate.setHours(0, 0, 0, 0); 
        maxDate.setHours(23, 0, 0, 0); 
        return { min: minDate, max: maxDate };
    }, []);

    function getMinMaxHours(data) {
        if (!data || data.length === 0) {
            return { minHour: 8, maxHour: 20 };
        }
        const hours = data
            .map(item => parseInt(item.hour))
            .filter(h => !isNaN(h));

        if (hours.length === 0) return { minHour: 8, maxHour: 20 };

        const minHour = Math.min(...hours);
        const maxHour = Math.max(...hours);

        return {
            minHour: minHour,
            maxHour: maxHour <= minHour ? minHour + 1 : maxHour
        };
    }
      
    const [currentDate, setCurrentDate] = useState(new Date())

    function filterItemsByWeekAndStatus(items, currentDate) {
        if (!items) return [];
        const now = new Date(currentDate);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); 
        startOfWeek.setHours(0, 0, 0, 0); 
      
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); 
        endOfWeek.setHours(23, 59, 59, 999); 
      
        return items.filter(item => {
          const startDate = new Date(item.start); 
          return (
            startDate >= startOfWeek &&
            startDate <= endOfWeek &&
            item.status.toLowerCase() !== "available"
          );
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
    }    

    const [events, setEvents] = useState(null);
    const [currDay, setCurrDay] = useState(new Date())
    const [isCalendarLoading, setIsCalendarLoading] = useState(true)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [teamDocId, setTeamDocId] = useState(null)

    useEffect(() => {
        const updateCal = async() => {
            if(!currentLocation?.id) return;
            setIsCalendarLoading(true)
            const newDate = new Date(currDay)
            newDate.setDate(currDay.getDate() + currWeekNum * 7)
            const weekEvents = await getXWeeksData({locationId: currentLocation.id, x: xWeeks, currDay: newDate})
            
            const formattedEvents = weekEvents?.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            })) || [];

            setCurrWeekEvents(filterItemsByWeekAndStatus(formattedEvents, currentDate))
            setEvents(formattedEvents)
            setCurrWeekNum(0)
            setCurrDay(newDate)
            setIsCalendarLoading(false)
        }
        
        if (Math.abs(currWeekNum) > xWeeks) {
            updateCal()
        } else if (events) {
            setCurrWeekEvents(filterItemsByWeekAndStatus(events, currentDate))
        }
    }, [currWeekNum])

    useEffect(() => {
        if (!userInfo?.userData?.firebaseId) return; 

        const initializeDashboard = async () => {
            try {
                const teamId = userInfo?.userData?.firebaseId;
                const teamResults = await getEntriesByMatching({ 
                    collectionName: "Team", 
                    fields: { firebaseId: teamId } 
                });
                
                if (teamResults && teamResults.length > 0) {
                    const teamDoc = teamResults[0];
                    setTeamDocId(teamDoc.id);
                    if (teamDoc.status === "inactive") {
                        setIsDeactivated(true);
                    } else if (teamDoc.status !== "Active") {
                        setIsPending(true);
                    } else {
                        setIsPending(false);
                        setIsDeactivated(false);
                        await getLocationInfo(teamDoc.id); 
                    }
                } else {
                    setIsPending(true);
                }
            } catch (error) {
                console.error("Dashboard initialization failed:", error);
            } finally {
                setIsLoading(false); 
            }
        };

        async function getLocationInfo(id) {
            const [locationsInfo, firestoreCoaches] = await Promise.all([
                getEntriesByMatching({ collectionName: "Location", fields: { teamId: id } }),
                getEntriesByMatching({ collectionName: 'Coach', fields: { teamId: id } })
            ]);

            if (!locationsInfo || locationsInfo.length === 0) {
                setIsLoading(false);
                return;
            }

            setRetrievedCoaches(firestoreCoaches);
            const retrievedLocations = {};
            const parsedAddresses = [];

            for (const location of locationsInfo) {
                const [imgs, hrs, types, skills] = await Promise.all([
                    getEntriesByMatching({ collectionName: "Images", fields: { teamId: id, locationId: location.id, photoType: "location" } }),
                    getEntriesByMatching({ collectionName: "OperationDayTime", fields: { locationId: location.id } }),
                    getEntriesByMatching({ collectionName: "LessonType", fields: { locationId: location.id } }),
                    getEntriesByMatching({ collectionName: "SkillLevel", fields: { locationId: location.id } })
                ]);

                location.images = transformImagesListToJsons({ list: imgs });
                location.skillLevels = skills ? skills.map(s => Object.keys(s)).flat() : [];
                location.lessonTypes = types ? types.map(t => Object.keys(t)).flat() : [];
                
                const { minHour, maxHour } = getMinMaxHours(hrs);
                location.parsedAddress = parseAddress({ address: location.address }) || {};
                location.maxHour = maxHour;
                location.minHour = minHour;
                location.operatingHours = hrs || []; 

                retrievedLocations[location.id] = location;
                parsedAddresses.push(location.parsedAddress);
            }

            const firstLoc = locationsInfo[0];
            const weekEvents = await getXWeeksData({ locationId: firstLoc.id, x: xWeeks, currDay: currDay });

            const dayMap = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
            
            const generatedSlots = (firstLoc.operatingHours || []).map(slot => {
                const targetDayIndex = dayMap[slot.day];
                if (targetDayIndex === undefined) return null;

                const slotDate = new Date(currentDate);
                const currentDayIndex = slotDate.getDay();
                const diff = targetDayIndex - currentDayIndex;
                
                const start = new Date(slotDate);
                start.setDate(slotDate.getDate() + diff);
                start.setHours(parseInt(slot.hour), 0, 0, 0);
                
                const end = new Date(start);
                end.setHours(start.getHours() + 1);

                return {
                    id: `reg-${slot.id}`,
                    title: "Available",
                    status: "Availability",
                    start: start,
                    end: end,
                };
            }).filter(s => s !== null);

            const formattedEvents = (weekEvents || []).map(event => ({
                ...event,
                start: event.start?.seconds ? new Date(event.start.seconds * 1000) : new Date(event.start),
                end: event.end?.seconds ? new Date(event.end.seconds * 1000) : new Date(event.end)
            }));

            const allEvents = [...formattedEvents, ...generatedSlots];
            
            setEvents(allEvents);
            setCurrWeekEvents(filterItemsByWeekAndStatus(allEvents, currentDate));
            
            setCurrentLocation(firstLoc);
            setCurrLocoCoaches(firestoreCoaches.filter(c => c.locationId === firstLoc.id));
            setSelectedLocation(firstLoc.id);
            setLocationInfo(retrievedLocations);
            setAllParsedAddresses(parsedAddresses);
            setIsCalendarLoading(false);
        }

        initializeDashboard();
    }, [userInfo?.userData?.firebaseId]); 

    const [pickedEvent, setPickedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const openEventModal = () => {setIsEventModalOpen(true)};
    const closeEventModal = () => setIsEventModalOpen(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addAvailibilityModalKey, setAddAvailibilityModalKey] = useState(0)
    const openAddModal = () => {setIsAddModalOpen(true)};
    const closeAddModal = () => {setIsAddModalOpen(false), setAddAvailibilityModalKey(1 + addAvailibilityModalKey)};

    const parentDivRef = useRef(null)
    const [selectedPage, setSelectedPage] = useState("dashboard")

    const handleSelectEvent = (event) => {
        setPickedEvent(event); 
        openEventModal()
    };

    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const openChangeModal = () => {setIsChangeModalOpen(true)};
    const closeChangeModal = () => setIsChangeModalOpen(false);

    const pullLocoInfo = async({locationId}) => {
        setIsCalendarLoading(true)
        const weekEvents = await getXWeeksData({locationId: locationId, x: xWeeks, currDay: currDay})
        
        const formattedEvents = weekEvents?.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        })) || [];

        setCurrWeekEvents(filterItemsByWeekAndStatus(formattedEvents, currentDate))
        setEvents(formattedEvents)
        setCurrentLocation(locationInfo[locationId])
        setCurrLocoCoaches(retrievedCoaches.filter(coach => locationId === coach.locationId));
        closeChangeModal()
        setIsCalendarLoading(false)
    }

    return (
    <div className="relative flex flex-col no-scroll overflow-x-hidden justify-center items-center"
        style={{ overflow: isEventModalOpen || isAddModalOpen ? 'hidden' : '' }}>
        
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

        <DynamicScreen className={`${isEventModalOpen || isAddModalOpen ? "min-h-screen w-[98%] no-scroll" : "w-[99%] min-h-screen no-scroll"} ${(!userInfo || !userInfo.userData) ? "blur-sm pointer-events-none" : ""}`}>

            <div className="flex flex-col min-h-screen no-scroll">
                <TeamDashHeader selectedPage={"dashboard"} setSelectedPage={setSelectedPage} setIsLoading={setIsLoading} />

                {isLoading || loadingNewPage ? (
                    <div className="items-center min-h-screen">
                        <LoadingSubScreen loadingMessage={!loadingNewPage ? `Loading team ${selectedPage}` : ""} />
                    </div>
                ) 
                : isDeactivated ? (
                    <div className="flex flex-col items-center justify-center flex-grow min-h-[60vh] p-10 text-center">
                        <div className="bg-white border border-red-100 shadow-xl p-10 rounded-2xl max-w-lg">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Account Deactivated</h2>
                            <p className="text-gray-500">This team account has been deactivated. Please contact the administrator for more information.</p>
                            <button onClick={() => window.location.href = "/"} className="mt-8 px-6 py-2 bg-red-600 text-white rounded-full">Go to Homepage</button>
                        </div>
                    </div>
                )
                : isPending ? (
                    <div className="flex flex-col items-center justify-center flex-grow min-h-[60vh] p-10 text-center">
                        <div className="bg-white border border-gray-100 shadow-xl p-10 rounded-2xl max-w-lg">
                            <h2 className="text-2xl font-bold text-streamlineBlue mb-2">Verification in Progress</h2>
                            <p className="text-gray-500">We are reviewing your team details. Please check back soon.</p>
                            <button onClick={() => window.location.reload()} className="mt-8 px-6 py-2 border border-streamlineBlue text-streamlineBlue rounded-full">Refresh Status</button>
                        </div>
                    </div>
                ) 
                : (
                    <div className="flex flex-col flex-grow">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-[5px] border border-gray-200 rounded-full shadow-[0_5px_6px_rgba(0,0,0,0.1)] py-[8px] px-[16px] items-center">
                                <div className="font-bold">Location:</div>
                                <div>{currentLocation?.parsedAddress?.streetAddress || "No Address Found"}</div>
                                {Object.keys(locationInfo).length > 1 && (
                                    <div className="text-streamlineBlue font-bold pl-[7px] text-[12px] cursor-pointer" onClick={() => { openChangeModal() }}>Change</div>
                                )}
                            </div>
                        </div>

                        <div className="w-full mt-[20px]">
                            <MyCalendar 
                                loading={isCalendarLoading}
                                events={events || []}
                                setPickedEvent={setPickedEvent} 
                                openEventModal={openEventModal} 
                                setCurrWeekNum={setCurrWeekNum} 
                                isCalendarLoading={isCalendarLoading} 
                                setIsCalendarLoading={setIsCalendarLoading} 
                                currWeekNum={currWeekNum} 
                                min={calendarBounds.min}
                                max={calendarBounds.max}
                                currentDate={currentDate} 
                                setCurrentDate={setCurrentDate} 
                                fullAddress={currentLocation?.address} 
                            />
                        </div>

                        <ModalTemplate isOpen={isChangeModalOpen} onClose={closeChangeModal}>
                            <div className="p-4">
                                {Object.keys(locationInfo).map((item, index) => (
                                    <LocationThumbnail key={index} location={locationInfo[item]} pullLocoInfo={pullLocoInfo} setSelectedLocation={setSelectedLocation} selectedLocation={selectedLocation} />
                                ))}
                            </div>
                        </ModalTemplate>

                        <ModalTemplate isOpen={isEventModalOpen} onClose={closeEventModal}>
                            {pickedEvent && (
                                <EventModal 
                                    pickedEvent={pickedEvent} 
                                    streetAddress={currentLocation?.parsedAddress?.streetAddress} 
                                    onClose={closeEventModal} 
                                    setCurrWeekEvents={setCurrWeekEvents} 
                                    setEvents={setEvents} 
                                    events={events} 
                                    currWeekEvents={currWeekEvents} 
                                    athletes={pickedEvent.athletes} 
                                    fullAddress={currentLocation.address} 
                                />
                            )}
                        </ModalTemplate>

                        <ModalTemplate onClose={closeAddModal} isOpen={isAddModalOpen} parentDivRef={parentDivRef}>
                            <AddAvailibilityModal 
                                key={addAvailibilityModalKey} 
                                parentDivRef={parentDivRef} 
                                lessonTypes={currentLocation?.lessonTypes} 
                                lessonSkills={currentLocation?.skillLevels} 
                                onClose={closeAddModal} 
                                teamId={teamDocId}
                                retrievedCoaches={currLocoCoaches} 
                                locationId={currentLocation?.id} 
                                events={events} 
                                setEvents={setEvents} 
                            />
                        </ModalTemplate>

                        <div className="flex w-full justify-end mt-4">
                            <div className="flex space-x-[5px] rounded-full text-white font-bold items-center px-4 py-2 bg-green-500 cursor-pointer" onClick={openAddModal}>
                                <span>+ Add Availability</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DynamicScreen>
    </div>
);
}