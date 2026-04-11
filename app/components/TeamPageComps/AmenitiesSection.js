import CONFIG from "../../../config"

export default function AmenitiesSection({amenities,withoutHeader}){
    return(
        <div className={withoutHeader?"":"mt-[15px]"}>
            {!withoutHeader&&
            <div className="text-[18px] font-bold">
                Swim Team Amenities
            </div>}
            <div className="grid grid-cols-2 flex-between ">

            {amenities.map((item,index)=>
            (
                <div key={index}>
                    <div className="mt-[10px] flex items-center font-bold space-x-[10px]
                    text-[16px] py-[10px]">
                        <img src={`/amenities/${CONFIG.amenitiesIcons[item]['iconName']}`} 
                        className="w-[45px] h-[45px]"/>
                        <div>
                             {CONFIG.amenitiesIcons[item]['name']}
                        </div>
                    </div>
                </div>
            ))
            }
            

            </div>
        </div>
    )
}