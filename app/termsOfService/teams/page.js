"use client"

import LoadingSubScreen from "@/app/components/loadingSubscreen";
import DynamicScreen from "../../components/DynamicScreen"
import TopBar from "../../components/TopBarComps/TopBar"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect } from "react";

const PolicyText = () => {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Terms and Conditions for Teams Registered on Streamline</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">1. Free Trial Period</h2>
          <p className="text-gray-600 mt-2">
            Teams registered on the Streamline platform will receive a two-month free trial period to explore the platform’s features and services.
          </p>
          <p className="text-gray-600 mt-2">
            After the free trial period ends, continued access requires payment under the chosen plan.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">2. Payment Terms</h2>
          <p className="text-gray-600 mt-2">
            Payments are processed monthly through the Streamline platform. Teams are responsible for ensuring their payment information is up-to-date.
          </p>
          <p className="text-gray-600 mt-2">
            Late or failed payments will result in temporary suspension from the platform until payment is made.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">3. Cancellation Policy</h2>
          <p className="text-gray-600 mt-2">
            Teams may cancel their registration at any time, but cancellation must be communicated 30 days in advance of the next billing cycle.
          </p>
          <p className="text-gray-600 mt-2">
            No refunds will be issued for unused portions of a billing cycle.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">4. Commitment to Services</h2>
          <p className="text-gray-600 mt-2">
            Teams agree to honor trial lessons booked through Streamline and provide the agreed-upon services to users.
          </p>
          <p className="text-gray-600 mt-2">
            Teams that fail to honor bookings or receive consistent negative feedback may face suspension or removal from the platform.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">5. Exclusivity and Payment Processing</h2>
          <p className="text-gray-600 mt-2">
            All payments for lessons booked through Streamline must be processed on the platform. Teams are prohibited from accepting direct payments for these bookings to ensure proper tracking and transparency.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">6. Liability and Insurance</h2>
          <p className="text-gray-600 mt-2">
            Teams are responsible for maintaining their own liability insurance to cover incidents occurring during lessons.
          </p>
          <p className="text-gray-600 mt-2">
            Streamline is not liable for injuries, damages, or disputes arising during lessons provided by the team.
          </p>
        </div>
      </div>
    );
  };
  
export default function teamTermsAndConditions(){

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