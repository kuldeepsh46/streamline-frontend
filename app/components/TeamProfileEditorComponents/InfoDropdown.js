
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { logout } from '@/app/hooks/authHooks/firebaseAuth';
import { useRouter } from 'next/navigation';

const InfoDropdown = ({isVisible, onClose, categories}) => {

    const divRef = useRef(null);

    const handleClickOutside = (event) => {
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
                className="absolute flex flex-col bg-white w-[200px]
                  top-full mt-[5px] right-1/2 translate-x-1/2 py-[8px] 
                 rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-[200]"
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >

                    <div className='text-black font-normal text-start px-3 text-[14px] leading-[15px] mb-[3px]'>
                        For each of the following entries, please select one of these categories
                    </div>
                        {Object.entries(categories).map(([category, categoryDetails], index) => (
                            <div
                                key={index}
                                className="flex flex-1 pl-3 pr-3 w-full py-[7px]
                                rounded-xl  "
                            >
                                <div className="flex space-x-2">
                                <div className="flex-col">
                                    <div className="text-[14px] text-start font-semibold leading-[13px]">{category}</div>
                                    <div className="text-[12px] mt-[2px] text-start text-graySubtitle">{categoryDetails}</div>
                                </div>
                                </div>
                            </div>
                            ))}
                </div>
        )
    );
};

export default InfoDropdown;
