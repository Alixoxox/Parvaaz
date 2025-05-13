import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Baggage() {
  const navigate=useNavigate()
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="h-64 bg-cover bg-center relative mt-20"
        style={{ backgroundImage: "url('/images/baggage-hero.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Baggage Information</h1>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Baggage Policies</h2>
        <p className="text-gray-600 mb-4">
          Understand our baggage allowances, restrictions, and fees to ensure a smooth travel experience.
        </p>
        <p className="text-gray-600 mb-4">
          Check specific policies for carry-on, checked luggage, and special items with our partner airlines.
        </p>
      </div>
      
      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Travel?</h2>
          <p className="text-lg mb-6">Book your flight and pack with confidence.</p>
          <button 
            onClick={() => navigate('/book',)}
            className="bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-600 hover:text-white transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Baggage;