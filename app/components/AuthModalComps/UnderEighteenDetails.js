"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ProfileEntryEditor from "../TeamProfileEditorComponents/ProfileEntryEditor";
import { useSignUpContext } from "../../contexts/SignUpProvider";
import MultiFieldEntryEditor from "./MultiFieldEntryEditor";
import "react-datepicker/dist/react-datepicker.css";
import "react-day-picker/style.css";
import ChildBirthDatePicker from "./BirthDatePicker";
import MultiFieldPhoneEntry from "./MultiFieldPhoneEntry";
import AdditionalSwimmersSection from "./AdditionalSwimmersSection";
import CONFIG from "@/config";
import validateFields from "@/app/hooks/firestoreHooks/validateFields";
import { emailSignUp } from "@/app/hooks/authHooks/firebaseAuth";
import { addAccountDependants, addAccountDetails } from "@/app/hooks/firestoreHooks/createAccount";
import { useAuth } from "@/app/contexts/AuthContext";
import TermsAcknowledgment from "../termAcknowledgment";
import SMSAgreement from "./SMSAgreement";

export default function UnderEighteenDetails({setFinishSignUpDetails, onClose}) {
    
    const {setLoadingNewPage,noLoading,setNoLoading}=useAuth()
    const {guardianInfo, setGuardianInfo, kids, setKids, hasEmail, hasNumber, setErrorMessage} = useSignUpContext()
    const [guardianFullName, setGuardianFullName] = useState("")
    const [incompleteFieldsError, setIncompleteFieldsError] = useState(false)
    const [userPhoneAgreement,setUserPhoneAgreement]=useState(false)

    useEffect(()=>{
        setNoLoading(true)
    },[])

    useEffect(()=>{
        setGuardianInfo(prevState => ({
            ...prevState,
            fullName: guardianFullName,
          }));
    },[guardianFullName])

    function extractContent(str) {
        const match = str.match(/:(.*?)(?=\()/);
        return match ? match[1].trim() : null; // Return the content or null if no match is found
    }

    function extractLatterContent(str) {
        const match = str.match(/\/(.*?)(?=\))/);
        return match ? match[1].trim() : null; // Return the content or null if no match is found
    }

    useEffect(()=>{
    if(guardianInfo["isValid"]){
        setIncompleteFieldsError(false)
    }
    }
    ,[guardianInfo["isValid"]]
    )


    const handleSubmit = async() => {
        try{
            validateFields({data:guardianInfo, isGuardian:guardianInfo.isGuardian})
            for (const swimmer of kids){
                validateFields({data:swimmer})
            }
            setIncompleteFieldsError(false)
            let userId; 

            if (guardianInfo.signUpMethod==="email"){
            userId = await emailSignUp({email:guardianInfo.emailAddress,password:guardianInfo.password,setLoadingNewPage:setLoadingNewPage,noLoading:noLoading})
            }
        
        const accountDetails={
            accountType:"guardian",
            dateJoined:new Date(),
            emailAddress: guardianInfo.emailAddress,
            firebaseId: userId.uid,
            fullName: guardianInfo.fullName,
            phoneNumber: guardianInfo.phoneNumber,
            smsAgreement:userPhoneAgreement
        }
        addAccountDetails({accountData:accountDetails})
        
        addAccountDependants({dependantsList: kids, firebaseId:userId.uid})
        
        onClose()
        
        }catch(error){
                if (error.message.includes("auth")){
                    const errMessage = extractContent(error.message)
                    const errMessageTwo = extractLatterContent(error.message)
                    const finalErrMessage = errMessage + " (" + errMessageTwo + ")"
                    setErrorMessage(finalErrMessage)
                    setFinishSignUpDetails(false)
                }else{
                setIncompleteFieldsError(true)
                }
            }
        }

    return (
        <div className="w-full mx-auto space-y-[10px] mt-[10px]">

        <MultiFieldEntryEditor
            prompt={"Guardian Full Name"}
            placeholder={"Full Name"}
            field={"fullName"}
            fieldResponse={guardianInfo}
            setFieldResponse={setGuardianInfo}
        />

        {
            !hasEmail&&
            <MultiFieldEntryEditor
            prompt={"Guardian Email"}
            placeholder={"Email Address"}
            field={"emailAddress"}
            uneditable={true}
            fieldResponse={guardianInfo}
            setFieldResponse={setGuardianInfo}
            />
        }

        {!hasNumber&&
            <MultiFieldPhoneEntry
            prompt={"Guardian Phone Number"}
            placeholder={"Enter Phone Number"}
            fieldResponse={guardianInfo}
            setFieldResponse={setGuardianInfo}
            field={"phoneNumber"}
            />
        }
        <div className="text-[12px] text-streamlineBlue leading-[14px]">
            {CONFIG.contactInfoDisclaimer}
        </div>
        
        <AdditionalSwimmersSection isMinor={true}/>

        {incompleteFieldsError &&
        <div className="text-center text-red-500 text-[14px] font-bold">
            {guardianInfo["isValid"] ?
            "Please ensure all the fields above are completely filled out":
            "Please ensure you have entered a correct phone number"
            }
        </div>}

        
        {/* <SMSAgreement setUserPhoneAgreement={setUserPhoneAgreement} blurb={"I agree to receive SMS notifications for lesson scheduling. Standard SMS carrier rates apply."}/> */}


        <TermsAcknowledgment buttonText={"Create Account"} termsPageRoute={"termsOfService/swimmers"}/>


        <div>
        <div className="flex w-full align-center justify-center mt-[10px]">
        <button
            onClick={handleSubmit}
            className="bg-streamlineBlue font-bold text-white py-2 px-6 rounded-full shadow hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
            Create account
        </button>
        </div>
        </div>
        </div>
    );
}