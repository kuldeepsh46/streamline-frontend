

export default function  AmenitiesSelection(
    {selectedAmenities, setSelectedAmenities, amenitiesIcons}
){

    const toggleAmenitySelection = (amenityId) => {
        setSelectedAmenities((prevSelected) =>
          prevSelected.includes(amenityId)
            ? prevSelected.filter((id) => id !== amenityId) // Remove if already selected
            : [...prevSelected, amenityId] // Add if not selected
        );
      };
    
      return (
        <div style={{
          userSelect: "none", // Prevent text selection
          WebkitUserSelect: "none", // Safari
          MozUserSelect: "none", // Firefox
          msUserSelect: "none",}} >
        <div className="text-[15px] mb-[8px] font-bold">
            Please select all the applicable amenities for this location
          </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {Object.entries(amenitiesIcons).map(([id, amenity]) => (
            <div
              key={id}
              onClick={() => toggleAmenitySelection(Number(id))}
              className=
              {`${selectedAmenities.includes(Number(id))? "border-2 text-streamlineBlue font-bold border-streamlineBlue":"border-2 border-gray-300"}
              hover:border-streamlineBlue items-center`}
              style={{
                display: "flex",
                alignItems: "center",
                width: "calc(50% - 10px)", // Two columns
                padding: "10px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "border 0.3s",
              }}
            >
              <img
                src={`/amenities/${amenity['iconName']}`}
                alt={amenity.name}
                style={{
                  width: "40px",
                  height: "40px",
                  marginRight: "10px",
                  objectFit: "contain",
                }}
              />
              <span>{amenity.name}</span>
            </div>
          ))}
    
        </div>
        </div>
      );
}