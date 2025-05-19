import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Partners() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const airlinePartners = [
    {
      name: 'Emirates',
      logo: '/images/emirates-logo.png',
      description: 'Fly with Emirates to over 130 destinations, enjoying award-winning service and luxury on every journey.',
    },
    {
      name: 'Qatar Airways',
      logo: '/images/qatar-logo.png',
      description: 'Experience the World’s Best Airline, Qatar Airways, connecting you to over 150 destinations with unmatched comfort.',
    },
    {
      name: 'Turkish Airlines',
      logo: '/images/turkish-logo.png',
      description: 'Turkish Airlines flies to more countries than any other, serving 120 countries with seamless connectivity.',
    },
    {
      name: 'PIA',
      logo: '/images/pia-logo.png',
      description: 'Pakistan International Airlines offers reliable service, connecting Pakistan to key global destinations.',
    },
    {
      name: 'Etihad Airways',
      logo: '/images/etihad-logo.png',
      description: 'Etihad Airways, the UAE’s national airline, delivers premium service to over 80 destinations worldwide.',
    },
    {
      name: 'Japan Airlines',
      logo: '/images/japan-airlines-logo.png',
      description: 'Japan Airlines combines Japanese hospitality with global connectivity, serving key destinations with excellence.',
    },
    {
      name: 'Air China',
      logo: '/images/air-china-logo.png',
      description: 'As China’s flag carrier, Air China connects you to major cities across Asia and beyond with comprehensive routes.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section - Prominent background, touches Navbar, no text shadow */}
      <div
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white">Our Trusted Partners</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Airline Partners</h2>
        <p className="text-gray-600 text-lg mb-8">
          At Parvaaz, we’ve partnered exclusively with the world’s leading airlines—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China—to provide you with a seamless booking experience. Our partners are renowned for their exceptional service, extensive global networks, and commitment to passenger satisfaction, ensuring your journey is nothing short of extraordinary.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {airlinePartners.map((partner) => (
            <div
              key={partner.name}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={partner.logo} alt={`${partner.name} logo`} className="w-16 h-16 object-contain" />
                <h3 className="text-2xl font-bold text-gray-800">{partner.name}</h3>
              </div>
              <p className="text-gray-600">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Fly?</h2>
          <p className="text-lg mb-6">Book your next flight with our trusted airline partners through Parvaaz.</p>
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

export default Partners;