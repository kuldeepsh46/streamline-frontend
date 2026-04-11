"use client";

import LoadingSubScreen from "../components/loadingSubscreen";
import { getAllEntries } from "../hooks/firestoreHooks/retrieving/getAllEntries";
import { useEffect ,useState} from "react";

export default function Bookings(){

    const [allBookings,setAllBookings]=useState(null)
    const [loading,setLoading]=useState(true)

    function addFormattedDates(bookings) {
        return bookings.map(booking => {
          if (booking.bookingDateTime && booking.bookingDateTime.seconds) {
            const date = new Date(booking.bookingDateTime.seconds * 1000);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZoneName: 'short'
            }).format(date);
            
            return { ...booking, formattedDate };
          }
          return booking;
        });
      }
      

    useEffect(()=>{

        const getData = async() => {
            const allBookings = await getAllEntries({collectionName:"LessonBookings"})
            const filteredBookings = allBookings.filter(item=>item.phoneNumber)
            const sortedBookings = filteredBookings.sort((a, b) => b.bookingDateTime.seconds - a.bookingDateTime.seconds);
            console.log(sortedBookings)
            const formattedBookings = addFormattedDates(sortedBookings)
            setAllBookings(formattedBookings)
            setLoading(false)
        }
        getData()
        
    },[])


    return(

        <div className="w-screen h-screen overflow-y-scroll">

            {
                loading?
                <LoadingSubScreen/>:
                <div className="flex flex-col text-[12px]">
                    {allBookings.map((item,idx)=>
                        (<div className="" key={idx}>
                           <span className="font-bold">
                           {item?.teamName}*{item?.address}*{item?.city}*{item?.state}*{item?.country}*{item?.athlete}*{item?.age}*{item?.phoneNumber}*{item?.lessonType}*{item?.skillLevel}*{item.bookingDateTime?
                            item.formattedDate: "N/A"}
                                
                                </span> 
                        </div>)
                    )}
                </div>
            }

        </div>

    )
}