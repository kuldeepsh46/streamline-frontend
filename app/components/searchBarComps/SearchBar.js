"use client";

import { FaSearch } from "react-icons/fa";
import LocationDropdown from "./LocationDropdown";
import LessonTimingDropdown from "./LessonTimingDropdown";
import LessonTypeDropdown from "./LessonTypeDropdown";
import { useState } from "react";

import PriceDropdown from "./PriceDropdown";
import CONFIG from "@/config";
const SearchBar = ({searchTeams,locations,setLocations,setDaysOfWeek,daysOfWeek,timesOfDay,setTimesOfDay,selectedLessonType,setSelectedLessonType,selectedSkillLevel,setSelectedSkillLevel,desiredMaxPrice,setDesiredMaxPrice,desiredMinPrice,setDesiredMinPrice,biggestPrice}) => {

    // lesson location dropdown setup
    const [isLocationDropdownVisible, setIsLocationDropdownVisible] = useState(false);
    const [isDropdownClosing, setIsDropdownClosing] = useState(false);
    const toggleLocationDropdownVisibility = () => {
        if (isDropdownClosing) return; // Prevent reopening if in closing state
        setIsLocationDropdownVisible(prev => !prev);
    };
    const handleCloseDropdown = () => {
        setIsDropdownClosing(true); // Set closing flag
        setIsLocationDropdownVisible(false);
        setTimeout(() => setIsDropdownClosing(false), 500); // Reset after a short delay
    };

      
    // Lesson type dropdown setup
    const [isLessonTypeDropdownVisible, setIsLessonTypeDropdownVisible] = useState(false);
    const [isLessonTypeDropdownClosing, setIsLessonTypeDropdownClosing] = useState(false);
    const toggleIsLessonTypeDropdownVisible = () => {
        if (isLessonTypeDropdownClosing) return; // Prevent reopening if in closing state
        setIsLessonTypeDropdownVisible(prev => !prev);
    };
    const handleCloseLessonTypeDropdown = () => {
        setIsLessonTypeDropdownClosing(true); // Set closing flag
        setIsLessonTypeDropdownVisible(false);
        setTimeout(() => setIsLessonTypeDropdownClosing(false), 500); // Reset after a short delay
    };
    
    const [lessonTypes, setLessonTypes] = useState(
        Object.keys(CONFIG.lessonTypes).map(item => ({
          lessonType: item,
          lessonTypeDescription: CONFIG.lessonTypes[item]
        }))
      );
      
    const [skillLevels, setSkillLevels] = useState(
        Object.keys(CONFIG.skillLevels).map(item => ({
          skillLevel: item,
          skillLevelDescription: CONFIG.skillLevels[item]
        }))
      );
      

    // Lesson pricing dropdown setup
    const [priceLowerBound, setPriceLowerBound] = useState(0)
    const [priceUpperBound, setPriceUpperBound] = useState(biggestPrice)
    
    
    const [isPriceDropdownVisible, setIsPriceDropdownVisible] = useState(false);
    const [isPriceDropdownClosing, setIsPriceDropdownClosing] = useState(false);
    const toggleIsPriceDropdownVisible = () => {
        if (isPriceDropdownClosing) return; // Prevent reopening if in closing state
        setIsPriceDropdownVisible(prev => !prev);
    };
    const handleClosePriceDropdown = () => {
        setIsPriceDropdownClosing(true); // Set closing flag
        setIsPriceDropdownVisible(false);
        setTimeout(() => setIsPriceDropdownClosing(false), 500); // Reset after a short delay
    };

    // Lesson timing dropdown setup
    const [isLessonTimingDropdownVisible, setIsLessonTimingDropdownVisible] = useState(false);
    const [isLessonTimingDropdownClosing, setIsLessonTimingDropdownClosing] = useState(false);
    const toggleIsLessonTimingDropdownVisible = () => {
        if (isLessonTimingDropdownClosing) return; // Prevent reopening if in closing state
        setIsLessonTimingDropdownVisible(prev => !prev);
    };
    const handleCloseLessonTimingDropdown = () => {
        setIsLessonTimingDropdownClosing(true); // Set closing flag
        setIsLessonTimingDropdownVisible(false);
        setTimeout(() => setIsLessonTimingDropdownClosing(false), 500); // Reset after a short delay
    };
    


    return(
        <div className="flex flex-col w-full justify-center items-center">
        <div className="relative flex shadow-[0_0_10px_rgba(0,0,0,0.1)] 
         justify-between border-[1px] border-gray-300 h-[50px] sm:h-[60px] rounded-full w-[100%] md:w-[75%] lg:w-[75%]"
        style={{
            zIndex:100,
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}} 
         >  
        
            {/* where box */}

            <div className={`relative flex sm:flex-1 flex-col justify-center rounded-full px-3 w-[25%]
            py-1 pl-6 hover:bg-gray-200 cursor-pointer ${isLocationDropdownVisible?"bg-gray-200":""}`}
            onClick={toggleLocationDropdownVisibility}
            style={{
                zIndex:100
            }}
            >
                <div className="font-semibold text-[14px] text-center sm:text-start">
                    Where
                </div>
                <div className="hidden sm:block text-graySubtitle text-[12px]">
                    Search locations 
                </div>

                <LocationDropdown isVisible={isLocationDropdownVisible} setLocations={setLocations}
                    onClose={handleCloseDropdown} locations={locations}/>
            </div>

            {/* when box */}
            <div className={`relative flex w-[25%] flex-col cursor-pointer items-center sm:items-start
            justify-center rounded-full sm:ßpx-3 py-1 pl-0 sm:pl-6 hover:bg-gray-200
            ${isLessonTimingDropdownVisible?"bg-gray-200":""}`}
            onClick={toggleIsLessonTimingDropdownVisible}>
                    <div className="absolute right-0 h-[25px] sm:h-[35px]  w-[0.5px] bg-gray-200 transform -translate-x-1/2
                    opacity-100  "/>
                    <div className="font-semibold text-[14px] text-center sm:text-start">
                        When
                    </div>
                    <div className="hidden sm:block text-graySubtitle text-[12px]">
                        Lesson times
                    </div>
                    <div className="absolute left-0 h-[25px] sm:h-[35px] w-[1px] bg-gray-200 transform -translate-x-1/2
                    opacity-100  "/>
                    <LessonTimingDropdown isVisible={isLessonTimingDropdownVisible}
                    onClose={handleCloseLessonTimingDropdown} 
                    timesOfDay={timesOfDay} daysOfWeek={daysOfWeek}
                    setDaysOfWeek={setDaysOfWeek}
                    setTimesOfDay={setTimesOfDay}
                    />
                    
            </div>

            {/* lesson type box */}
            <div className={`relative group flex w-[25%] sm:w-[25%] flex-col justify-center rounded-full px-3 py-1
             hover:bg-gray-200 pl-3 sm:pl-6 cursor-pointer ${isLessonTypeDropdownVisible?"bg-gray-200":""}`}
             onClick={toggleIsLessonTypeDropdownVisible}>
                <div className="absolute right-0 h-[25px] sm:h-[35px]  w-[1px] bg-gray-200 transform -translate-x-1/2
                    opacity-100  "/>
                <div className="font-semibold text-[14px] text-center sm:text-start">
                    Level
                </div>
                <div className="hidden sm:block text-graySubtitle text-[12px]">
                    Add Level
                </div>
                <div className="absolute left-0 h-[25px] sm:h-[35px] w-[0.5px] bg-gray-200 transform -translate-x-1/2
                    opacity-100  "/>
                <LessonTypeDropdown isVisible={isLessonTypeDropdownVisible}
                    onClose={handleCloseLessonTypeDropdown} 
                    lessonTypes={lessonTypes} skillLevels={skillLevels}
                    selectedLessonType={selectedLessonType}
                    setSelectedLessonType={setSelectedLessonType}
                    selectedSkillLevel={selectedSkillLevel}
                    setSelectedSkillLevel={setSelectedSkillLevel}
                    additionalStyling={null}/>
            </div>

            {/* Price box */}
            <div 
                className={`relative flex sm:flex-1 w-[25%] 
                    justify-between items-center rounded-full py-1 pr-0 sm:pr-1 pl-0 sm:pl-4
                    cursor-pointer hover:bg-gray-200 
                    ${isPriceDropdownVisible ? "bg-gray-200" : ""}`}
                onClick={toggleIsPriceDropdownVisible}
            >
                <div className="flex flex-col w-full">
                    <div className="font-semibold text-[14px] text-center sm:text-start">Price</div>
                    <div className="text-graySubtitle hidden sm:block text-[12px]">Per Lesson</div>
                </div>

                {/* The button should NOT interfere with the parent's hover */}
                <button 
                    onClick={(event) => {
                        event.stopPropagation();
                        searchTeams();
                    }} 
                    className="pointer-events-auto"
                >
                    <div className="hidden sm:block">
                    <div 
                        className="flex justify-center items-center 
                            rounded-full w-[42px] h-[42px] mt-1 mb-1 
                            bg-streamlineBlue hover:bg-blue-600"
                    >
                        <FaSearch style={{ color: 'white', fontSize: '19px' }} />
                    </div>  
                    </div>
                </button>      



                <PriceDropdown 
                    isVisible={isPriceDropdownVisible} 
                    setPriceLowerBound={setPriceLowerBound}
                    priceLowerBound={priceLowerBound} 
                    setPriceUpperBound={setPriceUpperBound}
                    priceUpperBound={priceUpperBound}
                    onClose={handleClosePriceDropdown} 
                    minPrice={desiredMinPrice} 
                    setMinPrice={setDesiredMinPrice}
                    maxPrice={desiredMaxPrice} 
                    setMaxPrice={setDesiredMaxPrice}
                    biggestPrice={biggestPrice}
                />
            </div>


        </div>

        <div className="sm:hidden cursor-pointer flex bg-streamlineBlue items-center px-[10px] rounded-full mt-[12px]" onClick={(event) => {
                        event.stopPropagation();
                        searchTeams();
                    }} >
        <div 
            className="flex justify-center items-center 
                rounded-full w-[42px] h-[25px] mt-1 mb-1 
                 hover:bg-blue-600"
        >
            <FaSearch style={{ color: 'white', fontSize: '16px' }} />
        </div>  
        <div className="flex text-white font-bold mr-[8px] text-[15px]">
            Search teams
        </div>
        </div>

        </div>


    )

}

export default SearchBar;