import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const navigateToBook = () => {
    navigate('/book') ;
  };

  // Function to redirect to countries' official websites
  const navigateToCountry = (country) => {
    const countryWebsites = {
      'Dubai': 'https://www.visitdubai.com/',
      'New York': 'https://www.nyc.gov/',
      'London': 'https://www.visitlondon.com/'
    };
    
    window.open(countryWebsites[country], '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section - Full-screen, touches Navbar, with visible text */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="hero-text-container">
            <h1 className="text-4xl md:text-5xl font-bold hero-text">Welcome to Parvaaz</h1>
            <p className="text-lg md:text-xl mt-4 mb-8 hero-text">Explore the world with comfort and ease</p>
            <button 
              onClick={navigateToBook}
              className="bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-black transition duration-300"
            >
              Book Your Flight
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Parvaaz</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 7c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm14 8c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-7-4c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-7 7c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Global Network</h3>
              <p className="text-gray-600">Access to hundreds of destinations worldwide through our partner airlines.</p>
            </div>
            
            <div className="card text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Quick Booking</h3>
              <p className="text-gray-600">Simple and fast booking process with instant confirmation.</p>
            </div>
            
            <div className="card text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v7h-2zm0 8h2v2h-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service to assist you anytime.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Dubai', 'New York', 'London'].map((city, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden h-80 shadow-lg group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  style={{ backgroundImage: `url('/images/destination-${index + 1}.jpg')` }}
                  onClick={() => navigateToCountry(city)}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 
                    onClick={() => navigateToCountry(city)} 
                    className="text-2xl font-bold mb-2 cursor-pointer destination-text hover:text-blue-300"
                  >
                    {city}
                  </h3>
                  <p className="mb-4">Explore amazing deals</p>
                  <button 
                    onClick={navigateToBook} 
                    className="btn-secondary"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action - Background matches Navbar */}
      <div className="bg-[var(--header-bg)] text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6 cta-text">Ready for your next adventure?</h2>
          <p className="text-lg mb-8">Book your flight today and enjoy a seamless travel experience with Parvaaz.</p>
          <button 
            onClick={navigateToBook}
            className="bg-white text-gray-800 font-medium py-3 px-8 rounded-lg hover:bg-black hover:text-white transition duration-300 shadow-lg"
          >
            Start Booking
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;