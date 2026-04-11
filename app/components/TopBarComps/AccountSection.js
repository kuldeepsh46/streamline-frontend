"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import OptionsDropdown from "./OptionsDropdown";
import { useState, useRef,  useEffect } from "react";
import SettingsIcon from '../../../public/SettingsIcon.svg';
import ProfileIcon from '../../../public/ProfileIcon.svg';

const AccountSection = ({openLogInModal, setIsLogin}) => {

    const {user, setUser,userInfo} = useAuth();

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
    const [showIt, setShowIt] = useState(false)

    const [userName,setUsername] = useState(" ")
    useEffect(()=>{        
        if(userInfo.userData){
            if(userInfo.userData.account=="team"){
                if (userInfo.teamInfo){
                setUsername(userInfo.teamInfo.teamName)
                }
            }else{
                setUsername(userInfo.userData.fullName)
            }
        }
    },[userInfo])
    
    return(
        
        <div className="flex relative border border-gray-200 border-[1px] rounded-full items-center justify-between space-x-[12px] px-[12px] py-[5px] cursor-pointer"
        onClick={()=>{toggleVisibility()}} style={{
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}} >
            {/* <img src="SettingsIcon.png"/> */}
            <SettingsIcon/>

            {userInfo.userData? 
            <div className="flex bg-black rounded-full text-white text-[15px] w-[28px] h-[28px] items-center justify-center ">
            {userName.charAt(0).toUpperCase()}
            </div> 
            :
            <div className="bg-[#5F5F5F] rounded-full">
            {/* <img src="ProfileIcon.png"/> */}
            <ProfileIcon/>
            </div>
            }

            <OptionsDropdown onClose={handleCloseDropdown} isVisible={isVisible}
            openLogInModal={openLogInModal} setIsLogin={setIsLogin}/>
        </div>
    )
}
export default AccountSection;