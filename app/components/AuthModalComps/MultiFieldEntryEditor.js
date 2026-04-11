import { useRef } from "react";


export default function MultiFieldEntryEditor({prompt, placeholder, fieldResponse, setFieldResponse,field,isLong,uneditable}) {

    const divRef = useRef(null);


    const autoResize = (boxRef) => {
        const textarea = boxRef.current;
        if (textarea) {
          textarea.style.height = 'inherit';  // Temporarily make height adequate to the content
          textarea.style.height = `${textarea.scrollHeight}px`;  // Set height to scrollHeight to remove the scrollbar
        }
      };
    const handleChange = (boxRef,event,setText) => {
        autoResize(boxRef);  // Call to resize the textarea
        if(event && setText){
          setText(prevState => ({
            ...prevState,
            [field]: event.target.value,
          }));
        }
      }

    return(

        <>
        <div>
        <div className="text-[15px] mb-[3px] font-bold">
            {prompt}
          </div>
          {
            isLong?
          <textarea 
          value={fieldResponse[field]}
          ref={divRef}
          placeholder={placeholder}
          disabled={uneditable}
          onChange={(event) => handleChange(divRef,event,setFieldResponse)}
          className={`w-full text-gray-700 border border-gray-300 rounded-[12px]  
          resize-none overflow-auto overflow-hidden pl-[7px] pt-[7px] 
          focus:outline-none focus:border-blue-500 ${uneditable ?"bg-gray-300":""}`}
          />
          :
          <input
          value={fieldResponse[field]}
          ref={divRef}
          disabled={uneditable}
          placeholder={placeholder}
          onChange={(event) => handleChange(divRef,event,setFieldResponse)}
          className={`w-full text-gray-700 border border-gray-300 rounded-[12px]    
          resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
          focus:outline-none focus:border-blue-500 ${uneditable ?"bg-gray-300":""}`} 
          />
          }
        </div>
        </>
    )
}