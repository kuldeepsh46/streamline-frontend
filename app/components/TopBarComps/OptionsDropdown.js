import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { logout } from '@/app/hooks/authHooks/firebaseAuth';
import { usePathname, useRouter } from 'next/navigation';

const OptionsDropdown = ({isVisible, onClose, setIsLogin, openLogInModal}) => {

    const divRef = useRef(null);
    const {user, userInfo,setLoadingNewPage} = useAuth();
    const router = useRouter();

    const pathName = usePathname()

    const [teamName, setTeamName] =useState("");
    useEffect(()=>{
        if (userInfo.teamInfo){
            setTeamName(userInfo.teamInfo.teamName)
        }
    },[userInfo])

    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            onClose(); // Trigger the close function
        }
    };

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    const loginQuery = {state:"login"};
    const signUpQuery = {state:"signup"};
    const teamsLoginQuery = new URLSearchParams(loginQuery).toString();
    const teamsSignupQuery = new URLSearchParams(signUpQuery).toString();

    return (
        isVisible && (
            <div
                ref={divRef}
                className="absolute flex flex-col bg-white 
                  top-full mt-[5px] right-0 py-[8px] 
                 rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-[200]"
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
                
            >
                <div className=''
                style={{
                    fontWeight:525
                }}> 
                    {
                    user ? 
                    <div>
                        <div className='w-[150px]'>
                        <div className='px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 
                        py-[7px]' 
                        onClick={()=>{
                            if(userInfo.userData.accountType==="team"){
                            setLoadingNewPage(true)
                              if(pathName.split("/").length>2){
                                if(pathName.split("/")[2]=="profile")
                                {
                                    window.location.reload()
                                }else{router.push(`/${teamName.replace(/\s+/g, '').toLowerCase()}/profile`)}
                                }else{
                                router.push(`/${teamName.replace(/\s+/g, '').toLowerCase()}/profile`)}

                            }
                            else{
                            setLoadingNewPage(true)
                            router.push(`/user/${user.uid}`)
                            }
                            onClose()
                        }
                    }   
                        >
                            Profile
                        </div>
                        {
                           userInfo.userData.accountType==="team"&& 
                            <div className='py-[7px] px-[8px] text-[14px] text-gray-700 w-full hover:bg-gray-100'
                        onClick={()=>{
                            
                            if(userInfo.userData.accountType==="team")
                            {
                                setLoadingNewPage(true)
                                if(pathName.split("/").length>2){
                                if(pathName.split("/")[2]=="dashboard")
                                {
                                    window.location.reload()
                                }else{router.push(`/${teamName.replace(/\s+/g, '').toLowerCase()}/dashboard`)}
                                }else{
                                router.push(`/${teamName.replace(/\s+/g, '').toLowerCase()}/dashboard`)}
                            }else{
                                setLoadingNewPage(true)
                                router.push(`/user/${userInfo.userData.firebaseId}/dashboard`)
                            }
                            onClose()
                            }}>
                            Dashboard
                        </div>}
                        <div className='w-full bg-gray-200 h-[1px]'/>
                        <div className='py-[7px] px-[8px] text-[14px] text-gray-700 w-full hover:bg-gray-100'
                        onClick={()=>{logout(router,setLoadingNewPage); onClose()}}>
                            Log out
                        </div>
                    </div>

                    </div>
                    :
                    <div className='w-[150px]'>
                        <div
                        className='px-[10px] text-[14px] text-gray-500 w-full 
                        pt-[3px] pb-[3px]'
                        >
                        Swimmers
                        </div>
                        
                        <div className='px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 
                        py-[10px]' onClick={()=>{openLogInModal();setIsLogin(true),onClose()}}>
                            Log in
                        </div>
                        <div className='py-[10px] px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100'
                        onClick={()=>{openLogInModal();setIsLogin(false); onClose()}}>
                            Sign up
                        </div>
                        
                        <div className='w-full bg-gray-200 h-[1px]'/>

                        <div
                        className='px-[10px] text-[14px] text-gray-500 w-full 
                        pt-[6px] pb-[3px]' 
                        onClick={()=>router.push('/neptunes/teamDashboard')}
                        >
                        Teams
                        </div>
                        <div className='px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 
                        py-[10px]' onClick={()=>{
                            setLoadingNewPage(true)
                            onClose()
                            router.push(`/teams?${teamsLoginQuery}`)
                        }}>
                            Log in
                        </div>
                        <div className='py-[10px] px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100'
                         onClick={()=>{
                            setLoadingNewPage(true)
                            onClose()
                            router.push(`/teams?${teamsSignupQuery}`)
                        }}>
                            Sign up
                        </div>
                    </div>
                    }
                </div>
            </div>
        )
    );
};

export default OptionsDropdown;
