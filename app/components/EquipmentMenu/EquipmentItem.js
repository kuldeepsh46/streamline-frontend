import MoveRightBlack from "../../../public/MoveRightBlack.svg";

export default function EquipmentItem() {

    const image="https://streamlineplatform.s3.us-east-2.amazonaws.com/equipmentImages/kickboard.jpg"

    return(

        <div className="flex-1 cursor-pointer">

                {/* Image Div */}
                <div className="relative w-full aspect-[1]  overflow-hidden">

                        <img
                            src={image}
                            className=
                            {
                            `absolute top-0 left-0 w-full h-full object-cover rounded-[10px]`
                            }
                            
                        />

                        
                    </div>

                    {/* Team Description */}
                    <div className="mt-[10px]">

                        <div className="font-bold">
                            Black Speedo Kickboard
                        </div>

                        <div className=" flex items-center  text-gray-500 text-[14px]">
                            View on shopify 
                            <div className="ml-[10px]">
                            <MoveRightBlack/>
                            </div>
                        </div>

                    
                    </div>



        </div>
    )
}