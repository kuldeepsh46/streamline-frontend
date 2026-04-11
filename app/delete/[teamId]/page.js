"use client"

import { deleteMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/deleteEntriesByMatchingFields"
import { getEntriesByConditions } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByConditions"
import { usePathname } from "next/navigation"
import { useEffect } from "react"



export default function DeletePage(){


    const pathName = usePathname()

    const teamId=  pathName.split("/")[2]
    
    // console.log(teamId)

    useEffect(()=>{

        const deleteTeamInfo = async() =>{
            const locationsInfo = await getEntriesByConditions({collectionName:"Location",conditions:[{operator:"==",field:"teamId",value:teamId}]})

            const teamInfo = await getEntriesByConditions({collectionName:"Team",conditions:[{operator:"==",field:"id",value:teamId}]})
            const locationIds = locationsInfo.map(item=>item.id)
            
            for(const locoId of locationIds){

                await deleteMatchingEntriesByAllFields({collectionName:"Amenities",matchParams:{"locationId":locoId}})
                
                await deleteMatchingEntriesByAllFields({collectionName:"Coach",matchParams:{"locationId":locoId}})
                
                await deleteMatchingEntriesByAllFields({collectionName:"Images",matchParams:{"locationId":locoId}})

                await deleteMatchingEntriesByAllFields({collectionName:"LessonType",matchParams:{"locationId":locoId}})

                await deleteMatchingEntriesByAllFields({collectionName:"Location",matchParams:{"id":locoId}})

                await deleteMatchingEntriesByAllFields({collectionName:"OperationDayTime",matchParams:{"locationId":locoId}})

                await deleteMatchingEntriesByAllFields({collectionName:"SkillLevel",matchParams:{"locationId":locoId}})


                await deleteMatchingEntriesByAllFields({collectionName:"TimeBlock",matchParams:{"locationId":locoId}})


            }

            await deleteMatchingEntriesByAllFields({collectionName:"Team",matchParams:{"firebaseId":teamInfo[0].firebaseId}})

            await deleteMatchingEntriesByAllFields({collectionName:"Account",matchParams:{"firebaseId":teamInfo[0].firebaseId}})
        }

        deleteTeamInfo()

    },[])

    return(

        <div className="w-full h-full items-center justify-center">
            <div className="font-bold text-[20px] text-center mt-[50%] text-streamlineBlue">
                Team info has been successfully deleted
            </div>
        </div>
    )
}