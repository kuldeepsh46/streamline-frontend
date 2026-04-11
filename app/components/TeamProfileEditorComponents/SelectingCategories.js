

import InfoDropdown from "./InfoDropdown";
import { useState } from "react";

export default function SelectingCategories({categoryTypes, programs, setPrograms, categoryDict,missingBool}) {

    const handleAddLevel = () => {
        setPrograms([...programs, { level: "", category: "" }]);
      };
    
    const handleRemoveLevel = (index) => {
    if (programs.length > 1) {
        const updatedLevels = programs.filter((_, i) => i !== index);
        setPrograms(updatedLevels);
    }
    };

    const handleInputChange = (index, field, value) => {
        
        const updatedLevels = [...programs];
        updatedLevels[index][field] = value; // Update the specific field (level or name)
        setPrograms(updatedLevels);
    };

    const [isVisible, setIsVisible] = useState(false);
    const [isDropdownClosing, setIsDropdownClosing] = useState(false);
    const toggleVisibility = () => {
        if (isDropdownClosing) return; // Prevent reopening if in closing state
        setIsVisible(prev => !prev);
    };
    const handleCloseDropdown = () => {
        setIsDropdownClosing(true); // Set closing flag
        toggleVisibility(false);
        setTimeout(() => setIsDropdownClosing(false), 500); // Reset after a short delay
    };
    
    const categories = Object.keys(categoryDict)

    let missingInfo = false

    programs.map(item=>{
        if("Program Class Sizes"==categoryTypes){
        if(item.price==""||item.category==""||item.level==""){
            missingInfo=true
        }
        }else{
            if(item.category==""||item.level==""){
                missingInfo=true
            }
        }
    })

    return(
        <div className="">
            <div className="flex text-[15px] mb-[10px] font-bold items-center ">
                Available {categoryTypes} 
                <div 
                style={{
                    userSelect: "none", // Prevent text selection
                    WebkitUserSelect: "none", // Safari
                    MozUserSelect: "none", // Firefox
                    msUserSelect: "none",}} 
                className="relative text-center ml-[10px] w-[25px] h-[25px] border rounded-full border-streamlineBlue font-bold text-streamlineBlue border-[1.5px] pb-[1px] hover:bg-gray-100 cursor-pointer" onClick={toggleVisibility}>
                    <div className="mb-[8px]">i
                    </div>
                    <InfoDropdown isVisible={isVisible} onClose={handleCloseDropdown} categories={categoryDict}/>
                </div>
            </div>
            
            {
              (missingBool && missingInfo)&&
              <div className="mb-[8px] text-red-500 text-[14px]">
                  Some information is missing here. Please check that each of the {categoryTypes.toLowerCase()} has a {"Program Class Sizes"==categoryTypes?"name, category, and price":"name and category"}
              </div>
              }
            
            <div className="flex w-full flex-col justify-center">

            {programs.map((program, index) => (
            <div key={index} style={{ marginBottom: "12px" }}
            className="flex-col ">
                <div className="flex">
                    <input
                        type="text"
                        value={program.level}
                        onChange={(e) =>
                        handleInputChange(index, "level", e.target.value)
                        }
                        placeholder={`${categoryTypes.slice(0,categoryTypes.length-1)} Name ${index + 1}`}
                        className="text-gray-700 w-[60%] mr-[8px] border border-gray-300 rounded-[12px]    
                resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
                focus:outline-none focus:border-blue-500" 
                />
                    

                    <select
                        value={program.category || ""}
                        onChange={(e) => handleInputChange(index, "category", e.target.value)}
                        style={{ marginRight: "10px" }}
                        className="flex w-[40%] cursor-pointer"
                    >
                        <option value={""} disabled>
                        Select category
                        </option>
                        {categories.map((option, i) => (
                        <option key={i} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                    {programs.length > 1 && (
                        
                        <button onClick={() => handleRemoveLevel(index)}
                        className="flex items-center justify-center border  border-red-600 px-[10px] rounded-[10px] bg-red-100 hover:bg-gray-100 border-[1px] cursor-pointer">
                            <div className="mr-[5px] text-red-600 
                            font-bold text-[12px] mt-[1px]">X</div>
                            <div className="text-[12px]">Remove</div>
                        </button>
                    )}
                </div>

                {"Program Class Sizes"==categoryTypes &&
                <div className="flex h-full pt-[2px] items-center mt-[4px] items-center space-x-[6px] justify-center pr-[10px]"> 
                    <div className="text-[14px]">
                    Approx. price per lesson: 
                    </div>
                            
                    <div className="flex mt-[2px] items-center">   
                        <input 
                        type="text"
                        value={program.price}
                        className="w-[35px] border mr-[4px] rounded-[12px] px-[6px] py-[4px] text-center" onChange={(e)=>{
                            if(Number(e.target.value))
                            handleInputChange(index,'price',Number(e.target.value))
                            else if(e.target.value=="")
                            handleInputChange(index,'price',"")
                        }}/>
                        $CAD
                    </div>
                </div>
            }
            </div>
        ))}

            </div>

        <div className="flex items-center">
        <div className="flex items-center justify-center border border-green-600 px-[10px] rounded-[10px] bg-green-100 hover:bg-gray-100 border-[1px] cursor-pointer">
        <div className="px-[5px] text-green-600 font-bold text-[20px]">
            +
        </div>
        <button onClick={handleAddLevel}
        className="text-[14px]">Add {categoryTypes.slice(0,categoryTypes.length-1)}</button>
        </div>
        </div>

        </div>
    )
}