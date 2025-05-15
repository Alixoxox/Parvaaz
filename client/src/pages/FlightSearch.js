import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/parvaaz';
import { searchFlights } from '../utils/flightService';
import { calculateDuration, convertTimeName } from '../utils/aviationstack';
import { MdOutlineAirplanemodeInactive } from "react-icons/md";

function FlightSearch() {
  const {
    fromCity, setFromCity,
    toCity, setToCity,
    departDate, setDepartDate,
    cabinClass, passengers,
    modifiedFlightData, setmodifyFlightData,
    setselectedFlight, tripType, returnDate,setstartFlightD  } = useApp();

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [modifyReturnflights, setmodifyReturnflights] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([]);
  const [searchprice, setsearchprice] = useState('100');
  const navigate = useNavigate();

  // Initial flight search on component mount or when key props change
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
  
      const {
        outbound_flights = [],
        return_flights = []
      } = await searchFlights(
        fromCity,
        toCity,
        departDate,
        tripType === 'roundtrip' ? returnDate : undefined,
        cabinClass,
        passengers || 1,
        tripType
      );
      
      setFlights(outbound_flights);
      setmodifyFlightData(outbound_flights); // Initialize modified data with all flights
      
      if (tripType === 'roundtrip') {
        setReturnFlights(return_flights);
        setmodifyReturnflights(return_flights); // Initialize modified return data with all return flights
      } else {
        setReturnFlights([]);
        setmodifyReturnflights([]);
      }
      
      setLoading(false);
    };
    
    fetchFlights();
  }, [ cabinClass, passengers, tripType]);
  
  // Handle manual search button click
  const handleSearch = async () => {
    setLoading(true);
    
    const {
      outbound_flights = [],
      return_flights = []
    } = await searchFlights(
      fromCity,
      toCity,
      departDate,
      tripType === 'roundtrip' ? returnDate : undefined,
      cabinClass,
      passengers || 1,
      tripType
    );
    
    setFlights(outbound_flights);
    setmodifyFlightData(outbound_flights);
    
    if (tripType === 'roundtrip' && return_flights.length > 0) {
      setReturnFlights(return_flights);
      setmodifyReturnflights(return_flights);
    } else {
      setReturnFlights([]);
      setmodifyReturnflights([]);
    }
    
    setLoading(false);
  };

  const handleFlightSelect = (flightId, clickedFlight) => {
    console.log("Clicked flight:", clickedFlight);
    const isRoundTrip = tripType === "roundtrip";
  
    // 1. Set the selected flight (the one user clicked)
    
    // 2. If roundtrip, find the corresponding departure flight
    if (isRoundTrip) {
      const matchingDeparture = flights.find(depFlight =>
        depFlight.origin === clickedFlight.destination &&  // reversed
        depFlight.destination === clickedFlight.origin     // reversed
      );
      
      if (matchingDeparture) {
        setstartFlightD(clickedFlight);
      } else {
        console.warn("No matching departure flight found.");
      }
      setselectedFlight(matchingDeparture);
    }else{
      setselectedFlight(clickedFlight)
    }
  
    // 3. Navigate to details page with the clicked flight
    navigate(`/flight-details?id=${flightId}`, { state: clickedFlight });
  };
  // Format display for stops
  const ShowStops = (stopNo) => {
    if (stopNo > 0 && stopNo === 1) {
      return "1 Stop";
    } else if (stopNo > 1) {
      return "2+ Stops";
    } else {
      return "Non-Stop";
    }
  }
  
  // Handle airline filter change
  const handleAirlineChange = (e) => {
    const airlineId = e.target.id;
    setSelectedAirlines((prevSelected) =>
      prevSelected.includes(airlineId)
        ? prevSelected.filter((id) => id !== airlineId)
        : [...prevSelected, airlineId]
    );
  };

  // Handle stops filter change
  const handleStopChange = (e) => {
    const stop = parseInt(e.target.id, 10);
    setSelectedStops((prevSelected) =>
      prevSelected.includes(stop)
        ? prevSelected.filter((s) => s !== stop)
        : [...prevSelected, stop]
    );
  };

  // Handle departure time filter change
  const handleDepartureTimeChange = (e) => {
    const departureTime = e.target.id;
    setSelectedDepartureTimes((prevSelected) =>
      prevSelected.includes(departureTime)
        ? prevSelected.filter((time) => time !== departureTime)
        : [...prevSelected, departureTime]
    );
  };
  
  // Apply filters effect
  useEffect(() => {
    // Apply filters to the appropriate flight list based on trip type
    if (tripType === "oneway") {
      let filteredFlights = [...flights];
      
      // Apply airline filter
      if (selectedAirlines.length > 0) {
        filteredFlights = filteredFlights.filter((flight) =>
          selectedAirlines.includes(flight.airline_id.toString())
        );
      }
      
      // Apply price filter
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
      
      // Apply stops filter
      if (selectedStops.length > 0) {
        filteredFlights = filteredFlights.filter((flight) => {
          if (selectedStops.includes(2)) {
            return flight.stops >= 2; // 2+ stop flights
          } else {
            return selectedStops.includes(flight.stops);
          }
        });
      }
  
      // Apply departure time filter
      if (selectedDepartureTimes.length > 0) {
        filteredFlights = filteredFlights.filter((flight) =>
          selectedDepartureTimes.includes(flight.departure_time)
        );
      }
      
      setmodifyFlightData(filteredFlights);
    } else {
      // For roundtrip, filter return flights
      let filteredReturnFlights = [...returnFlights];
      
      // Apply airline filter
      if (selectedAirlines.length > 0) {
        filteredReturnFlights = filteredReturnFlights.filter((flight) =>
          selectedAirlines.includes(flight.airline_id.toString())
        );
      }
      
      // Apply price filter
      if (Number(searchprice) > 101) {
        filteredReturnFlights = filteredReturnFlights.filter((flight) => {
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
      
      // Apply stops filter
      if (selectedStops.length > 0) {
        filteredReturnFlights = filteredReturnFlights.filter((flight) => {
          if (selectedStops.includes(2)) {
            return flight.stops >= 2; // 2+ stop flights
          } else {
            return selectedStops.includes(flight.stops);
          }
        });
      }
  
      // Apply departure time filter
      if (selectedDepartureTimes.length > 0) {
        filteredReturnFlights = filteredReturnFlights.filter((flight) =>
          selectedDepartureTimes.includes(flight.departure_time)
        );
      }
      
      setmodifyReturnflights(filteredReturnFlights);
    }
  }, [flights, returnFlights, tripType, selectedAirlines, selectedStops, selectedDepartureTimes, searchprice, cabinClass]);

  // Determine which flights to render based on trip type
  const flightsToRender = tripType === "oneway" ? modifiedFlightData : modifyReturnflights;
  
  // Determine which data source to use for filters based on trip type
  const filterDataSource = tripType === "oneway" ? flights : returnFlights;

  return (
    <>
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
                    value={searchprice}
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
                    {Array.isArray(filterDataSource) && 
                      [...new Set(filterDataSource.map(flight => flight.airline_id))].map((airlineId, index) => {
                        const airline = filterDataSource.find(f => f.airline_id === airlineId);
                        return (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={airlineId.toString()}
                              className="mr-2"
                              checked={selectedAirlines.includes(airlineId.toString())}
                              onChange={handleAirlineChange}
                            />
                            <label htmlFor={airlineId.toString()} className="text-sm">
                              {airline?.airline_name || "Unknown Airline"}
                            </label>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Stops</h4>
                  <div className="space-y-1">
                    {Array.isArray(filterDataSource) && 
                      [...new Set(filterDataSource.map(flight => flight.stops))].map((stop, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={stop} 
                            className="mr-2" 
                            checked={selectedStops.includes(stop)} 
                            onChange={handleStopChange} 
                          />
                          <label htmlFor={stop} className="text-sm">{ShowStops(stop)}</label>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Departure Time</h4>
                  <div className="space-y-1">
                    {Array.isArray(filterDataSource) && 
                      [...new Set(filterDataSource.map(flight => flight.departure_time))].map((departureTime, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={departureTime} 
                            className="mr-2"  
                            checked={selectedDepartureTimes.includes(departureTime)} 
                            onChange={handleDepartureTimeChange}
                          />
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
                  {Array.isArray(flightsToRender) && flightsToRender.length > 0 ? (
                    flightsToRender.map((flight, index) => {
                      const duration = calculateDuration(flight.departure_time, flight.arrival_time);
                  
                      const cost =
                        cabinClass === "business"
                          ? flight.cost_buis
                          : cabinClass === "first"
                          ? flight.cost_first_class
                          : cabinClass === "premium_economy"
                          ? flight.cost_pre_eco
                          : flight.cost_eco;
                  
                      const stops =
                        flight.stops < 1
                          ? "Non-Stop"
                          : flight.stops > 1
                          ? `${flight.stops} Stops`
                          : `${flight.stops} Stop`;
                  
                      return (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Airline Logo */}
                            <div className="w-16 h-16 flex items-center justify-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                {flight.airline_code?.charAt(0) || "?"}
                              </div>
                            </div>
                  
                            {/* Flight Details */}
                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between items-center">
                                <div>
                                  <p className="font-semibold text-lg">
                                    {flight.departure_time?.slice(0, 5) || "N/A"} - {flight.arrival_time?.slice(0, 5) || "N/A"}
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    {flight.airline_name || "Unknown"} | {flight.airline_code || "N/A"} • {flight.flight_code || "N/A"}
                                  </p>
                                </div>
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <p className="font-medium">{duration}</p>
                                <p className="text-gray-600 text-sm">{stops}</p>
                              </div>
                              {tripType === "roundtrip" && flights.length>0 && returnFlights.length>0 &&(
                                <p className="text-gray-600 text-sm text-right justify-self-center p-3">(Round trip)</p>
                              )}

                            </div>
                            </div>
                  
                              <span className="font-sm font-semibold mt-5 text-gray-700">
                               {tripType === "roundtrip" && flights.length>0 && returnFlights.length>0
                                 ? (flight.origin?.toUpperCase() || "N/A") + " <--> " + (flight.destination?.toUpperCase() || "N/A")
                                 : (flight.origin?.toUpperCase() || "N/A") + " --> " + (flight.destination?.toUpperCase() || "N/A")}
                              </span>
                            </div>
                  
                            {/* Price and Select */}
                            <div className="flex flex-col items-end gap-2">
                              <p className="font-semibold text-xl">${tripType === "roundtrip" && flights.length>0 && returnFlights.length>0 ? cost * 2 : cost}</p>
                              <button
                                onClick={() => handleFlightSelect(flight.schedule_id,flight)}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
                    <MdOutlineAirplanemodeInactive className="text-4xl mb-2" />
                    <p className="text-sm font-medium">No flights found.</p>
                  </div>
                  )}
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