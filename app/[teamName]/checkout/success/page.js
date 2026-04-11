"use client";

import { useRouter } from "next/navigation";
import DynamicScreen from "../../../components/DynamicScreen";
import TopBar from "../../../components/TopBarComps/TopBar";
import EquipmentSection from "@/app/components/EquipmentMenu/EquipmentSection";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useAuth } from "@/app/contexts/AuthContext";
import LoadingSubScreen from "@/app/components/loadingSubscreen";
import { usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import CONFIG from "@/config";

export default function SuccessfulCheckout() {


    const router = useRouter();

    const {setLoadingNewPage,loadingNewPage,user}=useAuth()
    
    const pathName = usePathname();
    const { checkoutData, setCheckoutData } = useCheckout();

    const [currSelectedLessonType, setCurrSelectedLessonType] = useState(checkoutData!=null ? checkoutData.lessonType : "")
    const [currSelectedSkillLevel, setCurrSelectedSkillLevel] = useState(checkoutData!=null ? checkoutData.skillLevel : "")

    const [teamName,setTeamName]=useState("")
    const [prevPage,setPrevPage]=useState("")
    const currency = "CAD"
    const [isLoginOption,setIsLoginOptions] = useState(false)
    const [locationInfo,setLocationInfo]=useState(null)

    const [lessonType,setLessonType]=useState(null)
    const [skillLevel,setSkillLevel]=useState(null)
    const [teamPhoto,setTeamPhoto]=useState(null)
    
        useEffect(()=>{
        const pathStop = pathName.split('/')[1];
        
        const name = pathStop.split('-')[0]
        console.log("HELLO??",pathStop)
        setPrevPage(pathStop)
        if(!checkoutData){
            router.push(`/${pathStop}`)
        }else{
            console.log(checkoutData)
            setLoadingNewPage(false)
            setTeamName(checkoutData.teamInfo[0].teamName)
            setTeamPhoto(checkoutData.images[0])
            setLessonType(checkoutData.selectedLessonType)
            setSkillLevel(checkoutData.selectedSkillLevel)
            setLocationInfo(checkoutData.locationInfo[0])
        }

    },[])



    const handleRedirect = () => {
        router.push(`/`)
    }
  return (
    <div className="flex  justify-center items-center">
      <DynamicScreen className="w-[99%] md:w-[82%] lg:[75%]">

        <TopBar/>

       {loadingNewPage?
        <div className="h-screen">
          <LoadingSubScreen/>
        </div>
        :
        <div
        className="relative flex flex-col items-center justify-center w-full"
        >
        <div
            className="relative w-screen h-[1px] bg-gray-200 mt-[18px]"
          />  

        <div className="flex flex-col w-full  min-h-screen">

        <div className="
        text-streamlineBlue
        font-bold items-start mt-[20px] mb-[15px] leading-[18px]">
          Your trial lesson has been requested. You will hear back from {teamName} within 24 hrs to confirm
        </div>

        <div className="h-[5px]"></div>
      
        <div className="flex w-full justify-center">
        <div className=" py-[20px] px-[20px] border border-gray-300 rounded-xl
                shadow-[0_0_10px_rgba(0,0,0,0.1)] ">  
                    <div className="flex items-center  mb-[10px] space-x-[4px] items-end">
                            <img
                                src={teamPhoto}
                                className=
                                " w-[140px] h-[140px] rounded-[10px]"
                            />
                        <div className="pl-[10px]">
                        
                        <div className="font-bold">
                        {teamName}
                        </div>

                        <div className="flex-col leading-1.25 text-[14px] flex">
                        <div className=" mr-[3px]">Trial lesson, 1 {CONFIG.athleteType.toLowerCase()}
                        </div>
                        <div className="flex">
                        <div className="flex font-bold mr-[3px]">Skill level: </div> {currSelectedSkillLevel}
                        </div>
                        <div className="flex">
                        <div className="flex font-bold mr-[3px]">Lesson type: </div> {currSelectedLessonType}
                        </div>
                        </div>

                        </div>
                    </div>

                </div>
        </div>

        <div className="h-[25px]"></div>

        {/* <EquipmentSection/> */}

        <div className="w-full flex items-center justify-center">
        <div className=" bg-streamlineBlue text-white flex px-[20px] justify-center mx-[30px] py-[10px] font-bold rounded-[20px] mt-[20px] mb-[20px] cursor-pointer" onClick={()=>{
          setLoadingNewPage(true)
          router.push(`/user/${user.uid}`)}}>
                Go to my profile page
          </div>
        </div>
        
        </div>
        
        </div>    }    

      </DynamicScreen>
    </div>
  );
}
