export default function formatHoursOfOperations(daysOfWeek) {

    const hourToString = (hour) => {
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
      return `${hour12} ${period}`;
    };
  
    const parseHours = (hours) => {
      if (hours.length === 0) return []; // No hours
      
      hours.sort((a, b) => a - b); // Sort hours
      const blocks = [];
      let start = hours[0];
      let end = hours[0];
  
      for (let i = 1; i < hours.length; i++) {
        if (hours[i] === end + 1) {
          // Continue the block
          end = hours[i];
        } else {
          // Close the current block
          blocks.push(`${hourToString(start)} - ${hourToString(end + 1)}`);
          start = hours[i];
          end = hours[i];
        }
      }
  
      // Add the final block
      blocks.push(`${hourToString(start)} - ${hourToString(end + 1)}`);
      return blocks;
    };
  
    return daysOfWeek.map((day) => ({
      ...day,
      hoursStringified: day.checked?parseHours(day.hoursOfOps):[],
    }));
  }