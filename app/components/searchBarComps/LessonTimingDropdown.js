import React, { useEffect, useRef, useState } from 'react';

const LessonTimingDropdown = ({ isVisible, onClose, daysOfWeek,timesOfDay, 
setTimesOfDay, setDaysOfWeek }) => {
    const divRef = useRef(null);

    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            onClose(); // Trigger the close function
        }
    };

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

    const [dayId, setDayId] = useState(null)

    const handleDaysCheckboxChange = (id) => {
        setTimesOfDay(timesOfDay.map(item => ({ ...item, checked: false })));
        if(id==dayId || daysOfWeek.some(item => item.id === id && item.checked)){
            setDayId(null)
            setDaysOfWeek(daysOfWeek.map(item => 
                item.id === id ? { ...item, checked: !item.checked,hoursOfOps:[] } : item
              ));
            return
        }else{
        setDayId(id)
        setDaysOfWeek(daysOfWeek.map(item => 
          item.id === id ? { ...item, checked: !item.checked } : item
        ));}
      };

    const handleTimingCheckboxChange = (id,dayId) => {
    setDaysOfWeek(daysOfWeek.map(item => {
        if (item.id === dayId) {
            const time = timesOfDay.find(entry => entry.id === id)?.timeOfDay || null;
            const alreadySelected = item.hoursOfOps.includes(time); // Check if timing exists

            return {
                ...item,
                hoursOfOps: alreadySelected
                    ? item.hoursOfOps.filter(t => t !== time) // Remove if exists
                    : [...item.hoursOfOps, time] // Add if not exists
            };
        }
        return item;
    }));
    setTimesOfDay(timesOfDay.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
    ));
    };


    return (
        isVisible && (
            <div
                ref={divRef}
                className="absolute bg-white
                flex left-1/2 top-full mt-2 py-2 
                 rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)]
                 transform -translate-x-1/2 pr-1.5"
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >
                <div className='flex min-w-[150px] overflow-y-scroll pl-3 pr-4'>
                    <div className='flex flex-col'>
                        <div className='text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                        text-streamlineBlue pr-4 '
                        style={{
                            fontWeight:525
                        }}>
                            Preferred day(s)
                        </div>
                        {daysOfWeek.map((item, index) => (
                        <div key={index} className="flex flex-1 pl-3  pr-3 w-full  py-[8px]
                        text-[15px] 
                        rounded-xl whitespace-nowrap items-center hover:bg-gray-200 
                        space-x-1.5" onClick={()=>{handleDaysCheckboxChange(item.id)}}>
                            <input
                            className='mr-2'
                            type='checkbox' checked={item.checked} onChange={()=>{handleDaysCheckboxChange(item.id)}}
                            />
                            {item.day}
                        </div>
                        ))}
                        </div>
                    </div>
                    <div className='flex flex-col min-w-[150px]'>
                        <div className='text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                            text-streamlineBlue pr-2 '
                            style={{
                                fontWeight:525
                            }}>
                            Preferred time(s)
                        </div>
                        {dayId&&<div className='text-[11px] mb-0.5 pl-3 whitespace-nowrap 
                            text-gray-400 pr-2 '
                            style={{
                                fontWeight:525
                            }}>
                            Selecting for {daysOfWeek.find(item=>item.id===dayId).day}
                        </div>}

                        {dayId?<>
                        {timesOfDay.map((item, index) => (
                        <div key={index} className="flex flex-1 pl-3  pr-3 w-full py-1
                        rounded-xl whitespace-nowrap items-center hover:bg-gray-200 text-[15px]
                        space-x-1.5" onClick={()=>{handleTimingCheckboxChange(item.id,dayId)}}>
                            <input
                            className='mr-2'
                            type='checkbox' checked={item.checked} onChange={()=>{handleTimingCheckboxChange(item.id,dayId)}}
                            />
                            {item.timeOfDay}
                        </div>
                        ))}
                        </>:
                        <div className='flex flex-1 text-gray-400 text-[14px] items-center justify-center text-center'>
                            Please select a day to indicated preferred time(s)
                        </div>
                        }
                        </div>
            </div>
        )
    );
};

export default LessonTimingDropdown;
