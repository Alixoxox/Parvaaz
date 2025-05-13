import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/parvaaz';
import { searchFlights } from '../utils/flightService';
import { calculateDuration, convertTimeName } from '../utils/aviationstack';
function FlightSearch() {
 const {fromCity, setFromCity,toCity, setToCity,departDate, setDepartDate,cabinClass,passengers,modifiedFlightData,setmodifyFlightData,setselectedFlight,tripType,returnDate}=useApp()
  let cost=0
  let stops=0
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([]);
  const [searchprice,setsearchprice]=useState('100')
  const navigate=useNavigate()
  // Mock flight data
useEffect(() => {
  setLoading(true);
  if (tripType==="oneway" && fromCity.trim() === "" && toCity.trim() === "" && departDate === ""
  ) {
    setLoading(false);
    return alert("Enter At-least One field")
  }else if(tripType==="roundway" && !returnDate){
    setLoading(false);
    return alert("You Must Enter The Return Date")
  }
  const getflightData=async()=>{
    const data= await searchFlights(fromCity,toCity,departDate,cabinClass,passengers||1)
    console.log(data)
    setFlights(data?.available_flights || []);
    setLoading(false);
  }
  getflightData()
  setselectedFlight(null)

}, []);
  const handleSearch = () => {
    setLoading(true);
    if(fromCity.trim()==="" && toCity === '' && departDate === ''){
      setLoading(false); 
      return alert("You must enter at least one field")
    }
    setTimeout(async() => {
      const data= await searchFlights(fromCity,toCity,departDate,cabinClass,passengers||1)
      console.log(data)
      setFlights(data?.available_flights||[]);
      setLoading(false);
    }, 20);
  };

  useEffect(()=>{
    setmodifyFlightData(flights);
    console.log("modified data:",modifiedFlightData)
  },[flights])
  
  const handleFlightSelect = (flightId) => {
    const data = flights.find(flight => flight.schedule_id === flightId);
    setselectedFlight(data)
    navigate(`/flight-details?id=${flightId}`, { replace: true,state: data });
  }
  const ShowStops=(stopNo)=>{
    if(stopNo>0 && stopNo==1){
      return "1 Stop"
    }else if(stopNo>1){
      return "2+ Stops"
    }else {
      return "Non-Stop"
    }
  }
  const handleAirlineChange = (e) => {
    const airlineId = e.target.id;
    setSelectedAirlines((prevSelected) =>
      prevSelected.includes(airlineId)
        ? prevSelected.filter((id) => id !== airlineId)
        : [...prevSelected, airlineId]
    );
  };

  const handleStopChange = (e) => {
    const stop = parseInt(e.target.id, 10); // Ensure stop is treated as an integer
    setSelectedStops((prevSelected) =>
      prevSelected.includes(stop)
        ? prevSelected.filter((s) => s !== stop)
        : [...prevSelected, stop]
    );
  };

  const handleDepartureTimeChange = (e) => {
    const departureTime = e.target.id;
    setSelectedDepartureTimes((prevSelected) =>
      prevSelected.includes(departureTime)
        ? prevSelected.filter((time) => time !== departureTime)
        : [...prevSelected, departureTime]
    );
  };
  useEffect(() => {
    let filteredFlights = [...flights]; // Start with all flights

    if (selectedAirlines.length > 0) {
      filteredFlights = filteredFlights.filter((flight) =>
        selectedAirlines.includes(flight.airline_id.toString())  // Ensure both are strings
      );
    }
    
    if (Number(searchprice) > 101) {
      filteredFlights = filteredFlights.filter((flight) => {
        let flightCost;
        if (cabinClass === "business") {
          flightCost = flight.cost_buis;
        } else if (cabinClass === "first") {
          flightCost = flight.cost_first_class;
        } else if (cabinClass === "premium_economy") {
          flightCost = flight.cost_pre_eco;
        } else {
          flightCost = flight.cost_eco;
        }
    
        return flightCost <= Number(searchprice);
      });
    }
    console.log(searchprice)

    // Filter by selected stops
    if (selectedStops.length > 0) {
      filteredFlights = filteredFlights.filter((flight) => {
        if (selectedStops.includes(2)) {
          return flight.stops >= 2; // 2+ stop flights
        } else {
          return selectedStops.includes(flight.stops);
        }
      });
    }

    // Filter by selected departure times
    if (selectedDepartureTimes.length > 0) {
      filteredFlights = filteredFlights.filter((flight) =>
        selectedDepartureTimes.includes(flight.departure_time)
      );
    }
    console.log('Filtered Flights:', filteredFlights);

console.log(selectedAirlines);
    setmodifyFlightData(filteredFlights); // Set the modified filtered data
  }, [selectedAirlines, selectedStops, selectedDepartureTimes,searchprice]);

  return (<>
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      {/* Header Banner */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">Flight Search Results</h1>
          
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={fromCity}
                placeholder='Enter Source City'
                onChange={(e) => setFromCity(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={toCity}
                placeholder='Enter Destination City'
                onChange={(e) => setToCity(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white py-2 px-4 rounded font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Results */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Price Range</h4>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  onChange={(e) => setsearchprice(e.target.value)}
                  className="w-full" 
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>$100</span>
                  <span>$2000</span>
                </div>
                <p className="text-sm mt-1 text-right text-gray-600">
                 Selected: ${searchprice}
                 </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Airlines</h4>
                <div className="space-y-1">
                  {Array.isArray(flights) &&  [...new Set(flights.map(flight => flight.airline_id))].map((airlineId, index)  => {
                     const airline = flights.find(f => f.airline_id === airlineId);
                     return (
                      <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={airlineId.toString()}  // Make sure the id is a string
                        className="mr-2"
                        checked={selectedAirlines.includes(airlineId.toString())}  // Check if the selectedAirlines includes the string version
                        onChange={handleAirlineChange}
                      />
                      <label htmlFor={airlineId.toString()} className="text-sm">{airline.airline_name}</label>
                    </div>
                    ) })}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Stops</h4>
                <div className="space-y-1">
                  {Array.isArray(flights) && [...new Set(flights.map(flight => flight.stops))].map((stop, index)=> (
                    <div key={index} className="flex items-center">
                      <input type="checkbox" id={stop} className="mr-2" checked={selectedStops.includes(stop)} onChange={handleStopChange} />
                      <label htmlFor={stop} className="text-sm">{ShowStops(stop)}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
              <h4 className="font-medium mb-2">Departure Time</h4>
            <div className="space-y-1">
                 {Array.isArray(flights) && 
                     [...new Set(flights.map(flight => flight.departure_time))].map((departureTime, index) => (
                    <div key={index} className="flex items-center">
                      <input type="checkbox" id={departureTime} className="mr-2"  checked={selectedDepartureTimes.includes(departureTime)} onChange={handleDepartureTimeChange}/>
                      <label htmlFor={departureTime} className="text-sm">
                        {convertTimeName(departureTime)}
                      </label>
                    </div>
                  ))
                }
              </div>
            </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(modifiedFlightData) && modifiedFlightData.length > 0 ? (modifiedFlightData.map((flight,index)=> {
                   const duration = calculateDuration(flight.departure_time, flight.arrival_time);
                   if(cabinClass==="business") {
                    cost=flight.cost_buis
                   }else if(cabinClass==="first"){
                    cost=flight.cost_first_class
                   }else if(cabinClass==="premium_economy"){
                    cost=flight.cost_pre_eco
                   }else{
                    cost=flight.cost_eco
                   }

                   {if(flight.stops<1){
                         stops="Non-Stop"       
                   }else if(flight.stops>1){
                      stops=`${flight.stops} Stops`
                   }else{
                      stops=`${flight.stops} Stop`
                   }} 
                 return(
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Airline Logo */}
                      <div className="w-16 h-16 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {flight.airline_code.charAt(0)}
                        </div>
                      </div>
                   
                      {/* Flight Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-center">
                          <div>
                            <p className="font-semibold text-lg">{flight.departure_time.slice(0,5)} - {flight.arrival_time.slice(0,5)}</p>
                            <p className="text-gray-600 text-sm">{flight.airline_name} | {flight.airline_code} • {flight.flight_code}</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{duration}</p>
                            <p className="text-gray-600 text-sm">
                            {stops}
                            </p>
                          </div>
                      </div>
                          <span className="font-sm font-semibold mt-5 text-gray-700">{tripType === "roundway" ? `${flight.origin?.toUpperCase()} <--> ${flight.destination?.toUpperCase()}`  : `${flight.origin?.toUpperCase()} --> ${flight.destination?.toUpperCase()}`}</span>
                        </div>
                      
                      {/* Price and Select */}
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold text-xl">${cost}</p>
                        <button
                          onClick={() => handleFlightSelect(flight.schedule_id)} //get that specific flight schedule
                          className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                )})):(<p>No flights found.</p>)}
                 
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
    <Footer />
    </>
  );
}

export default FlightSearch;