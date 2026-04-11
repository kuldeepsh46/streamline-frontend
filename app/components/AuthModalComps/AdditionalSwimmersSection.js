import ChildBirthDatePicker from "./BirthDatePicker"
import { useSignUpContext } from "@/app/contexts/SignUpProvider";
import { useState } from "react";
import isUnderEighteen from "@/app/hooks/isUnderEighteen";

export default function AdditionalSwimmersSection({isMinor}) {

    const {kids, setKids} = useSignUpContext()

    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const [kidBdayEditorId,setKidBdayEditorId]=useState(false)

    const toggleDatePicker = ({id}) => {
        setIsPickerOpen(!isPickerOpen);
        if(id){
            setKidBdayEditorId(id)
        }
    };

    const handleInputChange = (id, field, value) => {
        setKids((prevKids) =>
        prevKids.map((kid) =>
        kid.id === id ? { ...kid, [field]: value } : kid
        )
        );
        if(field==="dateOfBirth"){
            const isMinor = isUnderEighteen(value)
            setKids((prevKids) =>
            prevKids.map((kid) =>
            kid.id === id ? { ...kid, ["isMinor"]: isMinor } : kid
            )
            );
        }
    };

    const addKid = () => {
        setKids((prevKids) => [
        ...prevKids,
        { id: prevKids.length + 1, fullName: "", dateOfBirth: null },
        ]);
    };

    const removeKid = (id) => {
        setKids((prevKids) => prevKids.filter((kid) => kid.id !== id));
    };

    return(
        <>
        <div 
        className="text-[15px] font-semibold mb-[3px] leading-[8px] pt-[6px]">
            Enter {!isMinor && "Another "}Swimmer(s) Information
        </div>
        <div className="text-[13px] leading-[14px] pb-[7px]">
            {isMinor && "Please include any swimmers older than 18 as well."} Swimmers can be added/removed later
        </div>
        {kids.map((kid, index) => (
            <div
            key={kid.id}
            className="relative mb-6 p-[7px] border border-gray-300 rounded-lg shadow-sm"
            >
            <div className="text-lg font-medium mb-[4px]">
                Swimmer {index + 1}
            </div>
            <div className="flex space-x-[10px]">
            <div className="mb-[8px] w-[95%]">
                <label className="block font-bold text-sm  text-gray-700 mb-1">
                Full Name
                </label>
                <input
                type="text"
                value={kid.fullName}
                onChange={(e) =>
                    handleInputChange(kid.id, "fullName", e.target.value)
                }
                placeholder="Enter full name"
                className="w-full text-gray-700 border border-gray-300 rounded-[12px]    text-[15px]
          resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
          focus:outline-none focus:border-blue-500" 
                />
            </div>
            <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                    Date of Birth
                </label>
                <input
                    type="text"
                    value={kid.dateOfBirth ? kid.dateOfBirth.toLocaleDateString() : ""}
                    placeholder="Select birthday"
                    readOnly
                    onClick={()=>{console.log(kid.id);
                                    toggleDatePicker({id:kid.id})}
                                }
                    className="w-full text-gray-700 border border-gray-300 rounded-[12px] text-[15px]    
          resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
          focus:outline-none focus:border-blue-500" 
                />
                {(isPickerOpen && kidBdayEditorId==kid.id) && (
                    <div key={kid.id}>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-20"
                            onClick={() => {setIsPickerOpen(false), console.log(kid)}} // Close on backdrop click
                        >
                        </div>
                        {/* Centered DatePicker */}
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white p-4 rounded-[15px] shadow-lg">
                            <ChildBirthDatePicker
                            id={kid.id}
                            kid={kid}
                            handleInputChange={handleInputChange}
                            setIsPickerOpen={setIsPickerOpen}
                            />                            
                        </div>
                    </div>
                )}
            </div>
            </div>
            {kids.length > 1 && (
                <button
                onClick={() => removeKid(kid.id)}
                className=" flex rounded  items-center align-center w-full mr-0"
                >
                <div className="text-red-500 font-bold mb-[2px] mr-[5px]">
                    x
                </div>
                <div className="text-red-500 text-[14px]">
                    Remove Swimmer
                </div>
                </button>
            )}
            </div>
        ))}
        <div>
        <button
            onClick={addKid}
            className=" flex rounded  items-center align-center w-full mr-0"
        >
            <div className="text-streamlineBlue font-bold mr-[5px]">
                    +
                </div>
                <div className="text-streamlineBlue text-[14px] font-bold">
                    Add Another Swimmer
                </div>
        </button>
        </div>
        </>
    )
}