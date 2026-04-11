"use client";

import StreamlineLogo from '../../../public/streamlineLogo.svg'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import AuthModal from '../AuthModalComps/AuthModal';
import { monitorAuthState, logout } from "../../hooks/authHooks/firebaseAuth";
import { useAuth } from '../../contexts/AuthContext';
import AccountSection from './AccountSection';
import { SignUpProvider } from '../../contexts/SignUpProvider';
import { usePathname } from "next/navigation";

const TopBar = () => {

    const {isFetchingUserInfo, setLoadingNewPage} = useAuth();

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLogin, setIsLogin] = useState(false)

    const pathName = usePathname();

    function openModal() { 
        setIsModalOpen(true)}
    const closeModal = () => setIsModalOpen(false)
    const switchModalType = () => setIsLogin(!isLogin)

    const redirectHome = () => {
        setLoadingNewPage(true)
        if(pathName=="/"){
            window.location.reload()
        }else{
            router.push('/')
        }
    }

    // useEffect(()=>{
    //     if (userInfo.teamInfo){
    //         setTeamLogo(userInfo.teamInfo.logoPhotoURL)
    //         setUseOtherLogo(true)
    //     }
    // },[userInfo])

    return (
        <SignUpProvider>
        <div className='flex justify-between items-center' style={{
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // Safari
            MozUserSelect: "none", // Firefox
            msUserSelect: "none",}} >
            <button onClick={redirectHome}>
            {
                
                <StreamlineLogo className="w-[130px] h-[50px]"/>
            }
            </button>

            {!isFetchingUserInfo&&<AccountSection openLogInModal={openModal} setIsLogin={setIsLogin}/>}

            <AuthModal isOpen={isModalOpen} onClose={closeModal} isLogin={isLogin}
            switchModalType={switchModalType} isModal={true}/>

        </div>
        </SignUpProvider>
    )

}


export default TopBar