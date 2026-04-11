"use client";

import UnderEighteenDetails from "./UnderEighteenDetails";
import OverEighteenDetails from "./OverEighteenDetails";
import { useSignUpContext } from "@/app/contexts/SignUpProvider";
import BlackMoveLeft from "../../../public/BlackMoveLeft.svg"

export default function CompleteSignUpDetails(
    {underEighteen, setUnderEighteen, setFinishSignUpDetails,onClose}) {

    const {setGuardianInfo,guardianInfo} = useSignUpContext();

    const setAccountType = (isGuardian) => {
        setGuardianInfo(prevState => ({
            ...prevState,
            isGuardian: isGuardian,
          }));
    }

    return(
        <>
            <div className="relative flex text-streamlineBlue w-full items-center justify-center ">
            <div className='absolute z-100 flex left-[-2px] bottom-[8px] items-center cursor-pointer' onClick={()=>{setFinishSignUpDetails(false)}}>
                <div>
                <BlackMoveLeft/>
                </div>
                <div className='text-black font-semibold text-[13px] ml-[4px]'>
                    Go back
                </div>
            </div>
            <div className='relative font-bold pb-[6px] z-10 bg-white'>
              Complete sign up 
            </div>
            </div>

            
            <div className="max-h-[800px] overflow-y-auto">
            <div className="px-[13px]">
            <div className="mt-[15px] leading-[18px]">
                Are you looking for lessons for a swimmer under 18?
            </div>
            <div className="flex justify-center mt-[7px]">
                <div className="flex space-x-[6px] items-center px-[30px] cursor-pointer"
                onClick={()=>{setUnderEighteen(true);setAccountType(true)}}>
                    <div className={
                        underEighteen?
                        `bg-streamlineBlue w-[15px] h-[15px] `
                        :
                        `bg-white w-[15px] h-[15px] border border-gray-400`}
                        style={{
                            borderRadius:"5px"
                        }}/>
                    <div className={underEighteen?'font-bold':''}>
                        Yes
                    </div>
                </div>
                <div className="flex space-x-[6px] items-center px-[30px] cursor-pointer"
                onClick={()=>{setUnderEighteen(false);setAccountType(false)}}>
                    <div className={
                        underEighteen===false?
                        `bg-streamlineBlue w-[15px] h-[15px] `:
                        `bg-white w-[15px] h-[15px] border border-gray-400`}
                        style={{
                            borderRadius:"5px"
                        }}/>
                    <div className={underEighteen===false?'font-bold ':''}>
                        No
                    </div>
                </div>

            </div>
            
            {underEighteen===false?
            <OverEighteenDetails setFinishSignUpDetails={setFinishSignUpDetails} onClose={onClose}/>
            :
            <>
            {underEighteen &&
            <UnderEighteenDetails setFinishSignUpDetails={setFinishSignUpDetails} onClose={onClose}/>}
            </>
            }
            </div>
            </div>
        </>
    )
}