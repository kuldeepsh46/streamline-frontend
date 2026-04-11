import moment from "moment-timezone";

export function calculateAge(dateOfBirthTimestamp) {
    const dateOfBirth = dateOfBirthTimestamp.seconds ? new Date(dateOfBirthTimestamp.seconds*1000):new Date(dateOfBirthTimestamp)
    
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
  
    // Adjust for whether the birthday has passed this year
    const hasHadBirthdayThisYear =
      today.getMonth() > dateOfBirth.getMonth() ||
      (today.getMonth() === dateOfBirth.getMonth() &&
        today.getDate() >= dateOfBirth.getDate());
  
    if (!hasHadBirthdayThisYear) {
      age--;
    }
  
    return age;
  }

export function formatEventTime({ startTime, endTime }) {
    // Days of the week and months for formatting
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (!startTime) return "";

    // Convert startTime and endTime to Toronto time zone
    const startToronto = moment.tz(startTime, "America/Toronto");
    const endToronto = moment.tz(endTime, "America/Toronto");

    // Extract components for the start time
    const startDay = daysOfWeek[startToronto.day()];
    const startMonth = months[startToronto.month()];
    const startDate = startToronto.date();

    // Formatting hours and minutes for start and end time
    const formatTime = (date) => {
        const hours = date.hour() % 12 || 12; // Convert to 12-hour format
        const minutes = date.minute().toString().padStart(2, "0");
        const amPm = date.hour() >= 12 ? "PM" : "AM";
        return `${hours}${minutes !== "00" ? `:${minutes}` : ""} ${amPm}`;
    };

    const startFormattedTime = formatTime(startToronto);
    const endFormattedTime = formatTime(endToronto);

    // Return formatted string in Toronto Time
    return `${startDay}, ${startMonth} ${startDate} · ${startFormattedTime} – ${endFormattedTime}`;
}

export function subtractTime(start, amount, unit) {
  const newDate = new Date(start); // Clone the original date
  const now = new Date(); // Get the current time
  
  if (unit === "days") {
    newDate.setDate(newDate.getDate() - amount);
  } else if (unit === "hours") {
    newDate.setHours(newDate.getHours() - amount);
  } else {
    throw new Error("Invalid unit. Use 'days' or 'hours'.");
  }

  return newDate < now ? false : newDate;
}