export default function getRelevantDates({startDate, endDate, daysPicked,timeObjStart,timeObjEnd,coach,numberOfSpots,reminder,lessonType}) {
    
    const daysOWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysOWeekFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Convert the start and end dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get selected days of the week as indices (0 = Sunday, 6 = Saturday)
    const selectedDays = daysPicked
        .filter((day) => day.isPicked)
        .map((day) => daysOWeek.indexOf(capitalizeFirstLetter(day.day)));

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Array to store relevant dates
    const relevantDates = [];

    // Iterate through the date range
    for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
        const dayIndex = currentDate.getDay(); // Day of the week (0-6)
        if (selectedDays.includes(dayIndex)) {
            relevantDates.push({
                day: daysOWeekFull[dayIndex], // Day of the week as a string
                start: consolidateDate({now:new Date(currentDate),timeObj:timeObjStart}), // Date object
                end: consolidateDate({now:new Date(currentDate),timeObj:timeObjEnd}),
                status:'Available',
                title : coach ? `Coach ${coach.coachName.split(" ")[0]} - Trial lesson` : 'Trial lesson',
                reminder:reminder,
                coachName:coach?coach.coachName:null,
                coachEmail:coach?coach.coachEmail:null,
                coachPhone:coach?coach.coachPhone:null,    
                numberOfSpots:numberOfSpots,
                lessonType:lessonType
            });
        }
    }

    return relevantDates;
}

export function consolidateDate({timeObj,now}) {

    const { hrs, mins, xm } = timeObj;

    if (hrs === null || mins === null || xm === null) {
        throw new Error("Invalid date object. Ensure hrs, mins, and xm are provided.");
    }

    let hours = parseInt(hrs, 10); // Convert hours to number
    let minutes = parseInt(mins, 10); // Convert minutes to number

    if (xm.toLowerCase() === "pm" && hours < 12) {
        hours += 12; // Convert PM to 24-hour format
    } else if (xm.toLowerCase() === "am" && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours (midnight)
    }

    // Set the date and time
    now.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    return now; // Return the updated Date object
}


// Example Usage:
const daysOWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

