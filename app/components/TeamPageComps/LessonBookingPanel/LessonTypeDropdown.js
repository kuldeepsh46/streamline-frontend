import CONFIG from '@/config';
import React, { useEffect, useRef, useState } from 'react';

const LessonTypeDropdown = ({ isVisible, onClose, lessonTypes,skillLevels, selectedLessonType, selectedSkillLevel,
setSelectedLessonType, setSelectedSkillLevel,lessonInfoDropdownStyling}) => {
    const divRef = useRef(null);

    function transformSkillData(jsonList) {
        return jsonList.map(item => ({
            [item.SkillLevel]: item.SkillLevelDescription
        }));
    }

    const allSkillList = Object.keys(CONFIG.skillLevels).map(item => ({
        skillLevel: item,
        skillLevelDescription: CONFIG.skillLevels[item]
    }));
    
    const desiredSkills = skillLevels.map(item=>item.skillLevel)
    
    const orderedSkills = allSkillList.filter(item=>desiredSkills.includes(item.skillLevel))


    useEffect(() => {
        if (isVisible && divRef.current) {
            divRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [isVisible,selectedLessonType,selectedSkillLevel]);

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
                className={`${lessonInfoDropdownStyling}`}
                style={{height:'fit-content'}}
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >
                <div className='flex max-h-[256px] pl-3 pr-4'>
                    <div className='flex flex-col '>
                        <div className='text-[12px] mb-0.5 pl-3 
                        text-streamlineBlue pr-2 '
                        style={{
                            fontWeight:525
                        }}>
                            Lesson types
                        </div>
                        {lessonTypes.map((item, index) => (
                        <div key={index} className="flex flex-1 pl-3  pr-3 w-full py-2
                        rounded-xl md:whitespace-nowrap hover:bg-gray-200  cursor-pointer"
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
                    <div className='flex flex-col w-full'>
                        <div className='text-[12px] mb-0.5 pl-3 w-full whitespace-nowrap 
                            text-streamlineBlue pr-2 sm:text-center md:text-start'
                            style={{
                                fontWeight:525
                            }}>
                            Skill Levels
                        </div>
                        {orderedSkills.map((item, index) => (
                        <div key={index} className="flex flex-1 pl-3  pr-3 w-full py-2
                        rounded-xl md:whitespace-nowrap hover:bg-gray-200  cursor-pointer"
                        onClick={()=>{setSelectedSkillLevel(item.skillLevel)}}>
                            <div className='flex items-center space-x-2'>
                            <input
                            type='radio' 
                            checked={selectedSkillLevel==item.skillLevel} 
                            onChange={()=>{setSelectedSkillLevel(item.skillLevel)}}
                            />
                                <div className='flex-col'>
                                    <div className='text-[14px] font-semibold'>{item.skillLevel}</div>
                                    <div className='text-[12px] text-graySubtitle'>{item.skillLevelDescription}</div>
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
