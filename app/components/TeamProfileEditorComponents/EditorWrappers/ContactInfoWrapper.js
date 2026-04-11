import ProfileEntryEditor from "../ProfileEntryEditor"
import MultiFieldPhoneEntry from "../../AuthModalComps/MultiFieldPhoneEntry"

export default function ContactInfoWrapper({fullName,setFullName,emailAddress,setEmailAddress,phoneNumberObj,setPhoneNumberObj,missingBool}) {

    return(
        <>
            <ProfileEntryEditor
              prompt={"Contact Name"}
              response={fullName}
              setResponse={setFullName}
              placeholder={"Full Name"}
              isLong={false}
              />
               {
                  (missingBool && fullName=="")&&
                  <div className="leading-[0px] text-red-500 text-[14px]">
                      Missing full name
                  </div>
              }
              
              <ProfileEntryEditor
              prompt={"Team Contact Email"}
              response={emailAddress}
              setResponse={setEmailAddress}
              uneditable={true}
              placeholder={"Email Address"}
              isLong={false}
              />
                 {
                  (missingBool && emailAddress=="")&&
                  <div className="leading-[0px] text-red-500 text-[14px]">
                      Missing email address
                  </div>
              }

              <MultiFieldPhoneEntry 
              prompt="Contact Phone Number"
              placeholder={"Phone Number"}
              fieldResponse={phoneNumberObj}
              setFieldResponse={setPhoneNumberObj}
              field="phoneNumber"
              customLength={"w-[190px]"}
              />

              <div
              className="h-[8px]"
              />
        </>
    )
}