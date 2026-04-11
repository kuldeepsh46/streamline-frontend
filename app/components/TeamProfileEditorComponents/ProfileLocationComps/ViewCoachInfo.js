import { useEffect, useState } from "react"
import EditableInfoSection from "../EditableInfoSection"
import HeadCoachWrapper from "../EditorWrappers/HeadCoachWrapper"
import DisplayCoachInfo from "../InfoDisplayWrappers/DisplayCoachInfo"
import { editingMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/editingEntryByAllFields"

export default function ViewCoachInfo({coachInfo}){

    const [coachPhoto,setCoachPhoto]=useState(coachInfo.coachPhoto) //PENDING CHECJIUBG PROGRAMS INFO
    const [coachName,setCoachName]=useState(coachInfo.coachName)
    const [coachDescription,setCoachDescription]=useState(coachInfo.coachDescription)
    const [coachEmail,setCoachEmail]=useState(coachInfo.coachEmail)
    const [coachPhone,setCoachPhone]=useState({"phoneNumber":coachInfo.coachPhone,"isValid":true})

    const [coachEntryId,setCoachEntryId]=useState(coachInfo.coachId)
    const [defaultCoachPhoto,setDefaultCoachPhoto]=useState(coachInfo.coachPhoto) //PENDING CHECJIUBG PROGRAMS INFO
    const [defaultCoachName,setDefaultCoachName]=useState(coachInfo.coachName)
    const [defaultCoachEmail,setDefaultCoachEmail]=useState(coachInfo.coachEmail)
    const [defaultCoachPhone,setDefaultCoachPhone]=useState({"phoneNumber":coachInfo.coachPhone,"isValid":true})
    const [defaultCoachDescription,setDefaultCoachDescription]=useState(coachInfo.coachDescription)

    return(
        <>

    <EditableInfoSection 
    daysOfWeekHook={()=>{
      if (coachPhone.isValid==true){
        console.log("great")
      }else{
        throw new Error("Phone Number isn't right")
      }}}
    EditableInfoWrapper={HeadCoachWrapper} GeneralInfoDisplayWrapper={DisplayCoachInfo} 
      fields={{
        headCoachBio:coachDescription,
        headCoachName:coachName,
        setHeadCoachName:setCoachName,
        setHeadCoachBio:setCoachDescription,
        coachImg:coachPhoto,
        setCoachImg:setCoachPhoto,
        noHeader:true,
        coachEmail:coachEmail,
        setCoachEmail:setCoachEmail,
        coachPhone:coachPhone,
        setCoachPhone:setCoachPhone
        }
      }
      displayFields={{
        coachPhoto:coachPhoto[0].url,
        coachName:coachName,
        coachBio:coachDescription,
        coachEmail:coachEmail,
        coachPhone:coachPhone.phoneNumber
      }}
      editButtonText={"coach info"} 
      savingDefaultValuesOnCancel={
        [
          {value:defaultCoachDescription,
          setter:setCoachDescription
          },
          {
            value:defaultCoachName,
            setter:setCoachName
          },
          {
            value:defaultCoachPhoto,
            setter:setCoachPhoto
          },
          {
            value:defaultCoachEmail,
            setter:setCoachEmail
          },
          {
            value:defaultCoachPhone.phoneNumber,
            setDict:setCoachPhone,
            field:'phoneNumber'
          }
        ]
    }
    toUpdateDefaultsOnSave={
        [
        {value:coachDescription,setter:setDefaultCoachDescription},
        {value:coachName,setter:setDefaultCoachName},
        {value:coachPhoto,setter:setDefaultCoachPhoto},
        {value:coachEmail,setter:setDefaultCoachEmail},
        {value:coachPhone,setDict:setDefaultCoachPhone,field:'phoneNumber'},
        ]
    }
    allStatesJson={
        {coachDescription:coachDescription,
        coachName:coachName,
        coachPhoto:coachPhoto,
        coachEmail:coachEmail,
        coachPhone:coachPhone
        }}
    headerText={"Head coach info"}
    onEdit={async()=>{

        try{

        if(coachPhoto != defaultCoachPhoto){
          await deleteS3Objects({urls:[defaultCoachPhoto]})
          const desiredURLs = await uploadImagesToS3({files:[coachPhoto[0].url],s3Uri:"s3://streamlineplatform/coachPhotos/"})
          await editingMatchingEntriesByAllFields({collectionName:"Coach",matchParams:{id:coachEntryId},
          updateData:{
          coachName:coachName,
          coachBio:coachDescription,
          coachEmail:coachEmail,
          coachPhone:coachPhone.phoneNumber,
          photoUrl:desiredURLs[0],
          editTimestamp:new Date()}})
        }else{
          
          await editingMatchingEntriesByAllFields({collectionName:"Coach",matchParams:{id:coachEntryId},
          updateData:{
          coachName:coachName,
          coachEmail:coachEmail,
          coachPhone:coachPhone.phoneNumber,
          coachBio:coachDescription,
          editTimestamp:new Date()}})
        }

    }catch(error)
    {
        console.log(error)
    }
    }
    }
    />


        </>
    )
}