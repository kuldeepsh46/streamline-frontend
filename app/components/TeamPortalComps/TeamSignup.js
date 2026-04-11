import { useTeamSignUpContext } from "@/app/contexts/TeamSignUpProvider";
import { useEffect, useState } from "react";
import EmailIcon from '../../../public/emailIcon.svg'
import RedWarningIcon from "../../../public/RedWarningIcon.svg"
import { checkAccountExists } from "@/app/hooks/firestoreHooks/user/getUser";
import { useRouter } from "next/navigation";
import { emailLogin } from "@/app/hooks/authHooks/firebaseAuth";
import MultiFieldEntryEditor from "../AuthModalComps/MultiFieldEntryEditor";
import MultiFieldPhoneEntry from "../AuthModalComps/MultiFieldPhoneEntry";
import { useAuth } from "@/app/contexts/AuthContext";

export default function TeamSignUp({switchModalType}){

    const router=useRouter();
    const isModal=false;

    const {setLoadingNewPage,loadingNewPage} = useAuth();

    const {handleTeamRegistrantInfo, teamRegistrantInfo,errorMessage,setErrorMessage,setTeamRegistrantInfo} = useTeamSignUpContext();
    const [showPassword,setShowPassword] = useState(false);


    const handleNavigate = () => {
        const fullName = teamRegistrantInfo.fullName;
        const phoneNumber = teamRegistrantInfo.phoneNumber;
        const emailAddress = teamRegistrantInfo.emailAddress;
        const teamName = teamRegistrantInfo.teamName;
        const isSigningUp = true
    
        setLoadingNewPage(true)
        // Construct the query string
        const query = new URLSearchParams({
          fullName,
          phoneNumber,
          emailAddress,
          teamName,
          isSigningUp
        }).toString();
    
        // Navigate to teamName/profile with query parameters
        router.push(`/${teamRegistrantInfo.teamName.toLowerCase().replace(" ","")}/createProfile?${query}`);
      };

    function extractContent(str) {
        const match = str.match(/:(.*?)(?=\()/);
        return match ? match[1].trim() : null; // Return the content or null if no match is found
    }

    function extractLatterContent(str) {
        const match = str.match(/\/(.*?)(?=\))/);
        return match ? match[1].trim() : null; // Return the content or null if no match is found
    }

    return(
        <div className="flex flex-col w-full px-[20px] py-[15px]">
        
        <div className="flex w-full text-streamlineBlue font-bold justify-center mb-[10px]">
          Create New Team Account
        </div>
        
        {isModal && 
        <div
        className={isModal?'absolute w-full h-[1px] bg-gray-300 top-[55px]':
                        "absolute w-full h-[1px] bg-gray-300 top-[10px]"}
        />}

        <div className='px-[13px]'>
        <div className={isModal?'w-full mt-[40px]':'w-full'}>
        {isModal && <div className='font-bold '>
            Welcome to Experience Streamline
        </div>}

        <div className="space-y-[8px]">

        <MultiFieldEntryEditor
        prompt="Team Name"
        placeholder={"Team Name"}
        fieldResponse={teamRegistrantInfo}
        setFieldResponse={setTeamRegistrantInfo}
        field={"teamName"}
        isLong={false}
        />

        <MultiFieldEntryEditor
        prompt="Contact Full Name"
        placeholder={"Full Name"}
        fieldResponse={teamRegistrantInfo}
        setFieldResponse={setTeamRegistrantInfo}
        field={"fullName"}
        isLong={false}
        />

        <MultiFieldPhoneEntry
        prompt="Contact Phone Number"
        placeholder={"Phone Number"}
        fieldResponse={teamRegistrantInfo}
        setFieldResponse={setTeamRegistrantInfo} 
        field={"phoneNumber"} customLength={"w-[70%]"}/>

        <MultiFieldEntryEditor
        prompt={"Contact Email Address"}
        placeholder={"Email Address"}
        fieldResponse={teamRegistrantInfo}
        setFieldResponse={setTeamRegistrantInfo}
        field={"emailAddress"}
        isLong={false}/>

        <div className="text-[12px] text-streamlineBlue leading-[15px]">
            This information will be used for login credentials and/or to contact you by prospective swimmers. It will also be displayed on your public team profile. Additional contact information can be added later.
        </div>
        
            {/* <div>
            <div className="text-[15px] font-bold mb-[3px]">
                Password
            </div>
            <div className='flex border
            border-gray-300 px-[8px] py-[4px] w-full items-center rounded-[12px]'
            style={{
            }}>
                <input
                value={teamRegistrantInfo.password}
                placeholder="Password"
                className='w-full outline-none'
                onChange={(e)=>{handleTeamRegistrantInfo(
                    {field:"password", value:e.target.value}
                );setErrorMessage("")}}
                type={showPassword?'':"password"}
                />

                {teamRegistrantInfo.password.length>0 &&
                <div className='font-bold text-[14px] text-streamlineBlue cursor-pointer'
                onClick={(e)=>{setShowPassword(!showPassword);e.stopPropagation();
                    setErrorMessage("")}}>
                    {!showPassword? "Show" : "Hide"}
                </div>}

            </div>
            </div> */}

        {errorMessage.length>0 &&
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

        <div className={`flex items-center justify-center py-2 rounded-full
        mt-[20px] font-bold bg-streamlineBlue text-white w-full text-center
        ${teamRegistrantInfo.emailAddress.length>0 && teamRegistrantInfo.isValid && teamRegistrantInfo.fullName.length>1 && teamRegistrantInfo.teamName.length>1 ? 'cursor-pointer':'opacity-50 '}`}
        onClick={()=>{
            if(teamRegistrantInfo.emailAddress.length>0 && teamRegistrantInfo.isValid && teamRegistrantInfo.fullName.length>1 && teamRegistrantInfo.teamName.length>1){
            handleNavigate()
            }
        }}>
            Complete Team Details
        </div>
        </div>


        <div className="flex items-center justify-center mt-[45px] space-x-4">
        <div className="flex-1 bg-streamlineBlue h-[1px] w-[130px]" />
        <span className="text-black font-semibold">or Log In</span>
        <div className="flex-1 bg-streamlineBlue h-[1px] w-[130px]" />
        </div>

        <div className="flex py-2 rounded-2xl
        items-center justify-center relative
        border border-gray-300 px-3 text-[14px]
        mt-[20px] font-bold  w-full text-center cursor-pointer"
        onClick={()=>{switchModalType()}}>
            <div className='absolute left-[20px] top-[9px]'>
                <EmailIcon className="w-[40px] h-[30px]"/>
            </div>
            Log In with Email
            </div>
        </div>

        </div>
    )
}