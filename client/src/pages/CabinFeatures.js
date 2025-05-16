import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function CabinFeatures() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="h-64 bg-cover bg-center relative mt-20"
        style={{ backgroundImage: "url('/images/cabin-features-hero.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Cabin Features</h1>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Travel in Comfort</h2>
        <p className="text-gray-600 mb-4">
          Experience world-class cabin features, including spacious seating, advanced entertainment, and premium amenities.
        </p>
        <p className="text-gray-600 mb-4">
          Discover the luxury of our partner airlines’ first, business, and economy cabins.
        </p>
      </div>
      
      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Fly in Style</h2>
          <p className="text-lg mb-6">Book your flight and enjoy our premium cabin features.</p>
          <button 
            onClick={() => navigate('/book')}
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

export default CabinFeatures;