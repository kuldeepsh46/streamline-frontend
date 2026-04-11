"use client";

import DynamicScreen from "../../components/DynamicScreen";

import CONFIG from "@/config";
import TopBar from "../../components/TopBarComps/TopBar";
import { useState, useRef, useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";
import { useCheckout } from "../../contexts/CheckoutContext";
import DateTimePicker from "@/app/components/TeamPageComps/LessonBookingPanel/DateTimePicker";
import BlackMoveLeft from "../../../public/BlackMoveLeft.svg"
import LessonTypeDropdown from "@/app/components/searchBarComps/LessonTypeDropdown";
import AuthModal from "@/app/components/AuthModalComps/AuthModal";
import PaymentModal from "@/app/components/PaymentModal";
import { useAuth } from "@/app/contexts/AuthContext";
import { SignUpProvider, useSignUpContext } from "@/app/contexts/SignUpProvider";
import LoadingSubScreen from "@/app/components/loadingSubscreen";
import PersonEntry from "@/app/components/TeamDashboard/CalendarComps/PersonEntry";
import { editingMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/editingEntryByAllFields";
import { addInfoAsJson } from "@/app/hooks/firestoreHooks/adding/addInfoAsJson";
import sendMessage from "@/app/hooks/twilio/sendMessage";
import { calculateAge, formatEventTime } from "@/app/hooks/miscellaneous";

export default function CheckoutPage() {

    const {user, setUser,setLoadingNewPage,loadingNewPage,userInfo,setNoLoading} = useAuth();

    const [isNewPageLoading,setIsNewPageLoading]=useState(true)
    const router = useRouter();
    
    const switchModalType = () => {
    setIsLoginOptions(!isLoginOption)
    }

    const pathName = usePathname();
    const { checkoutData, setCheckoutData } = useCheckout();

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
        setNoLoading(true)
        setPrevPage(pathStop)
        if(!checkoutData){
            router.push(`/${pathStop}`)
        }else{
            setIsNewPageLoading(false)
            setLoadingNewPage(false)
            setTeamName(checkoutData.teamInfo[0].teamName)
            setTeamPhoto(checkoutData.images[0])
            setLessonType(checkoutData.selectedLessonType)
            setSkillLevel(checkoutData.selectedSkillLevel)
            setLocationInfo(checkoutData.locationInfo[0])
        }

    },[])

    const [lessonTypes,setLessonTypes] = useState([
        { lessonType: 'Private', lessonTypeDescription: 'One one one with an instructor' },
        { lessonType: 'Semi-Private', lessonTypeDescription: `I don't remember` },
        { lessonType: 'Group', lessonTypeDescription: 'Group lesson with other swimmers' }
    ]);
    const [skillLevels,setSkillLevels] = useState([
        { skillLevel: 'Beginner', skillLevelDescription: 'Learning swimming for the first time' },
        { skillLevel: 'Intermediate', skillLevelDescription: `Has some swimming experience` },
        { skillLevel: 'Advanced', skillLevelDescription: 'Already a proficient swimmer' }
    ]);

    const [currSelectedDate, setCurrSelectedDate] = useState(checkoutData!=null ? checkoutData.lessonDate : "");
    const [currSelectedTime, setCurrSelectedTime] = useState(checkoutData!=null ? checkoutData.lessonTime : "");

    function invertObject(obj) {
        const inverted = {};
      
        for (const [key, value] of Object.entries(obj)) {
          inverted[value] = key; // Swap key and value
        }
      
        return inverted;
      }
      
    const lessonTypesMapping = invertObject(checkoutData?checkoutData?.lessonTypesMapping:{})

    // Lesson type dropdown setup
    const [currSelectedLessonType, setCurrSelectedLessonType] = useState(checkoutData!=null ? checkoutData.lessonType : "")
    const [currSelectedSkillLevel, setCurrSelectedSkillLevel] = useState(checkoutData!=null ? checkoutData.skillLevel : "")

    const [isDateTimeDropdownVisible, setIsDateTimeDropdownVisible] = useState(false);
    const [isDateTimeDropdownClosing, setIsDateTimeDropdownClosing] = useState(false);

    const toggleIsDateTimeDropdownVisible = () => {
        if (isDateTimeDropdownClosing) return; // Prevent reopening if in closing state
        setIsDateTimeDropdownVisible(prev => !prev);
    };
    const handleCloseDateTimeDropdown = () => {
        setIsDateTimeDropdownClosing(true); // Set closing flag
        setIsDateTimeDropdownVisible(false);
        setTimeout(() => setIsDateTimeDropdownClosing(false), 500); // Reset after a short delay
    };

    const [potentialAthletes,setPotentialAthletes]=useState(null)

    const {kids} = useSignUpContext()

    useEffect(()=>{

        

        if(userInfo){

            if(userInfo.userData){
            if(!userInfo.otherAthletes){
                
                setPotentialAthletes([{fullName:userInfo.userData.fullName,athleteInfo:userInfo.userData,firebaseId:user.uid}])

                const newAthletes = kids.map((item) => ({
                    fullName: item.fullName,
                    firebaseId:user.uid
                  }));
                  
                  // Set state once
                  setPotentialAthletes((prev) => [...prev, ...newAthletes]);
            }else{
                setPotentialAthletes([{fullName:userInfo.userData.fullName,athleteInfo:userInfo.userData}])
                  
                  const newAthletes = userInfo.otherAthletes.map((item) => ({
                    fullName: item.fullName,
                    athleteInfo: item,
                  }));
                  
                  // Set state once
                  setPotentialAthletes((prev) => [...prev, ...newAthletes]);
                }
            }
        }
    },[userInfo])

    const [selectedAthleteId,setSelectedAthleteId]=useState(null)
    
    console.log(checkoutData)

    const handleRedirect = async() => {
        setLoadingNewPage(true)

        const entryId = await addInfoAsJson({jsonInfo:{
            coachEmail:checkoutData.eventInfo.coachEmail,
            coachName:checkoutData.eventInfo.coachName,
            coachPhone:checkoutData.eventInfo.coachPhone,
            userId:user.uid,
            createdOn:new Date(),
            day:checkoutData.eventInfo.day,
            end:checkoutData.eventInfo.end,
            lessonType:[`${lessonTypesMapping[currSelectedSkillLevel]}\`${lessonTypesMapping[currSelectedLessonType]}`],
            locationId:checkoutData.eventInfo.locationId,
            reminder:checkoutData.eventInfo.reminder,
            start:checkoutData.eventInfo.start,
            status:"Pending",
            teamId:checkoutData.eventInfo.teamId,
            title:checkoutData.eventInfo.title,
            availableSister:checkoutData.eventInfo.id,
            athletes:[potentialAthletes[selectedAthleteId]],
            contact:[potentialAthletes[selectedAthleteId].athleteInfo.phoneNumber?{phoneNumber:potentialAthletes[selectedAthleteId].athleteInfo.phoneNumber,fullName:potentialAthletes[selectedAthleteId].athleteInfo.fullName}:userInfo.userData]
        },collectionName:"TimeBlock"})

        const bookedLessonId=await addInfoAsJson({
            jsonInfo:{
                userId:user.uid,
                lessonId:entryId,
                athlete:potentialAthletes[selectedAthleteId].fullName,
                bookingDateTime:new Date(),
                skillLevel:currSelectedSkillLevel,
                lessonType:currSelectedLessonType,
                age:potentialAthletes[selectedAthleteId].athleteInfo.dateOfBirth? `${calculateAge(potentialAthletes[selectedAthleteId].athleteInfo.dateOfBirth)}`:"Over 18",
                teamName:checkoutData.teamInfo[0].teamName,
                city:checkoutData.locationInfo[0].city,
                state:checkoutData.locationInfo[0].state,
                country:checkoutData.locationInfo[0].country,
                address:checkoutData.locationInfo[0].address,
                phoneNumber:potentialAthletes[selectedAthleteId].athleteInfo.phoneNumber?potentialAthletes[selectedAthleteId].athleteInfo.phoneNumber:userInfo.userData.phoneNumber
            },
            collectionName:"LessonBookings"
        })

        await editingMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"id":checkoutData.eventInfo.id},updateData:{numberOfSpots:checkoutData.eventInfo.numberOfSpots-1,pendingSisters:checkoutData.eventInfo.pendingSisters?[...checkoutData.eventInfo.pendingSisters,entryId]:[entryId],lessonType:[`${lessonTypesMapping[currSelectedSkillLevel]}\`${lessonTypesMapping[currSelectedLessonType]}`]
        }})

        const reservationDateTime = formatEventTime({startTime:checkoutData.eventInfo.start,endTime:checkoutData.eventInfo.end})

        const message = `Hi Coach ${checkoutData.eventInfo.coachName.split(" ")[0]}! A trial lesson on ${reservationDateTime} (Level: ${lessonTypesMapping[currSelectedSkillLevel]}, Category: ${lessonTypesMapping[currSelectedLessonType]}) has been requested by ${potentialAthletes[selectedAthleteId].fullName}. ${potentialAthletes[selectedAthleteId].athleteInfo.dateOfBirth? `(${calculateAge(potentialAthletes[selectedAthleteId].athleteInfo.dateOfBirth)} yo swimmer)`:""} Contact info: ${userInfo.userData.phoneNumber}\n\nLocation: ${checkoutData.locationInfo[0].address} \n \n To ACCEPT, click here:\n https://www.experiencestreamline.com/accept/${entryId}\n \n To REJECT, click here:\nhttps://www.experiencestreamline.com/reject/${entryId}`
        
        sendMessage(
            checkoutData.eventInfo.coachPhone
            ,message)
        
        router.push(pathName+`/success`)
        }


    return (
            <div className="flex  justify-center items-center">
                <DynamicScreen className="w-[99%] md:w-[82%] lg:[75%] h-screen">

                <TopBar/>

                {isNewPageLoading||loadingNewPage?
                <div className="h-screen">
                    <LoadingSubScreen/>
                </div>   
                :
                <div className="min-h-screen">
                <div
                className="relative flex flex-col items-center justify-center w-full"
                >
                <div
                    className="relative w-screen h-[1px] bg-gray-200 mt-[18px]"
                />  

                </div>

                <div className="flex space-x-[43px] mt-[30px]">
                
                <div className="flex-1 ">
                
                <div
                className="flex items-center text-[21px] mb-[15px] space-x-[5px]"
                >
                    <div className="justify-center items-center hover:bg-gray-100 p-[10px] rounded-full
                    cursor-pointer" onClick={()=>{
                        setLoadingNewPage(true)
                        router.push(`/${prevPage}`)
                    }}>
                    <BlackMoveLeft />
                    </div>
                    <div className="font-bold">
                    Review and confirm
                    </div>
                </div>

                {/* TOP OF MOBILE PAGE BOOKING PANEL */}
                <div className=" sm:hidden p-[20px] border border-gray-300 rounded-xl
                shadow-[0_0_10px_rgba(0,0,0,0.1)] ">  
                    <div className="flex items-center  mb-[10px] space-x-[4px] items-end">
                            <img
                                src={teamPhoto}
                                className=
                                " w-[100px] h-[100px] rounded-[10px]"
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

                <div
                    className=" w-full sm:hidden h-[1px] bg-gray-200 mt-[27px] mb-[20px]"
                />  

                <div
                className="font-bold text-[18px] mb-[15px]"
                >
                    Your trial lesson details
                </div>

                <div className="font-bold">
                        Address
                </div>
                <div>
                    {locationInfo.address}
                </div>

                <div className="relative flex justify-between mb-[5px]"
                style={{
                    zIndex:25
                }}>
                    <div className="font-bold mt-[8px]">
                        Time and date
                    </div>
                    {/* <div className="font-bold underline cursor-pointer"
                    onClick={toggleIsDateTimeDropdownVisible}>
                        Edit
                    <DateTimePicker
                    selectedDate={currSelectedDate}
                    setSelectedDate={setCurrSelectedDate}
                    isVisible={isDateTimeDropdownVisible}
                    onClose={handleCloseDateTimeDropdown}
                    selectedTime={currSelectedTime}
                    setSelectedTime={setCurrSelectedTime}
                    toggleIsDateTimeDropdownVisible={toggleIsDateTimeDropdownVisible}
                    dateTimePositioning={"right-0"}
                    />
                    </div> */}

                </div>
                

                <div className="leading-none text-[14px]">
                    {currSelectedTime}
                </div>
                <div className="leading-1.25 text-[15px]">
                    {currSelectedDate!=""?currSelectedDate.toDateString():""}
                </div>
                
                {
                potentialAthletes&&
                <>
                <div className="font-bold mt-[8px]">
                        Select {CONFIG.athleteType.toLowerCase()}
                </div>
                {potentialAthletes.map((item,index)=>(
                                    <div key={index} className={`py-[3px] cursor-pointer hover:opacity-100 ${selectedAthleteId==index ? "": "opacity-50"}`} onClick={()=>{setSelectedAthleteId(index)}}>
                                        <PersonEntry noLeftMargin={true} personInfo={{fullName:item.fullName}}/>
                                    </div>
                                )
                )}
                </>
                }

                {/* <div
                className="font-bold text-[18px] mb-[15px]"
                >
                    Price details
                </div>

                <div className="relative flex justify-between mb-[5px]"
                style={{
                    zIndex:20
                }}>
                    <div>
                        Trial lesson fee
                    </div>

                    <div>
                        ${lessonPrice}
                    </div>

                </div>
                
                <div
                    className="relative w-full h-[1px] bg-gray-500 mt-[5px] mb-[5px]"
                />         

                <div className="relative flex justify-between mb-[5px]"
                style={{
                    zIndex:20
                }}>
                    <div>
                        Total ({currency})
                    </div>

                    <div>
                        ${lessonPrice}
                    </div>

                </div>
                
                <div
                    className="relative w-full h-[1px] bg-gray-200 mt-[20px] mb-[20px]"
                />          */}
                {!user?
                <>
                <div
                    className="relative w-full h-[1px] bg-gray-200 mt-[15px] mb-[20px]"
                />         
                <div
                className="font-bold text-[18px] mb-[15px]"
                >
                    {user?"Pay with":"Login or signup to book"}
                </div>

                <div className="flex justify-center">
                { 
                user?
                // <PaymentModal lessonPrice={lessonPrice} currency={currency.toLowerCase()}/>
                <div>
                    MAKE RESERVATION
                </div>
                :
                <AuthModal
                isOpen={true}
                onClose={null}
                isLogin={isLoginOption}
                switchModalType={switchModalType}
                isModal={false}
                />}

                </div>
                </>:
                <>
                <div className="w-full mt-[30px] flex items-center justify-center">

                    <div className={`flex font-bold text-white bg-streamlineBlue py-[7px] px-[16px] rounded-full items-center  ${selectedAthleteId!==null?"cursor-pointer":"opacity-50"}`} onClick={async()=>{if(selectedAthleteId!==null){await handleRedirect()}}}>
                        Confirm free trial lesson reservation
                    </div>
                </div>
                </>
                }
                
                <div
                    className="relative w-full h-[1px]  mt-[20px] mb-[20px]"
                />         

            {/* <div className="relative flex justify-between mb-[5px]"
                style={{
                    zIndex:15
                }}>
                    <div className="font-bold">
                        Lesson type
                    </div>
                    <div className="font-bold underline cursor-pointer"
                    onClick={toggleIsLessonTypeDropdownVisible}>
                        Edit
                    <LessonTypeDropdown isVisible={isLessonTypeDropdownVisible}
                    onClose={handleCloseLessonTypeDropdown} 
                    lessonTypes={lessonTypes} skillLevels={skillLevels}
                    selectedLessonType={currSelectedLessonType}
                    setSelectedLessonType={setCurrSelectedLessonType}
                    selectedSkillLevel={currSelectedSkillLevel}
                    setSelectedSkillLevel={setCurrSelectedSkillLevel}
                    additionalStyling={"right-0"}/>
                    </div>

                </div> */}
                
                {/* <div className="leading-1.25 text-[15px]">
                {currSelectedSkillLevel} {currSelectedLessonType.toLowerCase()} lesson
                </div>
                
                <div
                    className="relative w-full h-[1px] bg-gray-200 mt-[15px] mb-[20px]"
                />          */}


                </div>

                
                {/* BIGGER SCREEN BOOK LESSON PANEL */}
                <div className={`hidden sm:block p-[20px] border 
                flex flex-col justify-center border-gray-300 rounded-xl
                shadow-[0_0_10px_rgba(0,0,0,0.1)] }`} style={{height:'fit-content'}}>
                    
                    <div className="flex items-center  mb-[10px] space-x-[4px] items-end">
                            <img
                                src={teamPhoto}
                                className=
                                " w-[100px] h-[100px] rounded-[10px]"
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
                </div>}
                
            </DynamicScreen>
            </div>
    );
}
