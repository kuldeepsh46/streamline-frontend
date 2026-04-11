import EmailIcon  from "../../../../public/smallerEmailIcon.svg"

export default function PersonEntry({personInfo,noLeftMargin,noIcon}){

    function getFirstOneOrTwoInitials({input}) {
        if (typeof input !== "string") {
          throw new Error("Input must be a string");
        }
      
        // Split the string into words and filter out empty parts
        const words = input.trim().split(/\s+/);
      
        // Get the initials of the first one or two words
        const initials = words.slice(0, 2).map(word => word[0].toUpperCase());
      
        // Join the initials into a single string
        return initials.join("");
      }

      return(

        <div className={noLeftMargin?"flex flex-col mt-[4px] text-[14px]":"ml-[32px] flex flex-col mt-[4px] text-[14px]"}>
                        
                        <div className="flex items-center space-x-[10px]">
                        <div className=
                        {`w-[32px] h-[32px] rounded-full text-white items-center text-center justify-center ${noIcon?"":"bg-black"}`} >
                            <div className="mt-[6px]">
                                {getFirstOneOrTwoInitials({input:personInfo.fullName})}
                            </div>
                        </div>
                        <div className="">
                            <div className="font-bold">
                            {personInfo.fullName} {personInfo.age? `(${personInfo.age} yrs)`:""} 
                            </div>
                            
                            {personInfo.email &&
                            <div className="flex items-center mt-[1px]  space-x-[3px] leading-[14px]">
                            <div>
                            <EmailIcon/>
                            </div>
                            <div>
                            {personInfo.email}
                            </div>                    
                            </div>       }
                            
                            {personInfo.phoneNumber &&
                            <div className="flex mt-[6px] items-center space-x-[3px] leading-[5px]">
                            <div className="">
                            <img src="/PhoneIcon.png" className="h-[18px]"/>
                            </div>    
                            <div>
                                {personInfo.phoneNumber}
                            </div>                    
                            </div>       }


                        </div>        
                        
                        </div>
 

                    </div>
      )
}