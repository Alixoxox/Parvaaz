import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function TravelGuide() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const guideCategories = [
    {
      title: 'City Highlights',
      icon: '/images/city-highlights.png',
      description: 'Uncover iconic landmarks and hidden gems in destinations like Istanbul, Tokyo, and Dubai, served by our partner airlines such as Turkish Airlines and Emirates.',
      link: '/guides/city-highlights',
    },
    {
      title: 'Cultural Tips',
      icon: '/images/cultural-tips.png',
      description: 'Navigate local customs in Doha, Lahore, or Shanghai with insights to respect traditions and enhance your experience with Qatar Airways or Air China.',
      link: '/guides/cultural-tips',
    },
    {
      title: 'Safety Advice',
      icon: '/images/safety-advice.png',
      description: 'Travel confidently in cities like London or Abu Dhabi with safety tips and emergency contacts, tailored for Etihad Airways and Emirates travelers.',
      link: '/guides/safety-advice',
    },
    {
      title: 'Local Cuisine',
      icon: '/images/local-cuisine.png',
      description: 'Savor authentic dishes in Osaka or Karachi, with dining recommendations for Japan Airlines and PIA destinations.',
      link: '/guides/local-cuisine',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/travel-guide-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Travel Guides</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Discover Destinations with Confidence</h2>
        <p className="text-gray-600 mb-6">
          Our expertly crafted travel guides help you make the most of your journey with partner airlines like Turkish Airlines, Japan Airlines, and Qatar Airways. From cultural insights to must-visit attractions, we’ve got you covered.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guideCategories.map((category) => (
            <div
              key={category.title}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100"
            >
              <img src={category.icon} alt={`${category.title} icon`} className="h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <a
                href={category.link}
                className="text-gray-600 hover:text-gray-800 hover:underline transition-colors duration-300"
              >
                Explore Now
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Plan Your Perfect Trip</h2>
          <p className="text-lg mb-6">Use our travel guides to explore destinations and book flights with ease.</p>
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

export default TravelGuide;