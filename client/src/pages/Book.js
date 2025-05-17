import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/parvaaz';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import cityCodes from '../utils/iata.json'
import { toast } from 'react-toastify';
function Book() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
    const {
    tripType, setTripType, fromCity, setFromCity, toCity, setToCity,departDate, setDepartDate, returnDate, setReturnDate, passengers, setPassengers, cabinClass, setCabinClass } = useApp();

  // Local state for UI management
  // const [passengerDetails, setPassengerDetails] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const navigate = useNavigate();
  
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
  const handleCitySelect = (field, city) => {
    if (field === 'from') {
      setFromCity(city);
      setShowFromDropdown(false);
    } else {
      setToCity(city);
      setShowToDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tripType === 'roundtrip' && !returnDate) {
      toast.warn("Please select a return date for roundtrip.");
      return;
    }

    if (tripType === 'oneway' || tripType === 'roundtrip') {
      if(!Object.keys(cityCodes).includes(fromCity.toLowerCase()) || !Object.keys(cityCodes).includes(toCity.toLowerCase())){
        toast.warn('Please select valid cities from the list.');
        return;
      }
    }
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
          </div>

          <form onSubmit={handleSubmit}>
            {(tripType === 'oneway' || tripType === 'roundtrip') && (
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
                    required
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
            ) }
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