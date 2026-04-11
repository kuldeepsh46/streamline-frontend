import { useEffect, useState } from "react"
import EditableInfoSection from "../TeamProfileEditorComponents/EditableInfoSection"
import { editingMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/editingEntryByAllFields"
import { useAuth } from "@/app/contexts/AuthContext"
import UserEditorWrapper from "./UserEditorWrapper"
import DisplayUserInfo from "./DisplayUserInfo"
import { deleteMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/deleteEntriesByMatchingFields"
import { addAccountDependants } from "@/app/hooks/firestoreHooks/createAccount"

export default function ViewUserInfo({userEmail,setUserEmail,userName,setUserName,userPhone,setUserPhone,otherAthletes,setOtherAthletes}){

    const {user,userData} = useAuth()

    const [defaultUserEmail,setDefaultUserEmail]=useState("")
    const [defaultUserName,setDefaultUserName]=useState("")
    const [defaultUserPhone,setDefaultUserPhone]=useState({
        "phoneNumber":"","isValid":true
    })
    const [defaultOtherAthletes,setDefaultOtherAthletes]=useState([])

    useEffect(()=>{
      setDefaultOtherAthletes(otherAthletes)
      setDefaultUserEmail(userEmail)
      setDefaultUserName(userName)
      setDefaultUserPhone({"phoneNumber":userPhone.phoneNumber,"isValid":true})
    },[])

    return(
        <>

    <EditableInfoSection 
    daysOfWeekHook={()=>{
      if (userPhone.isValid==true){
        
        console.log("great")
        
        if(otherAthletes.length>0&&otherAthletes[0]!="nothing"){
        otherAthletes.forEach((item,index)=>{
          if(item.fullName && item.dateOfBirth){
            console.log("great")
          }else{
            throw new Error("Missing dependant info")
          }
        })}

      }else{
        throw new Error("Phone Number isn't right")
      }}}
    EditableInfoWrapper={UserEditorWrapper} GeneralInfoDisplayWrapper={DisplayUserInfo} 
      fields={{
        accountHolderEmailAddress:userEmail,
        setAccountHolderEmailAddress:setUserEmail,
        accountFullName:userName,
        setAccountFullName:setUserName,
        accountPhoneNumber:userPhone,
        setAccountPhoneNumber:setUserPhone,
        otherAthletes:otherAthletes,
        setOtherAthletes:setOtherAthletes
        }
      }
      displayFields={{
        accountFullname:userName,
        accountEmailAddress:userEmail,
        accountPhoneNumber:userPhone.phoneNumber,
        otherAthletes:otherAthletes
      }}
      editButtonText={"account info"} 
      savingDefaultValuesOnCancel={
        [
          {value:defaultUserEmail,
          setter:setUserEmail
          },
          {
            value:defaultUserName,
            setter:setUserName
          },
          {
            value:defaultOtherAthletes,
            setter:setOtherAthletes
          },
          {
            value:defaultUserPhone.phoneNumber,
            setDict:setUserPhone,
            field:'phoneNumber'
          }
        ]
    }
    toUpdateDefaultsOnSave={
        [
        {value:userName,setter:setDefaultUserName},
        {value:userEmail,setter:setDefaultUserEmail},
        {value:otherAthletes,setter:setDefaultOtherAthletes},
        {value:userPhone.phoneNumber,setDict:setDefaultUserPhone,field:'phoneNumber'},
        ]
    }
    allStatesJson={
        {userName:userName,
        userEmail:userEmail,
        userPhone:userPhone,
        otherAthletes:otherAthletes,
        }}
    headerText={"Account info"}
    
    // CURRENTLY OVER HERE
    onEdit={async()=>{

        try{

          await editingMatchingEntriesByAllFields({collectionName:"Account",matchParams:{firebaseId:user.uid},
          updateData:{
          emailAddress:userEmail,
          fullName:userName,
          phoneNumber:userPhone.phoneNumber,
          editTimestamp:new Date()}})

          if(otherAthletes!=defaultOtherAthletes){
          await deleteMatchingEntriesByAllFields({collectionName:"accountDependants",matchParams:{accountFirebaseId:user.uid}})

          if(otherAthletes.length>0&&otherAthletes[0]!="nothing"){
          await addAccountDependants({dependantsList:otherAthletes,firebaseId:user.uid})
            }
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