import SwimTeamThumbnail from "./SwimTeamThumbnail";


export default function SwimTeamsMenu({teamLocations}) {

    return(

        <div className="grid gap-[25px] 
         sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {teamLocations.map ((teamLocation,index)=>(
                <SwimTeamThumbnail key={index} locationInfo={teamLocation}/>
            ))}

        </div>
    )
}