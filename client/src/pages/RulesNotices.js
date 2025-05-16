import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function RulesNotices() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/rules-notices-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Rules & Notices</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Travel with Clarity</h2>
        <p className="text-gray-600 mb-6">
          Understand the policies governing your bookings with our partner airlines, including Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China. Our transparent rules ensure a smooth travel experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Booking Terms</h3>
            <p className="text-gray-600">
              Review the conditions for reserving flights and services. Ensure compliance with airline-specific policies for destinations like Dubai, Tokyo, or Islamabad.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Cancellation Policies</h3>
            <p className="text-gray-600">
              Learn about flexible cancellation options and refund processes for bookings with partners like Qatar Airways or Japan Airlines, tailored to your travel needs.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Passenger Rights</h3>
            <p className="text-gray-600">
              Know your entitlements, including compensation for delays or cancellations on flights to cities like London or Shanghai with Emirates or Air China.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Legal Notices</h3>
            <p className="text-gray-600">
              Access important legal information related to our platform and partner airline services, ensuring compliance across all destinations.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Book with Confidence</h2>
          <p className="text-lg mb-6">Our clear policies make planning your trip worry-free.</p>
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

export default RulesNotices;