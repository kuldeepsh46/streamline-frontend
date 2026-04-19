import React, { useState, useEffect } from 'react';

const DisplayLocationInfo = ({ locations = [] }) => {
  const [selectedId, setSelectedId] = useState(null);

  // Fix for "Cannot update a component while rendering":
  // If you need to set a default, do it in useEffect, NOT in the function body.
  useEffect(() => {
    if (locations.length > 0 && !selectedId) {
      setSelectedId(locations[0].id);
    }
  }, [locations, selectedId]);

  return (
    <div className="location-container">
      <h3>Locations</h3>
      <ul>
        {locations.map((loc) => (
          /* Fix for "Each child in a list should have a unique 'key' prop":
             The 'key' must be on the outermost element returned by map.
          */
          <li 
            key={loc.id || loc.name} 
            className={selectedId === loc.id ? 'active' : ''}
          >
            <span>{loc.name}</span>
            <button 
              /* Fix for the other 'setState' error: 
                 Always wrap the call in an arrow function so it runs on CLICK, 
                 not during RENDER.
              */
              onClick={() => setSelectedId(loc.id)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayLocationInfo;