"use client";

import { useState,useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext"
import TopBar from "../TopBarComps/TopBar"
import { useRouter } from "next/navigation";

export default function TeamDashHeader({selectedPage,setIsLoading,setSelectedPage}){

    const [currPage,setCurrPage]=useState(selectedPage)
    const {userInfo} = useAuth()
    const router = useRouter();
    const [teamName, setTeamName] =useState("");
    const [teamLogo, setTeamLogo] =useState("");
    useEffect(()=>{
        if (userInfo.teamInfo){
            setTeamName(userInfo.teamInfo.teamName)
            setTeamLogo(userInfo.teamInfo.logoPhotoURL)
        }
    },[userInfo])

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
                {teamLogo.length>0 ?
                <div className="flex items-center space-x-[20px]">
                    <img
                    src={teamLogo}
                    className='h-[90px] py-[8px] '
                    />
                    <div className="font-bold text-streamlineBlue text-[20px]">
                        {teamName}
                    </div>        
                </div> :
                <>
                </>}
            </div>

            <div className="flex space-x-[12px] items-center justify-center">


            <div className={currPage==="dashboard" ? `text-[16px] font-bold py-[6px] px-[14px] bg-gray-200 rounded-[30px]` :`text-[16px] py-[6px] px-[14px] hover:bg-gray-200 rounded-[30px] font-bold text-gray-400 cursor-pointer`}
            onClick={()=>{
                if(userInfo.userData.accountType==="team")
                {
                    if(currPage!="dashboard"){
                    setCurrPage("dashboard")
                    setSelectedPage("dashboard")
                    setIsLoading(true)
                    router.push(`/${teamName.replace(/\s+/g, '').toLowerCase()}/dashboard`)}
                }else{
                    router.push(`/user/${userInfo.userData.firebaseId}/dashboard`)
                }}}>            
                Dashboard
            </div>
            {/* <div className="font-bold text-streamlineBlue text-[20px] mb-[5px]">
                |
            </div> */}
            <div className={currPage==="profile" ? `text-[16px] font-bold py-[6px] px-[14px] bg-gray-200 rounded-[30px]` :`text-[16px] py-[6px] px-[14px] hover:bg-gray-200 rounded-[30px] font-bold text-gray-400 cursor-pointer`}
            onClick={()=>{
                if(userInfo.userData.accountType==="team")
                {
                    if(currPage!="profile"){
                    setCurrPage("profile")
                    setSelectedPage("profile")
                    setIsLoading(true)
                    router.push(`/${teamName.replace(/\s+/g, '').toLowerCase()}/profile`)
                }
                }else{
                    router.push(`/user/${userInfo.userData.firebaseId}/profile`)
                }}}>
                Profile
            </div>
            </div>
            <div className="w-full h-[1px] bg-gray-200 mt-[10px] mb-[16px] "/>
        </div>

    )
}