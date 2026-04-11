import DynamicScreen from "./DynamicScreen";
import TopBar from "./TopBarComps/TopBar";

import { BounceLoader } from "react-spinners";

const Spinner = () => {
    return (
    <BounceLoader
        color="#28C8ED" // Customize the color
        size={80} // Customize the size
        aria-label="Loading spinner"
    />
    );
};
    

export default function LoadingScreen({loadingMessage}){

        return (
        <div className="flex justify-center items-center h-full">
            <DynamicScreen className="h-full">
            <TopBar />

            <div
            className="relative w-screen left-[-3%] h-[1px] bg-gray-200 mt-[18px]"
            />  
            <div className="flex text-[18px] h-screen font-bold items-center left-1/2">
                <div className="absolute left-1/2 transform -translate-x-1/2  bottom-[54%] flex flex-col items-center">
                    <div className="justify-center ">
                    <Spinner/>
                    </div>        
                    <div className="text-streamlineBlue mt-[16px] text-center">
                    {loadingMessage}
                    </div>
                </div>
            </div>
            </DynamicScreen>
        </div>
        );
}