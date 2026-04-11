import { useSignUpContext } from "@/app/contexts/SignUpProvider";
import { NormalBirthDatePicker } from "./BirthDatePicker"
import { useState } from "react";

export default function OverEighteenDateField() {

    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const toggleDatePicker = () => {
        setIsPickerOpen(!isPickerOpen);
    };

    const {setGuardianInfo,guardianInfo} = useSignUpContext()

    return(

        <div className="flex flex-col w-[50%]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Date of Birth
                    </label>
                    <input
                        type="text"
                        value={guardianInfo.dateOfBirth ? guardianInfo.dateOfBirth.toLocaleDateString() : ""}
                        placeholder="Select birthday"
                        readOnly
                        onClick={toggleDatePicker}
                        className="w-full text-gray-700 border border-gray-300 rounded-[12px] text-[15px]    
            resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
            focus:outline-none focus:border-blue-500" 
                    />
                    {isPickerOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                                onClick={() => {setIsPickerOpen(false)}} // Close on backdrop click
                            >
                            </div>
                            {/* Centered DatePicker */}
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white p-4 rounded-[15px] shadow-lg">
                                <NormalBirthDatePicker
                                personInfo={guardianInfo}
                                setPersonInfo={setGuardianInfo}
                                setIsPickerOpen={setIsPickerOpen}
                                />                            
                            </div>
                        </>
                    )}
        </div>
    )
}
