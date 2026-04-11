import { useEffect, useRef, useState } from "react";
import extractAddressFromGoogleLink from "@/app/hooks/addressExtraction";
import { getCoordinatesFromAddress } from "@/app/hooks/addressExtraction";

export default function GoogleAddyEntryEditor({address,setAddress,streetAddress,setStreetAddress, coords, setCoords,postalCode,setPostalCode, city, setCity, province, setCountry,country, setProvince}) {

    const divRef = useRef(null);
    const [errorMessage,setErrorMessage] = useState("")
    const [cityStateError, setCityStateError] = useState("")

    const parseAddress = (address) => {
      const parts = address.split(",").map(part => part.trim());
    
      if (parts.length < 5) {
        throw new Error("Address format is invalid. Expected format: 'Street Address, City, State, PostalCode, Country'");
      }
    
      const [streetAddress, city, statePostal, postalCode, country] = parts;
    
      const state = statePostal.split(" ")[0];
    
      return {
        streetAddress,
        city,
        state,
        postalCode,
        country,
      };
    };

    const [isFirstTime, setIsFirstTime] = useState(true)
    useEffect(()=>{
      if (address.length>0 && isFirstTime){
        try{  
        const brokenUpAddress =  parseAddress(address)
        console.log("BROKEN UP", brokenUpAddress)
        setStreetAddress(brokenUpAddress.streetAddress)
        setCity(brokenUpAddress.city)
        setProvince(brokenUpAddress.state)
        setPostalCode(brokenUpAddress.postalCode)
        setCountry(brokenUpAddress.country)
        }catch(error){
          console.log("no address to break up")
        }
        setIsFirstTime(false)
      }
    },[address])
    // const handleChange = async(boxRef,event,setText) => {
    //     autoResize(boxRef);  // Call to resize the textarea
    //     if(event && setText){
    //     setText(event.target.value)
    //     if (event.target.value!=""){
    //     try{
    //     const {lat,lng,address} = await extractAddressFromGoogleLink({addressLink:event.target.value})
    //     setAddress(address)
        
    //     setCoords({"lat":lat,"lng":lng})
    //     try{
    //       extractCityAndState(address)
    //     }catch{
          
    //     }
    //     }
    //     catch(error){
    //       setErrorMessage("Please make sure you entered a correct Google Maps link for the intended location")
    //       console.log(errorMessage)
    //     }
    //     }else{
    //       setErrorMessage("")
    //     } 
    //     }
    //   }

    // function extractCityAndState(address) {
    //   // Split the address by commas
    //   const parts = address.split(',');
      
    //   // Assuming the format is consistent, extract city and state
    //   if (parts.length >= 2) {
    //     const city = parts[1].trim(); // City is usually the second part
    //     const stateZip = parts[2].trim(); // State and ZIP are usually the third part
    //     const country = parts[parts.length-1].trim();

    //     // Split state and ZIP
    //     const state = stateZip.split(' ')[0]; // State is before the space
    //     setCity(city)
    //     setProvince(state)
    //     setCountry(country)
    //   } else {
    //     setCityStateError("nada")
    //     throw new Error('Address format is not correct');
    //   }
    // }
    useEffect(() => {
      const fetchCoordinates = async () => {
          if (
              streetAddress.length > 0 &&
              city.length > 0 &&
              province.length > 0 &&
              postalCode.length > 0 &&
              country.length > 0
          ) {
              const locInfoList = [streetAddress, city, province, postalCode, country];
  
              let combinedAddress = locInfoList.join(", ");
              setAddress(combinedAddress);
              try {
                  const retreivedCoords = await getCoordinatesFromAddress({ address: combinedAddress });
                  setCoords(retreivedCoords);
                  console.log(retreivedCoords);
              } catch (error) {
                  console.log(error);
              }
          }
      };
  
      fetchCoordinates();
  }, [streetAddress, city, province, postalCode, country]);  



    return(

        <>
        <div className="pb-[10px] w-[100%]">
          <div className="text-[15px] mb-[3px] font-bold mb-[8px]">
            Full Address
          </div>
          <div className="w-full flex items-center">
          <div className="text-[15px] mb-[3px]  mr-[9px]">
            Street Address
          </div>
          <input
          value={streetAddress}
          ref={divRef}
          onChange={(event) => setStreetAddress(event.target.value)}
          className="flex-1 text-gray-700 border border-gray-300 rounded-[12px]    
          resize-none overflow-auto overflow-hidden pt-[3px] pb-[2px] pl-[9px]
          focus:outline-none focus:border-blue-500" 
          />
          </div>
          {cityStateError.length>0  &&
          <div className="mt-[7px] font-bold text-streamlineBlue">
            Please enter the city and state
          </div>}
          <div className="flex flex-col mt-[10px] space-y-[10px]">
            <div className="flex items-center">
              <div className="flex flex-1 items-center">
              <div className="text-[15px] mr-[8px]">
                City
              </div>
              <input
              value={city}
              ref={divRef}
              onChange={(event) => setCity(event.target.value)}
              className="flex-1 text-gray-700 border border-gray-300 rounded-[12px]    
              resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
              focus:outline-none focus:border-blue-500 mr-[8px]" 
              />
              </div>
              <div className="flex flex-1">
                <div className="text-[15px]  mr-[8px] ml-[8px]">
                  Province
                </div>
                <input
                value={province}
                ref={divRef}
                onChange={(event) => setProvince(event.target.value)}
                className="flex-1 text-gray-700 border border-gray-300 rounded-[12px]    
                resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
                focus:outline-none focus:border-blue-500 " 
                />
              </div>
            </div>

              <div className="flex items-center w-full">
                <div className="flex items-center w-[50%]">
                <div className="flex text-[15px] pr-[10px] min-w-[95px]">
                  Postal Code
                </div>
                <input
                value={postalCode}
                ref={divRef}
                onChange={(event) => setPostalCode(event.target.value)}
                className="flex-1 text-gray-700 border border-gray-300 rounded-[12px]    
                resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
                focus:outline-none focus:border-blue-500 mr-[8px]" 
                />
                </div>
                <div className="flex w-[50%] items-center">
                <div className="text-[15px]  mr-[8px] ml-[8px]">
                  Country
                </div>
                <input
                value={country}
                ref={divRef}
                onChange={(event) => setCountry(event.target.value)}
                className="flex-1 text-gray-700 border border-gray-300 rounded-[12px]    
                resize-none overflow-auto overflow-hidden pl-[9px] pt-[3px] pb-[2px]
                focus:outline-none focus:border-blue-500" 
                />
                </div>

              </div>
            </div>
        </div>
        </>
    )
}