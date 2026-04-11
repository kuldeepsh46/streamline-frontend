import BottomTab from "./BottomTab";

const DynamicScreen = ({ children, className = "" }) => {
    return (
        <div
            className={`flex flex-col px-[15px] py-[8px] ${className}`}
        >
            {/* Children container */}
            <div className="flex flex-col flex-grow z-10">
                {children}
            </div>


            {/* BottomTab Section */}
            <div className="mt-[10px]">
                {/* Divider */}
                <div className="mt-[30px]">
                    {/* <div className="h-[1px] bg-gray-400 w-full" /> */}
                </div>
                <BottomTab />
            </div>
        </div>
    );
};

export default DynamicScreen;
