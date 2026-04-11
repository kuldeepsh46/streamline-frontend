const WeekdayPicker = ({daysPicked,setDaysPicked}) => {
  
    const toggleDay = (day) => {
        setDaysPicked((prevState) =>
        prevState.map((d) =>
          d.day === day ? { ...d, isPicked: !d.isPicked } : d
        )
      );
    };
  
    return (
      <div className="flex flex-wrap justify-center w-full space-x-[12px]">
        {daysPicked.map(({ day, isPicked }) => (
          <button
            key={day}
            className={`w-10 h-10 text-[13px] flex  items-center justify-center text-center m-1 rounded-[22px] border 
            ${isPicked ? "border-2 border-streamlineBlue" : "border border-gray-400"} 
            hover:border-2`}
            onClick={() => toggleDay(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>
    );
  };

export default WeekdayPicker;