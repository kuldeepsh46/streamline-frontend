"use client";

import { useState } from "react";
import ThreeDotMenu from "../../../../public/ThreeDotMenu.svg";
import InfoDropdown from "../InfoDropdown";
import GenericOptionsDropdown from "../../GenericOptionsDropdown";


export default function LocationThumbnail({location, pullLocoInfo,setSelectedLocation,selectedLocation,isNotPulling}){

    const [showThreeDotMenu,setShowThreeDotMenu]=useState(location.status=="Pending Verifications")
    const [isVisible, setIsVisible] = useState(false);
    const [isDropdownClosing, setIsDropdownClosing] = useState(false);
    const toggleVisibility = () => {
        if (isDropdownClosing) return; // Prevent reopening if in closing state
        setIsVisible(prev => !prev);
    };
    const handleCloseDropdown = () => {
        setIsDropdownClosing(true); // Set closing flag
        toggleVisibility(false);
        setTimeout(() => setIsDropdownClosing(false), 500); // Reset after a short delay
    };
    // options dropdown
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [isOptionsDropdownClosing, setIsOptionsDropdownClosing] = useState(false);
    const toggleOptionsVisibility = () => {
        if (isDropdownClosing) return; // Prevent reopening if in closing state
        setIsOptionsVisible(prev => !prev);
    };
    const handleOptionsCloseDropdown = () => {
        setIsDropdownClosing(true); // Set closing flag
        toggleVisibility(false);
        setTimeout(() => setIsDropdownClosing(false), 500); // Reset after a short delay
    };

    return(
            <div
              className={`shadow-[0_4px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)] w-[80%] md:w-[100%] mx-auto md:mx-0 ${selectedLocation==location.id ? "border border-[2px] border-streamlineBlue " : "border border-gray-200" } rounded-[20px] py-[15px] px-[12px] space-x-[10px] flex items-center cursor-pointer h-[180px]`}
              
              onClick={async()=>{
                setSelectedLocation(location.id)
                await pullLocoInfo({locationId:location.id})}
              }
              >
              {/* Image with 1:1 Aspect Ratio */}
              <div className="w-[37%] aspect-[1/1] max-h-[100%] rounded-[10px] overflow-hidden">
                <img
                  src={location.images[0]?.url || "/placeholder.jpg"}
                  alt="Location"
                  className="w-full h-full object-cover"
                />
              </div>
  
              {/* Address and Status */}
              <div className="flex flex-col flex-1">
                <div className="flex text-[15px] font-bold pb-[5px] leading-[16px]">
                  <div className="">{location?.parsedAddress?.streetAddress || "Unknown St Address"}, {location.parsedAddress?.city || "Unknown City"}, {location.parsedAddress?.state || "Unknown State"}</div>
                </div>
                <div className="flex-col text-[15px] mt-[2px]">
                  <div className="flex-col">
                    <div>
                    <div className="mr-2 pb-[7px] ">Status</div>
        
                    </div>
                    <div
                      className={`font-bold leading-[1px] mt-[1px] ${
                        location.status === "Pending Verification"
                          ? "text-yellow-500"
                          : (location.status === "Published" || location.status === "Verified")
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {location.status}
                    </div>
                  </div>
                </div>
              </div>

            {showThreeDotMenu&&
              <div className="relative flex items-center justify-center pr-[11px] justify-center pl-[10px]  py-[14px] rounded-full hover:bg-gray-200 cursor-pointer "
              onMouseEnter={(e) => e.stopPropagation()} // Prevent parent hover
              onClick={()=>{setIsOptionsVisible(!isOptionsVisible)}}
              >
                <ThreeDotMenu/>
              <GenericOptionsDropdown customPositioning={"right-0"} isVisible={isOptionsVisible} onClose={handleOptionsCloseDropdown} 
              options={["Edit location information", true?"Unpublish location":"Publish location"]} 
              optionsActions={[()=>console.log("hello"),
              ()=>{console.log("no")}]}/>
              </div>}
            </div>
    )
}