"use client"

import PasswordEntry from "../AuthModalComps/PasswordEntry";
import ProfileEntryEditor from "./ProfileEntryEditor";
import { useEffect, useState } from "react";
import RedWarningIcon from "public/RedWarningIcon.svg";
import { extractContent } from "@/app/hooks/authHooks/errorMessageProcessing";
import { extractLatterContent } from "@/app/hooks/authHooks/errorMessageProcessing";
import TermsAcknowledgment from "../termAcknowledgment";
import SMSAgreement from "../AuthModalComps/SMSAgreement";

const EmailSignupWidget = ({setAlternativeSignUpEmail, alternativeSignUpEmail, useDifferentEmailThanContact, setUseDifferentEmailThanContact, emailAddress, setEmailAddress, password, setPassword, completeSignUp, errorMessage,setErrorMessage,setUserPhoneAgreement}) => {


    return(
        <div className="flex flex-col w-full bg-white p-[20px] rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] items-center justify-center  space-y-[5px]">


            <div className="font-bold text-streamlineBlue mb-[10px]">
                Sign Up with Email
            </div>

            <div className="flex flex-col w-[60%] space-y-[10px]">
            <ProfileEntryEditor
            prompt={"Email Address"}
            placeholder={"Email Address"}
            response={useDifferentEmailThanContact?alternativeSignUpEmail:emailAddress}
            setResponse={useDifferentEmailThanContact?setAlternativeSignUpEmail:setEmailAddress}
            isLong={false}
            uneditable={!useDifferentEmailThanContact}
            clearErrorMessage={setErrorMessage}
            />
            <label className="flex items-center space-x-2">
                <input
                type="checkbox"
                checked={useDifferentEmailThanContact}
                onChange={() => setUseDifferentEmailThanContact(!useDifferentEmailThanContact)}
                className="w-4 h-4"
                />
                <span>Use different email than contact email</span>
            </label>



            <PasswordEntry
            password={password}
            setPassword={setPassword}
            setErrorMessage={setErrorMessage}
            />
            </div>
            <div className="">
            {errorMessage.length!=0 &&
        <div className='flex mt-[7px] items-center'>
            <div className='w-[20px]'>
            <RedWarningIcon/>
            </div>
            <div className='text-[11px] mt-[3px] ml-[5px]'
            style={{color:'#FF0000'}}>
                {errorMessage}
            </div>
        </div>}
            </div>
            <div className="h-[10px]"/>
            <div className="w-[60%] pb-[4px]">

            {/* <SMSAgreement setUserPhoneAgreement={setUserPhoneAgreement} blurb={"I agree to have coaches registered under this team to receive SMS notifications for lesson scheduling. Standard SMS carrier rates apply."}/> */}

            <div className="h-[10px]"/>

            <TermsAcknowledgment buttonText={"Sign Up"} termsPageRoute={"termsOfService/teams"}/>
            </div>

            <div className="flex justify-center rounded-[20px] font-bold text-white bg-streamlineBlue py-[7px] w-[130px] mt-[20px] cursor-pointer"
            onClick={async()=>{try{await completeSignUp()}
            catch(error){
                if (error.message.includes("auth")){
                    const errMessage = extractContent(error.message)
                    const errMessageTwo = extractLatterContent(error.message)
                    const finalErrMessage = errMessage + " (" + errMessageTwo + ")"
                    setErrorMessage(finalErrMessage)
                    console.log("hiii???",finalErrMessage)
                    // setFinishSignUpDetails(false)
                }else{
                setErrorMessage("An error has occurred, please try again later.")
                }
            }}}>
                Sign Up
            </div>


        </div>
    )

}

export default EmailSignupWidget;