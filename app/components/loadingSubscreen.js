import DynamicScreen from "./DynamicScreen";
import TopBar from "./TopBarComps/TopBar";

import { BounceLoader } from "react-spinners";

const Spinner = ({color}) => {
    return (
    <BounceLoader
        color={color?"#FFFFFF":"#28C8ED"} // Customize the color
        size={80} // Customize the size
        aria-label="Loading spinner"
    />
    );
};
    

export default function LoadingSubScreen({loadingMessage,color}){

        return (
        <div className="flex justify-center items-center h-full w-full">
            
            <div className="flex text-[18px] font-bold items-center h-[500px]">
                <div className=" bottom-[54%] flex flex-col items-center">
                    <div className="justify-center ">
                    <Spinner color={color}/>
                    </div>        
                    <div className="text-streamlineBlue mt-[16px] text-center">
                    {loadingMessage}
                    </div>
                </div>
            </div>
        </div>
        );
}