import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function KnowHowToTravel() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const travelTips = [
    {
      title: 'Packing Smart',
      description: 'Learn how to pack efficiently for your trip, ensuring you have all essentials without overpacking.',
    },
    {
      title: 'Navigating Airports',
      description: 'Tips for a smooth airport experience, from check-in to boarding, with our partner airlines.',
    },
    {
      title: 'Travel Documentation',
      description: 'Ensure you have the necessary visas, passports, and health documents for international travel.',
    },
    {
      title: 'Staying Connected',
      description: 'Advice on staying connected abroad with affordable roaming plans and local SIM options.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/know-how-to-travel-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Know How to Travel</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Travel Smarter with Parvaaz</h2>
        <p className="text-gray-600 mb-6">
          Get ready for your journey with our expert travel tips, designed to make your experience with our partner airlines—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China—seamless and enjoyable.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {travelTips.map((tip) => (
            <div
              key={tip.title}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{tip.title}</h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Travel Smart?</h2>
          <p className="text-lg mb-6">Book your next flight with Parvaaz and travel with confidence.</p>
          <button
            onClick={() =>navigate('/book')}
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

export default KnowHowToTravel;