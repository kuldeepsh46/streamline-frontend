import CONFIG from "@/config";
import SelectingCategories from "../SelectingCategories";
import DaysHoursOperations from "../DaysHoursOperation";

export default function ProgramOfferingsWrapper({programsOfferedDivRef,isMissingProgramsOffered,programLevels,setProgramLevels,programTypes,setProgramTypes,daysOfWeek,setDaysOfWeek,hourOfOpError, noHeader,missingBool}){

  let noCheckedDays = true;
  daysOfWeek.map(item=>{if(item.checked){noCheckedDays=false}})
    return(
        <>
            <div className="font-bold text-streamlineBlue text-[18px]"
              ref={programsOfferedDivRef}>
                  {!noHeader && <div>
                  Programs Offered at this Location
                  </div>}
                  {isMissingProgramsOffered &&
                  <div className="text-red-500 text-[15px]">
                    Please ensure you have completed all the fields in this section.
                  </div>}
              </div>

              <SelectingCategories categoryTypes={"Program Levels"}
              programs={programLevels}
              setPrograms={setProgramLevels}
              categoryDict={CONFIG.skillLevels}
              missingBool={missingBool}/>
               {
                  (missingBool && programLevels=="")&&
                  <div className="leading-[0px] text-red-500 text-[14px]">
                      Missing team description
                  </div>
              }

              <SelectingCategories categoryTypes={"Program Class Sizes"}
              programs={programTypes}
              setPrograms={setProgramTypes}
              categoryDict={CONFIG.lessonTypes}
              missingBool={missingBool}/>

{
              (missingBool && noCheckedDays)&&
              <div className="leading-[0px] text-red-500 text-[14px]">
                  No days have been selected 
              </div>
              }
              <DaysHoursOperations daysOfWeek={daysOfWeek} setDaysOfWeek={setDaysOfWeek} hourOfOpError=
              {hourOfOpError}/>

              <div className="h-[6px]"/>

              {!noHeader && <div
                  className="relative w-full h-[1px] bg-gray-200 mt-[15px]"
                />  }
        </>
    )
}