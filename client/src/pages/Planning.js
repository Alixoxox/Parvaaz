import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Planning() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div 
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/planning-hero.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white">Plan Your Journey</h1>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Craft Your Perfect Trip</h2>
        <p className="text-gray-600 mb-6">
          Plan your dream vacation with flights from our partner airlines—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China. Our tools and tips make organizing your journey effortless.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Destination Guides</h3>
            <p className="text-gray-600">
              Explore curated guides for destinations like Dubai, Istanbul, or Tokyo, with insights on attractions and culture for Emirates or Turkish Airlines travelers.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Itinerary Planner</h3>
            <p className="text-gray-600">
              Build a personalized itinerary for your trip to Doha or Sydney, integrating flights, hotels, and activities with Qatar Airways or Etihad Airways.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Travel Tips</h3>
            <p className="text-gray-600">
              Get practical advice on packing, budgeting, and navigating airports like Karachi or Shanghai for PIA or Air China journeys.
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Group Travel</h3>
            <p className="text-gray-600">
              Organize seamless group trips to destinations like London or Osaka with tailored solutions for Japan Airlines or Emirates passengers.
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-[#1a1a1a] py-12 px-4 text-white text-center">
              <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Start Planning Now</h2>
          <p className="text-lg mb-6">Use our tools to create your ideal trip and book flights today.</p>
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

export default Planning;