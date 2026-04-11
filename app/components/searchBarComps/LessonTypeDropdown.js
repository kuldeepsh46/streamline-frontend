import React, { useEffect, useRef, useState } from 'react';
const LessonTypeDropdown = ({ isVisible, onClose, lessonTypes,skillLevels, selectedLessonType, selectedSkillLevel,
setSelectedLessonType, setSelectedSkillLevel, additionalStyling }) => {
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

    return (
        isVisible && (
            <div
                ref={divRef}
                className=
                {`absolute sm:flex-row flex-col bg-white
                    ${additionalStyling===null?
                    "left-1/2 transform -translate-x-1/2":additionalStyling}
                 top-full mt-2 py-2 w-[300px]
                 rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)]
                 `}
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >
                <div className='flex  overflow-y-scroll pl-3 pr-4'>
                    <div className='flex flex-col'>
                        <div className='text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                        text-streamlineBlue pr-2 '
                        style={{
                            fontWeight:525
                        }}>
                            Available lesson types
                        </div>
                        {lessonTypes.map((item, index) => (
                        <div key={index} className="flex flex-1 pl-3  pr-3 w-full py-2
                        rounded-xl whitespace-nowrap hover:bg-gray-200  cursor-pointer"
                        onClick={()=>{setSelectedLessonType(item.lessonType)}}>
                            <div className='flex items-center space-x-2'>
                            <input
                            type='radio' 
                            checked={selectedLessonType==item.lessonType} 
                            onChange={()=>{setSelectedLessonType(item.lessonType)}}
                            />
                                <div className='flex-col'>
                                    <div className='text-[14px] font-semibold'>{item.lessonType}</div>
                                    <div className='text-[12px] text-graySubtitle'>{item.lessonTypeDescription}</div>
                                </div>
                            </div>
                        </div>
                        ))}
                        </div>
                    </div>
                    <div className='flex flex-col pl-3 pr-4 pt-[10px] sm:pt-[0px]'>
                        <div className='text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                            text-streamlineBlue pr-2 '
                            style={{
                                fontWeight:525
                            }}>
                            Skill Levels
                        </div>
                        {skillLevels.map((item, index) => (
                        <div key={index} className="flex flex-1 pl-3  pr-3 w-full py-2
                        rounded-xl whitespace-nowrap hover:bg-gray-200  cursor-pointer"
                        onClick={()=>{setSelectedSkillLevel(item.skillLevel)}}>
                            <div className='flex items-center space-x-2'>
                            <input
                            type='radio' 
                            checked={selectedSkillLevel==item.skillLevel} 
                            onChange={()=>{setSelectedSkillLevel(item.skillLevel)}}
                            />
                                <div className="flex flex-col">
                                    <div className="text-[14px] font-semibold">{item.skillLevel}</div>
                                    <div className="text-[12px]  text-graySubtitle whitespace-normal">
                                        {item.skillLevelDescription}
                                    </div>
                                </div>

                            </div>
                        </div>
                        ))}
                        </div>
            </div>
        )
    );
};

export default LessonTypeDropdown;
