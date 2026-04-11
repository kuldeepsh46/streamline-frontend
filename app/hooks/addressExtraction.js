import CONFIG from "@/config";


async function resolveShortLink(shortUrl) {
    try {
        const query = new URLSearchParams({ shortUrl });
      const response = await fetch(CONFIG.backendRoute+`resolve-short-link?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resolve short link");
      }
  
      const data = await response.json();
      console.log("Resolved URL:", data.resolvedUrl);
      return data.resolvedUrl;
    } catch (error) {
      console.error("Error resolving short link:", error.message);
      throw error;
    }
  }

  async function geocodeAddress(address) {
    const apiKey = "YOUR_API_KEY"; // Replace with your Google API key
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location; // Extract coordinates
        console.log(`Coordinates for "${address}":`, location);
        return location; // { lat: <latitude>, lng: <longitude> }
      } else {
        console.error("No results found for the given address.");
        return null;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }

  async function getAddressFromCoords(lat, lng, apiKey) {
    try {
      const query = new URLSearchParams({ lat, lng, apiKey });
      const response = await fetch(CONFIG.backendRoute+ `get-address-from-coords?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch address");
      }
  
      const data = await response.json();
      console.log("Fetched Address:", data.address);
      return data.address;
    } catch (error) {
      console.error("Error fetching address:", error.message);
      throw error;
    }
  }
  

export async function extractAddressFromGoogleLink({addressLink}){

    let fullUrl;

    if (addressLink.includes("@")){
        fullUrl = addressLink;
    }else{
        fullUrl = await resolveShortLink(addressLink)
    }

    const match = fullUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    
    let lat;
    let lng;
    if (match) {
        lat = parseFloat(match[1]);
        lng = parseFloat(match[2]);
        console.log({ lat, lng });
    }else{
        throw("Short link resolved, but coordinates not found")
    }

    const address = await getAddressFromCoords(lat, lng, process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);


    if (address) {
        console.log("Full Address:", address);
      } else {
        console.error("Failed to fetch address.");
      }

      console.log("package",lat,lng,address)
    return {lat,lng, address};
}

export async function getCoordinatesFromAddress({address}) {
  const backendUrl = CONFIG.backendRoute+'geocode'; // Replace with your backend's URL

  try {
      const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }), // Send the address in the request body
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch coordinates');
      }

      const data = await response.json();
      console.log(`Coordinates for "${address}":`, data.location);
      return data.location; // { lat: <latitude>, lng: <longitude> }
  } catch (error) {
      console.error('Error fetching coordinates:', error.message);
      return null;
  }
}

export const parseAddress = ({address}) => {
  const parts = address.split(",").map(part => part.trim());

  if (parts.length < 5) {
    throw new Error("Address format is invalid. Expected format: 'Street Address, City, State, PostalCode, Country'");
  }

  const [streetAddress, city, statePostal, postalCode, country] = parts;

  const state = statePostal.split(" ")[0];

  return {
    streetAddress,
    city,
    state,
    postalCode,
    country,
  };
};