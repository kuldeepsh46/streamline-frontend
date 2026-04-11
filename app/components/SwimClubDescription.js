import React, { useState, useEffect, useRef } from "react";
import MoveRight from "../../public/MoveRightBlack.svg";

const SwimClubDescription = ({ swimClubDescription }) => {
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
        <div className="mt-[0px]">
            <div
                ref={contentRef}
                className={`${showFullText ? "" : "line-clamp-5"}`}
            >
                {swimClubDescription}
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
    );
};

export default SwimClubDescription;
