import { getEntriesByMatching } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByMatching";
import InfoDropdown from "../InfoDropdown";
import LocationThumbnail from "./LocationThumbnail";
import { transformToDaysOfWeek, transformImagesListToJsons } from "@/app/hooks/firestoreHooks/retrieving/adjustingRetrievedData";
import { useState } from "react";
import LoadingSubScreen from "../../loadingSubscreen";
import EditableInfoSection from "../EditableInfoSection";
import DisplayLocationInfo from "../InfoDisplayWrappers/DisplayLocationInfo";
import LocationInfoWrapper from "../EditorWrappers/LocationInfoWrapper";
import ViewLocationInfo from "./ViewLocationInfo";
import CONFIG from "@/config";
import ViewProgramsInfo from "./ViewProgramsInfo";
import formatHoursOfOperations from "@/app/hooks/retrieveHoursOfOps";
import ViewCoachInfo from "./ViewCoachInfo";
import { useRouter } from "next/navigation";
import { changeField } from "@/app/hooks/changeField";
import { useAuth } from "@/app/contexts/AuthContext";

export default function TeamProfileLocationsSection({ locationsInfo,teamId,teamName }) {

  const router = useRouter()  
  const [isAddingNewLocation,setIsAddingNewLocation]=useState(false)

  const [retrievedSkillLevel,setRetrievedSkillLevel] = useState()
  const [retrievedLessonTypes,setRetrievedLessonTypes]=useState()
  const [daysOfWeek, setDaysOfWeek]=useState()
  const [retrievedAmenities,setRetrievedAmenities]=useState()
  const [stringifiedDaysOfWeek,setStringifiedDaysOfWeek]=useState()

  const [locationBeingView, setLocationBeingView]=useState(null)
  const [isViewingLocationInfo, setIsViewingLocationInfo] = useState(false)
  const [isLoadingLocationInfo, setIsLoadingLocationInfo] = useState(false)
  const [chosenLocationId,setChosenLocationId]=useState("")

  const [coachName,setCoachName]=useState("")
  const [coachDescription,setCoachDescription]=useState("")
  const [coachPhoto,setCoachPhoto]=useState("")
  const [coachPhone,setCoachPhone]=useState({"phoneNumber":"",isValid:null})
  const [coachEmail,setCoachEmail]=useState("")
  const [coachId,setCoachId]=useState("")

  const [selectedLocation,setSelectedLocation]=useState("")
  const {setLoadingNewPage}=useAuth()

  const pullLocoInfo = async({locationId}) => {
      setIsViewingLocationInfo(true)
      setIsLoadingLocationInfo(true)
      const locoAmenitiesFirestore = await getEntriesByMatching({collectionName:"Amenities",
      fields:{
        locationId:locationId
      }})
      
      const locoAmenitiesArray = []
      for (const locoAm of locoAmenitiesFirestore){
        locoAmenitiesArray.push(locoAm.selectedAmenities)
      }
      setRetrievedAmenities(locoAmenitiesArray)
      const firestoreLocationSkillLevel = await getEntriesByMatching({collectionName:"SkillLevel", fields:{locationId:locationId}})
      setRetrievedSkillLevel(firestoreLocationSkillLevel)

      const firestoreLocationLessonTypes = await getEntriesByMatching({collectionName:"LessonType", fields:{locationId:locationId}})
      setRetrievedLessonTypes(firestoreLocationLessonTypes)

      const firestoreDaysOfOp = await getEntriesByMatching({collectionName:"OperationDayTime", fields:{locationId:locationId}})
      const processedDaysHours = transformToDaysOfWeek(firestoreDaysOfOp)
      setDaysOfWeek(processedDaysHours)

      const stringifiedHours = formatHoursOfOperations(processedDaysHours)
      setStringifiedDaysOfWeek(stringifiedHours)

      const firestoreLocationCoach = await getEntriesByMatching({collectionName:"Coach", fields:{locationId:locationId,coachType:"Head Coach"}})
      setCoachName(firestoreLocationCoach[0].coachName)
      setCoachDescription(firestoreLocationCoach[0].coachBio)
      const formattedCoachImages = transformImagesListToJsons({list:[{imageUrl:firestoreLocationCoach[0].photoUrl}]})
      setCoachPhoto(formattedCoachImages)
      setCoachId(firestoreLocationCoach[0].id)
      setCoachEmail(firestoreLocationCoach[0].coachEmail)
      changeField({setDict:setCoachPhone,field:"phoneNumber",value:firestoreLocationCoach[0].coachPhone})


      const chosenLocation = findJsonById(locationsInfo,locationId)
      setLocationBeingView(chosenLocation)

      setIsLoadingLocationInfo(false)

      setChosenLocationId(locationId)

  }
    function findJsonById(jsonList, targetId) {
      return jsonList.find(item => item.id === targetId) || null;
    }

    const handleNavigateToAddLocation = () => {

      setLoadingNewPage(true)
      const isSigningUp = false
  
      // Construct the query string
      const query = new URLSearchParams({
        isSigningUp
      }).toString();
  
      // Navigate to teamName/profile with query parameters
      router.push(`/${teamName.toLowerCase().replace(" ","")}/createProfile?${query}`);
    };

    return (
 
      <div className="w-full">
        <div className="flex justify-between items-center mb-[16px]">
        <div className="text-[18px] font-bold text-streamlineBlue w-full">Team Locations</div>
        {!isAddingNewLocation&&<div className="flex text-[13px] font-bold text-white bg-green-500 px-[10px] py-[6px] rounded-full whitespace-nowrap space-x-[5px] items-center cursor-pointer" onClick={()=>{
          handleNavigateToAddLocation()}}>
          <div className="text-[16px]">
          +
          </div>
          <div>
          Add another location
          </div>
        </div>}
        </div>
        {/* <FaEllipsisV size={13} strokeWidth={0.5} /> */}
        {/* Parent Container */}
        {!isAddingNewLocation?
        <>
        <div className="w-full flex flex-col space-y-[16px] md:grid md:grid-cols-2 sm:space-y-[0px] md:gap-4 py-[10px]">
          {locationsInfo.map((location, idx) => (
            <LocationThumbnail location={location} key={idx} pullLocoInfo={pullLocoInfo} setSelectedLocation={setSelectedLocation} selectedLocation={selectedLocation}/>
          ))}
        </div>
        <div>
        {isViewingLocationInfo?
        <>
        {isLoadingLocationInfo?
          <div className="w-full h-[400px]">
            <LoadingSubScreen loadingMessage={"Loading location information"}/>
          </div>:
        <>
        <div className="w-full h-[1px] bg-gray-200 mb-[20px] mt-[16px]"/>
        <ViewLocationInfo
        locationsInfo={locationBeingView}
        retrievedAmenities={retrievedAmenities} setRetrievedAmenities={setRetrievedAmenities}
        />
        <div className="w-full h-[1px] bg-gray-200 mb-[20px] mt-[16px]"/>
        <ViewProgramsInfo programsInfo={{locationId:chosenLocationId,programLevels:retrievedSkillLevel, programTypes:retrievedLessonTypes,daysOfWeek:daysOfWeek, teamId:teamId, stringifiedDaysOfWeek:stringifiedDaysOfWeek}}/>
        <div className="w-full h-[1px] bg-gray-200 mb-[20px] mt-[16px]"/>
        <ViewCoachInfo coachInfo={
          {
            coachPhoto:coachPhoto,
            coachName:coachName,
            coachDescription:coachDescription,
            coachId:coachId,
            coachPhone:coachPhone.phoneNumber,
            coachEmail:coachEmail
          }
        }/>
        </>}
        </>

        
        :
        <>
        {isLoadingLocationInfo?
          <div className="w-full h-[400px]">
            <LoadingSubScreen loadingMessage={"Loading location information"}/>
          </div>:
        <>
        </>}
        </>
      }
        </div>
        </>:
        <>
        
        </>
        }
      </div>
    );
  }
  