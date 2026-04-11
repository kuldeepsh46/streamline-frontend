import React, { useEffect, useRef, useState } from 'react';
import PriceDial from './PriceDial';

const PriceDropdown = ({ isVisible, onClose, setPriceLowerBound, priceLowerBound,
setPriceUpperBound, priceUpperBound, minPrice, setMinPrice, maxPrice,setMaxPrice,biggestPrice}) => {
    const divRef = useRef(null);

    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            onClose(); // Trigger the close function
        }
    };

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    return (
        isVisible && (
            <div
                ref={divRef}
                className="absolute flex flex-col bg-white
                right-0 top-full mt-2 py-2 
                 rounded-3xl shadow-[0_0_12px_rgba(0,0,0,0.1)] px-2"
                onClick={(e)=>e.stopPropagation()} // Close on click within the div
            >
                <div className='hidden sm:block text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                text-streamlineBlue pr-2 '
                style={{
                    fontWeight:525
                }}> 
                    Per lesson price range ($CAD)
                <PriceDial setPriceLowerBound={setPriceLowerBound} 
                lowerBound={priceLowerBound} upperBound={priceUpperBound}
                setPriceUpperBound={setPriceUpperBound}
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                biggestPrice={biggestPrice}
                />
                </div>
                <div className='block sm:hidden text-[12px] mb-0.5 pl-3 whitespace-nowrap 
                text-streamlineBlue pr-2 '
                style={{
                    // fontWeight:525
                }}> 
                    <div className='font-bold'>
                    Per lesson price range ($CAD)
                    </div>
                    
                    <div className='flex-col mt-[15px] space-y-[20px]'>
                    <div className="flex h-full text-black pt-[2px] items-center mt-[4px] items-center space-x-[6px] justify-center pr-[10px]"> 
                    <div className="text-[14px] font-bold">
                    Minimum: 
                    </div>
                            
                    <div className="flex mt-[2px] text-[14px] items-center">   
                        <input 
                        type="text"
                        value={minPrice}
                        className="w-[40px] border mr-[4px] rounded-[12px] px-[6px] py-[4px] text-center" onChange={(e)=>{
                            if(Number(e.target.value))
                            setMinPrice(e.target.value)
                            else if(e.target.value=="")
                            setMinPrice("")
                        }}/>
                        $CAD
                    </div>
                    
                    </div>
                    <div className="flex h-full text-black pt-[2px] items-center mt-[4px] items-center space-x-[6px] justify-center pr-[10px]"> 
                    <div className="text-[14px] font-bold">
                    Maximum: 
                    </div>
                            
                    <div className="flex mt-[2px] text-[14px] items-center">   
                        <input 
                        type="text"
                        value={maxPrice}
                        className="w-[40px] border mr-[4px] rounded-[12px] px-[6px] py-[4px] text-center" onChange={(e)=>{
                            if(Number(e.target.value))
                            setMaxPrice(e.target.value)
                            else if(e.target.value=="")
                            setMaxPrice("")
                        }}/>
                        $CAD
                    </div>
                    
                    </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default PriceDropdown;
