import SwimTeamThumbnail from "../SwimTeamThumbnail"
import EquipmentItem from "./EquipmentItem"

export default function EquipmentSection() {


    return(
        <div>

            <div className="font-bold text-[18px]">
                Recommended Swimming Equipment
            </div>
            <div className=" text-[16px]">
                This menu can also be found later on your profile page
            </div>

            <div className="grid gap-[25px] mt-[12px] mb-[15px] 
            grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                
                <EquipmentItem/>

                <EquipmentItem/>

                <EquipmentItem/>

                <EquipmentItem/>

                <EquipmentItem/>

            </div>

        </div>
    )
}