import CONFIG from "@/config";
import InfoIcon from "../../../../public/InfoIcon.svg"
import LocationIcon from "../../../../public/LocationIcon.svg"
import NotifIcon  from "../../../../public/NotifIcon.svg"
import PeopleIcon  from "../../../../public/PeopleIcon.svg"
import PersonEntry from "@/app/components/TeamDashboard/CalendarComps/PersonEntry";
import { useEffect, useState } from "react";
import { editingMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/editingEntryByAllFields";
import { addInfoAsJson } from "@/app/hooks/firestoreHooks/adding/addInfoAsJson";
import { getEntriesByMatching } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByMatching";
import { getEntriesByConditions } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByConditions";
import removeJsonByField, { appendToJsonSubListById, editJsonById } from "@/app/hooks/jsonHooks";
import { FaTrash } from "react-icons/fa";

import { deleteMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/deleteEntriesByMatchingFields";
import LoadingSubScreen from "../../loadingSubscreen";
import { changeField } from "@/app/hooks/changeField";
import { useAuth } from "@/app/contexts/AuthContext";
import sendMessage from "@/app/hooks/twilio/sendMessage";
import scheduleTwilioSms from "@/app/hooks/twilio/scheduleMessage";
import { formatEventTime, subtractTime } from "@/app/hooks/miscellaneous";

export default function EventModal ({pickedEvent,streetAddress,onClose,setCurrWeekEvents, setEvents,events,currWeekEvents,athletes,auxiliaryStatus,fullAddress}){
    
    const {userInfo}=useAuth()

    function processEntries(entries) {
        const firstEntries = new Set();
        const secondEntries = new Set();
      
        entries.forEach(entry => {
          const [first, second] = entry.split('`');
          if (first && second) {
            firstEntries.add(first.trim());
            secondEntries.add(second.trim());
          }
        });
      
        return {
          firstEntries: Array.from(firstEntries),
          secondEntries: Array.from(secondEntries)
        };
      }
      
    const [selectedSkillsLevels,setSelectedSkillLevels]=useState(null)
    const [selectedLessonTypes,setSelectedLessonTypes]=useState(null)
    console.log(pickedEvent.start.toISOString())

    useEffect(()=>{
        const {firstEntries,secondEntries} = processEntries(pickedEvent.lessonType)
        
        setSelectedLessonTypes(secondEntries)
        setSelectedSkillLevels(firstEntries)
    },[])

    const [rejectedStepOne,setRejectedStepOne] = useState(false)
    const [acceptedStepOne,setAcceptedStepOne] = useState(false)

    const [hasClickedSubmit,setHasClickedSubmit]=useState(false)

    const handleAcceptRequest = async() => {

        // await editingMatchingEntriesByAllFields({collectionName:"TimeBlock", matchParams:{"id":pickedEvent.availableSister},updateDate})
        setHasClickedSubmit(true)
        let foundSister=false
        events.forEach(async(item)=>{
            if (item.id == pickedEvent.availableSister){

            foundSister=true

            if (!item.confirmedSister){
                // CREATE NEWLY ACCEPTED EVENT OR CHECK FOR EXISTING CONFIRMED

                const newConfirmedEvent = {
                    coachEmail:pickedEvent.coachEmail,
                    coachName:pickedEvent.coachName,
                    coachPhone:pickedEvent.coachPhone,
                    createdOn:new Date(),
                    day:pickedEvent.day,
                    end:pickedEvent.end,
                    lessonType:pickedEvent.lessonType,
                    locationId:pickedEvent.locationId,
                    reminder:pickedEvent.reminder,
                    start:pickedEvent.start,
                    status:"Confirmed",
                    numberOfAthletes:1,
                    teamId:pickedEvent.teamId,
                    title:pickedEvent.title,
                    availableSister:pickedEvent.availableSister,
                    athletes:athletes,
                    contact:pickedEvent.contact
                }

                const createdEntryId = await addInfoAsJson({jsonInfo:newConfirmedEvent,collectionName:"TimeBlock"})

                await editingMatchingEntriesByAllFields({collectionName:"LessonBookings",matchParams:{lessonId:pickedEvent.id},updateData:{lessonId:createdEntryId}})

                const editedEvents= editJsonById({fieldName:"confirmedSister",fieldValue:createdEntryId,setter:setEvents,id:pickedEvent.availableSister,jsonList:events}) 

                await editingMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{id:pickedEvent.availableSister},updateData:{confirmedSister:createdEntryId}})

                await deleteMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{id:pickedEvent.id}})
                
                const updatedEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setEvents,jsonList:editedEvents})
                const updatedCurrWeekEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setCurrWeekEvents,jsonList:currWeekEvents})
                
                setEvents([...updatedEvents,newConfirmedEvent])

                const newCurrEvents = [...updatedCurrWeekEvents,newConfirmedEvent]

                const sortedNewCurrEvents = newCurrEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

                setCurrWeekEvents(sortedNewCurrEvents)

                onClose()
            }else{

                
                
                let confirmedSister;
                
                events.forEach(item=>{if(item.availableSister==pickedEvent.availableSister){confirmedSister=item}})

                await editingMatchingEntriesByAllFields({collectionName:"LessonBookings",matchParams:{'lessonId':pickedEvent.id},updateData:{lessonId:confirmedSister.id}})
                
                const updatedCurrWeekEvents = appendToJsonSubListById({fieldMappings:{"athletes":athletes,"contact":pickedEvent.contact,"numberOfAthletes":1},setter:setCurrWeekEvents,jsonList:currWeekEvents,id:confirmedSister.id})
                const updatedEvents = appendToJsonSubListById({fieldMappings:{"athletes":athletes,"contact":pickedEvent.contact,"numberOfAthletes":1},setter:setEvents,jsonList:events,id:confirmedSister.id})
                const finalizedEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setEvents,jsonList:updatedEvents})
                const finalizedCurrWeekEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setCurrWeekEvents,jsonList:updatedCurrWeekEvents})

                setEvents(finalizedEvents)
                setCurrWeekEvents(finalizedCurrWeekEvents)
                await deleteMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{id:pickedEvent.id}})

                await editingMatchingEntriesByAllFields({collectionName:"TimeBlock", matchParams:{"id":item.confirmedSister},updateData:{athletes:[...confirmedSister.athletes,...athletes],contact:[...confirmedSister.contact,...pickedEvent.contact],numberOfAthletes:confirmedSister.numberOfAthletes+1}})
                onClose()
            }

            }
        })

        if(!foundSister){

            const newConfirmedEvent = {
                coachEmail:pickedEvent.coachEmail,
                coachName:pickedEvent.coachName,
                coachPhone:pickedEvent.coachPhone,
                createdOn:new Date(),
                day:pickedEvent.day,
                end:pickedEvent.end,
                lessonType:pickedEvent.lessonType,
                locationId:pickedEvent.locationId,
                reminder:pickedEvent.reminder,
                start:pickedEvent.start,
                status:"Confirmed",
                numberOfAthletes:1,
                teamId:pickedEvent.teamId,
                title:pickedEvent.title,
                availableSister:pickedEvent.availableSister,
                athletes:athletes,
                contact:pickedEvent.contact
            }

            const createdEntryId = await addInfoAsJson({jsonInfo:newConfirmedEvent,collectionName:"TimeBlock"})

            await deleteMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{id:pickedEvent.id}})
            
            const updatedEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setEvents,jsonList:events})
            const updatedCurrWeekEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setCurrWeekEvents,jsonList:currWeekEvents})
            
            setEvents([...updatedEvents,newConfirmedEvent])

            const newCurrEvents = [...updatedCurrWeekEvents,newConfirmedEvent]

            const sortedNewCurrEvents = newCurrEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

            setCurrWeekEvents(sortedNewCurrEvents)            

            onClose()
        }

        const reservationDateTime = formatEventTime({startTime:pickedEvent.start,endTime:pickedEvent.end})

        const message = `Hi ${pickedEvent.contact[0].fullName}. Your trial lesson with ${userInfo.teamInfo.teamName} on ${reservationDateTime} has been accepted by Coach ${pickedEvent.coachName} (contact: ${pickedEvent.coachPhone}). \n\nPlease be sure to arrive at least 10 minutes before your lesson. \n\nLocation address: ${fullAddress}. \n\nIf you can no longer attend, please be sure to inform the coach BEFORE the scheduled time.
        `

        const scheduledMessageTime = subtractTime(pickedEvent.start,pickedEvent.reminder.quantity,pickedEvent.reminder.metric)


        const scheduledAthleteMessage = `Hi ${pickedEvent.contact[0].fullName}. This is a courtesy reminder that your trial lesson with ${userInfo.teamInfo.teamName} on ${reservationDateTime} is coming up soon. Happy Swimming!`;
        const scheduledCoachMessage = `Hi Coach ${pickedEvent.coachName}. This is a courtesy reminder that your trial lesson with ${pickedEvent.contact[0].fullName} on ${reservationDateTime} is coming up soon. Please reach out to the swimmer if there are any changes in your schedule at your earliest convenience.`

        const athleteContactNumber = pickedEvent.contact[0].phoneNumber
        console.log(scheduledMessageTime,pickedEvent.start,pickedEvent.reminder)
        if(scheduledMessageTime){
            await scheduleTwilioSms(scheduledAthleteMessage,athleteContactNumber,scheduledMessageTime,'America/Toronto')
            await scheduleTwilioSms(scheduledCoachMessage,pickedEvent.coachPhone,scheduledMessageTime,'America/Toronto')
        }
        
        sendMessage(
            athleteContactNumber
            ,message)

    }
    console.log(pickedEvent.id)
    const handleRejectRequest=async()=>{


        const editedEvents= editJsonById({fieldName:"status",fieldValue:"Cancelled",setter:setEvents,id:pickedEvent.id,jsonList:events}) 
        const editedCurrEvents= editJsonById({fieldName:"status",fieldValue:"Cancelled",setter:setEvents,id:pickedEvent.id,jsonList:currWeekEvents}) 

        // const currEvent = pickedEvent
        let foundSister=false

        // currEvent["status"] = "Cancelled"

        events.forEach((item)=>{if(item.id==pickedEvent.availableSister){
            foundSister=true
            editingMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"id":item.id},updateData:{numberOfSpots:item.numberOfSpots+1}})
            editingMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"id":pickedEvent.id},updateData:{status:"Cancelled"}})
            
            const editedAvailEvents= editJsonById({fieldName:"numberOfSpots",fieldValue:item.numberOfSpots+1,setter:setEvents,id:pickedEvent.availableSister,jsonList:editedEvents}) 
            const editedAvailCurrEvents= editJsonById({fieldName:"numberOfSpots",fieldValue:item.numberOfSpots+1,setter:setEvents,id:pickedEvent.availableSister,jsonList:editedCurrEvents}) 
            
            
            setEvents(editedAvailEvents)
            setCurrWeekEvents(editedAvailCurrEvents)
            onClose()
        }
    
    
        })

        if(!foundSister){
            await editingMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"id":pickedEvent.id},updateData:{status:"Cancelled"}})
            
            setEvents(editedEvents)
            setCurrWeekEvents(editedCurrEvents)
            onClose()

        }

        const reservationDateTime = formatEventTime({startTime:pickedEvent.start,endTime:pickedEvent.end})

        const message = `Hi ${pickedEvent.contact[0].fullName}. Your requested trial lesson with ${userInfo.teamInfo.teamName} on ${reservationDateTime} has been cancelled by Coach ${pickedEvent.coachName} (contact: ${pickedEvent.coachPhone}). \n\nPlease request another trail lesson at another time or reach out to the coach if you have any questions.
            `
        const athleteContactNumber = pickedEvent.contact[0].phoneNumber
        sendMessage(
            athleteContactNumber
            ,message)

    }

    const [isDeleting,setIsDeleting]= useState(false)
    const [loadingDeleteMenu,setLoadingDeleteMenu]=useState(true)
    const [seriesInfo,setSeriesInfo]=useState(null)
    useEffect(()=>{

        const getSeries = async()=>{
            const retrieveSeriesInfo = await getEntriesByConditions({collectionName:'TimeBlockSeries',conditions:[{field:"id",value:pickedEvent.seriesId,operator:"=="}]})
            
            setSeriesInfo(retrieveSeriesInfo[0])
            const starter = new Date(retrieveSeriesInfo[0].startDate.seconds*1000)
            const ender  = new Date(retrieveSeriesInfo[0].endDate.seconds*1000)
            changeField({setDict:setSeriesInfo,field:"dateStart",value:starter})
            changeField({setDict:setSeriesInfo,field:"dateEnd",value:ender})
            setLoadingDeleteMenu(false)
            
        }

        if(pickedEvent.seriesId){
            getSeries()
            setLoadingDeleteMenu(false)

        }else{
            setLoadingDeleteMenu(false)
        }

    },[])

    

    const handleDeleteEvent = async() => {

        const updatedEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setEvents,jsonList:events})
        const updatedCurrWeekEvents = removeJsonByField({fieldName:"id",fieldValue:pickedEvent.id,setter:setCurrWeekEvents,jsonList:currWeekEvents})
        setEvents([...updatedEvents])
        setCurrWeekEvents([...updatedCurrWeekEvents])
        onClose()
        
        await deleteMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"id":pickedEvent.id}})
    }

    const handleDeleteSeries = async() => {
        const updatedEvents = removeJsonByField({fieldName:"seriesId",fieldValue:pickedEvent.seriesId,setter:setEvents,jsonList:events})
        const updatedCurrWeekEvents = removeJsonByField({fieldName:"seriesId",fieldValue:pickedEvent.seriesId,setter:setCurrWeekEvents,jsonList:currWeekEvents})
        setEvents([...updatedEvents])
        setCurrWeekEvents([...updatedCurrWeekEvents])
        onClose()

        await deleteMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"seriesId":pickedEvent.seriesId,"status":"Available"}})

    }

    const dayMap= {
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday",
        sun: "Sunday",
      };
      
      
    return(
        <>
                <div className="p-[8px]"  style={{
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}} >
                    {(!isDeleting&&pickedEvent.status.toLowerCase()=="available")&&<div className="absolute top-[10px] h-[20px] right-[42px] cursor-pointer" >
                        <FaTrash className="text-gray-400 w-[14px] h-[20px] hover:text-black" onClick={()=>{
                            if(pickedEvent.seriesId){setLoadingDeleteMenu(true)}
                            setIsDeleting(true)}}/>
                    </div>}

                    {isDeleting?
                    <div>
                        {
                        pickedEvent.seriesId?
                        <div>

                            {true?
                            <>
                            <div className="text-[14px] text-center">
                                This event belongs to the following weekly series:
                            </div>
                            <div className="flex justify-center text-[14px] space-x-[5px] text-center mt-[10px] mb-[5px]">
                                <div className="text-[14px] font-bold text-center">
                                    Days:
                                </div>
                                <div className=" text-[14px] text-center">
                                {seriesInfo.days
                                    ?.map((day) => dayMap[day.toLowerCase()] || day) // Convert to full name, fallback to original if not found
                                    .join(" - ")}
                                </div>
                            </div>
                            <div className="text-[14px] flex justify-center space-x-[30px]  text-center">
                                <div className=" flex justify-center space-x-[5px] text-[14px] text-center">
                                    <div className="text-[14px] font-bold text-center">
                                        Start Date: 
                                    </div>
                                    <div className="  text-[14px] text-center">
                                        {seriesInfo.dateStart.toDateString()}
                                    </div>
                                </div>
                                <div className="flex justify-center text-[14px] space-x-[5px] text-center">
                                    <div className="text-[14px] font-bold text-center">
                                        Date: 
                                    </div>
                                    <div className="  text-[14px] text-center">
                                    {seriesInfo.dateEnd.toDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex mt-[12px] justify-center items-center space-x-[30px]  w-full">
                                        <div className={`py-[6px] text-[14px] px-[10px] text-white font-bold bg-red-500 rounded-full cursor-pointer ${hasClickedSubmit?"opacity-50":""}`} onClick={async()=>{await handleDeleteSeries()}}>
                                            Delete entire series
                                        </div>
                                        <div className={`py-[6px] text-[14px] px-[10px] text-white font-bold bg-red-500 rounded-full cursor-pointer ${hasClickedSubmit?"opacity-50":""}`} onClick={async()=>{await handleDeleteEvent()}}>
                                            Delete only this event
                                        </div>

                                        <div className="font-bold text-[14px] text-streamlineBlue cursor-pointer" onClick={()=>{setIsDeleting(false)}}>
                                            Cancel
                                        </div>
                            </div>
                            </>
                            :
                            <div className="w-[100px] h-[100px]">
                                <LoadingSubScreen/>
                            </div>
                            }
                            
                        </div>
                        :
                        <div>
                        <div>
                            Are you sure you want to delete this event?
                        </div>
                        <div className="flex mt-[12px] justify-center items-center space-x-[50px]  w-full">
                                    <div className={`py-[6px] px-[10px] text-white font-bold bg-red-500 rounded-full cursor-pointer ${hasClickedSubmit?"opacity-50":""}`} onClick={async()=>{await handleDeleteEvent()}}>
                                        Yes, delete this event
                                    </div>

                                    <div className="font-bold text-streamlineBlue cursor-pointer" onClick={()=>{setIsDeleting(false)}}>
                                        No
                                    </div>
                        </div>
                        </div>

                        }

                    </div>
                        :
                    <>
                    {pickedEvent && 
                    <div className="relative">



                    <div className="flex flex-col">
                    <div className="flex items-center space-x-[16px] mt-[10px]">

                    <div className="flex w-[22px] justify-center items-center">
                    <div className="flex w-[14px] h-[14px] rounded-[4px] "
                    style={{backgroundColor:CONFIG.calendar.blockColors[auxiliaryStatus?auxiliaryStatus.toLowerCase():pickedEvent.status.toLowerCase()]}}/>
                    </div>
                    
                        <div className="flex font-bold   text-[18px]">
                        {pickedEvent.title} 
                        </div>
                    </div>

                    </div>
                    <div className="ml-[38px] flex  text-[14px]">
                    {formatEventTime({startTime:pickedEvent.start,endTime:pickedEvent.end})}
                    </div>

                    <div className="flex flex-col pt-[8px]">
                    <div className="flex items-center space-x-[16px]">
                    <div className="flex w-[22px] mt-[5px] justify-center items-center">
                    <InfoIcon/>
                    </div>
                    <div className="flex flex-col ">
                        <div className="flex leading-[14px] text-[14px] mt-[5px]">
                        <div className="font-bold mr-[4px]">
                        Status:
                        </div>    
                        <div>
                        {auxiliaryStatus?auxiliaryStatus:pickedEvent.status}
                        </div>    
                        </div>
                    </div>
                    </div>
                    </div>

                    {(selectedLessonTypes&&(userInfo.teamInfo||userInfo.userData==null))&&
                    <>
                    {(pickedEvent.numberOfSpots||pickedEvent.numberOfAthletes)&&<div className="flex text-[14px] ml-[38px]">
                    {pickedEvent.numberOfSpots?
                        <>
                        <div className="font-bold mr-[4px]">
                        Spots:
                        </div>    
                        <div>
                        {pickedEvent.numberOfSpots}
                        </div>    
                        </>:
                        <>
                        <div className="font-bold mr-[4px]">
                        Attendees:
                        </div>
                        <div className=" mr-[4px]">
                        {pickedEvent.numberOfAthletes} {CONFIG.athleteType}{pickedEvent.numberOfAthletes>1?"s":""}
                        </div>    
                        </>
                    }
                    </div>}
                    <div className="text-[14px] leading-[8px] mt-[5px] mb-[3px] ml-[38px] font-bold">
                        {pickedEvent.status=="Available"?"Applicable lesson types:":"Lesson type"}
                    </div>
                    <div className="text-[14px] ml-[38px] ">
                        {selectedLessonTypes.join(", ")}
                    </div>
                    <div className="text-[14px] leading-[8px] mt-[8px] mb-[3px] ml-[38px] font-bold">
                    {pickedEvent.status=="Available"?"Applicable skill levels:":"Skill level"}
                    </div>
                    <div className="text-[14px]  ml-[38px] ">
                        {selectedSkillsLevels.join(", ")}
                    </div>
                    </>}

                    <div className="flex flex-col mt-[4px]">
                    <div className="flex items-center space-x-[16px]">

                    <div className="flex w-[22px] py-[12px] justify-center items-center">
                    <LocationIcon/>
                    </div>
                        <div className="flex flex-col">
                            <div className="flex  text-[14px]">
                            {streetAddress}
                            </div>
                        </div>
                    </div>
                    </div>


                    <div className="flex items-center py-[12px] space-x-[15px] mt-[3px]">

                    <div className="flex w-[22px] justify-center items-center">
                    <NotifIcon/>
                    </div>

                    <div className="flex  text-[14px]">
                    { `Reminder: ${pickedEvent.reminder.quantity} ${pickedEvent.reminder.metric} before`} 
                    </div>
                    
                    </div>
                    {(pickedEvent.coachName || athletes) &&
                    <>
                    <div className="flex items-center pt-[10px] space-x-[16px]">

                    <div className="flex w-[22px] justify-center items-center">
                    <PeopleIcon/>
                    </div>

                    
                    <div className="flex font-bold text-[14px]">
                    {pickedEvent.coachName?"Coach":CONFIG.athleteType}
                    </div>
                    
                    </div>

                    <div className="ml-[7px] space-y-[14px]">

                    {pickedEvent.coachName&&<PersonEntry personInfo={
                        {
                            fullName:pickedEvent.coachName,
                            email:pickedEvent.coachEmail,
                            phoneNumber:pickedEvent.coachPhone
                            }}/>}

                    {athletes &&
                    <>
                    {athletes.length>0&&<>
                    {pickedEvent.coachName&&<div className="flex font-bold ml-[32px] text-[14px] mt-[6px] pt-[4px]">
                    {CONFIG.athleteType}{athletes.length>1?"s":""}
                    </div>}

                    {athletes.map((athlete,index)=>
                    (
                    
                    athlete.athleteInfo.phoneNumber?
                    <PersonEntry key={index} personInfo={
                          {
                            fullName:athlete.fullName,
                            email:athlete.athleteInfo.emailAddress,
                            phoneNumber:athlete.athleteInfo.phoneNumber
                            }}/>
                    :
                    <div key={index}>
                    <PersonEntry  personInfo={
                        {
                          fullName:athlete.fullName
                          }}/>

                    <div className="leading-[10px] mt-[4px] w-full text-[14px] ml-[73px] mb-[6px]">
                        {athlete.fullName.split(" ")[0]}'s contact:
                    </div>
                    <PersonEntry noIcon={true} personInfo={
                        {
                          fullName:pickedEvent.contact[index].fullName,
                          email:pickedEvent.contact[index].emailAddress,
                          phoneNumber:pickedEvent.contact[index].phoneNumber
                        }}
                    />
                    </div>
                            
                    ))}
                    </>}
                    
                    </>
                    }

                    </div>

                    </>

                    }

                    {/* BUTTONS AT THE END */}
                    {(pickedEvent.status.toLowerCase()=="pending"&&(userInfo.teamInfo||userInfo.userData==null)&&!auxiliaryStatus)&&
                        <div className="flex space-y-[12px] flex-col w-full justify-center items-center mt-[25px]">

                        {
                            (!rejectedStepOne&&!acceptedStepOne)?
                            <>
                            <div className="text-white font-bold py-[8px] text-center w-[240px]    cursor-pointer text-[14px] rounded-full " style={{backgroundColor:CONFIG.calendar.blockColors.confirmed}} onClick={()=>{setAcceptedStepOne(true)}}>
                            Accept trial lesson request
                            </div>
                            <div className="text-white font-bold py-[8px] text-center w-[240px] cursor-pointer text-[14px] rounded-full bg-red-500" onClick={()=>{setRejectedStepOne(true)}}>
                                Reject trial lesson request 
                            </div>        
                            </>:
                            <>
                            {rejectedStepOne?
                             <div className="flex flex-col items-center justify-center text-[14px] w-[270px] mb-[20px]" >
                             <div className="flex leading-[18px] mb-[16px] text-center">
                                 Are you sure you want to reject this trial lesson reservation? The {CONFIG.athleteType.toLowerCase()} will be notified of your response.
                             </div>
                             <div className="flex justify-center items-center space-x-[12px] justify-between w-full px-[12px]">
                                 <div className="py-[6px] px-[10px] text-white font-bold rounded-full cursor-pointer bg-red-500" onClick={async ()=>{await handleRejectRequest()}}>
                                     Yes, reject trial lesson
                                 </div>

                                 <div className="font-bold   px-[10px] text-streamlineBlue cursor-pointer" onClick={()=>{setRejectedStepOne(false)}}>
                                     No
                                 </div>
                             </div>
                         </div>
                            :
                            <div className="flex flex-col items-center justify-center text-[14px]  mb-[20px]" style={{width:'280px'}}>
                                <div className="flex leading-[18px] mb-[16px] text-center">
                                    Are you sure you want to accept this trial lesson reservation? The {CONFIG.athleteType.toLowerCase()} will be notified of your response.
                                </div>
                                <div className="flex justify-center items-center space-x-[62px]  w-full">
                                    <div className={`py-[6px] px-[10px] text-white font-bold bg-green-500 rounded-full cursor-pointer ${hasClickedSubmit?"opacity-50":""}`} onClick={()=>{handleAcceptRequest()}}>
                                        Yes, accept trial lesson
                                    </div>

                                    <div className="font-bold text-streamlineBlue cursor-pointer" onClick={()=>{setAcceptedStepOne(false)}}>
                                        No
                                    </div>
                                </div>
                            </div>
                            }
                            </>
                        }
                        <div className="font-bold text-streamlineBlue text-[14px] py-[8px] cursor-pointer" onClick={()=>{onClose()}}>
                            Go back to dashboard
                        </div>                
                        
                    </div>        }
                </div>
                    }
                    </>}
                </div>
        </>
    )
}