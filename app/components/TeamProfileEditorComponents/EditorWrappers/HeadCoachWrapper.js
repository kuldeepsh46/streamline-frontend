import ProfileEntryEditor from "../ProfileEntryEditor"
import ImageUploader from "../ImageUploader"
import MultiFieldPhoneEntry from "../../AuthModalComps/MultiFieldPhoneEntry"

export default function HeadCoachWrapper({coachInfoDivRef,isMissingCoachInfo,headCoachBio,setHeadCoachBio,headCoachName,setHeadCoachName,coachImg,setCoachImg,noHeader,coachEmail,setCoachEmail,coachPhone,setCoachPhone,missingBool}){

    return(
        <>
            {!noHeader&&<div className="font-bold text-streamlineBlue text-[18px] pt-[4px]"
              ref={coachInfoDivRef}>
                  <div>
                  Head Coach Information
                  </div>
                  {isMissingCoachInfo &&
                  <div className="text-red-500 text-[15px]">
                    Please ensure you have completed all the fields in this section
                  </div>}
              </div>}
              
              <ProfileEntryEditor
              prompt={"Head coach full name"}
              response={headCoachName}
              setResponse={setHeadCoachName}
              placeholder={"Coach Name"}
              isLong={false}
              />
              {
              (missingBool && headCoachName=="")&&
              <div className="leading-[0px] text-red-500 text-[14px]">
                  Missing coach name
              </div>
              }

              <ProfileEntryEditor
              prompt={"Head coach bio"}
              response={headCoachBio}
              setResponse={setHeadCoachBio}
              placeholder={"Talk about the head coach's experiences, history, fun facts, etc..."}
              isLong={true}
              />
              {
              (missingBool && headCoachBio=="")&&
              <div className="leading-[0px] text-red-500 text-[14px]">
                  Missing coach bio
              </div>
              }

              <MultiFieldPhoneEntry
              prompt={"Head coach phone #"}
              placeholder={'Phone #'}
              fieldResponse={coachPhone}
              setFieldResponse={setCoachPhone}
              field={'phoneNumber'}
              customLength={"w-[180px]"}/>
              {
              (missingBool && coachPhone=="")&&
              <div className="leading-[0px] text-red-500 text-[14px]">
                  Missing coach name
              </div>
              }

              <ProfileEntryEditor
              prompt={"Head coach email (optional)"}
              response={coachEmail}
              setResponse={setCoachEmail}
              placeholder={"Email address"}
              isLong={false}/>
              {
              (missingBool && coachEmail=="")&&
              <div className="leading-[0px] text-red-500 text-[14px]">
                  Missing coach email
              </div>
              }

              <ImageUploader allowMultiple={false} images={coachImg} setImages={setCoachImg} prompt={"Head Coach Photo"}
              buttonMessage={
                  coachImg.length!=0?"Replace Head Coach Photo":"Upload Head Coach Photo"}/>
                {
              (missingBool && coachImg.length==0)&&
              <div className="leading-[0px] pb-[30px] text-red-500 text-[14px]">
                  Missing coach photo
              </div>
              }
        </>
    )
}