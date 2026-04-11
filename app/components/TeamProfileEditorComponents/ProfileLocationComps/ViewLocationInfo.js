"use client";
import EditableInfoSection from "../EditableInfoSection";
import { useState } from "react";
import DisplayLocationInfo from "../InfoDisplayWrappers/DisplayLocationInfo";
import LocationInfoWrapper from "../EditorWrappers/LocationInfoWrapper";
import { editingMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/editingEntryByAllFields";
import { uploadImagesToS3 } from "@/app/hooks/awsHooks/uploadToS3";
import { getEntriesByMatching } from "@/app/hooks/firestoreHooks/retrieving/getEntriesByMatching";
import { deleteMatchingEntriesByAllFields } from "@/app/hooks/firestoreHooks/editing/deleteEntriesByMatchingFields";
import extractFieldFromJsonList from "@/app/hooks/extractFieldFromJSONList";
import deleteS3Objects from "@/app/hooks/awsHooks/deleteFromS3";
import { generateJsonList } from "@/app/hooks/firestoreHooks/adding/addInfoAsList";
import { addListOfJsons } from "@/app/hooks/firestoreHooks/adding/addInfoAsList";
import { deleteEntriesByFieldValues } from "@/app/hooks/firestoreHooks/editing/deleteEntriesByFieldValue";

export default function ViewLocationInfo({locationsInfo, retrievedAmenities,setRetrievedAmenities}){

    const [address, setAddress] = useState(locationsInfo.address)
  const [coords, setCoords] = useState(locationsInfo.longitude!="na"?{"lng":locationsInfo.longitude,"lat":locationsInfo.latitude}:{"lng":"na","lat":"na"})
  const [streetAddress,setStreetAddress]=useState(locationsInfo.parsedAddress.streetAddress ? locationsInfo.parsedAddress.streetAddress : "")
  const [city,setCity]=useState(locationsInfo.parsedAddress.city ? locationsInfo.parsedAddress.city : "")
  const [postalCode,setPostalCode]=useState(locationsInfo.parsedAddress.postalCode ? locationsInfo.parsedAddress.postalCode : "")
  const [country,setCountry]=useState(locationsInfo.parsedAddress.country ? locationsInfo.parsedAddress.country : "")
  const [province,setProvince]=useState(locationsInfo.parsedAddress.state ? locationsInfo.parsedAddress.state : "")
  const [locationImgs,setLocationImgs]=useState(locationsInfo.images)
  const [locationContactName,setLocationContactName]=useState(locationsInfo.locationContactName)
  const [locationContactPhone,setLocationContactPhone]=useState({"phoneNumber":locationsInfo.locationContactPhone,isValid:true})
  const [locationContactEmail,setLocationContactEmail]=useState(locationsInfo.locationContactEmail)

    const [defaultAmenitiesList,setDefaultAmenititesList] = useState(retrievedAmenities)  
    const [defaultStreetAddress,setDefaultStreetAddress]=useState(locationsInfo.parsedAddress.streetAddress ? locationsInfo.parsedAddress.streetAddress : "")
    const [defaultCity, setDefaultCity]=useState(locationsInfo.parsedAddress.city ? locationsInfo.parsedAddress.city : "")
    const [defaultState, setDefaultState]=useState(locationsInfo.parsedAddress.city ? locationsInfo.parsedAddress.city : "")
    const [defaultPostalCode,setDefaultPostalCode]=useState(locationsInfo.parsedAddress.postalCode ? locationsInfo.parsedAddress.postalCode : "")
    const [defaultCountry,setDefaultCountry]=useState(locationsInfo.parsedAddress.country ? locationsInfo.parsedAddress.country : "")
    const [defaultAddress,setDefaultAddress]=useState(locationsInfo.parsedAddress.state ? locationsInfo.parsedAddress.state : "")
    const [defaultImages,setDefaultImages]=useState(locationsInfo.images)
    const [defaultLocationContactEmail,setDefaultLocationContactEmail]=useState(locationsInfo.locationContactEmail)
    const [defaultLocationContactName,setDefaultLocationContactName]=useState(locationsInfo.locationContactName)
    const [defaultLocationNumber,setDefaultLocationNumber]=useState({"phoneNumber":locationsInfo.locationContactPhone,isValid:true})
  
  return(

        <>

<EditableInfoSection daysOfWeekHook={()=>{
  if (locationContactPhone.isValid==true){
    console.log("great")
  }else{
    throw new Error("Phone Number isn't right")
  }
}}
EditableInfoWrapper={LocationInfoWrapper} GeneralInfoDisplayWrapper={DisplayLocationInfo} 
      fields={{
        "address":address,
        "setAddress":setAddress,
        "setCoords":setCoords,
        "setCity":setCity,
        "setProvince":setProvince,
        "coords":coords,
        "city":city,
        "province":province,
        "setCountry":setCountry,
        postalCode:postalCode,
        setPostalCode:setPostalCode,
        country:country,
        streetAddress:streetAddress,
        setStreetAddress:setStreetAddress,
        locationImgs:locationImgs,
        setLocationImgs:setLocationImgs,
        selectedAmenities:retrievedAmenities,
        setSelectedAmenities:setRetrievedAmenities,
        setLocationContactEmail:setLocationContactEmail,
        setLocationContactName:setLocationContactName,
        setLocationContactNumber:setLocationContactPhone,
        locationContactEmail:locationContactEmail,
        locationContactName:locationContactName,
        locationContactNumber:locationContactPhone,
        hasChosenLocationContact:true,
        noHeader:true
        }
      }
      displayFields={{
        parsedAddress:{
          streetAddress:streetAddress,
          city:city,
          postalCode:postalCode,
          country:country,
          state:province,
        },
        locationImages:locationImgs,
        amenitiesList:retrievedAmenities,
        locationContactEmail:locationContactEmail,
        locationContactName:locationContactName,
        locationContactNumber:locationContactPhone.phoneNumber
      }}
      editButtonText={"location info/images"} 
      savingDefaultValuesOnCancel={
        [
          {value:defaultStreetAddress,
          setter:setStreetAddress
          },
          {
            value:defaultLocationContactEmail,
            setter:setLocationContactEmail
          },
          {
            value:defaultLocationContactName,
            setter:setLocationContactName
          },
          {
            value:defaultLocationNumber,
            setDict:setLocationContactPhone,
            field:'phoneNumber'
          },
          {
            value:defaultCity,
            setter:setCity
          },
          {
            value:defaultPostalCode,
            setter:setPostalCode
          },
          {
            country:defaultCountry, setCountry:setCountry            
          },
          {
            value:defaultState,setter:setProvince
          },{
            value:defaultAddress,setter:setAddress
          },
          {value:defaultImages,setter:setLocationImgs},
          {value:defaultAmenitiesList,setter:setRetrievedAmenities}
        ]
    }
    toUpdateDefaultsOnSave={
        [{value:address,setter:setDefaultAddress},
        {value:city,setter:setDefaultCity},
        {value:postalCode,setter:setDefaultPostalCode},
        {value:country,setter:setDefaultCountry},
        {value:province,setter:setDefaultState},
        {value:locationImgs,setter:setDefaultImages},
        {value:streetAddress,setter:setDefaultStreetAddress},
        {value:retrievedAmenities,setter:setDefaultAmenititesList},
        {value:locationContactPhone,setDict:setDefaultLocationNumber,field:'phoneNumber'}
        ]
    }
    allStatesJson={
        {streetAddress:streetAddress,
        city:city,province:province,country:country,postalCode:postalCode,locationImgs,
        retrievedAmenities:retrievedAmenities,locationContactEmail:locationContactEmail,locationContactName:locationContactName,locationContactPhone:locationContactPhone
        }}
    headerText={"Location Info"}
    onEdit={async()=>{

        try{

          await editingMatchingEntriesByAllFields({collectionName:"Location",matchParams:{id:locationsInfo.id},
        updateData:{address:address,
        city:city,
        state:province,
        country:country,
        latitude:coords!=null?coords.lat:"na",
        longitude:coords!=null?coords.lng:"na",
        locationContactEmail:locationContactEmail,
        locationContactName:locationContactName,
        locationContactPhone:locationContactPhone.phoneNumber,
        editTimestamp:new Date()}})

        if(defaultImages!=locationImgs){// REMOVE LOCATION IMAGES
        const existingImages = extractFieldFromJsonList({jsonList:defaultImages,fieldName:"url"})
        const newImages = extractFieldFromJsonList({jsonList:locationImgs,fieldName:"url"})
        const setOfOldUrls = new Set(existingImages)
        const setOfNewUrls = new Set(newImages)
        const imagesToDelete = []
        const imagesToAdd = []

        for(const image of locationImgs){ 
            if(!setOfOldUrls.has(image.url)){
                imagesToAdd.push(image)
            }
        }
        for(const image of existingImages){
            if(!setOfNewUrls.has(image)){
                imagesToDelete.push(image)
            }
        }

        if(imagesToDelete.length>0){
        const deletingS3ImagesResult = await deleteS3Objects({urls:imagesToDelete})
        deleteEntriesByFieldValues({collectionName:"Images",fieldName:"imageUrl",values:imagesToDelete})
        }
    
        // ADD LOCATION IMAGES
        const locationImageList = await uploadImagesToS3({s3Uri:"s3://streamlineplatform/locationImages/",files:locationImgs})
        const imagesFirestoreJsons = generateJsonList(locationImageList,"imageUrl",
        {locationId:locationsInfo.id},
        {photoType:"location"},
        {teamId:locationsInfo.teamId},
        {uploadTimestamp:new Date()})
        
        const imageFirestoreIds = await addListOfJsons({jsonList:imagesFirestoreJsons,collectionName:"Images"})
        
        }


        if(retrievedAmenities!=defaultAmenitiesList){
        await deleteMatchingEntriesByAllFields({collectionName:"Amenities",matchParams:{
            locationId:locationsInfo.id
        }})
        const firestoreAmenities = generateJsonList(retrievedAmenities,"selectedAmenities",{locationId:locationsInfo.id},{teamId:locationsInfo.teamId},{uploadTimestamp:new Date()}) 
        const amenityIds = await addListOfJsons({jsonList:firestoreAmenities,
        collectionName:"Amenities"})
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