import { createContext, useContext, useState } from 'react';

const SearchLocationsContext = createContext(null);

export const SearchLocationsPovider = ({ children }) => {
  
  const [selectedCities,setSelectedCities]=useState([]);
  const [selectedLessonTypes,setSelectedLessonTypes]=useState([])
  const [selectedSkillLevels,setSelectedSkillLevels]=useState([])
  const [selectedHoursOfOps,setSelectedHoursOfOps]=useState({"Monday":[],"Tuesday":[],"Wednesday":[],"Thursday":[],"Friday":[],"Saturday":[],"Sunday":[]})
  const [minPrice,setMinePrice]=useState(0);
  const [maxPrice,setMaxPrice]=useState(200);

  return (
    <SearchLocationsContext.Provider value={{selectedCities,setSelectedCities,selectedLessonTypes,setSelectedLessonTypes,selectedSkillLevels,setSelectedSkillLevels,selectedHoursOfOps,setSelectedHoursOfOps,minPrice,setMinePrice,maxPrice,setMaxPrice}}>
      {children}
    </SearchLocationsContext.Provider>
  );
};

export const useCheckout = () => useContext(SearchLocationsContext);
