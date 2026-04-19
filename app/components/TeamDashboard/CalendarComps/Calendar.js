"use client";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BlueMoveLeft from "../../../../public/BlueMoveLeft.svg";
import BlueMoveRight from "../../../../public/BlueMoveRight.svg";
import "./custom-styles.css"; 
import CONFIG from "@/config";
import LoadingSubScreen from "../../loadingSubscreen";

const localizer = momentLocalizer(moment);

const MyCalendar = ({ 
    events, 
    setPickedEvent, 
    openEventModal, 
    setCurrWeekNum, 
    currWeekNum, 
    isCalendarLoading, 
    min, // Changed from minHour to match page.js
    max, // Changed from maxHour to match page.js
    currentDate, 
    setCurrentDate 
}) => {

    const availableColor = CONFIG.calendar.blockColors.available;
    const pendingColor = CONFIG.calendar.blockColors.pending;
    const confirmedColor = CONFIG.calendar.blockColors.confirmed;
    const cancelledColor = CONFIG.calendar.blockColors.cancelled;

    const statuses = [{"Availability": availableColor}, {"Pending Approval": pendingColor}, {"Confirmed Lesson": confirmedColor}];

    const eventStyleGetter = (event) => {
        const status = event.status?.toLowerCase() || "";
        // Support both "availability" and "available"
        const backgroundColor = (status === "available" || status === "availability") 
            ? availableColor 
            : (status === "pending" ? pendingColor 
            : (status === "confirmed" ? confirmedColor 
            : (status === "cancelled" ? cancelledColor : "#ffffff")));
    
        return {
            style: {
                backgroundColor,
                color: "#000",
                padding: "4px",
                border: '1px solid #ffffff',
                borderRadius: "5px",
            },
        };
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(currentDate);
        setCurrWeekNum(currWeekNum + 1);
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
    };
      
    const goToPreviousWeek = () => {
        const prevWeek = new Date(currentDate);
        setCurrWeekNum(currWeekNum - 1);
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
    };

    const handleSelectEvent = (event) => {
        setPickedEvent(event);
        openEventModal();
    };

    const CustomToolbar = (props) => (
        <div className="custom-toolbar flex justify-between items-center py-[10px]">
            <div className="flex items-center space-x-[6px] text-streamlineBlue font-bold px-[4px] py-[4px] rounded-full cursor-pointer select-none" onClick={goToPreviousWeek}>
                <BlueMoveLeft/>  
                <span>Previous</span>
            </div>
            <span className="font-bold">{props.label}</span>
            <div className="flex items-center space-x-[6px] select-none text-streamlineBlue font-bold px-[4px] py-[4px] rounded-full cursor-pointer" onClick={goToNextWeek}>
                <span>Next</span>
                <BlueMoveRight/>  
            </div>
        </div>
    );

    const CustomEvent = ({ event }) => (
        <div className="ml-[4px] mt-[1px]">
            <div style={{ fontWeight: "bold", fontSize: '10px' }} className="leading-[10px]">{event.title}</div>
            <div style={{ fontSize: '9px', marginTop: '2px' }} className="leading-[9px]">
                {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
            </div>
        </div>
    );

    const filteredEvents = events?.filter(event => !("numberOfSpots" in event) || event.numberOfSpots > 0) || [];

    return (
        <div style={{ userSelect: "none", WebkitUserSelect: "none" }}>
            <div className="relative" style={{ height: "800px", width: "100%" }}>
                {isCalendarLoading && (
                    <div className="absolute inset-0 z-10 bg-white/50">
                        <LoadingSubScreen loadingMessage={""}/>
                    </div>
                )}

                <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    defaultView="week"
                    views={["week"]}
                    showMultiDayTimes={false}
                    step={30}
                    timeslots={2}
                    // IMPORTANT: Use the Date objects passed from page.js
                    min={min}
                    max={max}
                    style={{ height: "100%" }}
                    components={{
                        toolbar: CustomToolbar,
                        event: CustomEvent,
                        timeGutterHeader: () => null,
                    }}
                    date={currentDate}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                />
            </div>

            <div className="flex w-full items-center justify-center mt-4">
                {statuses.map((statusObj, index) => {
                    const [status, color] = Object.entries(statusObj)[0];
                    return (
                        <div key={index} className="flex items-center px-4">
                            <div style={{ width: "16px", height: "16px", backgroundColor: color, marginRight: "6px", borderRadius: '4px' }}></div>
                            <span className="text-[14px]">{status}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyCalendar;