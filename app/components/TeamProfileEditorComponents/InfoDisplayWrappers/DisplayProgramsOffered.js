import CONFIG from "@/config"

export default function DisplayProgramsOffered({ daysOfWeek, programTypes, programLevels }) {
    return (
        <>
            <div className="h-[10px]" />
            
            <div className="font-bold text-[16px] pt-[8px]">Class levels offered</div>
            <ul className="list-disc pl-5">
                {programLevels.map((item, index) => (
                    // Use a unique ID if available, otherwise index is okay if list is static
                    <li key={`level-${index}`} className="mb-2">
                        {item.level} ({item.category})
                    </li>
                ))}
            </ul>

            <div className="font-bold text-[16px] pt-[8px]">Class Sizes offered</div>
            <ul className="list-disc pl-5">
                {programTypes.map((item, index) => (
                    <li key={`type-${index}`} className="mb-2">
                        {item.level} ({item.category})
                        <ul className="list-disc ">
                            <li className="flex items-center">
                                <div className="text-[10px] mr-[6px]">▶</div>
                                ${item.price} per lesson
                            </li>
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="font-bold text-[16px] pt-[8px]">Hours of Operation</div>
            <ul className="list-disc pl-5">
                {daysOfWeek.map((item, index) => (
                    // FIX: Removed the empty <> fragment. 
                    // The conditional check happens first, then the <li> with the key.
                    item.hoursStringified.length > 0 && (
                        <li key={`day-${index}`} className="mb-2 flex items-start justify-between w-[250px]">
                            <div className="list-item list-disc flex-none">
                                {item.day}
                            </div>
                            <ul className="list-disc ml-4">
                                {item.hoursStringified.map((hour, hourIndex) => (
                                    <li key={`hour-${index}-${hourIndex}`} className="flex items-end justify-end">
                                        <div className="text-[10px] mr-[6px]"></div>
                                        {hour}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )
                ))}
            </ul>
        </>
    )
}