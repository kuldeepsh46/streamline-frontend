import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { logout } from '@/app/hooks/authHooks/firebaseAuth';
import { usePathname, useRouter } from 'next/navigation';

const OptionsDropdown = ({isVisible, onClose, setIsLogin, openLogInModal}) => {

    const divRef = useRef(null);
    const {user, userInfo, setLoadingNewPage} = useAuth();
    const router = useRouter();
    const pathName = usePathname()

    const [teamName, setTeamName] = useState("");

    useEffect(() => {
        if (userInfo?.teamInfo) {
            setTeamName(userInfo.teamInfo.teamName)
        }
    }, [userInfo])

    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            onClose(); 
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

    // Helper to format team name for URL
    const formatUrlName = (name) => name ? name.replace(/\s+/g, '').toLowerCase() : "";

    return (
        isVisible && (
            <div
                ref={divRef}
                className="absolute flex flex-col bg-white 
                  top-full mt-[5px] right-0 py-[8px] 
                 rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-[200]"
                onClick={(e) => e.stopPropagation()} 
            >
                <div style={{ fontWeight: 525 }}> 
                    {user ? (
                        <div className='w-[150px]'>
                            {/* Profile Link */}
                            <div className='px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 py-[7px] cursor-pointer' 
                                onClick={() => {
                                    if (userInfo?.userData?.accountType === "team") {
                                        setLoadingNewPage(true);
                                        const urlName = formatUrlName(teamName);
                                        if (pathName.split("/")[2] === "profile") {
                                            window.location.reload();
                                        } else {
                                            router.push(`/${urlName}/profile`);
                                        }
                                    } else {
                                        setLoadingNewPage(true);
                                        router.push(`/user/${user.uid}`);
                                    }
                                    onClose();
                                }}
                            >
                                Profile
                            </div>

                            {/* Dashboard Link (Team Only) */}
                            {userInfo?.userData?.accountType === "team" && (
                                <div className='py-[7px] px-[8px] text-[14px] text-gray-700 w-full hover:bg-gray-100 cursor-pointer'
                                    onClick={() => {
                                        setLoadingNewPage(true);
                                        const urlName = formatUrlName(teamName);
                                        if (pathName.split("/")[2] === "dashboard") {
                                            window.location.reload();
                                        } else {
                                            router.push(`/${urlName}/dashboard`);
                                        }
                                        onClose();
                                    }}
                                >
                                    Dashboard
                                </div>
                            )}

                            <div className='w-full bg-gray-200 h-[1px]'/>

                            {/* Log out */}
                            <div className='py-[7px] px-[8px] text-[14px] text-gray-700 w-full hover:bg-gray-100 cursor-pointer'
                                onClick={() => {
                                    onClose(); 
                                    logout(router, setLoadingNewPage); 
                                }}
                            >
                                Log out
                            </div>
                        </div>
                    ) : (
                        /* Logged Out State */
                        <div className='w-[150px]'>
                            <div className='px-[10px] text-[14px] text-gray-500 w-full pt-[3px] pb-[3px]'>
                                Swimmers
                            </div>
                            
                            <div className='px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 py-[10px] cursor-pointer' 
                                onClick={() => { openLogInModal(); setIsLogin(true); onClose(); }}>
                                Log in
                            </div>
                            <div className='py-[10px] px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 cursor-pointer'
                                onClick={() => { openLogInModal(); setIsLogin(false); onClose(); }}>
                                Sign up
                            </div>
                            
                            <div className='w-full bg-gray-200 h-[1px]'/>

                            <div className='px-[10px] text-[14px] text-gray-500 w-full pt-[6px] pb-[3px] cursor-pointer'>
                                Teams
                            </div>
                            <div className='px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 py-[10px] cursor-pointer' 
                                onClick={() => {
                                    setLoadingNewPage(true);
                                    onClose();
                                    router.push(`/teams?${teamsLoginQuery}`);
                                }}>
                                Log in
                            </div>
                            <div className='py-[10px] px-[10px] text-[14px] text-gray-700 w-full hover:bg-gray-100 cursor-pointer'
                                onClick={() => {
                                    setLoadingNewPage(true);
                                    onClose();
                                    router.push(`/teams?${teamsSignupQuery}`);
                                }}>
                                Sign up
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default OptionsDropdown;