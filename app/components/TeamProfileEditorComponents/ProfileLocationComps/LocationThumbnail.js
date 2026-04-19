"use client";

import { useState } from "react";
import ThreeDotMenu from "../../../../public/ThreeDotMenu.svg";
import InfoDropdown from "../InfoDropdown";
import GenericOptionsDropdown from "../../GenericOptionsDropdown";


export default function LocationThumbnail({location, pullLocoInfo, setSelectedLocation, selectedLocation, isNotPulling}){
// console.log(location);
    // FIX 1: Show the menu for ALL statuses so you can always edit/unpublish
    const [showThreeDotMenu, setShowThreeDotMenu] = useState(true);
    
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [isOptionsDropdownClosing, setIsOptionsDropdownClosing] = useState(false);

    const toggleOptionsVisibility = (e) => {
        e.stopPropagation(); // Stop parent onClick (which selects the location)
        if (isOptionsDropdownClosing) return; 
        setIsOptionsVisible(prev => !prev);
    };

    const handleOptionsCloseDropdown = () => {
        setIsOptionsDropdownClosing(true); 
        setIsOptionsVisible(false); // FIX 2: Correct state setter
        setTimeout(() => setIsOptionsDropdownClosing(false), 500); 
    };

    return(
            <div
              className={`shadow-[0_4px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)] w-[80%] md:w-[100%] mx-auto md:mx-0 ${selectedLocation == location.id ? "border-[2px] border-streamlineBlue " : "border border-gray-200" } rounded-[20px] py-[15px] px-[12px] space-x-[10px] flex items-center cursor-pointer h-[180px]`}
              
              onClick={async()=>{
                setSelectedLocation(location.id)
                if(!isNotPulling) { // Safety check for the prop
                    await pullLocoInfo({locationId:location.id})
                }
              }}
              >
              {/* Image */}
              <div className="w-[37%] aspect-[1/1] max-h-[100%] rounded-[10px] overflow-hidden">
                <img
                  src={location.images?.[0]?.url || "/placeholder.jpg"}
                  alt="Location"
                  className="w-full h-full object-cover"
                />
              </div>
  
              {/* Address and Status */}
              <div className="flex flex-col flex-1">
                <div className="flex text-[15px] font-bold pb-[5px] leading-[16px]">
                  <div>{location?.parsedAddress?.streetAddress || "Unknown St Address"}, {location.parsedAddress?.city || "Unknown City"}</div>
                </div>
                <div className="flex-col text-[15px] mt-[2px]">
                    <div className="mr-2 pb-[7px] text-gray-500">Status</div>
                    <div
                      className={`font-bold mt-[1px] ${
                        location.status === "Pending Verification"
                          ? "text-yellow-500"
                          : (location.status === "Published" || location.status === "Verified" || location.status === "Active")
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {location.status}
                    </div>
                </div>
              </div>

            {showThreeDotMenu &&
              <div className="relative flex items-center justify-center px-[10px] py-[14px] rounded-full hover:bg-gray-200 cursor-pointer "
                onClick={toggleOptionsVisibility}
              >
                <ThreeDotMenu/>
                <GenericOptionsDropdown 
                    customPositioning={"right-0 top-full"} 
                    isVisible={isOptionsVisible} 
                    onClose={handleOptionsCloseDropdown} 
                    options={[
                        "Edit location information", 
                        location.status === "Published" ? "Unpublish location" : "Publish location"
                    ]} 
                    optionsActions={[
                        () => console.log("Edit Clicked"),
                        () => console.log("Status Toggle Clicked")
                    ]}
                />
              </div>
            }
            </div>
    )
}