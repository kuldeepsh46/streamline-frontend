"use client";

import DynamicScreen from "../components/DynamicScreen";
import ImageViewer from "../components/ImageViewer";
import BookingPanel from "../components/TeamPageComps/LessonBookingPanel/BookingPanel";
import SwimClubDescription from "../components/SwimClubDescription";
import GoogleMap from "../components/TeamPageComps/GoogleMap"
import TopBar from "../components/TopBarComps/TopBar";
import SafetyCertified from "../../public/SafetyCertified.svg"
import { useState, useRef, useEffect, useContext } from "react";
import AmenitiesSection from "../components/TeamPageComps/AmenitiesSection";
import HeadCoachSection from "../components/TeamPageComps/HeadCoachSection";
import { useRouter, useSearchParams,usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import LoadingSubScreen from "../components/loadingSubscreen";
import { getEntriesByConditions } from "../hooks/firestoreHooks/retrieving/getEntriesByConditions";
import { batchedGetEntriesByConditions } from "../hooks/firestoreHooks/retrieving/batchedGetEntriesByConditions";
import CONFIG from "@/config";
import ErrorBoundary from "../components/ErrorBoundary";


export default function TeamPage()  {

    const {loadingNewPage,loadingNewPageMessage,setLoadingNewPage,userInfo}=useAuth()

    // useEffect(()=>{
    //   setLoadingNewPage(false)
    // },[])

    const pathName = usePathname();
    const teamNameId = pathName.split('/').pop();

    const [teamName,setTeamName] = useState("Hello")
    const [teamDescription,setTeamDescription] = useState("Hi")
    const [programsAvailable,setProgramsAvailable]=useState([])
    const [classSizes,setClassSizes]=useState([])
    const [coachPhoto,setCoachPhoto]=useState([])
    const [coachName,setCoachName]=useState("")
    const [locationAddress,setLocationAddress]=useState("")
    // const [locationCoords,setLocationCoords]=useState({"lat":40.748817,"long":-73.985428})
    const [locationCoords,setLocationCoords]=useState(null)
    const [amenities,setAmenities]=useState([])
    const [headCoachDescription,setHeadCoachDescription]=useState("")

    const [lessonTypes,setLessonTypes] = useState("")
    const [lessonTypesMapping,setLessonTypesMapping] = useState(null)
    const [skillLevels,setSkillLevels] = useState("")

    const [locationState,setLocationState]=useState("")
    const [locationCity,setLocationCity]=useState("")

    const [images,setImages]=useState([])
    const [locationAvailability,setLocationAvailability]=useState(null)
    const [filteredEvents,setFilteredEvents]=useState(null)

    const [teamInfo,setTeamInfo]=useState(null)
    const [locationInfo,setLocationInfo]=useState(null)

    useEffect(()=>{

      const getTeamPageInfo = async() => {

        const flattenedName = teamNameId.split("-")[0];
        const locationId = teamNameId.split("-")[1];

        const today = new Date()
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() + 2); // Move to 

        const allLocationInfo = await batchedGetEntriesByConditions({queriesWithKeys:
        [{
          key:"teamInfo",
          queryConfig:{
            collectionName:'Team',
            conditions:[{field:"flattenedTeamName",operator:"==",value:flattenedName}]
          }}
          ,
          {
            key:"locationInfo",
            queryConfig:{
              collectionName:'Location',
              conditions:[{field:"id",operator:"==",value:locationId}]
            },
          },
          {
            key:"locationImages",
            queryConfig:{
              collectionName:'Images',
              conditions:[{field:"locationId",operator:"==",value:locationId},
              {field:"photoType",operator:"==",value:'location'}]
            },
          },
          {
            key:"locationOpsDays",
            queryConfig:{
              collectionName:'OperationDayTime',
              conditions:[{field:"locationId",operator:"==",value:locationId}]
            },
          },
          {
            key:"locationLessonSkills",
            queryConfig:{
              collectionName:'SkillLevel',
              conditions:[{field:"locationId",operator:"==",value:locationId}]
            },
          },
          {
            key:"locationLessonTypes",
            queryConfig:{
              collectionName:'LessonType',
              conditions:[{field:"locationId",operator:"==",value:locationId}]
            },
          },
          {
            key:"locationCoachInfo",
            queryConfig:{
              collectionName:'Coach',
              conditions:[{field:"locationId",operator:"==",value:locationId},
              {field:"coachType",operator:"==",value:"Head Coach"}]
            },
          },{
            key:"locationAmenities",
            queryConfig:{
              collectionName:'Amenities',
              conditions:[{field:"locationId",operator:"==",value:locationId}]
            },
          },{
            key:"locationAvailability",
            queryConfig:{
              collectionName:'TimeBlock',
              conditions:[{field:"start",operator:">",value:cutoff},
              {field:"locationId",operator:"==",value:locationId}]
            }
          }
          ]})

        

        function filterItemsByStatus({items,status}) {
        
          // Filter the list
          return items.filter(item => {
            
            return (
              item.status.toLowerCase() ==status && item.numberOfSpots>0
            );
          });
        }

        function createCategoryIndexMap(jsonList) {
          const map = new Map();
          jsonList.forEach((item, index) => {
              map.set(item.category, index);
          });
          return map;
        }
      

        setTeamInfo(allLocationInfo.teamInfo)
        setLocationInfo(allLocationInfo.locationInfo)
        setTeamName(allLocationInfo.teamInfo[0].teamName)
        setTeamDescription(allLocationInfo.teamInfo[0].teamDescription)
        setProgramsAvailable(allLocationInfo.locationLessonSkills.map(item=>item.level))
        const rawLocationSkills = allLocationInfo.locationLessonSkills
        const currSkillLevels = allLocationInfo.locationLessonSkills.map(item=>item.category)
        const locoSkillLevels = []
        const skillLevelsDict = CONFIG.skillLevels
        for (const skillLevel of currSkillLevels){
          locoSkillLevels.push({"skillLevel":skillLevel,"skillLevelDescription":skillLevelsDict[skillLevel]})
        }
        const listOfSkillLevels = Object.keys(CONFIG.skillLevels)
        const skillIndexMap = createCategoryIndexMap(rawLocationSkills)
        const orderedSkills = []
        for (const skillLevel of listOfSkillLevels){
          if(skillIndexMap.has(skillLevel)){
            orderedSkills.push(rawLocationSkills[skillIndexMap.get(skillLevel)])
          }
        }
        setProgramsAvailable(orderedSkills.map(item=>item.level))
        setSkillLevels(locoSkillLevels)
        
        const currLessonTypes = allLocationInfo.locationLessonTypes.map(item=>item.category)
        const locoLessonTypes = []
        const lessonTypesDict = CONFIG.lessonTypes
        const lessonTypesMapping = {}
        allLocationInfo.locationLessonTypes.forEach((item)=>{
          lessonTypesMapping[item.level]=item.category
        })
        allLocationInfo.locationLessonSkills.forEach((item)=>{
          lessonTypesMapping[item.level]=item.category
        })
        
        setLessonTypesMapping(lessonTypesMapping)
        for (const lessonType of currLessonTypes){
          
          locoLessonTypes.push({"lessonType":lessonType,"lessonTypeDescription":lessonTypesDict[lessonType]})
        }
        setLessonTypes(locoLessonTypes)

        setClassSizes(allLocationInfo.locationLessonTypes.map(item=>item.level))
        setCoachPhoto(allLocationInfo.locationCoachInfo[0].photoUrl)
        setCoachName(allLocationInfo.locationCoachInfo[0].coachName)
        setLocationCity(allLocationInfo.locationInfo[0].city)
        setLocationState(allLocationInfo.locationInfo[0].state)
        setLocationAddress(allLocationInfo.locationInfo[0].address)
        setLocationCoords({"long":allLocationInfo.locationInfo[0].longitude,"lat":allLocationInfo.locationInfo[0].latitude})

        const amenitiesList = allLocationInfo.locationAmenities.map(item=>item.selectedAmenities)

        setAmenities(amenitiesList)
        setHeadCoachDescription(allLocationInfo.locationCoachInfo[0].coachBio)

        setImages(allLocationInfo.locationImages.map(item=>item.imageUrl))

        const allTimeBlocks= allLocationInfo.locationAvailability

        const filteredAvailability = filterItemsByStatus({items:allTimeBlocks,status:"available"})

        function formatTimeIntervalsAsMap(data) {
          const result = new Map();
          const dateObjectsArray = []; // Array to store date objects
        
          // Helper function to convert Date object to 12-hour time format with AM/PM
          function to12HourFormat(date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12; // Convert 0 to 12 for AM
            return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
          }
          
          // Process each item in the data list
          data.forEach(({ id, start, end, lessonType }) => {
            if (!(start instanceof Date) || !(end instanceof Date)) {
              throw new Error("Both 'start' and 'end' must be Date objects.");
            }
        
            // Normalize the date to remove the time portion
            const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        
            // Format the time interval
            const startTime = to12HourFormat(start);
            const endTime = to12HourFormat(end);
            const timeInterval = `${startTime} - ${endTime}`;
        
            // Convert date to string for use as a key
            const startDateString = startDate.toDateString();

            // If the date is not already in the Map, initialize it with the header
            if (!result.has(startDateString)) {
              result.set(startDateString, [
                "Available times",
                startDate.toDateString().slice(0, startDate.toDateString().length - 4),
              ]);
              dateObjectsArray.push(startDate); // Add to the array of date objects
            }
            
            // Add the time interval with the id as a tuple to the Map
            result.get(startDateString).push([timeInterval, id,lessonType]);
          });
        
          return { datesMap: result, dates: dateObjectsArray };
        }
        
        
        const formattedDayTimes = formatTimeIntervalsAsMap(filteredAvailability)
        
        setLocationAvailability(formattedDayTimes)
        setFilteredEvents(filteredAvailability)

        
      }


      getTeamPageInfo()
      setTimeout(()=>{
        setLoadingNewPage(false)
        setIsPageLoading(false)
      },1000)
    },[])

    const [isPageLoading,setIsPageLoading]=useState(true)
    const trialLessonPrice = 30
    
    const checkAvailabilityRef = useRef(null)
    const coachRef = useRef(null)
    const [isDivVisible, setIsDivVisible] = useState(true); // Track visibility of the target div

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Lesson type dropdown setup
    const [selectedLessonType, setSelectedLessonType] = useState("")
    const [selectedSkillLevel, setSelectedSkillLevel] = useState("")

    const openModal = (index) => {
      setCurrentIndex(index);
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };

    const formatProgramsList = (items) => {
        if (items.length === 1) {
          // One item: Display the name followed by "programs"
          return `${items[0]} programs`;
        } else if (items.length === 2) {
          // Two items: Display items with "and" between them, and the second item in lowercase
          return `${items[0]} and ${items[1].toLowerCase()} programs`;
        } else if (items.length >= 3) {
          // Three or more items:
          const lastItem = items[items.length - 1].toLowerCase();
          const middleItems = items.slice(1, -1).map((item,index) => item.toLowerCase()).join(', ');
          return `${items[0]}, ${middleItems}, and ${lastItem} programs`;
        }
        return '';
      };
      
      const ProgramsList = ({ items }) => {
        return <div className="">{formatProgramsList(items)}</div>;
      };

    

    // KEEP TRACK OF LOWER SCREEN BOOKING PANEL
    useEffect(() => {
    // Observer callback to check visibility
    const observerCallback = (entries) => {
      console.log('Observer entries:', entries); // Debug here
        const [entry] = entries; // There will be only one entry for this div
        setIsDivVisible(entry.isIntersecting);
    };

    // Create an Intersection Observer
    const observer = new IntersectionObserver(observerCallback, {
        root: null, // Observe within the viewport
        threshold: [0.1,1], // Trigger if 10% of the div is visible
    });
    
    // Observe the target div
    if (checkAvailabilityRef.current) {
        observer.observe(checkAvailabilityRef.current);
    }

    return () => {
        // Cleanup the observer on unmount
        if (checkAvailabilityRef.current) {
        observer.unobserve(checkAvailabilityRef.current);
        }
    };
    }, [checkAvailabilityRef]);

    // Scroll to the target div when the button is clicked
    const scrollToDiv = () => {
    checkAvailabilityRef.current?.scrollIntoView({ behavior: "smooth",block:'center' });
    };

    const scrollToCoachDiv = () => {
        coachRef.current?.scrollIntoView({ behavior: "smooth",block:'center' });
    };
    

  return (
    <ErrorBoundary>
    <div className="flex  justify-center items-center w-screen">
      <DynamicScreen className="flex w-[98%] md:w-[82%] lg:[75%]">

        <TopBar/>

        {loadingNewPage || isPageLoading ? 
          <div className="h-screen">
            <LoadingSubScreen loadingMessage={loadingNewPageMessage.length>0 ? loadingNewPageMessage:null}/>
          </div>
          :
          <div className="flex flex-col">
        <div
        className="relative flex flex-col items-center justify-center w-full"
        >
        <div
            className="relative w-screen h-[1px] bg-gray-200 mt-[18px]"
          />  

        <div className="w-full mt-[20px] text-[20px] font-bold mb-[10px]">
        {teamName}
        </div>

        <div className="flex space-x-[10px] pb-[25px]">
            
                <div className="flex-1">
                <img
                    src={images[0]}
                    onClick={()=>{openModal(0)}}
                    className=
                    "aspect-square  object-cover w-full h-full cursor-pointer rounded-[15px]"
                />
                </div>
            
                <div className="hidden sm:block w-[50%] h-full">
                <div className="grid grid-cols-2 gap-[10px] h-full">
                    {images.slice(1,5).map((image, index) => (
                    <div
                    className=""
                    >
                    <img
                        key={index}
                        src={image}
                        className=
                        {
                        `w-full h-full object-cover transition-transform 
                        aspect-square cursor-pointer`
                        }
                        style={{
                            borderTopRightRadius:index==1?15:0,
                            borderBottomRightRadius:index==3?15:0,
                            borderTopLeftRadius:index==0?15:0,
                            borderBottomLeftRadius:index==2?15:0
                        }}
                        onClick={()=>{openModal(index+1)}}
                    />
                    </div>
                    ))} 

                </div>


        </div>
                <div className="absolute bottom-[40px] right-[20px] bg-white
                cursor-pointer text-[12px] font-bold border border-black
                px-2 py-2 rounded-full" onClick={()=>{openModal(0)}}>
                    Show all photos
                </div>

        </div>

                {isOpen &&
                <ImageViewer currentIndex={currentIndex} images={images}
                closeModal={closeModal} setCurrentIndex={setCurrentIndex}/>
                }
        </div>

        <div className="flex space-x-[20px]"
        style={{
            position:"sticky"
        }}>
        
        <div className="flex-1 ">
        
        <div
        className="font-bold text-[18px]"
        >
            Swim team in {locationCity}, {locationState}
        </div>
        
        <ProgramsList items={programsAvailable}/>

        <div className="flex space-x-[5px]">
        <div>
            Class size{classSizes.length>1?"s":""}:
        </div>
        <div className="font-bold">
            {classSizes.join(', ')}
        </div>

        </div>

        <div className="flex items-center space-x-[10px] mt-[15px]"
        >
        <img
                    src={coachPhoto}
                    className=
                    " w-[50px] h-[50px] rounded-[100px] cursor-pointer"
                    onClick={scrollToCoachDiv}
                />
            <div className="font-bold cursor-pointer" onClick={scrollToCoachDiv} >
            Coach {coachName}
            </div>
        </div>

        <div
            className="relative w-full h-[1px] bg-gray-200 mt-[30px]"
          />  
        <div className="h-[25px]"/>
        <SwimClubDescription swimClubDescription={teamDescription}/>

        <div
            className="relative w-full h-[1px] bg-gray-200 mt-[20px]"
          />  

        {/* SAFETY CERTIFICATION SECTION */}
        <div className="flex items-center mt-[15px]">
        <div>
        <SafetyCertified className="w-[90px]
        mt-[12px]"/>
        </div>
        <div className="flex flex-col text-[18px] font-bold ">
            <div>
                Safety Certified
            </div>
            <div className="text-[15px] text-gray-400 leading-5 ">
                {teamName}'s staff is fully certified and has passed all
                our rigorous safety checks
            </div>
        </div>
        </div>

        <div
            className="relative w-full h-[1px] bg-gray-200 mt-[20px] mb-[30px]"
          />  

        {/* AMENITIES SECTION */}

        <AmenitiesSection amenities={amenities}/>

        <div
            className="relative w-full h-[1px] bg-gray-200 mt-[30px] mb-[10px]"
          />  


        {/* MAP SECTION */}
        <div className="flex flex-col w-full mt-[35px]"/>
            {locationCoords&&<GoogleMap address={locationAddress} locationCoords={locationCoords}/>}
        
        <div
            className=" w-full h-[1px] bg-gray-200 mt-[30px] mb-[30px]"
          />  


        {/* Head coach section */}
        <div className="flex flex-col w-full mt-[25px]"
        ref={coachRef}
        />
            <HeadCoachSection coachName={coachName} coachPhoto={coachPhoto} coachBio={headCoachDescription}/>
        
        {!userInfo.teamInfo&&
          <>
          <div
            
            className=" w-full h-[1px] bg-gray-200 mt-[25px] mb-[35px]"
          />  
        

        {/* BOTTOM OF MOBILE PAGE BOOKING PANEL */}
        <div className="relative p-[20px] border border-gray-300 rounded-xl
        shadow-[0_0_10px_rgba(0,0,0,0.1)] "
        style={{zIndex:10}}
        >
            
            <div className="flex mb-[10px] font-bold space-x-[4px] items-end">
                <div className="text-[18px]">
                    Book your free trial lesson
                </div>
            </div>
            
            <div
            
            >
            <BookingPanel eventsList={filteredEvents} lessonTypesMapping={lessonTypesMapping} 
            filteredEvents={filteredEvents} key={1} subKey={1} lessonTypes={lessonTypes} skillLevels={skillLevels} locationAvailability={locationAvailability} locationInfo={locationInfo} teamInfo={teamInfo} images={images}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate} 
            selectedSkillLevel={selectedSkillLevel} setSelectedSkillLevel={setSelectedSkillLevel}
            selectedLessonType={selectedLessonType} setSelectedLessonType={setSelectedLessonType}
            selectedTime={selectedTime} setSelectedTime={setSelectedTime} 
            dateTimePositioning={"left-1/2 transform -translate-x-1/2 "}
            stackTimes={true}
            teamName={teamName} 
            lessonInfoDropdownStyling={"absolute border border-gray-300 border-[1px] flex bg-white left-0 top-full mt-2 py-2  rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)]"}
            />
            </div>

        </div>
          </>
        }

        <div
            ref={checkAvailabilityRef}
            style={{overflow:"visible"}}
            className=" w-full h-[1] bg-gray-200 mt-[32px] mb-[100px]"
          />  

        </div>
        

        {/* BIGGER SCREEN BOOK LESSON PANEL */}
        {!userInfo.teamInfo&&<div className={`
        hidden sm:block p-[20px] w-[35%] border border-gray-300 rounded-xl
        flex
        shadow-[0_0_10px_rgba(0,0,0,0.1)] ${selectedTime ?"" :""}`}

        style={{
          height:'fit-content',
            position: "sticky",
            // marginTop: `${scrollY}px`, // Adjust max height for stopping
            // transition: "top 0.2s ease-in-out",
          }}
        >

            <div className="flex mb-[10px] font-bold space-x-[4px] items-end">
                <div className="text-[16px]">
                    Book your free trial lesson
                </div>
            </div>
            

            
            <div>
            <BookingPanel eventsList={filteredEvents} lessonTypesMapping={lessonTypesMapping}  key={0} subKey={0} lessonTypes={lessonTypes} locationInfo={locationInfo} teamInfo={teamInfo} images={images}
            skillLevels={skillLevels} locationAvailability={locationAvailability}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            selectedSkillLevel={selectedSkillLevel} setSelectedSkillLevel={setSelectedSkillLevel}
            selectedLessonType={selectedLessonType} setSelectedLessonType={setSelectedLessonType}
            selectedTime={selectedTime} setSelectedTime={setSelectedTime}
            dateTimePositioning={"right-0"} teamName={teamName}
            lessonInfoDropdownStyling={"absolute  border border-gray-300 border-[1px] flex bg-white right-0 top-full mt-2 py-2  rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)]"}
            />
            </div>
            

        </div>}



        </div>
        
         {/* Fixed button that appears when the target div is out of view */}
        {!isDivVisible && (
            <button
            onClick={()=>{scrollToDiv();}}
            className="sm:hidden fixed font-bold bottom-[30px] px-[30px] py-[10px] left-1/2 transform -translate-x-1/2 bg-streamlineBlue text-white px-4 py-2 rounded-full
            shadow-[0_0_20px_rgba(0,0,0,0.15)]"
            >
            Check trial lesson availability
            </button>
        )}

        </div>}
      </DynamicScreen>
    </div>
    </ErrorBoundary>
  );
}
