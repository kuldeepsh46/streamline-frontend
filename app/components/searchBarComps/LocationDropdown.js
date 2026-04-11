import React, { useEffect, useRef, useState } from 'react';

const LocationDropdown = ({ isVisible, onClose, locations,setLocations }) => {
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

    const handleCheckboxChange = (id) => {
        setLocations(locations.map(item => 
          item.id === id ? { ...item, checked: !item.checked } : item
        ));
      };

    return (
        isVisible && (
            <div
                ref={divRef}
                className="absolute bg-white
                 flex flex-col  left-0 top-full mt-2 py-2 
                 rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)] "
                 style={{
                    zIndex:100
                 }}
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >
                <div 
                style={{
                    overflowY:'scroll'
                }}
                className='max-x-[400px] pl-3 pr-4'> 

                <div className='text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                text-streamlineBlue pr-2 '
                style={{
                    fontWeight:525
                }}>
                    Cities with available swim clubs
                </div>
                {locations.map((item, index) => (
                <div key={index} className="flex flex-1 pl-3  pr-3 w-full text-[14px] py-[12px]
                rounded-xl whitespace-nowrap items-center hover:bg-gray-200 
                space-x-1.5" onClick={()=>{handleCheckboxChange(item.id)}}
                style={{
                    fontWeight:500,
                }}
                >
                    <input
                    type='checkbox' checked={item.checked} onChange={()=>{handleCheckboxChange(item.id)}}
                    />
                    <p>{item.location}</p>
                </div>
                ))}
                </div>
            </div>
        )
    );
};

export default LocationDropdown;
