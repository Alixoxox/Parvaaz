import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Pricing() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const fareOptions = [
    {
      title: 'Economy Class',
      description: 'Affordable fares with essential amenities for budget-conscious travelers.',
    },
    {
      title: 'Premium Economy',
      description: 'Enhanced comfort with extra legroom and priority services.',
    },
    {
      title: 'Business Class',
      description: 'Luxury travel with lie-flat seats, gourmet dining, and lounge access.',
    },
    {
      title: 'First Class',
      description: 'Unparalleled luxury with private suites and personalized service.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/pricing-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Pricing & Fares</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Find the Best Value for Your Trip</h2>
        <p className="text-gray-600 mb-6">
          Book flights with our partner airlines—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China—at competitive rates. Explore fare options and services to suit your budget and preferences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fareOptions.map((option) => (
            <div
              key={option.title}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{option.title}</h3>
              <p className="text-gray-600">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Book Your Flight Today</h2>
          <p className="text-lg mb-6">Choose the perfect fare for your next adventure with Parvaaz.</p>
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

export default Pricing;