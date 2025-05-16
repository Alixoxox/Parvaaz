import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Transportation() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/transportation-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Ground Transportation</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Seamless Travel Connections</h2>
        <p className="text-gray-600 mb-6">
          Complete your journey with our premium ground transportation services, designed to complement your flights with our partner airlines, including Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China. Whether arriving in Dubai, Tokyo, or Istanbul, we ensure comfort and reliability from touchdown to destination.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Airport Transfers</h3>
            <p className="text-gray-600">
              Arrive stress-free with our professional airport transfer services. Book a chauffeured ride in cities like Doha, London, or Karachi, synchronized with your flight schedule for punctuality and comfort.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Car Rentals</h3>
            <p className="text-gray-600">
              Explore destinations like Sydney or Beijing at your own pace. Choose from a range of vehicles, from compact cars to luxury SUVs, available through our trusted partners.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Private City Tours</h3>
            <p className="text-gray-600">
              Discover the highlights of cities like Paris or Abu Dhabi with private tours tailored to your interests. Our expert guides enhance your travel experience with local insights.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Shuttle Services</h3>
            <p className="text-gray-600">
              Travel conveniently between airports, hotels, and attractions in cities like New York or Singapore with our cost-effective shuttle services, ideal for solo travelers or groups.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Explore with Ease?</h2>
          <p className="text-lg mb-6">Book your ground transportation alongside your flights for a seamless travel experience.</p>
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

export default Transportation;