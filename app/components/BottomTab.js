"use client";
import CONFIG from "@/config";
import EmailIcon from "../../public/emailIcon.svg"
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

// components/BottomTab.js
export default function BottomTab() {

  const router = useRouter()
  const {setLoadingNewPage}=useAuth()

    return (
      <div className="flex justify-between rounded-[20px] border-top border-gray-100 bg-gray-100 w-full h-[190px] p-[25px] items-center text-[14px]">
        <div className="flex flex-col text-center w-[33%]">
        <div className=" font-bold">
          Terms and Conditions
          </div>
          <div className="underline hover:no-underline cursor-pointer py-[3px]" onClick={()=>{
          setLoadingNewPage(true);
          router.push("/termsOfService/swimmers")}}>
            For {CONFIG.athleteType}s
          </div>
          <div className="underline hover:no-underline cursor-pointer " onClick={()=>{
          setLoadingNewPage(true);
          router.push("/termsOfService/teams")}}>
            For Teams
          </div>
          <div className="flex sm:hidden flex-col underline hover:no-underline cursor-pointer text-center font-bold mt-[20px]" onClick={()=>{
          setLoadingNewPage(true);
          router.push("/privacyPolicy")}}>
        Privacy Policy
        </div>
        </div>
        <div className="flex hidden sm:block flex-col underline hover:no-underline cursor-pointer text-center font-bold w-[0%] sm:w-[33%]" onClick={()=>{
          setLoadingNewPage(true);
          router.push("/privacyPolicy")}}>
        Privacy Policy
        </div>
        <div className="flex flex-col break-all w-[60%] sm:w-[33%]">
        <div className="font-bold text-center sm:text-start">Contact Info</div>
        <div className="flex text-[14px]  items-center space-x-[6px]">
          <div className="flex justify-center w-[30px]">
            <EmailIcon/>
            </div>
        <div className="flex mt-[1px] text-[14px] break-words">
        {CONFIG.contactEmail} 
        </div>
        </div>
        <div className="flex text-[14px] items-center space-x-[6px]">
        <div className="flex justify-center items-center w-[30px]">
            <img src="/PhoneIcon.png"
            className="w-[30px]"
            />
        </div>
        <div className="mt-[1px]">
        {CONFIG.contactPhoneNumber} 
        </div></div>
        </div>
      </div>
    );
  }
  