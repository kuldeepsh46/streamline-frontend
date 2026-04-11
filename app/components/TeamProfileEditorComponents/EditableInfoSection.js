"useClient"

import { useEffect, useState } from "react";
import validateFields from "@/app/hooks/firestoreHooks/validateFields";
import { useRef } from "react";

export default function EditableInfoSection({EditableInfoWrapper,GeneralInfoDisplayWrapper,fields,displayFields,editButtonText,valueSettersJson,savingDefaultValuesOnCancel,toUpdateDefaultsOnSave, allStatesJson,onEdit,headerText,daysOfWeekHook}){


    const [isEditingWrapperInfo,setIsEditingWrapperInfo] =useState(false)
    const [mustFixInputInfo,setMustFixInputInfo]=useState(false)


    const saveDefaultValuesOnCancel = ({actions}) => {
        actions.forEach(({ setter, setDict, field, value }) => {
          console.log("ACRTION",actions)
          if (setter) {
            // Directly set the value using a setter function
            setter(value);
          } else if (setDict && field) {
            // Use changeField logic for dictionaries or objects
            setDict((prev) => ({
              ...prev,
              [field]: value,
            }));
          }
        });
      };
    
      const updatingDefaultValuesOnSave = ({actions}) => {
        actions.forEach(({ setter, setDict, field, value }) => {
          if (setter) {
            // Directly set the value using a setter function
            setter(value);
          } else if (setDict && field) {
            // Use changeField logic for dictionaries or objects
            setDict((prev) => ({
              ...prev,
              [field]: value,
            }));
          }
        });
      };

    const [enableSaveInputChanges,setEnableInputChanges] =useState(false)

    const firstLoad = useRef(0)
    useEffect(()=>{
        setMustFixInputInfo(false)
        if (firstLoad.current>1 && !enableSaveInputChanges){
        setEnableInputChanges(true)
        }
        firstLoad.current+=1
    },Object.values(allStatesJson))

    return(
        <div>
        <div className="flex items-center justify-between">
        <div className="text-[18px] font-bold text-streamlineBlue">
            {headerText}
        </div>
        {!isEditingWrapperInfo&&<div className="mt-[1px] text-[13px] ml-[8px] bg-streamlineBlue text-white font-bold px-[10px] py-[6px] rounded-full cursor-pointer"
        onClick={()=>{setIsEditingWrapperInfo(!isEditingWrapperInfo)}}>
            Edit {editButtonText}
        </div>}
        </div>
        
        {!isEditingWrapperInfo ?
        <div className="space-y-[3px]">
            <GeneralInfoDisplayWrapper {...displayFields}/>
        </div>:
        <div className="space-y-[12px]">
            <EditableInfoWrapper {...fields}/>
            {mustFixInputInfo&&
            <div className="text-red-500 font-bold text-[14px] pb-[5px]">
                Please ensure all fields are completed correctly and try again
            </div>}
            <div className="flex justify-end space-x-[12px] items-center pb-[8px]">
                <div className="text-streamlineBlue px-[10px]  py-[6px] border border-[1px] border-streamlineBlue text-[14px] rounded-full font-bold cursor-pointer"
                onClick={()=>{
                    saveDefaultValuesOnCancel({actions:savingDefaultValuesOnCancel})
                    setMustFixInputInfo(false)
                    setEnableInputChanges(false)
                    setIsEditingWrapperInfo(!isEditingWrapperInfo)
                }}
                >
                    Cancel
                </div>
                <div className={`px-[10px] py-[6px] text-[14px] font-bold text-white bg-streamlineBlue rounded-full ${enableSaveInputChanges?"cursor-pointer":"opacity-50"}`}
                onClick={async()=>{
                    if(enableSaveInputChanges){

                        setEnableInputChanges(false)
                        try
                        {
                        validateFields({data:allStatesJson})
                        if(daysOfWeekHook){
                          daysOfWeekHook()
                        }
                        setIsEditingWrapperInfo(false)
                        await onEdit();
                        updatingDefaultValuesOnSave({actions:toUpdateDefaultsOnSave})
                        }catch(error){
                            setMustFixInputInfo(true)
                        }
                    }
                }}>
                    Save changes
                </div>        
            </div>
        </div>
        }
        </div>
    )
}