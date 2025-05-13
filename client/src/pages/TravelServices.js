import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function TravelServices() {
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/travel-services-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Travel Services</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Elevate Your Journey</h2>
        <p className="text-gray-600 mb-6">
          Enhance your travel experience with our premium services, designed to complement flights with our partner airlines: Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China. From airport lounges to travel insurance, we’ve got you covered.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Travel Insurance</h3>
            <p className="text-gray-600">
              Protect your trip to destinations like Dubai or Tokyo with comprehensive insurance plans, covering cancellations, medical emergencies, and more.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Airport Lounge Access</h3>
            <p className="text-gray-600">
              Relax before your flight in premium lounges at hubs like Doha or Istanbul, available with Qatar Airways or Turkish Airlines bookings.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Priority Boarding</h3>
            <p className="text-gray-600">
              Enjoy priority boarding on Emirates or Japan Airlines flights to cities like Sydney or Osaka, ensuring a smooth start to your journey.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Visa Assistance</h3>
            <p className="text-gray-600">
              Simplify visa applications for destinations like China or Pakistan with our expert guidance, tailored for Air China or PIA travelers.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Enhance Your Trip Today</h2>
          <p className="text-lg mb-6">Add our travel services to your flight booking for a seamless experience.</p>
          <button
            onClick={() => navigate('/book')}
            className="bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TravelServices;