"use client";


import { useState } from "react";
import MoveLeft from "../../public/MoveLeft.svg"
import MoveRight from "../../public/MoveRight.svg"
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function SwimTeamThumbnail({locationInfo}){

    const {setLoadingNewPageMessage,setLoadingNewPage}=useAuth()
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
  
    const images = locationInfo.images

    const teamPathName = locationInfo.teamInfo.flattenedTeamName
    
    const handleNext = (event) => {
        
    event.stopPropagation();
      
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const handlePrev = (event) => {
        event.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
  
    const handleRedirect = () => {
        setLoadingNewPage(true)
        router.push(`/${teamPathName}-${locationInfo.id}`)
    }

    

    return(

        <div className="flex-1 cursor-pointer"
        onClick={()=>{handleRedirect()}}
        >

                {/* Image Div */}
            <div className="relative w-full aspect-[5/4] rounded-2xl overflow-hidden">

            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className=
                    {
                    `absolute top-0 left-0 w-full h-full object-cover rounded transition-transform duration-500 ease-in-out
                        ${index < currentIndex ? '-translate-x-full' :
                        index > currentIndex ? 'translate-x-full' : 
                        index === currentIndex ? 'translate-x-0' : ""}`
                    }
                    
                />
                ))} 

                {currentIndex+1>1 &&
                <button onClick={(event)=>{handlePrev(event)}}>
                <div
                className="absolute top-1/2 left-2 transform -translate-y-1/2 
                 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-2 
                 rounded-full focus:outline-none"
                >
                    <MoveLeft/>
                </div>
                </button>}

                {currentIndex+1<images.length &&
                <button onClick={(event)=>{handleNext(event)}}>
                <div
                className="absolute top-1/2 right-2 transform -translate-y-1/2 
                 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-2 
                 rounded-full focus:outline-none"
                >
                    <MoveRight/>
                </div>
                </button>}


                <div
                className="absolute left-1/2 bottom-2 transform -translate-x-1/2 
                 bg-gray-700 bg-opacity-50  text-white px-2 py-[3px] 
                 rounded-full focus:outline-none text-[10px]"
                >
                    {currentIndex+1} / {images.length}
                </div>
                
            </div>

            {/* Team Description */}
            <div className="mt-[10px]">

                <div className="flex font-bold items-center space-x-[8px]">
                    <div className="">
                        <img
                        src={locationInfo.teamInfo.logoPhotoURL}
                        className=
                        {
                        `w-[35px] h-full object-cover rounded-full
                            `
                        }
                        />
                    </div>
                    <div className="flex-col leading-[16px]">
                    <div>
                    {locationInfo.teamInfo.teamName}
                    </div>
                    <div className="text-[12px] text-gray-500">
                    {locationInfo.address.split(",")[0]}
                    </div>
                    </div>
                </div>

                <div className="text-gray-500 text-[14px] mt-[2px]">
                    {locationInfo.city}, {locationInfo.state}
                </div>

                <div className="flex italic text-gray-800 text-[12px]">
                    {locationInfo.uniqueDays.map((day,index)=>(
                        <div className="flex" key={index}>
                           {index!=0?"-":""}{day}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}