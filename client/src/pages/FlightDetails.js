import BaggageModal from "../components/baggageCont";
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Luggage, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/parvaaz';
import { calculateDuration, getCityFromIATA } from '../utils/aviationstack';
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { toast } from 'react-toastify';

function FlightDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const {user,selectedFlight, cabinClass, setUser, tripType, startFlightD,selectedBaggage, setSelectedBaggage} = useApp();
  const [showBaggageModal, setShowBaggageModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Memoized calculations
  const flightInfo = useMemo(() => 
    location.state?.data || selectedFlight, 
    [location.state?.data, selectedFlight]
  );

  const isRoundTrip = useMemo(() => 
    tripType?.trim().toLowerCase() === "roundtrip", 
    [tripType]
  );

  const multiplier = useMemo(() => 
    isRoundTrip ? 2 : 1, 
    [isRoundTrip]
  );

  const formattedDate = useMemo(() => 
    user?.DOB ? new Date(user.DOB).toISOString().split('T')[0] : '', 
    [user?.DOB]
  );

  // Baggage options configuration
  const baggageOptions = useMemo(() => ({
    checked: [
      { weight: '10kg', price: 270 }, // 27*10
      { weight: '20kg', price: 540 }, // 27*20
      { weight: '30kg', price: 810 }  // 27*30
    ]
  }), []);

  // Calculate cabin class cost
  const getCabinClassCost = useMemo(() => {
    if (!flightInfo) return 0;
    
    const costs = {
      economy: flightInfo.cost_eco,
      business: flightInfo.cost_buis,
      first: flightInfo.cost_first_class,
      premium_economy: flightInfo.cost_pre_eco
    };
    
    return costs[cabinClass] || 0;
  }, [flightInfo, cabinClass]);

  const totalCost = useMemo(() => {
    const baseCost = getCabinClassCost * multiplier;
    const checkedIndex = selectedBaggage?.checked;
    const checkedCost = checkedIndex && checkedIndex > 0
      ? (baggageOptions.checked[checkedIndex - 1]?.price || 0) * multiplier
      : 0;
    const cabinCost = selectedBaggage?.cabin ? 189 * multiplier : 0;
    console.log(baseCost + checkedCost + cabinCost)
    return baseCost + checkedCost + cabinCost;
  }, [getCabinClassCost, multiplier, selectedBaggage?.checked, selectedBaggage?.cabin, baggageOptions.checked]);
  // Form validation
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['fname', 'lname', 'email', 'phoneNo', 'DOB', 'passport_no', 'nationality'];
    
    requiredFields.forEach(field => {
      if (!user?.[field]?.trim()) {
        errors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    // Email validation
    if (user?.email && !/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (user?.phoneNo && !/^\+?[\d\s-()]+$/.test(user.phoneNo)) {
      errors.phoneNo = 'Please enter a valid phone number';
    }

    // Date validation (must be in the past for DOB)
    if (user?.DOB && new Date(user.DOB) > new Date()) {
      errors.DOB = 'Date of birth must be in the past';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Effects
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Trip type:', tripType, 'Is Round Trip:', isRoundTrip);
      console.log('Selected Flight:', selectedFlight);
      console.log('Flight Info:', flightInfo);
    }
  }, [tripType, isRoundTrip, selectedFlight, flightInfo]);

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleContinue = () => {
    const usertoken=localStorage.getItem("authtoken")
    if (!usertoken) {
      toast.warn("You must be logged in to continue");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    navigate('/ticket-booking', { 
      state: { 
        flight: flightInfo,
        baggage: selectedBaggage,
        totalCost: totalCost
      } 
    });
  };

  // Early return for missing flight info
  if (!flightInfo) {
   navigate(-1)
  }

  return (<>
      <Navbar />
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Flight Details</h1>
          <p className="text-blue-100">Review your selected flight and enter passenger details</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Flight Summary */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Flight Summary</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 uppercase">
                  {flightInfo?.airline_name.charAt(0)}
                </div>
                <div className="flex-1 px-4">
                  <p className="text-lg font-medium capitalize">{flightInfo?.airline_name}</p>
                  <p className="text-gray-500 text-sm">{flightInfo?.flight_code}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-3">
              <div className="flex-1">
                <div className='flex'>
                  <p className="text-md text-gray-500">Flight Departure </p> 
                  <MdFlightTakeoff className='ms-1 text-2xl'/> 
                </div>
    
                <p className="text-xl font-semibold">{flightInfo?.departure_time.slice(0,5)}</p>
                <p className="text-base capitalize">{getCityFromIATA(flightInfo?.origin)}</p>
                <p className="text-sm text-gray-500">{flightInfo?.flight_date.slice(0,10)}</p>
              </div>
    
              <div className="flex flex-col items-center px-4">
                <div className="w-full flex items-center mb-1">
                  <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-500">{calculateDuration(flightInfo.departure_time,flightInfo.arrival_time)}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {flightInfo.stops === 0 ? 'Non-stop' : `${flightInfo.stops} stop`}
                </div>
              </div>
    
              <div className="flex-1 flex flex-col items-end text-right">
                <div className='flex items-center justify-end'>
                  <p className="text-md text-gray-500">Flight Arrival </p> 
                  <MdFlightLand className='ms-2 text-2xl'/>
                </div>
                <p className="text-xl font-semibold">{flightInfo.arrival_time.slice(0,5)}</p>
                <p className="text-base capitalize">{getCityFromIATA(flightInfo.destination)}</p>
              </div>
            </div>
              {/* Return Flight (if round trip) */}
              {isRoundTrip && startFlightD && (
                  <div className="flex items-start mb-3 pt-4 border-t">
                    <div className="flex-1">
                      <div className='flex items-center'> 
                        <p className="text-md text-gray-500">Return Departure</p> 
                        <MdFlightTakeoff className='ms-2 text-xl text-blue-600'/> 
                      </div>
                      <p className="text-xl font-semibold">{startFlightD.departure_time?.slice(0,5)}</p>
                      <p className="text-base capitalize">{getCityFromIATA(startFlightD.origin)}</p>
                      <p className="text-sm text-gray-500">{startFlightD.flight_date?.slice(0,10)}</p>
                    </div>
                    
                    <div className="flex flex-col items-center px-4">
                      <div className="w-full flex items-center mb-1">
                        <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
                        <div className="h-px flex-1 bg-gray-300"></div>
                        <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {calculateDuration(startFlightD.departure_time, startFlightD.arrival_time)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {startFlightD.stops === 0 ? 'Non-stop' : `${startFlightD.stops} stop${startFlightD.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-right">
                      <div className='flex items-center justify-end'> 
                        <p className="text-md text-gray-500">Return Arrival</p>
                        <MdFlightLand className='ms-2 text-xl text-green-600'/> 
                      </div>
                      <p className="text-xl font-semibold">{startFlightD.arrival_time?.slice(0,5)}</p>
                      <p className="text-base capitalize">{getCityFromIATA(startFlightD.destination)}</p>
                    </div>
                  </div>
                )}
                
                {/* Flight Details */}
                <div className="border-t border-b py-4 my-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Type:</span>
                    <span className="font-medium capitalize">{tripType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cabin Class:</span>
                    <span className="font-medium capitalize">{cabinClass?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aircraft:</span>
                    <span className="font-medium">{flightInfo.flight_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Cost ({isRoundTrip ? 'Round Trip' : 'One Way'}):</span>
                    <span className="font-medium">${getCabinClassCost * multiplier}</span>
                  </div>
                  
                  {/* Baggage Section */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Baggage Options:</span>
                      <button 
                        onClick={() => setShowBaggageModal(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                        aria-label="Modify baggage selection"
                      >
                        <Plus size={16} />
                        <Luggage size={16} />
                        <span>Modify</span>
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cabin baggage (7kg)</span>
                        <span className="text-green-600">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Checked baggage (20kg)</span>
                        <span className="text-green-600">Included</span>
                      </div>
                      
                      {selectedBaggage.checked > 0 && (
                        <div className="flex justify-between text-blue-600 font-medium">
                          <span>Extra {baggageOptions.checked[selectedBaggage.checked - 1].weight} checked</span>
                          <span>+${baggageOptions.checked[selectedBaggage.checked - 1].price * multiplier}</span>
                        </div>
                      )}
                      {selectedBaggage.cabin && (
                      <div className="flex justify-between text-blue-600 font-medium">
                        <span>Extra 7kg cabin baggage</span>
                        <span>+${189 * multiplier}</span>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Included Features</h3>
                  <ul className="space-y-1">
                    {["In-flight Snacks", "Newspapers", "Entertainment System"].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Total Price */}
                <div className="text-right border-t pt-4">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-3xl font-bold text-blue-600">${totalCost}</p>
                  <p className="text-red-500 font-medium text-sm">Non-Refundable</p>
                </div>
              </div>
            </div>
            
            {/* Passenger Details Form */}
            <div className="w-full md:w-1/2 lg:w-3/5">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-6 border-b pb-2">Passenger Details</h2>
                
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="fname"
                        value={user?.fname || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.fname ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.fname && <p className="text-red-500 text-xs mt-1">{formErrors.fname}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="lname"
                        value={user?.lname || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.lname ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.lname && <p className="text-red-500 text-xs mt-1">{formErrors.lname}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={user?.email || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phoneNo"
                        maxLength={13}
                        value={user?.phoneNo || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.phoneNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.phoneNo && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNo}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="DOB"
                      value={formattedDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.DOB ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.DOB && <p className="text-red-500 text-xs mt-1">{formErrors.DOB}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Passport Number <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="passport_no"
                        maxLength={9}
                        value={user?.passport_no || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.passport_no ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.passport_no && <p className="text-red-500 text-xs mt-1">{formErrors.passport_no}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="nationality"
                        value={user?.nationality || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.nationality ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.nationality && <p className="text-red-500 text-xs mt-1">{formErrors.nationality}</p>}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="button"
                      onClick={handleContinue} 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300"
                    >
                      Continue to Payment → ${totalCost}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBaggageModal && (
  <BaggageModal
    selectedBaggage={selectedBaggage}
    setSelectedBaggage={setSelectedBaggage}
    setShowBaggageModal={setShowBaggageModal}
    baggageOptions={baggageOptions}
    multiplier={multiplier}
  />
)}
      
      <Footer />
    </>
  );
}
export default FlightDetails