"use client"

import LoadingSubScreen from "@/app/components/loadingSubscreen";
import DynamicScreen from "../../components/DynamicScreen"
import TopBar from "../../components/TopBarComps/TopBar"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect } from "react";

const PolicyText = () => {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Terms and Conditions for Streamline Users</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">1. Booking and Attendance</h2>
          <p className="text-gray-600 mt-2">
            Users are expected to attend their scheduled trial lessons.
          </p>
          <p className="text-gray-600 mt-2">
            Failure to attend a trial lesson without prior rescheduling will result in suspension of future booking privileges.
          </p>
          <p className="text-gray-600 mt-2">
            Rescheduling is allowed up to 24 hours before the lesson, subject to availability.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">2. Account Usage</h2>
          <p className="text-gray-600 mt-2">
            Each user may only create one account. Duplicate accounts are prohibited.
          </p>
          <p className="text-gray-600 mt-2">
            Users agree to provide accurate information when signing up and booking lessons.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">3. Payment Policy</h2>
          <p className="text-gray-600 mt-2">
            Payments for lessons and other services must be completed through the Streamline platform. Any outside transactions are not permitted.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">4. Platform Usage</h2>
          <p className="text-gray-600 mt-2">
            Users must follow the guidelines provided by instructors and respect the terms set by partner teams and pools.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">5. Liability Waiver</h2>
          <p className="text-gray-600 mt-2">
            Users understand that swimming involves inherent risks. By using the platform, users agree to waive liability claims against Streamline for accidents or injuries occurring during lessons.
          </p>
        </div>
      </div>
    );
  };
  
export default function swimmerTermsAndConditions(){

    const {loadingNewPage,setLoadingNewPage} = useAuth()

    useEffect(()=>{setLoadingNewPage(false)},[])

    return(
        <div>

            <div className="flex  justify-center items-center">
                <DynamicScreen className=" w-[98%]">

                    <div className="flex flex-col min-h-screen ">


                    <TopBar/>

                    <div
                    className="relative z-0 w-full h-[1px] bg-gray-200 mt-[20px]"
                />
                    {loadingNewPage?
                    <LoadingSubScreen/>
                    :
                    <div className="mt-[20px]">
                    <PolicyText/>                    
                    </div>}

                    </div>
                </DynamicScreen>
            </div>


        </div>
    )
}