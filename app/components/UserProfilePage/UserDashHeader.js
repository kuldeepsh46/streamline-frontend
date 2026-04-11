"use client";

import { useState,useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext"
import TopBar from "../TopBarComps/TopBar"
import { useRouter } from "next/navigation";

export default function UserDashHeader({}){

    const noIcon=true
    const {userInfo} = useAuth()

    function getFirstOneOrTwoInitials({input}) {
        if (typeof input !== "string") {
          throw new Error("Input must be a string");
        }
      
        // Split the string into words and filter out empty parts
        const words = input.trim().split(/\s+/);
      
        // Get the initials of the first one or two words
        const initials = words.slice(0, 2).map(word => word[0].toUpperCase());
      
        // Join the initials into a single string
        return initials.join("");
      }

    return(

        <div style={{
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}}>
        <TopBar/>
            
            <div
            style={{
                userSelect: "none", // Prevent text selection
                WebkitUserSelect: "none", // Safari
                MozUserSelect: "none", // Firefox
                msUserSelect: "none",}}
                className="relative z-0 w-[2000px] left-[-100px] h-[1px] bg-gray-200 mt-[18px]"
            />

            
            <div className="flex space-x-[20px] h-[104px]">
                {userInfo.userData ?
                <div className="flex items-center py-[10px] space-x-[20px]">
                    <div className=
                        {`flex flex-1 w-[75px] text-[34px] h-[75px] rounded-full text-white items-center text-center justify-center ${noIcon?"bg-black":"bg-black"}`} >
                            <div className="">
                                {getFirstOneOrTwoInitials({input:userInfo.userData.fullName})}
                            </div>
                        </div>
                    <div className="font-bold text-[20px]">
                        {userInfo.userData.fullName}
                    </div>        
                </div> :
                <>
                </>}
            </div>

            <div className="w-full h-[1px] bg-gray-200 mt-[10px] mb-[16px] "/>
        </div>

    )
}