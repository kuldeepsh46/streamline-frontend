import CONFIG from "@/config"
import PersonEntry from "../TeamDashboard/CalendarComps/PersonEntry"
import EmailIcon from "../../../public/emailIcon.svg"
import { calculateAge } from "@/app/hooks/miscellaneous"

export default function DisplayUserInfo({accountFullname,accountEmailAddress,accountPhoneNumber,otherAthletes}){

    return(

    <div>

    <div className="font-bold text-[16px] pt-[8px]">Account Holder Info</div>    
    <div className="space-y-[4px] mt-[5px]">
    <div className="flex">
    <div className="flex text-[16px]">Contact person: 
    </div>
    <div className="ml-[4px]">
    {accountFullname}
    </div>
    </div>
    <div className="flex text-[16px] items-center space-x-[6px]"><EmailIcon/>
    <div className="mt-[1px] text-[16px]">
    {accountEmailAddress} 
    </div>
    </div>
    <div className="flex text-[16px] items-center space-x-[6px]">
    <div>
        <img src="/PhoneIcon.png"
        className="w-[30px]"
        />
    </div>
    <div className="mt-[1px]">
    {accountPhoneNumber} 
    </div></div>
    <div>
    
    </div>
    </div>

    {(otherAthletes.length>0&&otherAthletes[0]!="nothing")&&<div>
      <div className="font-bold text-[16px] pt-[8px]">{CONFIG.athleteType}s on this account</div>

      <div className="flex flex-col space-y-[20px]">
        {otherAthletes.map((athlete,index)=>(
          <PersonEntry key={index} noLeftMargin={true} personInfo={{fullName:athlete.fullName,age:calculateAge(athlete.dateOfBirth).toString()}}/>
        ))}
      </div>

    </div>}

</div>
    )

}