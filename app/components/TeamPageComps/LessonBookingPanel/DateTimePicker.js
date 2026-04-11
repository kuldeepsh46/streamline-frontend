import React, { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import LoadingSubScreen from '../../loadingSubscreen';

const DateTimePicker = ({ isVisible,lessonTypesMapping, onClose, selectedDate, setSelectedDate, selectedTime, 
    toggleIsDateTimeDropdownVisible,selectedSkillLevel,selectedLessonType,
    setSelectedTime, dateTimePositioning,givenLocationAvailability,setLessonId}) => {
    const divRef = useRef(null);
    
    
    const [isLoading,setIsLoading] = useState(true)
    const [locationAvailability,setLocationAvailability]=useState(null)

    useEffect(() => {
        if (isVisible && divRef.current) {
            divRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [isVisible,selectedDate]);

    const [currentDate, setCurrentDate] = useState(null)
    const [availableDatesSet,setAvailableDatesSet]=useState(null)
    // const [isDateSelectable,setIsDateSelectable]=useState(null)
    const [myDates,setMyDates]=useState(null)
    // const [isDateDisabled,setIsDateDisabled]=useState(null)

    useEffect(()=>{
        if(locationAvailability){
            const myCurrDates = locationAvailability?locationAvailability.dates:null
        
            // Convert the list of available dates to a Set for better performance
            const availableDatesSet = new Set(myCurrDates);

            setAvailableDatesSet(availableDatesSet)
            setMyDates(myCurrDates)            
            
            // const isDateSelectable = (date) => availableDatesSet.has(date.toDateString());
            // // setIsDateSelectable(isDateSelectable)
            // console.log("RIGHT AFTER",myCurrDates)
            // const isDateDisabled = (date) => {
            //     return !myCurrDates.some(selectableDay => 
            //     selectableDay.toDateString() === date.toDateString()
            //     );
            // };
            // setIsDateDisabled(isDateDisabled)
            
        }
    },[locationAvailability])


    // Disable all dates except the available ones

    const isDateDisabled = (date) => {
        if(date && myDates){
        return !myDates.some(selectableDay => 
        selectableDay.toDateString() === date.toDateString()
        );}
    };

    const isDateSelectable = (date) => {
        if(date&&availableDatesSet)
        {
            availableDatesSet.has(date.toDateString())
        }
    };

    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            onClose(); // Trigger the close function
        }
    };

    useEffect(()=>{

        function filterDatesMap(input,lessonTypesMapping,selectedLessonType,selectedSkillLevel){

            const output = {dates:[],datesMap:{}}
            const { dates, datesMap } = input;

            dates.forEach((dateStr,index) => {
              const dateKey = new Date(dateStr).toDateString();
              const originalList = datesMap.get(dateKey);
              if (!originalList) return; // Skip if there's no entry for this date
          
              const filteredList = [
                originalList[0],
                originalList[1],
              ];
              if(originalList[2].length==3){
              originalList.slice(2).forEach((item) => {
                if (Array.isArray(item) && item.length === 3) {
                  const [first, second, list] = item;
                  list.forEach((entry) => {
                    const [skill1, skill2] = entry.split("`");
                    
                    
                    if (lessonTypesMapping[skill1] === selectedSkillLevel && lessonTypesMapping[skill2] === selectedLessonType) {
                      filteredList.push(item);
                    }
                  });
                }
              });
          
              if (filteredList.length > 2) {
                output.dates.push(dateStr);
                output.datesMap[dateKey] = filteredList;
              }}
            });

                return output
                }
               

        if(selectedSkillLevel && selectedLessonType){
        const filteredOptions = filterDatesMap(givenLocationAvailability,lessonTypesMapping,selectedLessonType,selectedSkillLevel)

        
    
        setLocationAvailability(filteredOptions)

        setIsLoading(false)
        
        }

    },[selectedSkillLevel,selectedLessonType])
    
    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);
    

    return (
        isVisible && (
            <div
                ref={divRef}
                className={`absolute flex sm:flex-row flex-col bg-white justify-center items-center border border-gray-300
                ${dateTimePositioning}
                
                 mt-2 py-2 
                 rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)] mb-[10px]
                 `}
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >
                {isLoading?
                <div className='w-[300px] h-[300px]'>
                    <LoadingSubScreen loadingMessage={"Loading availability"}/>
                </div>
                :
                <>
                <div className='flex  overflow-y-scroll pl-3 space-x-[40px]'>
                    <div className='flex-1 flex-col mr-[15px]'>
                        <div className='text-[12px] mb-0.5 pl-[10px] whitespace-nowrap 
                        text-streamlineBlue '
                        style={{
                            fontWeight:525
                        }}>
                            {/* Available lesson types */}
                        </div>
                        <div className='flex flex-1 '>
                        <DayPicker
                            mode="single"
                            selected={currentDate}
                            onSelect={(event)=>{
                                
                                setCurrentDate(event)}}
                            disabled={isDateDisabled}
                            modifiers={{
                                selectable: (date) => isDateSelectable(date), // Highlight selectable dates
                              }}
                              modifiersClassNames={{
                                selectable: 'selectable', // Class name for selectable dates
                              }}

                        
                        />
                        </div>
                        </div>
                    </div>
                    <div className='flex text-[14px] flex-col sm:py-0 py-[20px]'>

                        <div className='flex  flex-1 justify-center 
                                items-center max-w-[180px] px-[10px]'>
                            <div className=
                            {`flex-1 text-center space-y-[10px]
                            ${currentDate?"w-[200px]":" w-[200px] text-graySubtitle"}
                            `}>
                                {
                                (currentDate) ? 
                                
                                locationAvailability.datesMap[currentDate.toDateString()].map(
                                    (item,index)=>
                                    (<div  key={index} className={item!="Available times" ? `flex-1 leading-6
                                    ${index==1 ? "font-bold": ""} 
                                    ${selectedTime!=item[0] && index>1 ? "hover:bg-gray-100":""}
                                    ${selectedTime===item[0] && index!=1 && currentDate==selectedDate ? "text-white bg-streamlineBlue":""}
                                    ${index>1?"text-streamlineBlue border border-streamlineBlue py-[4px]":""}
                                    rounded-full
                                    ` : ""} onClick={()=>{
                                        if(index>1)
                                        {setSelectedTime(item[0]);
                                            setLessonId(item[1])
                                            setSelectedDate(
                                                currentDate
                                            )
                                        toggleIsDateTimeDropdownVisible()}}}>
                                        {index<=1?item:item[0]}
                                    </div>)
                                )
                                :
                                myDates?(myDates.length>0?"Please select a date to view the available times ":"There are no available times for the lesson type you requested. Please try another lesson type or check again later"):""}
                            </div>
                        </div>
                        
                    </div>
                </>}
            </div>
        )
    );
};

export default DateTimePicker;
