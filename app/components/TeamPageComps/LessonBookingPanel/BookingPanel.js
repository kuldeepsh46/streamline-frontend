"use client"

import { useState, useEffect } from "react";
import LessonTypeDropdown from "./LessonTypeDropdown";
import DateTimePicker from "./DateTimePicker";
import { usePathname, useRouter } from "next/navigation";
import { useCheckout } from "../../../contexts/CheckoutContext";
import { useAuth } from "@/app/contexts/AuthContext";

export default function BookingPanel({lessonTypesMapping, lessonTypes,subKey, skillLevels,
selectedDate, setSelectedDate, selectedTime,setSelectedTime,selectedLessonType,setSelectedLessonType,selectedSkillLevel,locationInfo,teamInfo,images,setSelectedSkillLevel, dateTimePositioning,lessonInfoDropdownStyling,stackTimes,locationAvailability,eventsList}) {

        const router = useRouter();
        
        const {setLoadingNewPage,setLoadingNewPageMessage} = useAuth()

        const [isBeingUsed,setIsBeingUsed]=useState("")
        const [lessonId,setLessonId]=useState(null)

        const [isLessonTypeDropdownVisible, setIsLessonTypeDropdownVisible] = useState(false);
        const [isLessonTypeDropdownClosing, setIsLessonTypeDropdownClosing] = useState(false);
        const toggleIsLessonTypeDropdownVisible = () => {
            if (isLessonTypeDropdownClosing) return; // Prevent reopening if in closing state

            setIsBeingUsed(true)
            
            setIsLessonTypeDropdownVisible(prev => !prev);
        };
        const handleCloseLessonTypeDropdown = () => {
            setIsLessonTypeDropdownClosing(true); // Set closing flag
            setIsLessonTypeDropdownVisible(false);
            setTimeout(() => setIsLessonTypeDropdownClosing(false), 500); // Reset after a short delay
        };  

        const [isDateTimeDropdownVisible, setIsDateTimeDropdownVisible] = useState(false);
        const [isDateTimeDropdownClosing, setIsDateTimeDropdownClosing] = useState(false);
        const toggleIsDateTimeDropdownVisible = () => {
            if (isDateTimeDropdownClosing) return; // Prevent reopening if in closing state
            if(isDateTimeDropdownVisible){
                setIsBeingUsed(false)
            }else{
                setIsBeingUsed(true)
            }
            setIsDateTimeDropdownVisible(prev => !prev);
        };
        const handleCloseDateTimeDropdown = () => {
            setIsDateTimeDropdownClosing(true); // Set closing flag
            setIsDateTimeDropdownVisible(false);
            setTimeout(() => setIsDateTimeDropdownClosing(false), 500); // Reset after a short delay
        };

        useEffect(()=>{
            if(selectedLessonType!="" && selectedSkillLevel!="" && isBeingUsed){
                toggleIsLessonTypeDropdownVisible()
                toggleIsDateTimeDropdownVisible()
            }
        },[selectedLessonType, selectedSkillLevel])

        const { checkoutData, setCheckoutData } = useCheckout();

        const [eventInfo,setEventInfo]=useState(null)

        useEffect(()=>{

            // console.log(lessonId,"PICKED",eventsList)
            eventsList.forEach(element => {
                // console.log("HEL??",element)
                if(element.id==lessonId){
                    setEventInfo(element)
                }
            });

        },[lessonId])

        const updateCheckout = () => {
        setCheckoutData({
            lessonType :selectedLessonType,
            lessonDate: selectedDate,
            skillLevel:selectedSkillLevel,
            eventInfo:eventInfo,
            teamName:teamInfo,
            lessonTime:selectedTime,
            lessonId:lessonId,
            locationInfo:locationInfo,
            teamInfo:teamInfo,
            images:images,
            lessonTypesMapping:lessonTypesMapping
        })
        }
        const pathName=usePathname()
        
        const scrollToTop = () => {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0; // For older browsers
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        const handleRedirect = () => {
            scrollToTop()
            setLoadingNewPage(true)
            setLoadingNewPageMessage("")
            updateCheckout()
            router.push(`${pathName}/checkout`)
        }


    return(
        <>
        <div className="relative flex flex-col w-full  border border-gray-300 rounded-xl cursor-pointer"
        style={{
            zIndex:20,
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}}>

                <div className="relative border-b border-gray-300 p-2"
                onClick={toggleIsLessonTypeDropdownVisible}
                >
                    <div className="relative font-bold text-[11px]"
                    style={{zIndex:20}}
                    
                    >
                        LESSON TYPE
                    </div>
                    <div className="text-gray-500 text-[12px]">
                        {selectedLessonType!=""&&selectedSkillLevel!="" ? 
                        selectedLessonType + ", " + selectedSkillLevel :
                         "Select lesson type"}
                    </div>
                    <LessonTypeDropdown key={subKey} isVisible={isLessonTypeDropdownVisible}
                    onClose={handleCloseLessonTypeDropdown} 
                    lessonTypes={lessonTypes} skillLevels={skillLevels}
                    selectedLessonType={selectedLessonType}
                    setSelectedLessonType={setSelectedLessonType}
                    selectedSkillLevel={selectedSkillLevel} lessonInfoDropdownStyling={lessonInfoDropdownStyling}
                    setSelectedSkillLevel={setSelectedSkillLevel}/>
                </div>
                <div className=" flex">
                <div className="w-[50%] p-2 border-r border-gray-300"
                onClick={()=>{
                    if (selectedLessonType==="" || selectedSkillLevel==="")
                    {
                        
                        toggleIsLessonTypeDropdownVisible()}
                    else
                    {
                    toggleIsDateTimeDropdownVisible()
                    }
                }}>

                    <div className="font-bold text-[11px]">
                        DATE
                    </div>
                    <div className="text-gray-500 text-[12px]">
                        {selectedDate?
                        selectedDate.toDateString().slice(0,
                            selectedDate.toDateString().length -4):"Add date"}
                    </div>
                    <DateTimePicker
                    setLessonId={setLessonId}
                    lessonTypesMapping={lessonTypesMapping}
                    
                    givenLocationAvailability={locationAvailability}
                    stackTimes={stackTimes}
                    key={subKey}
                    selectedDate={selectedDate}
                    selectedLessonType={selectedLessonType}
                    selectedSkillLevel={selectedSkillLevel}
                    setSelectedDate={setSelectedDate}
                    isVisible={isDateTimeDropdownVisible}
                    onClose={handleCloseDateTimeDropdown}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    toggleIsDateTimeDropdownVisible={toggleIsDateTimeDropdownVisible}
                    dateTimePositioning={dateTimePositioning}
                    />
                </div>
                <div className="w-[50%] p-2" 
                onClick={()=>{
                    if (selectedLessonType==="" || selectedSkillLevel==="")
                    {toggleIsLessonTypeDropdownVisible()}
                    else
                    {
                    toggleIsDateTimeDropdownVisible()
                    }
                }}
                >
                    <div className="font-bold text-[11px]">
                        TIME
                    </div>
                    <div className="text-gray-500 text-[12px]">
                        {selectedTime?selectedTime:"Add time"}
                    </div>
                </div>


                </div>

            </div>
    
                <div className="flex w-full justify-center items-center mt-[13px]
                bg-streamlineBlue py-[10px] rounded-xl cursor-pointer"
                    onClick={
                        ()=>{
                            if(selectedSkillLevel!="" && selectedLessonType!="" && !selectedDate
                            && !selectedTime){
                                toggleIsDateTimeDropdownVisible()
                            }else if(selectedSkillLevel==="" || selectedLessonType ===""){
                                toggleIsLessonTypeDropdownVisible()
                            }else{
                                handleRedirect()
                            }
                        }
                    }>

                    <div className="text-white font-bold text-[15px] ">
                        {selectedTime?"Book lesson":"Check availability"}
                    </div>
                </div>

                {/* {selectedTime &&
                <div className="flex w-full justify-center items-center mt-[15px] text-[14px]">
                    You won't be charged yet
                </div>} */}
        
        </>
    )
}