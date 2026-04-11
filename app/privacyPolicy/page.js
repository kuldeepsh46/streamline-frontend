"use client"

import { useEffect } from "react"
import DynamicScreen from "../components/DynamicScreen"
import TopBar from "../components/TopBarComps/TopBar"
import { useAuth } from "../contexts/AuthContext"
import LoadingSubScreen from "../components/loadingSubscreen"

const PolicyText = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
          <p className="text-gray-600 mb-4">
            At Streamline, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information.
          </p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">1. Information We Collect</h2>
            <p className="text-gray-600 mt-2">
              <strong>Email Address:</strong> To send you updates, offers, and important information about your bookings.
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Phone Number:</strong> For communication purposes, including appointment confirmations or rescheduling.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">2. How We Use Your Information</h2>
            <p className="text-gray-600 mt-2">We use your contact information solely to:</p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Provide updates about your bookings and lessons.</li>
              <li>Share exclusive offers and promotional material.</li>
              <li>Improve the functionality and user experience of the platform.</li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">3. Credit Card Information</h2>
            <p className="text-gray-600 mt-2">
              We do not store or access your credit card information. All payment processing is handled securely by our third-party payment providers, compliant with industry-standard encryption and privacy regulations.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">4. Data Protection</h2>
            <p className="text-gray-600 mt-2">
              Your information is stored securely, and we take appropriate technical measures to safeguard it from unauthorized access or misuse.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">5. Consent</h2>
            <p className="text-gray-600 mt-2">
              By using our platform, you consent to our collection and use of your personal information as described in this policy.
            </p>
          </div>
        </div>
      );
    };
  
  

export default function privacePolicy(){

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