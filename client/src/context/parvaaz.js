import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const [bookingHistory,setbookingHistory]=useState([])
    const [tripType, setTripType] = useState('oneway');
      const [fromCity, setFromCity] = useState('');
      const [toCity, setToCity] = useState('');
      const [departDate, setDepartDate] = useState('');
      const [returnDate, setReturnDate] = useState('');
      const [passengers, setPassengers] = useState(1);
      const [cabinClass, setCabinClass] = useState('economy');
      const [modifiedFlightData,setmodifyFlightData]=useState([]) //copy
      const [selectedFlight,setselectedFlight]=useState(null)
      const [bookedAnchor,setbookedAnchor]=useState(false)
      const [selectedBaggage, setSelectedBaggage] = useState({checked: 0,cabin: false });    
      const [admin, setAdmin] = useState({ username: '', password: '' });  
      const [startFlightD,setstartFlightD]=useState(null);

  return (
    <AppContext.Provider value={{selectedBaggage, setSelectedBaggage,bookedAnchor,setbookedAnchor,admin,setAdmin,user, setUser ,bookingHistory,setbookingHistory,tripType, setTripType,fromCity, setFromCity,toCity, setToCity,departDate, setDepartDate,returnDate, setReturnDate,passengers, setPassengers,cabinClass, setCabinClass,modifiedFlightData,setmodifyFlightData,selectedFlight,setselectedFlight,startFlightD,setstartFlightD}}>
      {children}
    </AppContext.Provider>
  );
};