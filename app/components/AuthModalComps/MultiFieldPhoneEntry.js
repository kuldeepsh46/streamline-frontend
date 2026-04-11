import { use, useRef, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';

export default function MultiFieldPhoneEntry({prompt, placeholder, fieldResponse, setFieldResponse,field,customLength}) {

    const[isValid, setIsValid] = useState(true)

    const setPhoneNumber = (phoneNumber) => {
      setIsValid(true)
      setFieldResponse(prevState => ({
        ...prevState,
        [field]: phoneNumber,
      }));
      try{
      if (isValidPhoneNumber(phoneNumber)) {
        setIsValid(true); // Valid number
        setFieldResponse(prevState => ({
          ...prevState,
          ["isValid"]: true,
        }));
      } }catch(error){
        console.log("Helwlloolo")
      }
    };

    const handlePhoneNumberBlur = () => {
      if (fieldResponse[field] && isValidPhoneNumber(fieldResponse[field])) {
        setIsValid(true); // Valid number
        setFieldResponse(prevState => ({
          ...prevState,
          ["isValid"]: true,
        }));
      } else {
        setIsValid(false); // Invalid number
        setFieldResponse(prevState => ({
          ...prevState,
          ["isValid"]: null,
        }));
      }
    };
    
    return(
      
      <>
        <div className={` ${customLength ? customLength:"w-[50%]"}`}>
          <div className="text-[15px] mb-[3px] font-bold w-full">
            {prompt}
          </div>
            <PhoneInput
            className="flex text-gray-700 border border-gray-300 rounded-[12px]  
            resize-none pr-[4px] pl-[7px] py-[2px] 
            focus:outline-none focus:border-blue-500 " 
            placeholder={placeholder}
            value={fieldResponse[field]}
            onChange={setPhoneNumber}
            defaultCountry="CA"
            international
            withCountryCallingCode
            onBlur={handlePhoneNumberBlur} // Validate only on blur
            />
            {!isValid && (
              <p className="text-red-500 text-sm mt-1">Invalid phone number</p>
            )}
        </div>
        </>
    )
}