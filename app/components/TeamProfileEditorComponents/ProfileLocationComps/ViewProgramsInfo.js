import { useEffect, useState } from "react"
import ProgramOfferingsWrapper from "../EditorWrappers/ProgramOfferingsWrapper"
import { deleteMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/deleteEntriesByMatchingFields"
import { generateJsonList } from "@/app/hooks/firestoreHooks/adding/addInfoAsList"
import { addListOfJsons } from "@/app/hooks/firestoreHooks/adding/addInfoAsList"
import EditableInfoSection from "../EditableInfoSection"
import DisplayProgramsOffered from "../InfoDisplayWrappers/DisplayProgramsOffered"
import formatHoursOfOperations from "@/app/hooks/retrieveHoursOfOps"
import { generateJsonListGivenJsons } from "@/app/hooks/firestoreHooks/adding/addInfoAsList"

export default function ViewProgramsInfo({programsInfo}){

    const [programLevels,setProgramLevels]=useState(programsInfo.programLevels) //PENDING CHECJIUBG PROGRAMS INFO
    const [programTypes,setProgramTypes]=useState(programsInfo.programTypes)
    const [daysOfWeek,setDaysOfWeek]=useState(programsInfo.daysOfWeek)
    const [hourOfOpError,setHourOfOpError]=useState("")

    const [defaultProgramLevels,setDefaultProgramLevels]=useState(programsInfo.programLevels) //PENDING CHECJIUBG PROGRAMS INFO
    const [defaultProgramTypes,setDefaultProgramTypes]=useState(programsInfo.programTypes)
    const [defaultDaysOfWeek,setDefaultDaysOfWeek]=useState(programsInfo.daysOfWeek)
    const [locationId, setLocationId]=useState(programsInfo.locationId)
    const [teamId, setTeamId]=useState(programsInfo.teamId)

    const [stringifiedDaysOfWeek, setStringifiedDaysOfWeek] = useState(programsInfo.stringifiedDaysOfWeek)

    useEffect(()=>{
        let stringified = formatHoursOfOperations(daysOfWeek)
        setStringifiedDaysOfWeek(stringified)
    },[daysOfWeek])

    useEffect(()=>{
        setHourOfOpError("")
    },[daysOfWeek])


    return(
        <>

    <EditableInfoSection daysOfWeekHook={()=>{
                        
                        let missingHoursCounter = 0
                          for (const day of daysOfWeek){
                              if (day.checked){
                                if (day.hoursOfOps.length>0)
                                {
                                }
                                else{
                                missingHoursCounter+=1;
                                setHourOfOpError(day.day + " is missing hours of operation")
                                throw new Error("missing hops")
                                }
                              if (missingHoursCounter===0){
                                setHourOfOpError("")
                              }
                  
                              }
                            }}}
    EditableInfoWrapper={ProgramOfferingsWrapper} GeneralInfoDisplayWrapper={DisplayProgramsOffered} 
      fields={{
        programLevels:programLevels,
        setProgramLevels:setProgramLevels,
        programTypes:programTypes,
        setProgramTypes:setProgramTypes,
        daysOfWeek:daysOfWeek,
        setDaysOfWeek:setDaysOfWeek,
        hourOfOpError:hourOfOpError,
        noHeader:true
        }
      }
      displayFields={{
        daysOfWeek:stringifiedDaysOfWeek,
        programTypes:programTypes,
        programLevels:programLevels
      }}
      editButtonText={"programs offered"} 
      savingDefaultValuesOnCancel={
        [
          {value:defaultDaysOfWeek,
          setter:setDaysOfWeek
          },
          {
            value:defaultProgramLevels,
            setter:setProgramLevels
          },
          {
            value:defaultProgramTypes,
            setter:setProgramTypes
          }
        ]
    }
    toUpdateDefaultsOnSave={
        [
        {value:daysOfWeek,setter:setDefaultDaysOfWeek},
        {value:programLevels,setter:setDefaultProgramLevels},
        {value:programTypes,setter:setDefaultProgramTypes},
        ]
    }
    allStatesJson={
        {daysOfWeek:daysOfWeek,
        programLevels:programLevels,
        programTypes:programTypes
        }}
    headerText={"Programs offered"}
    onEdit={async()=>{

        try{


        if(programLevels != defaultProgramLevels){
            await deleteMatchingEntriesByAllFields({collectionName:'SkillLevel',matchParams:{locationId:locationId}})

            const firestoreSkillLevels = generateJsonListGivenJsons(programLevels,{locationId:locationId,teamId:teamId})
            const programLevelIds = await addListOfJsons({jsonList:firestoreSkillLevels,
            collectionName:"SkillLevel"})

        }

        if(programTypes!=defaultProgramTypes){
            await deleteMatchingEntriesByAllFields({collectionName:'LessonType',matchParams:{locationId:locationId}})
            const firestoreProgramTypes = generateJsonListGivenJsons(programTypes,{locationId:locationId,teamId:teamId})
            const programTypesIds = await addListOfJsons({jsonList:firestoreProgramTypes,
            collectionName:"LessonType"})

        }

        if(daysOfWeek!=defaultDaysOfWeek){
            await deleteMatchingEntriesByAllFields({collectionName:'OperationDayTime',matchParams:{locationId:locationId}})
            let dayTimes = []
            for (const day of daysOfWeek)
            {
                if(day.checked){
                if (day.hoursOfOps.length>0){
                    const dayHours = generateJsonList(day.hoursOfOps,"hour",
                    {day:day.day},
                    {locationId:locationId},
                    {teamId:teamId})
                    dayTimes.push(...dayHours)
                }}
            }
            const dayTimeIds = await addListOfJsons({jsonList:dayTimes,collectionName:"OperationDayTime"})
        }
        

    }catch(error)
    {
        console.log(error)
    }
    }
    }
    />


        </>
    )
}