import SwimTeamThumbnail from "./SwimTeamThumbnail";

export default function SwimTeamsMenu({teamLocations}) {
    return (
        <div className="grid gap-[25px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {teamLocations.map((teamLocation) => (
                <SwimTeamThumbnail 
                    key={teamLocation.id} // Use the actual document ID
                    locationInfo={teamLocation}
                />
            ))}
        </div>
    );
}