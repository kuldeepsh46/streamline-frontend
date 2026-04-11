

export const getPathName = ({idx}) => {
    const path = window.location.pathname; // Get the pathname part of the URL
    const segments = path.split("/").filter(Boolean); // Split by '/' and filter out empty strings
    return segments[idx] || null; // Return the first segment or null if no segment exists
  };
  