"use client";

import { useState, useEffect, useRef } from "react";
import ClockIcon  from "../../../../public/ClockIcon.svg"
import CalendarIcon  from "../../../../public/CalendarIcon.svg"
import NotifIcon  from "../../../../public/NotifIcon.svg"
//Create availability modal imoprts
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
// import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import { StaticTimePicker,PickersActionBar } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import WeekdayPicker from "@/app/components/TeamDashboard/CalendarComps/DayPicker";
import { DayPicker } from "react-day-picker";
import PeopleIcon  from "../../../../public/PeopleIcon.svg"
import InfoIcon  from "../../../../public/InfoIcon.svg"
import PersonEntry from "./PersonEntry";
import ProfileEntryEditor from "../../TeamProfileEditorComponents/ProfileEntryEditor";
import MultiFieldPhoneEntry from "../../AuthModalComps/MultiFieldPhoneEntry";
import { addListOfJsons, generateJsonList, generateJsonListGivenJsons } from "@/app/hooks/firestoreHooks/adding/addInfoAsList";
import { addInfoAsJson } from "@/app/hooks/firestoreHooks/adding/addInfoAsJson";
import getRelevantDates, { consolidateDate } from "@/app/hooks/getRelevantDates";
import CheckboxDropdown from "./SelectLessonCategories";
import CONFIG from "@/config";
import { useAuth } from "@/app/contexts/AuthContext";


export default function AddAvailibilityModal({onClose,setAddAvailibilityModalKey,teamId, addAvailibilityModalKey,locationId,events,setEvents,retrievedCoaches,lessonSkills,lessonTypes,parentDivRef}){

    const {userInfo}=useAuth()
    const [hasSubmitted,setHasSubmitted]=useState(false)
    const timePickerRef = useRef(null);
    // Create availibility stuffs
    const [startTime, setStartTime] = useState({ hrs: null, mins: null, xm: null });
    const [pickerStartTime,setPickerStartTime]=useState(dayjs().set('hour',0).set('minute',0));
    const [pickerEndTime,setPickerEndTime]=useState(dayjs().set('hour',0).set('minute',0));
    const [endTime, setEndTime] = useState({ hrs: null, mins: null, xm: null });
    const [isPickingTime,setIsPickingTime]=useState(false)
    const [isPickingStart,setIsPickingStart]=useState(null)
    const [openView, setOpenView] = useState('hours');

    const [selectedLocationLessonSkills,setSelectedLocationLessonSkills]=useState([])
    const [selectedLocationLessonTypes,setSelectedLocationLessonTypes]=useState([])

    // Reconstruct the original arrays
    function reconstructOriginalArrays(lessonTypes) {
        const selectedLocationLessonSkills = new Set();
        const selectedLocationLessonTypes = new Set();
    
        lessonTypes.forEach(combination => {
        const [skill, type] = combination.split("`"); // Split the string at the '-'
        selectedLocationLessonSkills.add(skill); // Add the skill to the set
        selectedLocationLessonTypes.add(type);  // Add the type to the set
        });
    
        // Convert sets to arrays
        return {
        selectedLocationLessonSkills: Array.from(selectedLocationLessonSkills),
        selectedLocationLessonTypes: Array.from(selectedLocationLessonTypes),
        };
    }

    // Handler for time change
    const handleTimeChange = (newValue) => {

        
        if(isPickingStart){
        setPickerStartTime(newValue)
        if (newValue) {
        let hr = newValue.hour()==0 ? 12:newValue.hour()
        setStartTime({
            hrs: hr, // Extract hours from the Day.js object
            mins: newValue.minute(), // Extract minutes from the Day.js object
            xm: newValue.format('A'), // Extract "AM" or "PM"
        });
        }
        }else{
        setPickerEndTime(newValue)
        let hr = newValue.hour()==0 ? 12:newValue.hour()
        setEndTime({
            hrs: hr, // Extract hours from the Day.js object
            mins: newValue.minute(), // Extract minutes from the Day.js object
            xm: newValue.format('A'), // Extract "AM" or "PM"
        }); 
        }
    };

    const CustomActionBar = (props) => {
        const { onAccept } = props;
        return (
          <PickersActionBar
            {...props}
            actions={['accept']} // Only show the OK button
          />
        );
      };

    const daysOWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const [daysPicked, setDaysPicked] = useState(
        daysOWeek.map((day) => ({ day: day.toLowerCase(), isPicked: false }))
    );
    const [isWeeklyOccurrence,setWeeklyOccurrence]=useState(null)
    const [isPickingDays,setPickingDays]=useState(null)
    const [selectedDates, setSelectedDates] = useState([]);
    const currentDate = new Date();
    const xDaysLater = new Date(currentDate);
    xDaysLater.setDate(currentDate.getDate() + 3);

    const [startDate,setStartDate]=useState(null)
    const [endDate,setEndDate]=useState(null)
    const [selectingStartEndDates,setSelectingStartEndDates]=useState(false)
    const [selectingStartDate,setSelectStartDate]=useState(false)

    const [isDaySelected,setIsDaySelected]=useState(false)

    

    useEffect(()=>{
        const isSelected = daysPicked.some((day) => day.isPicked === true);
        setIsDaySelected(isSelected);
    },[daysPicked])

    const [numberOfSpots,setNumberOfSpots]=useState(1)
    const [addAnotherCoach, setAddAnotherCoach]=useState(false)

    const [newCoachName,setNewCoachName]=useState("")
    const [newCoachEmail,setNewCoachEmail]=useState("")
    const [newCoachNumber,setNewCoachNumber]=useState({phoneNumber:"",isValid:false})


    const [coaches,setCoaches]=useState([...retrievedCoaches])
    const [selectedCoachId,setSelectedCoachId] = useState(null)
    const [reminderQuant,setReminderQuant]=useState(1)
    const [reminderMetric,setReminderMetric]=useState('days')

    function getPickedDays(daysPicked) {
        return daysPicked
            .filter((day) => day.isPicked) // Filter only picked days
            .map((day) => day.day);       // Return the 'day' value
    }

    // const parentDivRef = useRef(null)

    const handleSubmit = async() => {

        if(isWeeklyOccurrence){

            setHasSubmitted(true)
            const listODays = getPickedDays(daysPicked)
            const seriesId = await addInfoAsJson({jsonInfo:{startTime:startTime, endTime:endTime,days:listODays, startDate:startDate,endDate:endDate},collectionName:'TimeBlockSeries',locationId:locationId,createdOn:new Date()})

            const lessonTypes = [];

                // Loop through both arrays to create combinations
                selectedLocationLessonSkills.forEach(skill => {
                selectedLocationLessonTypes.forEach(type => {
                    lessonTypes.push(`${skill}\`${type}`);
                });
            });

            const relevantDates = getRelevantDates({startDate:startDate,endDate:endDate,daysPicked:daysPicked,timeObjStart:startTime,timeObjEnd:endTime,lessonType:lessonTypes,coach:selectedCoachId!=null?coaches[selectedCoachId]:null,numberOfSpots:numberOfSpots,sendCoachSMS:userInfo.userData.smsAgreement,reminder:{quantity:reminderQuant,metric:reminderMetric}})

            
            const allTimeBlocks = generateJsonListGivenJsons(relevantDates,{teamId:teamId,locationId:locationId,seriesId:seriesId,createdOn:new Date()})
            const timeBlockId = await addListOfJsons({jsonList:allTimeBlocks,collectionName:'TimeBlock'})
            
            // Assign the IDs back to allTimeBlocks in order
            const updatedTimeBlocks = allTimeBlocks.map((block, index) => ({
                ...block,  // Keep existing properties
                id: timeBlockId[index],  // Assign corresponding ID
            }));
            
            setEvents([...events,...updatedTimeBlocks])
            
            onClose()
            setAddAvailibilityModalKey(addAvailibilityModalKey+1)
        }else{

            setHasSubmitted(true)
            const daysOWeekFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let currEvents = []
            const coach = selectedCoachId ? coaches[selectedCoachId]:null
            for (const date of selectedDates){
                const startDateTime = consolidateDate({timeObj:startTime,now:date})
                const newDate = new Date(date)
                const endDateTime = consolidateDate({timeObj:endTime,now:newDate})

                const lessonTypes = [];

                // Loop through both arrays to create combinations
                selectedLocationLessonSkills.forEach(skill => {
                selectedLocationLessonTypes.forEach(type => {
                    lessonTypes.push(`${skill}\`${type}`);
                });
                });
                
                currEvents = [...currEvents, 
                    {start:startDateTime,
                    end:endDateTime,
                    day:daysOWeekFull[date.getDay()],
                    status:'Available',
                    title : coach ? `Coach ${coach.coachName.split(" ")[0]} - Trial lesson` : 'Trial lesson',
                    reminder:{quantity:reminderQuant,metric:reminderMetric},
                    coachName:coach?coach.coachName:null,
                    coachEmail:coach?coach.coachEmail:null,
                    coachPhone:coach?coach.coachPhone:null,    
                    lessonType:lessonTypes,
                    numberOfSpots:numberOfSpots,
                    sendCoachSMS:userInfo.userData.smsAgreement
                    }]
            }

            
            const allTimeBlocks = generateJsonListGivenJsons(currEvents,{teamId:teamId,locationId:locationId,createdOn:new Date()})
            
            
            const timeBlockId = await addListOfJsons({jsonList:allTimeBlocks,collectionName:'TimeBlock'})
            
            const updatedTimeBlocks = allTimeBlocks.map((block, index) => ({
                ...block,  // Keep existing properties
                id: timeBlockId[index],  // Assign corresponding ID
            }));
            
            setEvents([...events,...updatedTimeBlocks])
            onClose()
            setAddAvailibilityModalKey(addAvailibilityModalKey+1)
            
        }

    }

    const scrollToBottom = () => {
        
        if (parentDivRef.current) {
          parentDivRef.current.scrollTo({
            top: parentDivRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
        
      };
    

    return(
        <div className="flex flex-col p-[6px] items-center justify-center " style={{
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}} ref={parentDivRef}>

                    <div className="mt-[4px] font-bold text-center">
                        Add trial lesson availability
                    </div>

                    <div className="w-full h-[1px] bg-gray-200 mt-[8px] mb-[4px]"/>

                    <div className="flex flex-col overflow-y-auto justify-center items-center">

                    <div className="flex space-x-[8px] w-full items-center mt-[12px] mb-[8px]">
                        <div className="flex w-[25px] justify-center">
                        <ClockIcon/>
                            </div>
                    <div className="text-[14px] font-bold">
                        Lesson Time
                    </div>
                    </div>
                    <div>
                    <div className="flex items-center justify-center space-x-[4px]">
                    
                    {/* {((isPickingStart&&isPickingTime) || !isPickingTime)&& */}
                    <>
                    <div className="text-[14px] mr-[4px]">
                        Start
                    </div>
                    <div className={`border rounded-[12px] p-[2px] px-[6px] cursor-pointer ${isPickingTime&&isPickingStart?"border-streamlineBlue border-[2px]":""}`} onClick={()=>{setIsPickingStart(true);setIsPickingTime(true);setOpenView('hours')}}>
                        {(startTime.hrs || startTime.hrs==0) && (startTime.mins || startTime.mins==0) && startTime.xm ? 
                        <div>
                            {startTime.hrs>12?startTime.hrs-12:startTime.hrs}:{startTime.mins<10?'0'+startTime.mins:startTime.mins} {startTime.xm}
                        </div> : 
                        <div className="text-gray-500">
                            Select time
                        </div>
                        }
                    </div>
                    </>
                    {/* } */}

                    {/* {((!isPickingStart&&isPickingTime) || !isPickingTime)&& */}
                    <>
                    <div className="text-[14px] pl-[8px] pr-[3px]">
                        End
                    </div>

                    <div className={`border rounded-[12px] p-[2px] px-[6px] cursor-pointer ${isPickingTime&&!isPickingStart?"border-streamlineBlue border-[2px]":""}`}onClick={()=>{setIsPickingStart(false);setIsPickingTime(true);setOpenView('hours')}}>
                        {(endTime.hrs || endTime.hrs==0) && (endTime.mins || endTime.mins==0) && endTime.xm ? 
                        <div>
                            {endTime.hrs>12?endTime.hrs-12:endTime.hrs}:{endTime.mins<10?'0'+endTime.mins:endTime.mins} {endTime.xm}
                        </div> : 
                        <div className="text-gray-500">
                            Select time
                        </div>
                        }
                    </div>
                    </>
                    {/* } */}

                    </div>
                    {isPickingTime &&
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <StaticTimePicker orientation="portrait"
                      defaultValue={isPickingStart? (pickerStartTime?pickerStartTime:null):(pickerEndTime?pickerEndTime:null)}
                      openTo={openView}
                      onViewChange={(view)=>{
                        setOpenView(view)}}
                      onChange={handleTimeChange} 
                      
                      onAccept={()=>{
                        setOpenView('minutes');
                        setIsPickingTime(false)}}
                      slots={{ actionBar: CustomActionBar }} // Use the custom action bar
                      value={isPickingStart?pickerStartTime:pickerEndTime}
                      ref={timePickerRef}
                      />
                    </LocalizationProvider>}
                    </div>


                    {/* COACHES AND SPOTS */}
                    <div className="flex flex-col mt-[16px] w-full items-center">
                        <div className="flex w-full space-x-[10px] items-center">

                        <div className="flex w-[25px] justify-center">
                        <PeopleIcon/>
                        </div>
                        <div className="font-bold text-[14px]">
                            Coach & Spots
                        </div>
                        </div>

                        <div className="pl-[40px] w-full justify-center">
                        <div className="flex w-full mt-[4px] justify-center items-center">
                            <div className="text-[14px]">
                                Number of spots
                            </div>

                            <div className="flex space-x-[14px] ml-[20px] items-center select-none">
                            <div className={`font-bold select-none text-gray-500 mb-[2px] text-[24px] p-[5px] ${numberOfSpots==1 ? "opacity-50":"cursor-pointer"}`} 
                            style={{
                                userSelect: "none", // Prevent text selection
                                WebkitUserSelect: "none", // Safari
                                MozUserSelect: "none", // Firefox
                                msUserSelect: "none",}} 
                            onClick={()=>{if(numberOfSpots>1){setNumberOfSpots(numberOfSpots-1)}}}>-</div>
                            <div className="flex border rounded-[12px] p-[6px] text-center">
                            {numberOfSpots}
                            </div>
                            <div className={`font-bold select-none text-[24px] text-gray-500 p-[5px] cursor-pointer`} 
                            style={{
                                userSelect: "none", // Prevent text selection
                                WebkitUserSelect: "none", // Safari
                                MozUserSelect: "none", // Firefox
                                msUserSelect: "none",}} 
                            onClick={()=>{setNumberOfSpots(numberOfSpots+1)}}>+</div>
                            </div>


                        </div>
                        
                        <div className="flex items-center text-[14px] py-[4px]">
                            <div className="flex flex-col w-[100px] sm:w-[145px] ">
                            
                            <div className="leading-[14px] mt-[6px] text-gray-500 text-center">
                                Select coach or 
                            </div>
                            <div className="bg-streamlineBlue px-[8px] py-[4px] rounded-[16px] font-bold mt-[6px] text-[12px] text-center text-white cursor-pointer" onClick={()=>{setAddAnotherCoach(true)}}>
                                Add another coach
                            </div>
                            </div>

                            <div>
                                <div style={{
                                    userSelect: "none", // Prevent text selection
                                    WebkitUserSelect: "none", // Safari
                                    MozUserSelect: "none", // Firefox
                                    msUserSelect: "none",}}>
                                {coaches.map((item,index)=>(
                                    <div key={index} className={`py-[3px] cursor-pointer hover:opacity-100 ${selectedCoachId==index ? "": "opacity-50"}`} onClick={()=>{setSelectedCoachId(index)}}>
                                        <PersonEntry personInfo={{fullName:item.coachName,email:item.coachEmail,phoneNumber:item.coachPhone}}/>
                                    </div>
                                )
                                )}
                                </div>
                            </div>

                        </div>

                        {addAnotherCoach &&<>
                             <div className="space-y-[4px] mt-[8px]">
                                <ProfileEntryEditor prompt={"Full name"} 
                                placeholder={'Coach name'}
                                response={newCoachName}
                                setResponse={setNewCoachName}
                                />
                                <ProfileEntryEditor prompt={"Contact email (optional)"} 
                                placeholder={'Email address'}
                                response={newCoachEmail}
                                setResponse={setNewCoachEmail}
                                />

                                <MultiFieldPhoneEntry
                                prompt={'Phone number'}
                                placeholder={'Phone number'}
                                setFieldResponse={setNewCoachNumber}
                                fieldResponse={newCoachNumber}
                                field={'phoneNumber'} customLength={"w-[180px]"}/>
                        </div>

                        <div className="flex w-full justify-center mt-[12px] space-x-[16px]  items-center">

                        <div className="text-streamlineBlue py-[6px] font-bold cursor-pointer" onClick={()=>{setAddAnotherCoach(false);
                        setAddAvailibilityModalKey(addAvailibilityModalKey+1);setNewCoachEmail("");setNewCoachName("");setNewCoachNumber({phoneNumber:"",isValid:false})
                        }}>
                            Cancel
                        </div>

                        <div className={`font-bold bg-streamlineBlue text-white px-[12px] py-[6px] rounded-full text-[14px] ${newCoachName.length>0 && newCoachNumber.isValid ? "cursor-pointer" : "opacity-50"}`} onClick={async()=>{
                            if(newCoachName.length>0 && newCoachNumber.isValid)
                            {
                            setAddAnotherCoach(false); 
                            setCoaches([...coaches,
                                {coachName:newCoachName,coachEmail:newCoachEmail,coachPhone:newCoachNumber.phoneNumber}
                            ])
                            await addInfoAsJson({jsonInfo:{coachName:newCoachName,coachPhone:newCoachNumber.isValid?newCoachNumber.phoneNumber:null,coachEmail:newCoachEmail.length>0?newCoachEmail:null,locationId:locationId,teamId:teamId},collectionName:'Coach'})
                            setNewCoachEmail("");setNewCoachName("");setNewCoachNumber({phoneNumber:"",isValid:false})
                            }else{

                                }
                                
                            }}>
                            Add coach
                        </div>
                        </div>
                        </>
                        }
                        </div>
                    </div>

                    <div className="flex flex-col w-full items-center my-[16px] ">

                        <div className="w-full flex">
                            <div className="flex w-[25px] justify-center">
                            <InfoIcon/>
                            </div>

                            <div className="font-bold text-[14px] ml-[8px]">  
                            Applicable lesson types
                            </div>

                            {/* <div className="text-gray-500 text-[12px] ml-[8px]">
                            Proscpective {CONFIG.athleteType} looking for 
                            </div>     */}
                        </div>

                        <div className="flex w-full justify-center space-x-0 mt-[14px]">
                            <CheckboxDropdown
                            fieldType={"Skill levels"}
                            options={lessonSkills}
                            placeholder="Select lesson skills"
                            selectedOptions={selectedLocationLessonSkills}
                            setSelectedOptions={setSelectedLocationLessonSkills}
                            />
                            <CheckboxDropdown
                            fieldType={"Lesson types"}
                            options={lessonTypes}
                            placeholder="Select lesson types"
                            selectedOptions={selectedLocationLessonTypes}
                            setSelectedOptions={setSelectedLocationLessonTypes}
                            />
                        </div>

                    </div>

                    {/* REMINDER BEFORE LESSON */}
                    <div className="flex flex-col w-full mt-[8px]">
                        <div className="flex flex-col">
                        <div className="flex w-full items-center mt-[6px]">

                        <div className="flex w-[25px] justify-center">
                        <NotifIcon/>
                        </div>
                        <div className="ml-[8px] font-bold text-[14px]">
                            Reminder
                        </div>
                            </div>
                        <div className="text-gray-500 text-[12px] ml-[34px]">
                            Sent to both coach and swimmer(s)
                        </div>    
                        </div>

                        <div className="flex justify-center">
                        <div className="flex items-center mt-[8px]">
                        <div className="text-[14px]">
                            Before
                        </div>
                        <div>
                        <div className="flex space-x-[14px] ml-[10px] items-center select-none">
                            <div className={`font-bold select-none text-gray-500 mb-[2px] text-[24px] p-[5px] ${reminderQuant==1 ? "opacity-50":"cursor-pointer"}`} style={{
                                    userSelect: "none", // Prevent text selection
                                    WebkitUserSelect: "none", // Safari
                                    MozUserSelect: "none", // Firefox
                                    msUserSelect: "none",}}  onClick={()=>{if(reminderQuant>1){setReminderQuant(reminderQuant-1)}}}>-</div>
                            <input className="flex text-center w-[30px] border rounded-[30px] py-[7px]" value={reminderQuant} onChange={(e) => setReminderQuant(e.target.value)} />
                            <div       style={{
                                    userSelect: "none", // Prevent text selection
                                    WebkitUserSelect: "none", // Safari
                                    MozUserSelect: "none", // Firefox
                                    msUserSelect: "none",}}  className={`font-bold select-none text-[24px] text-gray-500 p-[5px] cursor-pointer`} onClick={()=>{setReminderQuant(reminderQuant+1)}}>+</div>
                            </div>
                        </div>
                        <div className="flex ml-[20px]">
                        <div className="flex space-x-[12px]">
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                className="form-radio "
                                name="radioOption"
                                value="hours"
                                checked={reminderMetric === 'hours'}
                                onChange={()=>{setReminderMetric('hours')}}
                                />
                                <span className="ml-2 text-[14px]">hours</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                className="form-radio"
                                name="radioOption"
                                value="option2"
                                checked={reminderMetric === 'days'}
                                onChange={()=>{setReminderMetric('days')}}
                                />
                                <span className="ml-2 text-[14px]">days</span>
                            </label>
                            </div>
                        </div>
                        </div>
                        </div>

                    </div>

                    {/* AVAILABLE DAYS */}
                    <div className="flex space-x-[8px] w-full mt-[16px] mb-[8px] items-center">
                    <div className="pl-[1px]">

                    <div className="flex w-[25px] justify-center">
                    <CalendarIcon/>
                    </div>

                    </div>
                    <div className="text-[14px] font-bold">
                        Available days
                    </div>
                    </div>

                    {/* //picking between two options */}
                    <div className="flex justify-center mt-[7px] mb-[10px]">
                    <div className="flex space-x-[6px] items-center px-[30px] cursor-pointer"
                    onClick={()=>{setWeeklyOccurrence(false);setPickingDays(true);scrollToBottom()}}>
                        <div className={
                            isPickingDays&& !isWeeklyOccurrence?
                            `bg-streamlineBlue w-[15px] h-[15px] `
                            :
                            `bg-white w-[15px] h-[15px] border border-gray-400`}
                            style={{
                                borderRadius:"5px"
                            }}/>
                        <div className={isPickingDays&& !isWeeklyOccurrence?'font-bold text-[14px]':'text-[14px]'} >
                            Pick specific dates
                        </div>
                    </div>
                    <div className="flex space-x-[6px] items-center px-[30px] cursor-pointer"
                    onClick={()=>{setWeeklyOccurrence(true);setPickingDays(true)}}>
                        <div className={
                            isPickingDays&& isWeeklyOccurrence?
                            `bg-streamlineBlue w-[15px] h-[15px] `:
                            `bg-white w-[15px] h-[15px] border border-gray-400`}
                            style={{
                                borderRadius:"5px"
                            }}/>
                        <div className={isPickingDays&& isWeeklyOccurrence?'font-bold text-[14px]':'text-[14px]'}>
                            Weekly occurrence
                        </div>
                    </div>

                    </div>


                    {
                        isPickingDays&&
                        <>
                            {isWeeklyOccurrence?
                            <>
                            <WeekdayPicker daysPicked={daysPicked} setDaysPicked={setDaysPicked}/>
                            
                            <div className="flex items-center justify-center space-x-[4px] mt-[14px]">
                                <div className="text-[14px]">
                                    Starts on
                                </div>
                                <div className={`border rounded-[12px] p-[2px] px-[6px] cursor-pointer ${selectingStartEndDates&&selectingStartDate?"border-streamlineBlue border-[2px]":""}`} onClick={()=>{setSelectStartDate(true);setSelectingStartEndDates(true);}}>
                                    {startDate ? 
                                    <div className="text-[14px]">
                                        {startDate.toDateString().slice(0,startDate.toDateString().length-5)}
                                    </div> : 
                                    <div className="text-gray-500 text-[14px]">
                                        Select date
                                    </div>
                                    }
                                </div>
                                <div className="text-[14px] pl-[8px]">
                                    Ends on
                                </div>
                                <div className={`border rounded-[12px] p-[2px] px-[6px] cursor-pointer ${selectingStartEndDates&&!selectingStartDate?"border-streamlineBlue border-[2px]":""}`}onClick={()=>{setSelectStartDate(false);setSelectingStartEndDates(true);}}>
                                    {endDate ? 
                                    <div className="text-[14px]">
                                        {endDate.toDateString().slice(0,endDate.toDateString().length-5)}
                                    </div> : 
                                    <div className="text-gray-500 text-[14px]">
                                        Select date
                                    </div>
                                    }
                                </div>
                            </div>
                            {
                             selectingStartEndDates &&
                             <div className="border p-[14px] rounded-[20px] border-[1px] border mt-[12px] shadow-[0_0_11px_rgba(0,0,0,0.1)] mb-[12px]">
                                 <DayPicker
                                 mode="single"
                                 selected={selectingStartDate?startDate:endDate}
                                 onSelect={(day) => {
                                    if (selectingStartDate) {
                                      setStartDate(day);
                                      setSelectStartDate(false)
                                    } else {
                                      setEndDate(day);
                                    }
                                  }}
                                 disabled={{before:xDaysLater}}
                                 />
                             </div>
                            }

                            </>                            
                            :
                            <>
                            <div className="border p-[16px] rounded-[20px]  shadow-[0_0_11px_rgba(0,0,0,0.1)]">
                                <DayPicker
                                mode="multiple"
                                selected={selectedDates}
                                onSelect={setSelectedDates}
                                disabled={{before:xDaysLater}}
                                />
                            </div>
                            
                            </>              }
                        </>

                    }
                    </div>

                    <div className="items-center flex space-x-[30px]">

                    <div className="mt-[15px] text-streamlineBlue font-bold cursor-pointer" onClick={()=>{onClose()}}>
                        Cancel
                    </div>

                    <div className={`mt-[24px] mb-[12px] bg-streamlineBlue text-white px-[16px] py-[8px] rounded-full font-bold ${!hasSubmitted&&startDate&&endDate&&startTime.xm&&startTime.hrs&&endTime.xm&&endTime.hrs&&isDaySelected&&selectedLocationLessonSkills.length>0&&selectedLocationLessonTypes.length>0&&(selectedCoachId!=null) || !hasSubmitted&&startTime.xm&&startTime.hrs&&endTime.xm&&endTime.hrs&&(selectedDates.length>0)&&selectedLocationLessonSkills.length>0&&selectedLocationLessonTypes.length>0&&(selectedCoachId!=null) ? "cursor-pointer" :"opacity-50" }`} onClick={()=>{
                        if(!hasSubmitted&&startDate&&endDate&&startTime.xm&&startTime.hrs&&endTime.xm&&endTime.hrs&&isDaySelected&&selectedLocationLessonSkills.length>0&&selectedLocationLessonTypes.length>0&&(selectedCoachId!=null) || !hasSubmitted&&startTime.xm&&startTime.hrs&&startTime.hrs&&endTime.hrs&&endTime.xm&&(selectedDates.length>0)&&selectedLocationLessonSkills.length>0&&selectedLocationLessonTypes.length>0&&(selectedCoachId!=null)){
                            handleSubmit()
                        }
                    }}>
                        Add availability
                    </div>
                    </div>

                </div>
    )
}