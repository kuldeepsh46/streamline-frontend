"use client"

import { useState } from "react";

export default function SMSAgreement({ setUserPhoneAgreement, blurb }) {
    const [isChecked, setIsChecked] = useState(false);
  
    const handleCheckboxChange = () => {
      const newValue = !isChecked;
      setIsChecked(newValue);
      setUserPhoneAgreement(newValue);
    };
  
    return (
      <label className="flex items-center space-x-2 text-[12px] text-gray-700 cursor-pointer leading-[16px] ">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300 cursor-pointer"
        />
        <span className="text-center">
          {blurb}
        </span>
      </label>
    );
  }