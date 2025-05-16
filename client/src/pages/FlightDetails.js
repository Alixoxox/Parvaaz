import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/parvaaz';
import { calculateDuration, getCityFromIATA } from '../utils/aviationstack';
import { MdFlightTakeoff,MdFlightLand } from "react-icons/md";
import { toast } from 'react-toastify';

function FlightDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const {user,selectedFlight,cabinClass,setUser,tripType,startFlightD}=useApp()
  const formattedDate =  user?.DOB ? new Date(user.DOB).toISOString().split('T')[0] : '';
  const flightInfo=location.state?.data || selectedFlight ;
  const multiplier = tripType?.toLowerCase().includes("round") ? 2 : 1;
  if (!flightInfo) return <div className="p-4 text-red-600">No flight information available.</div>

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  useEffect(()=>{
    console.log(selectedFlight,flightInfo)
  },[])

  const handleContinue = () => {
    console.log(user)
    if(!user){
      toast.warn("You must be an active user first")
      navigate("/login");
      return;
    }else{
      navigate('/ticket-booking', { 
        state: { 
          flight: flightInfo} 
      });
    }    
  };

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
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                  {flightInfo.airline_name.charAt(0)}
                </div>
                <div className="flex-1 px-4">
                  <p className="text-lg font-medium">{flightInfo.airline_name}</p>
                  <p className="text-gray-500 text-sm">{flightInfo.flight_code}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-3">
                <div className="flex-1">
                  <div className='flex'> <p className="text-md text-gray-500">Flight Departure </p> <MdFlightTakeoff className='ms-1 text-2xl'/> </div>
                 
                  <p className="text-xl font-semibold">{flightInfo.departure_time.slice(0,5)}</p>
                  <p className="text-base capitalize">{getCityFromIATA(flightInfo.origin)}</p>
                  <p className="text-sm text-gray-500">{flightInfo.flight_date.slice(0,10)}</p>
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
                
                
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-500">Arrival</p>
                  <p className="text-xl font-semibold">{flightInfo.arrival_time.slice(0,5)}</p>
                  <p className="text-base capitalize">{getCityFromIATA(flightInfo.destination)}</p>
                </div>
              </div>
              {tripType==="roundtrip" && startFlightD &&(
                <div className="flex items-start mb-3 pt-4 border-t">
                  
                <div className="flex-1">
                  <div className='flex'> <p className="text-md text-gray-500">Flight Arrival </p> <MdFlightLand className='ms-1 text-2xl'/> </div>
                 
                  <p className="text-xl font-semibold">{startFlightD.departure_time.slice(0,5)}</p>
                  <p className="text-base capitalize">{getCityFromIATA(startFlightD.origin)}</p>
                  <p className="text-sm text-gray-500">{startFlightD.flight_date.slice(0,10)}</p>
                </div>
                
                <div className="flex flex-col items-center px-4">
                  <div className="w-full flex items-center mb-1">
                    <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
                    <div className="h-px flex-1 bg-gray-300"></div>
                    <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">{calculateDuration(startFlightD.departure_time,startFlightD.arrival_time)}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {startFlightD.stops === 0 ? 'Non-stop' : `${startFlightD.stops} stop`}
                  </div>
                
                </div>
                
                
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-500">Arrival</p>
                  <p className="text-xl font-semibold">{startFlightD.arrival_time.slice(0,5)}</p>
                  <p className="text-base capitalize">{getCityFromIATA(startFlightD.destination)}</p>
                </div>
              </div>
              )}
              
              <div className="border-t border-b py-4 my-4">
              <div className="flex justify-between mb-2">
                  <span className="text-gray-600 capitalize">Flight Type:</span>
                  <span className="font-medium capitalize">{tripType}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 capitalize">Cabin Class:</span>
                  <span className="font-medium capitalize">{cabinClass}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Aircraft:</span>
                  <span className="font-medium">{flightInfo.flight_code}</span>
                </div>
                  <div className="flex justify-between mb-2">
                  <span className="text-gray-600 capitalize">Each Flight Cost:</span>
                  <span className="font-medium capitalize">${cabinClass === 'economy' ? `${flightInfo.cost_eco}` :
                        cabinClass === 'business' ? `${flightInfo.cost_buis}` :
                        cabinClass === 'first' ? `${flightInfo.cost_first_class}` :
                        cabinClass === 'premium_economy' ? `${flightInfo.cost_pre_eco}`: "N/A"}</span>
                </div>
               
                <div className="flex justify-between">
                  <span className="text-gray-600">Baggage Allowance:</span>
                  <div className='flex flex-col text-right'>
                  <span className="font-medium">20kg checked </span>
                  <span className="font-medium">7kg cabin </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Features</h3>
                <ul className="space-y-1">
                  {["In-flight Snacks", "Newspapers"].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="text-3xl font-bold text-blue-600">${ cabinClass === 'economy' ? `${flightInfo.cost_eco* multiplier}` :
                        cabinClass === 'business' ? `${flightInfo.cost_buis* multiplier}` :
                        cabinClass === 'first' ? `${flightInfo.cost_first_class* multiplier}` :
                        cabinClass === 'premium_economy' ? `${flightInfo.cost_pre_eco* multiplier}`: "N/A"}</p>

                  <p className="text-red-400 font-bold text-sm">Non-Refundable</p>
              </div>
            </div>
          </div>
          
          {/* Passenger Details Form */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 border-b pb-2">Passenger Details</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                    <input 
                      type="text" 
                      name="fname"
                      value={user?.fname||""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                    <input 
                      type="text" 
                      name="lname"
                      value={user?.lname||""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={user?.email||""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNo"
                      value={user?.phoneNo||""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    name="DOB"
                    value={formattedDate||"" }
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Passport Number</label>
                    <input 
                      type="text" 
                      name="passport_no"
                      value={user?.passport_no||""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Nationality</label>
                    <input 
                      type="text" 
                      name="nationality"
                      value={user?.nationality || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="button"
                    onClick={handleContinue} 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition duration-300"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}

export default FlightDetails;