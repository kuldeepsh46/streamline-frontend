const { getEntriesByConditions } = require("../firestoreHooks/retrieving/getEntriesByConditions");

// const getXWeeksData = async ({locationId,x,currDay}) => {
//   try {
//     const today = new Date(currDay);

//     // Calculate the Saturday of Week X
//     const saturdayOfWeekX = new Date(today);
//     saturdayOfWeekX.setDate(
//       today.getDate() + (6 - today.getDay()) + 7 * x // Move to Saturday and add X weeks
//     );
//     saturdayOfWeekX.setHours(23, 59, 59, 999); // Set to end of the day

//     // Calculate the Sunday of Week -X
//     const sundayOfWeekMinusX = new Date(today);
//     sundayOfWeekMinusX.setDate(
//       today.getDate() - today.getDay() - 7 * x // Move to Sunday and subtract x weeks
//     );
//     sundayOfWeekMinusX.setHours(0, 0, 0, 0); // Set to start of the day
    
//     // Define conditions
//     const conditions = [
//       { field: "locationId", operator: "==", value: locationId },
//       { field: "start", operator: "<", value: saturdayOfWeekX },
//       { field: "start", operator: ">", value: sundayOfWeekMinusX },
//     ];

//     // Fetch entries using the getEntriesByConditions function
//     const entries = await getEntriesByConditions({
//       collectionName: "TimeBlock",
//       conditions,
//     });

//     return entries; // Return the filtered entries
//   } catch (error) {
//     console.error("Error fetching entries for time range:", error);
//     throw error; // Rethrow for further handling
//   }
// };

const getXWeeksData = async ({locationId, x, currDay}) => {
  try {
    const today = new Date(currDay);

    // Saturday of 2 weeks from now
    const endRange = new Date(today);
    endRange.setDate(today.getDate() + 14);
    endRange.setHours(23, 59, 59, 999);

    // Sunday of 2 weeks ago
    const startRange = new Date(today);
    startRange.setDate(today.getDate() - 14);
    startRange.setHours(0, 0, 0, 0);
    
    // console.log("DEBUG Hook: Searching between", startRange, "and", endRange);

    const conditions = [
      { field: "locationId", operator: "==", value: locationId },
      { field: "start", operator: "<=", value: endRange },
      { field: "start", operator: ">=", value: startRange },
    ];

    const entries = await getEntriesByConditions({
      collectionName: "TimeBlock", // Double check this name in Firebase
      conditions,
    });

    return entries;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

export default getXWeeksData;