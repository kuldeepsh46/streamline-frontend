"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DynamicScreen from "../DynamicScreen";
import StreamlineLogo from "../../../public/streamlineLogo.svg";
import LoginSignUp from "./LoginSignUp";
import { useAuth } from "@/app/contexts/AuthContext";
import LoadingSubScreen from "../loadingSubscreen";

export default function ClientTeamsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateValue = searchParams.get("state");

  const {loadingNewPage,setLoadingNewPage} = useAuth()


  const [isLogin, setIsLogin]  = useState(stateValue=="login");
  const [isSignUp, setIsSignUp] = useState(stateValue=="signup");

  const switchModalType = () => {
    setIsLogin(!isLogin)
    setIsSignUp(!isSignUp)
  }
  const redirectHome = () => {
    setLoadingNewPage(true)
    router.push("/");
  };

  return (
    <div
      className="w-screen overflow-x-hidden"

    >
    <DynamicScreen className="bg-streamlineBlue">
        <div>
          <button onClick={redirectHome}>
            <StreamlineLogo className="w-[130px] h-[50px]" />
          </button>
        </div>

        {loadingNewPage ? 
        <div className="h-screen">
          <LoadingSubScreen color={true}/>
        </div>
        :
        <div className="flex flex-col h-screen items-center justify-center w-full">
          <div className="font-bold text-white text-[24px] px-[90px] text-center w-full">
            Welcome to the Experience Streamline Teams Portal
          </div>

          {stateValue || isLogin || isSignUp ? (
            <div className="w-[90%] md:w-[50%] lg:w-[40%] justify-center">
              <LoginSignUp isSignUp={isSignUp} isLogin={isLogin} setIsLogin={setIsLogin} setIsSignUp={setIsSignUp} switchModalType={switchModalType}/>
            </div>
          ) : (
            <div className="flex flex-col space-y-[10px] py-[20px]">
              <div className="flex w-full font-bold bg-white px-[30px] py-[10px] rounded-full justify-center cursor-pointer"
              onClick={()=>{setIsLogin(true);setIsSignUp(false)}}>
                Log In Existing Team Account
              </div>

              <div className="flex w-full font-bold bg-white px-[20px] py-[10px] rounded-full justify-center cursor-pointer"
              onClick={()=>{setIsLogin(false);setIsSignUp(true)}}>
                Create New Team Account
              </div>
            </div>
          )}
        </div>}
      </DynamicScreen>
      </div>
  );
}
