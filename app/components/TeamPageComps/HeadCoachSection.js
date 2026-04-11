import React, { useState, useEffect, useRef } from "react";
import MoveRight from "../../../public/MoveRightBlack.svg";

export default function HeadCoachSection({coachName, coachPhoto, coachBio}){

    const [showFullText, setShowFullText] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        // Check if the content height exceeds 5 lines
        const lineHeight = 24; // Set this to the line height in pixels used by Tailwind or CSS
        const maxHeight = lineHeight * 5; // Height of 5 lines

        if (contentRef.current.scrollHeight > maxHeight) {
            setIsTruncated(true);
        }
    }, []);

    return (
        <>
        <div className="font-bold text-[18px]">
            Meet the Head Coach
        </div>
        <div className="flex flex-col mt-[18px] items-center">

            <div className="flex flex-col w-full space-y-[10px] align-center items-center">

                <div className="w-[200px] aspect-square overflow-hidden">
                <img 
                    src={coachPhoto} 
                    className="w-full h-full object-cover rounded-[15px]"
                />
                </div>
                <div className="flex align-center items-center font-bold text-center">
                    Coach {coachName}
                </div>
            </div>
            
            <div className="flex flex-col mt-[10px]">
            <div
                ref={contentRef}
                className={`${showFullText ? "" : "line-clamp-5"}`}
            >
                {coachBio}
            </div>
            {isTruncated && (
                <button
                    onClick={() => setShowFullText(!showFullText)}
                    className="font-bold mt-[5px] underline flex "
                >
                    {showFullText ? "See Less" : "See More"}
                    {!showFullText && <MoveRight className="w-[30px] h-[30px] mt-[6px] ml-[5px]"/>}
                </button>
            )}
            </div>
        </div>

        </>
    );
}