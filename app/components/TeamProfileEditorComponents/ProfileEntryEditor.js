import { useRef } from "react";


export default function ProfileEntryEditor({prompt, placeholder, response, setResponse,isLong,uneditable,clearErrorMessage}) {

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
        setText(event.target.value)
        }
        if(clearErrorMessage){
          clearErrorMessage("")
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
          value={response}
          ref={divRef}
          uneditable={uneditable}
          placeholder={placeholder}
          onChange={(event) => handleChange(divRef,event,setResponse)}
          className="w-full text-gray-700 border border-gray-300 rounded-[12px]  
          resize-none overflow-auto overflow-hidden pl-[7px] pt-[7px] 
          focus:outline-none focus:border-blue-500 text-[15px]" 
          />
          :
          <input
          value={response}
          ref={divRef}
          disabled={uneditable}
          placeholder={placeholder}
          onChange={(event) => handleChange(divRef,event,setResponse)}
          className={`w-full text-gray-700 border border-gray-300 rounded-[12px]    
          resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
          focus:outline-none focus:border-blue-500 text-[15px] ${uneditable ?"bg-gray-300":""}`} 
          />
          }
        </div>
        </>
    )
}
