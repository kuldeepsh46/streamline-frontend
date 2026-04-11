import React, { useEffect, useRef } from "react";

const GoogleMap = ({locationCoords, address}) => {
  const mapRef = useRef(null);
  const apiKey = "AIzaSyB4Ju2F2EEtL4yYDAxZekIPrUJkHakCw-w"; // Replace with your actual Google Maps API key
  
  // const locationCoords = {long: -96.7732461, lat: 32.8413603}
  useEffect(() => {
    // Load the Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Initialize the map after the script has loaded
    window.initMap = () => {
      const location = { lat: locationCoords.lat, lng:locationCoords.long }; // Replace with your location coordinates
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        mapTypeControl:false,
        styles: [
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "off" }], // Hides public transport information
              },
          ],
      });
      new window.google.maps.Marker({
        position: location,
        map: map,
        title: "Our Address",
      });
    };

    return () => {
      // Cleanup: remove script and initMap function
      delete window.initMap;
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return (
    <>
    {true &&
    <div className="flex flex-col ">
      <h3 className=" font-semibold mb-[10px] text-[18px]
      ">Our Location</h3>
      <div
        ref={mapRef}
        className="w-full h-[350px] rounded-lg  border border-gray-300 shadow-[0_0_14px_rgba(0,0,0,0.1)]"
      ></div>
      <h3 className="  mt-[12px] text-[18px] font-bold
      ">{address}</h3>
      
    </div>}
    </>
  );
};

export default GoogleMap;
