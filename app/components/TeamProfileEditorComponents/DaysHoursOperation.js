"use client"

import { useState } from "react";
import CONFIG from "@/config";

export default function DaysHoursOperations({daysOfWeek,setDaysOfWeek,hourOfOpError}){

    const [daySelected, setDaySelected] = useState("")
    const [selectedDayId, setSelectedDayId] = useState(1)

    const handleDaysCheckboxChange = (id) => {
        setDaysOfWeek(daysOfWeek.map(item => 
          item.id === id ? { ...item, checked: !item.checked } : item          
        ));
        setDaySelected(daysOfWeek[id-1].day)
        setSelectedDayId(id)
      };

    const handleTimingCheckboxChange = ({dayId, hour}) => {
        setDaysOfWeek(
            daysOfWeek.map(item => 
              item.id === dayId 
                ? { 
                    ...item, 
                    hoursOfOps: item.hoursOfOps.includes(hour) 
                      ? item.hoursOfOps.filter(h => h !== hour) // Remove the hour
                      : [...item.hoursOfOps, hour] // Add the hour
                  } 
                : item
            )
          );
    };

    return(
        <div style={{
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}} >
            <div className="text-[15px]  font-bold">
            Days and Hours of Operation
            </div>
            {hourOfOpError.length>0 &&
            <div className="text-red-500 text-[15px]">
              {hourOfOpError}
            </div>}
            <div className="flex mt-2 pr-1.5">
                <div className="flex flex-1 space-x-[25px] mt-[10px]">
                    {/* Preferred Days */}
                    <div className="flex flex-col justify-center w-[145px]">

                    {daysOfWeek.map((item, index) => (
                        <div key={index} className="flex items-center">

                            <div
                            key={index}
                            className={`flex pl-3 pr-3 w-full py-[5px] mb-[10px]  rounded-xl whitespace-nowrap items-center space-x-1.5
                            ${
                                item.checked
                                ? "border-2 border-streamlineBlue text-streamlineBlue font-bold"
                                : "border-2 border-gray-300"
                            } hover:border-streamlineBlue cursor-pointer justify-center`}
                            onClick={() => {
                                handleDaysCheckboxChange(item.id);
                            }}
                            >
                            <div className="text-[15px]">{item.day}</div>
                            </div>
                            {item.checked && 
                            <div className={`mb-[10px] ml-[8px] font-bold ${selectedDayId!==item.id?"text-streamlineBlue":""} text-[13px] cursor-pointer`} onClick={()=>{setSelectedDayId(item.id)}}>
                                Edit
                            </div>    }
                        </div>
                    ))}
                    </div>

                    {/* Preferred Time of Day */}
                    <div className="flex flex-col items-center align-center justify-center">

                        {!daysOfWeek[selectedDayId-1].checked ?
                        <div className="text-gray-400 font-bold">
                            Select a day to assign hours of operation
                        </div>:
                        <>
                        <div className="flex">
                        <div className="text-streamlineBlue font-streamlineBlue font-bold mb-[10px]">
                            {daysOfWeek[selectedDayId-1].day.toString()}
                        </div>    
                        <div className="ml-[5px]">
                        hours of operation
                        </div>
                        </div>
                        <div className="flex space-x-[25px] select-none"
                        style={{
                            userSelect: "none", // Prevent text selection
                            WebkitUserSelect: "none", // Safari
                            MozUserSelect: "none", // Firefox
                            msUserSelect: "none",}} >
                        <div>
                        {CONFIG.hoursOfOps.slice(0,12).map((item, index) => (
                            <div
                            key={index}
                            className={`flex pl-3 select-none pr-3 w-full py-[3px] mb-[8px] rounded-xl whitespace-nowrap items-center 
                            ${
                                daysOfWeek[selectedDayId-1].hoursOfOps.includes(item.id)
                                ? "border-[1.5px] border-streamlineBlue text-streamlineBlue font-bold"
                                : "border-[1.5px] border-gray-300"
                            } hover:border-streamlineBlue cursor-pointer justify-center`}
                            onClick={() => {
                                handleTimingCheckboxChange({dayId:selectedDayId,hour:item.id});
                            }}
                            >
                            <div className="select-none text-[10px]">{CONFIG.hoursOfOps[index].hours}</div>
                            </div>
                        ))}
                        </div>
                        <div>
                        {CONFIG.hoursOfOps.slice(12,24).map((item, index) => (
                            <div
                            key={index}
                            className={`flex pl-3 pr-3 select-none w-full py-[3px] mb-[8px] rounded-xl whitespace-nowrap items-center
                            ${
                                daysOfWeek[selectedDayId-1].hoursOfOps.includes(item.id)
                                ? "border-[1.5px] border-streamlineBlue text-streamlineBlue font-bold"
                                : "border-[1.5px] border-gray-300"
                            } hover:border-streamlineBlue cursor-pointer justify-center`}
                            onClick={() => {
                                handleTimingCheckboxChange({dayId:selectedDayId,hour:item.id});
                            }}
                            >
                            <div className="select-none text-[10px]">{CONFIG.hoursOfOps[item.id].hours}</div>
                            </div>
                        ))}
                        </div>
                        </div>
                        </>
                        }
                    </div>
                </div>
                </div>

        </div>        
    )
}