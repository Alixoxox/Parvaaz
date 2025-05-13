import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/parvaaz';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import cityCodes from '../utils/iata.json'
function Book() {
  // Use context for global state management
  const {
    tripType, 
    setTripType,
    fromCity, 
    setFromCity,
    toCity, 
    setToCity,
    departDate, 
    setDepartDate,
    returnDate, 
    setReturnDate,
    passengers, 
    setPassengers,
    cabinClass, 
    setCabinClass,
    multiCity, 
    setMultiCity,
    setFlightData
  } = useApp();

  // Local state for UI management
  // const [passengerDetails, setPassengerDetails] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const navigate = useNavigate();

  // List of cities with international airports
  const cities = [
    'New York', 'London', 'Dubai', 'Singapore', 'Tokyo', 'Paris', 'Hong Kong', 'Shanghai', 'Sydney', 'Los Angeles', 'Toronto', 'Seoul', 'Bangkok', 'Istanbul', 'Frankfurt', 'Amsterdam','Doha', 'Miami', 'Delhi', 'Mumbai', 'São Paulo', 'Mexico City', 'Johannesburg', 'Rome', 'Madrid', 'Barcelona', 'Moscow', 'Beijing', 'Jakarta', 'Manila', 'Kuala Lumpur', 'Cairo', 'Cape Town', 'Vancouver', 'Chicago', 'San Francisco', 'Dallas', 'Atlanta', 'Houston','Rio de Janeiro', 'Buenos Aires', 'Lima', 'Bogotá', 'Santiago', 'Nairobi', 'Lagos', 'Abu Dhabi', 'Riyadh', 'Tel Aviv', 'Athens', 'Vienna', 'Zurich', 'Geneva', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Dublin', 'Edinburgh', 'Lisbon', 'Prague', 'Budapest', 'Warsaw', 'Kyiv', 'Brussels', 'Munich', 'Milan', 'Venice', 'Florence', 'Naples', 'Ho Chi Minh City', 'Hanoi', 'Taipei', 'Melbourne', 'Brisbane', 'Perth', 'Auckland', 'Christchurch', 'Wellington', 'Montreal', 'Calgary', 'Ottawa', 'Boston', 'Washington DC', 'Seattle', 'Denver', 'Las Vegas', 'Orlando', 'Phoenix', 'Austin', 'San Diego', 'karachi', 'Lahore', 'Dhaka', 'Colombo', 'Kathmandu', 'Yangon', 'Phnom Penh', 'Vientiane','Muscat', 'Kuwait City', 'Amman', 'Beirut', 'Baghdad', 'Damascus', 'Sanaa', 'Accra','Addis Ababa', 'Algiers', 'Casablanca', 'Tunis', 'Tripoli', 'Harare', 'Luanda', 'Kigali','Dar es Salaam', 'Kampala', 'Antananarivo', 'Maputo', 'Port Louis', 'Victoria',"islamabad"
  ];

  // Update flight data in context whenever relevant state changes
  useEffect(() => {
    setFlightData({ tripType, fromCity, toCity, departDate, returnDate, passengers, cabinClass, multiCity });
  }, [tripType, fromCity, toCity, departDate, returnDate, passengers, cabinClass, multiCity, setFlightData]);

  // Handle changes for 'from' and 'to' input fields
  const handleCityInput = (field, value) => {
    if (field === 'from') {
      setFromCity(value);
      const filtered = Object.keys(cityCodes).filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
      setShowFromDropdown(value.length > 0 && filtered.length > 0);
    } else if (field === 'to') {
      setToCity(value);
      const filtered = Object.keys(cityCodes).filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
      setShowToDropdown(value.length > 0 && filtered.length > 0);
    }
  };

  // Handle city selection from dropdown
  const handleCitySelect = (field, city, index = null) => {
    if (index !== null) {
      // For multi-city
      const updated = [...multiCity];
      updated[index][field] = city;
      setMultiCity(updated);
    } else {
      // For one-way/round-trip
      if (field === 'from') {
        setFromCity(city);
      } else if (field === 'to') {
        setToCity(city);
      }
    }
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  // Handle changes in multi-city inputs
  const handleMultiCityChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...multiCity];
    updated[index] = { ...updated[index], [name]: value };

    // Update suggestions for city inputs
    if (name === 'from') {
      const filtered = Object.keys(cityCodes).filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
      setShowFromDropdown(value.length > 0 && filtered.length > 0);
    } else if (name === 'to') {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
      setShowToDropdown(value.length > 0 && filtered.length > 0);
    }

    setMultiCity(updated);
  };

  // Add another city for multi-city trip
  const addMultiCity = () => {
    setMultiCity([...multiCity, { from: '', to: '', date: '' }]);
  };

  // // Handle passenger details update
  // const handlePassengerDetails = (index, field, value) => {
  //   const newDetails = [...passengerDetails];
  //   newDetails[index] = { ...newDetails[index], [field]: value };
  //   setPassengerDetails(newDetails);
  // };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (tripType === 'roundtrip' && !returnDate) {
      alert("Please select a return date for roundtrip.");
      return;
    }

    if (tripType === 'oneway' || tripType === 'roundtrip') {
      if(!Object.keys(cityCodes).includes(fromCity.toLowerCase()) || !Object.keys(cityCodes).includes(toCity.toLowerCase())){
        alert('Please select valid cities from the list.');
        return;
      }
    } else if (tripType === 'multicity') {
      for (const city of multiCity) {
        if ( !Object.keys(cityCodes).includes((city.to).toLowerCase())) { 
          alert('Please select valid cities from the list.');
          return;
        }
      }
    }
  //   // If there are multiple passengers but details not filled in
  //   if (passengers > 1 && passengerDetails.length !== passengers) {
  //     // Initialize passenger details array
  //     const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  //     const newDetails = Array.from({ length: passengers }, (_, i) => ({
  //       name: i === 0 ? currentUser?.name || '' : '',
  //       email: i === 0 ? currentUser?.email || '' : '',
  //       passport: i === 0 ? currentUser?.passport || '' : '',
  //       nationality: i === 0 ? currentUser?.nationality || '' : '',
  //     }));
  //     setPassengerDetails(newDetails);
  //     return;
  //   }

    // Navigate to flights page
    navigate('/flights');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/travel-banner.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Book Your Flight</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card bg-white p-6 rounded-lg shadow-md">
          <div className="flex border-b mb-6">
            <button
              className={`tab ${tripType === 'oneway' ? 'tab-active' : ''} px-4 py-2 text-sm font-medium text-gray-700`}
              onClick={() => setTripType('oneway')}
            >
              One Way
            </button>
            <button
              className={`tab ${tripType === 'roundtrip' ? 'tab-active' : ''} px-4 py-2 text-sm font-medium text-gray-700`}
              onClick={() => setTripType('roundtrip')}
            >
              Round Trip
            </button>
            <button
              className={`tab ${tripType === 'multicity' ? 'tab-active' : ''} px-4 py-2 text-sm font-medium text-gray-700`}
              onClick={() => setTripType('multicity')}
            >
              Multi-City
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {tripType === 'oneway' || tripType === 'roundtrip' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="text"
                    name="from"
                    value={fromCity}
                    onChange={(e) => handleCityInput('from', e.target.value)}
                    className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter departure city"
                    required
                  />
                  {showFromDropdown && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                      {fromSuggestions.map(city => (
                        <li
                          key={city}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCitySelect('from', city)}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    name="to"
                    value={toCity}
                    onChange={(e) => handleCityInput('to', e.target.value)}
                    className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter destination city"
                    required
                  />
                  {showToDropdown && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                      {toSuggestions.map(city => (
                        <li
                          key={city}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCitySelect('to', city)}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 
                  />
                </div>
                {tripType === 'roundtrip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input
                      type="date"
                      name="returnDate"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                  <input
                    type="number"
                    name="passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
                  <select
                    name="cabinClass"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="select w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {multiCity.map((city, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                      <input
                        type="text"
                        name="from"
                        value={city.from}
                        onChange={(e) => handleMultiCityChange(index, e)}
                        className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter departure city"
                        required
                      />
                      {showFromDropdown && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                          {fromSuggestions.map(city => (
                            <li
                              key={city}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCitySelect('from', city, index)}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                      <input
                        type="text"
                        name="to"
                        value={city.to}
                        onChange={(e) => handleMultiCityChange(index, e)}
                        className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter destination city"
                        required
                      />
                      {showToDropdown && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                          {toSuggestions.map(city => (
                            <li
                              key={city}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCitySelect('to', city, index)}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={city.date}
                        onChange={(e) => handleMultiCityChange(index, e)}
                        className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMultiCity}
                  className="btn-secondary bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                  Add Another City
                </button>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                  <input
                    type="number"
                    name="passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
                  <select
                    name="cabinClass"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="select w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            )}


            <div className="mt-8">
              <button
                type="submit"
                className="btn-primary bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-full font-medium hover:opacity-90 transition-opacity">
                  Search Flights

              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Book;