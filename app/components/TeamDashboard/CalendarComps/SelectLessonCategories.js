"use client";

import { useState,useEffect,useRef} from "react";


const CheckboxDropdown = ({ options, placeholder, selectedOptions, setSelectedOptions, fieldType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleOption = (option) => {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    };
  
    const toggleAll = () => {
      if (selectedOptions.length === options.length) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(options);
      }
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
      <div className="relative flex-col inline-block flex w-[50%] items-center justify-center" ref={dropdownRef}
      style={{
        userSelect: "none", // Prevent text selection
        WebkitUserSelect: "none", // Safari
        MozUserSelect: "none", // Firefox
        msUserSelect: "none",}}>
        <div className="mb-[4px] text-[14px]">
            {fieldType}
        </div>
        <div
          className={`border text-[14px] rounded-[18px] px-3 py-2 cursor-pointer ${isOpen ? "border-streamlineBlue border-[1px]":"border-gray-300"} ${selectedOptions.length==0?"text-gray-500":""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? selectedOptions.join(', ') : placeholder}
        </div>
        {isOpen && (
          <div className="absolute text-[14px] top-[100%] z-10 mt-[1px] w-full bg-white border border-gray-300 rounded-[20px] shadow-lg max-h-60 overflow-auto">
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-streamlineBlue items-center font-bold mt-[0px]" onClick={toggleAll}>
              <input
                type="checkbox"
                checked={selectedOptions.length === options.length}
                readOnly
                className="mr-2"
              />
              All categories
            </div>
            {options.map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  readOnly
                  className="mr-2"
                />
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default CheckboxDropdown;