import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [locationCheckoutAvailability,setLocationCheckoutAvailability]=useState(null)
  const [teamInfo,setTeamInfo]=useState(null)
  const [teamImage,setTeamImage]=useState(null)
  const [eventInfo,setEventInfo]=useState(null)

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutData, locationCheckoutAvailability,setLocationCheckoutAvailability,teamInfo,setTeamInfo,teamImage,setTeamImage,eventInfo,setEventInfo }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
