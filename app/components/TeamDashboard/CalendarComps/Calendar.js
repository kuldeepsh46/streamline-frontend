import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BlueMoveLeft from "../../../../public/BlueMoveLeft.svg"
import BlueMoveRight from "../../../../public/BlueMoveRight.svg"
import "./custom-styles.css"; // Include the custom CSS file
import CONFIG from "@/config";
import LoadingSubScreen from "../../loadingSubscreen";


// Configure the localizer with Moment.js
const localizer = momentLocalizer(moment);

const MyCalendar = ({ events, setPickedEvent, openEventModal, setCurrWeekNum,currWeekNum, isCalendarLoading, setIsCalendarLoading, minHour,maxHour,currentDate,setCurrentDate }) => {

    const availableColor = CONFIG.calendar.blockColors.available
    const pendingColor = CONFIG.calendar.blockColors.pending
    const confirmedColor = CONFIG.calendar.blockColors.confirmed
    const cancelledColor = CONFIG.calendar.blockColors.cancelled

    const statuses = [{"Availability":availableColor},{"Pending Approval":pendingColor},{"Confirmed Lesson":confirmedColor}]

    const eventStyleGetter = (event, start, end, isSelected) => {
      
      const backgroundColor = event.status.toLowerCase() === "available" ? availableColor : (event.status.toLowerCase() === "pending" ? pendingColor : (event.status.toLowerCase() === "confirmed" ? confirmedColor : (event.status.toLowerCase() === "cancelled" ? cancelledColor : "#ffffff")));
    
      return {
        style: {
          backgroundColor,
          color: "#000",
          padding: "4px",
          border: '1px solid #ffffff', // Change color and size here
          borderRadius: "5px", // Optional: Rounded corners
        },
      };
    };
  
    
  
  
      // Function to go to the next week
      const goToNextWeek = () => {
        const nextWeek = new Date(currentDate);
        setCurrWeekNum(currWeekNum+1)
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
        
      };
      
      // Function to go to the previous week
      const goToPreviousWeek = () => {
        
        const prevWeek = new Date(currentDate);
        setCurrWeekNum(currWeekNum-1)
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
      };

  const handleSelectEvent = (event) => {
    setPickedEvent(event); // Set the picked event
    openEventModal()
  };

  const CustomToolbar = (props) => {
    return (
      <div className="custom-toolbar flex justify-between items-center py-[10px]">
        < div className="flex items-center space-x-[6px] text-streamlineBlue font-bold px-[4px] py-[4px] rounded-full cursor-pointer select-none" onClick={() => goToPreviousWeek()}>
        <BlueMoveLeft/>  
        <button onClick={() => goToPreviousWeek()}>
        Previous</button>
        </div>
        <span className="font-bold">{props.label}</span>

        < div className="flex items-center space-x-[6px] select-none text-streamlineBlue font-bold px-[4px] py-[4px] rounded-full cursor-pointer" onClick={() => goToNextWeek()}>
        <button onClick={() => goToNextWeek()}>Next</button>
        <BlueMoveRight/>  
        </div>
      </div>
    );
  };

  const CustomEvent = ({ event }) => 
   { 
    
    return(
      <div className="ml-[4px] mt-[1px]">
      <div style={{ fontWeight: "bold",fontSize:'10px' }} className="leading-[10px] ">{event.title}</div>
      <div style={{ fontSize:'9px',marginTop:'2px' }} className="leading-[9px]">
      {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
        </div>
    </div>
    )
  };

  const filteredEvents = events.filter(
    (event) => !("numberOfSpots" in event) || event.numberOfSpots > 0
  );

  return (
    <div style={{
      userSelect: "none", // Prevent text selection
      WebkitUserSelect: "none", // Safari
      MozUserSelect: "none", // Firefox
      msUserSelect: "none",}} >

      <div className="items-center justify-center" 
      style={{ height: "800px", width: "100%" }}>

        {isCalendarLoading&&<div className="absolute w-[100%] h-[100%] z-10">
          <LoadingSubScreen loadingMessage={""}/>
        </div>}

        <div className={`w-full h-full ${isCalendarLoading?"opacity-50":""}`} >
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          defaultView="week"
          views={["week"]}
          showMultiDayTimes={false}
          step={30} // 30-minute intervals
          timeslots={2} // One timeslot per step
          min={(minHour==0 || maxHour==0) ? new Date(2023, 1, 1, 0, 0, 0) : new Date(2023, 1, 1, minHour, 0, 0)} // 6:00 AM
          max={(minHour==0 || maxHour==0) ? new Date(2023, 1, 1, 23, 59, 0) : new Date(2023, 1, 1, maxHour+1, 0, 0)} // 10:00 PM
          style={{ height: "100%" }}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
            timeGutterHeader: () => null, // Hide the time gutter header
          }}
          date={currentDate}
          onSelectEvent={handleSelectEvent}
          // onNavigate={(date, view) => console.log("Navigated to:", date, view)}
          eventPropGetter={eventStyleGetter}
        />
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
      {statuses.map((statusObj, index) => {
        const [status, color] = Object.entries(statusObj)[0]; // Destructure key-value pair
        return (
          <div key={index} className="pl-[20px]"
           style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            {/* Color box */}
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: color,
                marginRight: "4px",
                borderRadius:'6px'
              }}
            ></div>
            {/* Status text */}
            <span className="text-[14px]">{status}</span>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default MyCalendar;
