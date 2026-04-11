
export default function EventModalContent({pickedEvent}){
    
    if (!pickedEvent) {
        return null; // Safeguard against undefined pickedEvent
      }

    return(
        <div>
            <div className="flex  text-[18px] items-center ">
                <div className="flex w-[20px] h-[10px] rounded-[2px] bg-streamlineBlue pr-[10px]"/>
                
                <div className="flex">
                {pickedEvent.title}
                </div>
            </div>
        </div>
    )
}
