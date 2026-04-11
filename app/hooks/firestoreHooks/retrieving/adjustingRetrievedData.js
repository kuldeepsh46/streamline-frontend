import CONFIG from "@/config";

export const transformToDaysOfWeek = (data) => {
  const daysTemplate = CONFIG.daysOfWeek.map(day => ({
    ...day,
    checked:false,
    hoursOfOps: [...day.hoursOfOps], // Deep copy nested arrays
  }));
    // Group data by day and add hours to the corresponding day in the template
    data.forEach(({ day, hour }) => {
      const dayEntry = daysTemplate.find((d) => d.day.toLowerCase() === day.toLowerCase());
      if (dayEntry) {
        dayEntry.checked = true; // Mark the day as checked since it has data
        dayEntry.hoursOfOps.push(hour);
      }
    });
  
    return daysTemplate;
  };

export const transformImagesListToJsons = ({list}) => {
    return list.map(item => ({
      id: item.imageUrl,
      url: item.imageUrl
    }));
  };