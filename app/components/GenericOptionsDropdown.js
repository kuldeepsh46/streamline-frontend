
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { logout } from '@/app/hooks/authHooks/firebaseAuth';
import { useRouter } from 'next/navigation';

const GenericOptionsDropdown = ({isVisible, onClose, options,customPositioning,optionsActions}) => {

    const divRef = useRef(null);
    console.log("IM EHRE",isVisible)
    const handleClickOutside = (event) => {
        console.log("CLICK OUTSIDE")
        if (divRef.current && !divRef.current.contains(event.target)) {
            onClose(); // Trigger the close function
        }
    };

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    return (
        isVisible && (
            <div
                ref={divRef}
                className={`absolute flex flex-col bg-white 
                  top-full mt-[5px] ${customPositioning} py-[8px] 
                 rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-[200]`}
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >

                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="flex flex-1 pl-3 pr-3 w-full 
                                 whitespace-nowrap hover:bg-gray-200 py-[7px] items-center"
                                onClick={()=>{
                                    optionsActions[index]()
                                }}
                            >
                                <div className="flex space-x-2">
                                <div className="flex-col">
                                    <div className="text-[14px] text-start leading-[13px] ">{option}</div>
                                    {/* <div className="text-[12px] text-graySubtitle">{categoryDetails}</div> */}
                                </div>
                                </div>
                            </div>
                            ))}
                </div>
        )
    );
};

export default GenericOptionsDropdown;
