"use client";

import DynamicScreen from "./components/DynamicScreen";
import TopBar from "./components/TopBarComps/TopBar";
import SearchBar from "./components/searchBarComps/SearchBar";
import SwimTeamsMenu from "./components/SwimTeamsMenu";
import { useAuth } from "./contexts/AuthContext";
import LoadingSubScreen from "./components/loadingSubscreen";
import { useEffect, useState } from "react";
import { getEntriesByConditions } from "./hooks/firestoreHooks/retrieving/getEntriesByConditions";
import CONFIG from "@/config";
import { batchedGetEntriesByConditions } from "./hooks/firestoreHooks/retrieving/batchedGetEntriesByConditions";
import { changeField } from "./hooks/changeField";

export default function Home() {
  
  const {isFetchingUserInfo,loadingNewPage,loadingNewPageMessage,setLoadingNewPage}  = useAuth();

  const [teamLocations,setTeamLocations] = useState([])
  const [filteredTeamLocos,setFilteredTeamLocos] = useState([])
  const [loadingTeams,setLoadingTeams]=useState(true)
  const [onlySearchResults,setOnlySearchResults]=useState(false)
  const [loadingSearchResults,setLoadingSearchResults]=useState(false)

  const [locations,setLocations]=useState(null)
  const [selectedLocationIds,setSelectedLocationIds]=useState([])

  const [daysOfWeek,setDaysOfWeek] = useState(CONFIG.daysOfWeek);
  const [timesOfDay,setTimesOfDay] = useState(CONFIG.timesOfDay);

  const [selectedLessonType, setSelectedLessonType] = useState(null)
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(null)

  const [locoIdsToHours,setLocoIdsToHours]=useState({})
  const [hoursToIds,setHoursToIds]=useState()

  let biggestPrice = 200;
  const [desiredMaxPrice, setDesiredMaxPrice] = useState(biggestPrice);
  const [desiredMinPrice, setDesiredMinPrice] = useState(0);

  const [locationsToAvailability,setLocationsToAvailability]=useState(null)

  const cities=new Set()
  const [citiesToIds,setCitiesToIds]=useState({})

  const addCityAndId = (city, state,locationId) => {
    const cityState = `${city}, ${state}`;
    cities.add(cityState)
    
    setCitiesToIds(prev => ({
      ...prev,
      [cityState]: prev[cityState] ? [...prev[cityState], locationId] : [locationId]
    })); 

  };

  const pickedHoursSet = (jsonList) => {
    const myHoursSet = new Set()
    return jsonList.reduce((acc, item) => {
        

        // Create concatenated strings of day + each hour
        item.hoursBreakdown.forEach(hour => {
            myHoursSet.add(`${item.day}${hour}`);
        });

        return myHoursSet;
    }, {});
};

  const hasIntersection = (setA, setB) => {
    if (setA.size > setB.size) [setA, setB] = [setB, setA]; // Swap to iterate over smaller set
    return [...setA].some(item => setB.has(item));
  };  

  useEffect(()=>{

    const getTeamLocations = async() => {

      const locations =  await getEntriesByConditions({collectionName:"Location",
        conditions:[{field:'status',operator:'==',value:'Verified'}]
      })

      const getUniqueDays = (data) => {
        const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysSet = new Set(data.map((item) => item.day?.substring(0, 3)));
        return daysOrder.filter(day => daysSet.has(day));
      };

      const getHoursOfOp = (existingData = {}) => (newData) => {
        return newData.reduce((acc, item) => {
            const key = `${item.day}${item.hour}`; // Create key by concatenating day and hour
    
            if (!acc[item.locationId]) {
                acc[item.locationId] = new Set();
            }
            acc[item.locationId].add(key); // Add key to the locationId set
    
            return acc;
        }, existingData);
    };
  

      const processHours = getHoursOfOp();     

    let hoursOfOpsToIds
      const updatedLocations = await Promise.all(
        locations.map(async (location) => {
          const daysHoursOps = await getEntriesByConditions({
            collectionName: "OperationDayTime",
            conditions: [{ field: "locationId", operator: "==", value: location.id }],
          });
    
          const uniqueDays = getUniqueDays(daysHoursOps);

          changeField({setDict:setLocoIdsToHours,field:location.id,value:daysHoursOps})
          
          const locationImages = await getEntriesByConditions({
            collectionName: "Images",
            conditions: [
              { field: "locationId", operator: "==", value: location.id },
              { field: "photoType", operator: "==", value: "location" },
            ],
          });
          const listOfLocationImages = locationImages.map((item) => item.imageUrl);
          
          if (location.state.length < 3) {
            if (CONFIG.abbreviationToState[location.state]) {
              addCityAndId(location.city, CONFIG.abbreviationToState[location.state],location.id, [location.city,location.state]);
              
            } else {
              addCityAndId(location.city, location.state,location.id,[location.city,location.state]);
              
            }
          } else {
            addCityAndId(location.city, location.state,location.id,[location.city,location.state]);
            
          }
          hoursOfOpsToIds= processHours(daysHoursOps)
          

          const teamInfo = await getEntriesByConditions({
            collectionName: "Team",
            conditions: [{ field: "id", operator: "==", value: location.teamId }],
          });
          
           
          const myLocations = [...cities].map((location, index) => ({
            id: index,
            checked: false,
            location: location
          }))
          
          setLocations(myLocations);

          return {
            ...location,
            uniqueDays,
            images: listOfLocationImages,
            teamInfo: teamInfo.length > 0 ? teamInfo[0] : null,
          };
        })
      );
      

      setLocationsToAvailability(hoursOfOpsToIds)
      setTeamLocations(updatedLocations)
      setFilteredTeamLocos(updatedLocations)
      setLoadingTeams(false)
    }
    
    
    getTeamLocations()
    if(!isFetchingUserInfo){
      setLoadingNewPage(false)
    }
  },[isFetchingUserInfo])
  
  const getCommonIds = ({ a, b, c, d }, { useA, useB, useC, useD }) => {
    // Collect only the active sets
    
    console.log(a, b, c, d)
    console.log(useA, useB, useC, useD)
    const activeSets = [];
    if (useA) activeSets.push(a);
    if (useB) activeSets.push(b);
    if (useC) activeSets.push(c);
    if (useD) activeSets.push(d);

    // If no criteria are active, return an empty set
    if (activeSets.length === 0) return new Set();

    // Find intersection by reducing over the sets
    return activeSets.reduce((acc, set) => new Set([...acc].filter(id => set.has(id))));
};


  const searchTeams = async() => {
    setOnlySearchResults(true)
    setLoadingSearchResults(true)
    const lessonTypeConditions = [selectedLessonType].map(item=>
    (
      {
        key:`ApplicableByLessonTypePrice`,
        queryConfig:{
          collectionName:'LessonType',
          conditions:[{'field':"category",'operator':'==',value:item},{'field':'price','operator':'<=',value:desiredMaxPrice},{'field':'price','operator':'>=',value:desiredMinPrice}]
        }}
    ))
    const skillTypeConditions = [selectedSkillLevel].map(item=>
      (
        {
          key:`ApplicableBySkillType`,
          queryConfig:{
            collectionName:'SkillLevel',
            conditions:[{'field':"category",'operator':'==',value:item}]
          }}
      ))
    const matchedTeams = await batchedGetEntriesByConditions({
      queriesWithKeys:[
        ...lessonTypeConditions,
        ...skillTypeConditions]
    })

    const daysHoursOfOps = daysOfWeek.map(item=>({
      ...item,
      hoursBreakdown : item.checked?item.hoursOfOps.flatMap(item=>CONFIG.timingToHours[item]||[]).flat():[].flat()
    }))
    const setOfPickedHours = pickedHoursSet(daysHoursOfOps)

    const availabilityMatchedLocations=new Set()
    
    Object.keys(locationsToAvailability).forEach(item=>{
      if (hasIntersection(locationsToAvailability[item],setOfPickedHours)){
        availabilityMatchedLocations.add(item)
      }
    })

    const matchedByType = matchedTeams.ApplicableByLessonTypePrice.map(item=>item.locationId)
    const matchedBySkill = matchedTeams.ApplicableBySkillType.map(item=>item.locationId)

    const selectedLocos = new Set(selectedLocationIds)
    const skillTypeLocos = new Set(matchedBySkill)
    const lessonTypeLocos = new Set(matchedByType)

    const useSelectedLocos = selectedLocationIds.length>0
    const useTimeLocos = setOfPickedHours.size>0
    const useTypeLocos = selectedLessonType
    const useSkillLocos=selectedSkillLevel

    const criteria = {a:selectedLocos,b:availabilityMatchedLocations,c:skillTypeLocos,d:lessonTypeLocos}
    
    const settings = {useA:useSelectedLocos,useB:useTimeLocos,useC:useSkillLocos,useD:useTypeLocos}
    
    if(settings.useA||settings.useB||settings.useC||settings.useD){
    const desiredLocos = getCommonIds(criteria,settings)
    setFilteredTeamLocos(teamLocations.filter(item=>desiredLocos.has(item.id)))
    setLoadingSearchResults(false)
    }else{
      setFilteredTeamLocos(teamLocations)
      setLoadingSearchResults(false)
    }
  }

  useEffect(()=>{
    if (locations){
    const pickedLoco = locations
    .filter(loco => loco.checked) // Keep only items where checked is true
    .map(loco => loco.location); 

    const locoIds = new Set(pickedLoco.flatMap(item => citiesToIds[item] || []));

    setSelectedLocationIds([...locoIds])
  }
  }
  ,[locations])

  return (
    <div className="flex  justify-center items-center">
      <DynamicScreen className=" w-[98%]">

        <div className="flex flex-col min-h-screen ">


        <TopBar/>

        {loadingTeams?
          <div className={"h-screen"}>
          <LoadingSubScreen/>
          </div>
          :
        <div className="h-[100%]">
        {(isFetchingUserInfo || loadingNewPage) && !loadingTeams ?
        <div className="h-screen">
          <LoadingSubScreen loadingMessage={loadingNewPage?loadingNewPageMessage:null}/>
        </div>
        :
          <>
        <div
        className="relative flex flex-col items-center justify-center w-full pt-[10px]"
        >
          <div className="flex font-bold text-[18px] text-center mb-[12px] mt-2">
            <div>
            Find Your
            </div>
            <div className="px-[8px] text-streamlineBlue">
            Swim
            </div>
            <div>
            Team
            </div>
          </div>


            {/* SearchBar with high z-index */}
          <div className="relative flex justify-center z-40 w-full ">
            <SearchBar searchTeams={searchTeams} locations={locations} setLocations={setLocations} setDaysOfWeek={setDaysOfWeek} timesOfDay={timesOfDay} setTimesOfDay={setTimesOfDay} daysOfWeek={daysOfWeek} selectedLessonType={selectedLessonType} setSelectedLessonType={setSelectedLessonType} selectedSkillLevel={selectedSkillLevel} setSelectedSkillLevel={setSelectedSkillLevel} desiredMaxPrice={desiredMaxPrice} desiredMinPrice={desiredMinPrice} setDesiredMaxPrice={setDesiredMaxPrice} setDesiredMinPrice={setDesiredMinPrice} biggestPrice={biggestPrice}/>
          </div>

          {/* Gray line with lower z-index */}
          <div
            className="relative z-0 w-screen h-[1px] bg-gray-200 mt-[20px]"
          />

        </div>

        {loadingSearchResults?
        <>
        <LoadingSubScreen loadingMessage={'Loading search results'}/>
        </>:
        onlySearchResults?
          <>
        <div className="text-[18px] flex justify-between items-center font-semibold mt-[14px] mb-4">
            <div>
            Search results
            </div>
            <div className="py-[6px] text-[14px] px-[8px] rounded-full bg-streamlineBlue text-white font-bold cursor-pointer" onClick={()=>{setOnlySearchResults(false)}}>
            Show all teams
            </div>
        </div>
        {filteredTeamLocos.length>0?
          <SwimTeamsMenu teamLocations={filteredTeamLocos}/>:
          <div className="font-bold text-gray-400 text-[16px] flex-1 h-full text-center px-[20%] pt-[40px]">
             There are no teams matching all the criteria you provided. Please change the criteria and try again.
          </div>
        }
        </>:
        <>
             <div className="text-[18px] font-semibold mt-[18px] mb-4">
          All Partnered Swim Teams
        </div>
        <SwimTeamsMenu teamLocations={teamLocations}/>
        </>
        }


        </>}
        </div>}
        
        <div className="h-[50px]"/>

        </div>
      </DynamicScreen>
    </div>
  );
}
