import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function WhereWeFly() {
  const navigate=useNavigate()
  const [activeTab, setActiveTab] = useState('partners');
  
  const navigateToDestination = (destination) => {
    const destinationWebsites = {
      'Dubai': 'https://www.visitdubai.com/',
      'London': 'https://www.visitlondon.com/',
      'New York': 'https://www.nyc.gov/',
      'Singapore': 'https://www.visitsingapore.com/',
      'Tokyo': 'https://www.gotokyo.org/',
      'Sydney': 'https://www.sydney.com/',
      'Doha': 'https://visitqatar.qa/',
      'Paris': 'https://en.parisinfo.com/',
      'Bangkok': 'https://www.tourismthailand.org/',
      'Melbourne': 'https://www.visitmelbourne.com/',
      'Madrid': 'https://www.esmadrid.com/',
      'Cape Town': 'https://www.capetown.travel/',
      'Istanbul': 'https://www.goturkiye.com/',
      'Frankfurt': 'https://www.frankfurt-tourismus.de/en',
      'Rome': 'https://www.turismoroma.it/',
      'Cairo': 'https://egypt.travel/',
      'Beijing': 'http://english.visitbeijing.com.cn/',
      'Toronto': 'https://www.destinationtoronto.com/',
      'Karachi': 'https://www.kmc.gos.pk/',
      'Lahore': 'https://www.punjab.gov.pk/',
      'Islamabad': 'https://visitislamabad.net/',
      'Manchester': 'https://www.visitmanchester.com/',
      'Abu Dhabi': 'https://visitabudhabi.ae/',
      'Mumbai': 'https://www.maharashtratourism.gov.in/',
      'New Delhi': 'https://www.delhitourism.gov.in/',
      'Osaka': 'https://www.japan.travel/en/destinations/kansai/osaka/',
      'Los Angeles': 'https://www.discoverlosangeles.com/',
      'Hawaii': 'https://www.gohawaii.com/',
      'Taipei': 'https://www.travel.taipei/en',
      'Shanghai': 'https://www.meet-in-shanghai.net/',
      'Chengdu': 'https://www.travelchina.gov.cn/',
      'Seoul': 'https://english.visitseoul.net/',
      'Vancouver': 'https://www.destinationvancouver.com/',
    };

    window.open(destinationWebsites[destination], '_blank');
  };
  
  const partnerAirlines = [
    {
      name: 'Emirates',
      description: 'Fly Emirates to over 130 destinations worldwide. Experience award-winning service and comfort on board.',
      destinations: ['Dubai', 'London', 'New York', 'Singapore', 'Tokyo', 'Sydney'],
      logo: '/images/emirates-logo.png'
    },
    {
      name: 'Qatar Airways',
      description: 'Qatar Airways, the World\'s Best Airline, connects to over 150 destinations on the map.',
      destinations: ['Doha', 'Paris', 'Bangkok', 'Melbourne', 'Madrid', 'Cape Town'],
      logo: 'images/qatar-logo.png'
    },
    {
      name: 'Turkish Airlines',
      description: 'Turkish Airlines flies to more countries than any other airline, serving 120 countries across Europe, Asia, Africa, and the Americas.',
      destinations: ['Istanbul', 'Frankfurt', 'Rome', 'Cairo', 'Beijing', 'Toronto'],
      logo: '/images/turkish-logo.png'
    },
    {
      name: 'PIA',
      description: 'Pakistan International Airlines connects Pakistan to major destinations around the world with a focus on customer comfort.',
      destinations: ['Karachi', 'Lahore', 'Islamabad', 'Manchester'],
      logo: '/images/pia-logo.png'
    },
    {
      name: 'Etihad Airways',
      description: 'Experience the exceptional with Etihad Airways, the national airline of the UAE, offering premium service to over 80 destinations.',
      destinations: ['Abu Dhabi', 'Sydney', 'Mumbai', 'New Delhi'],
      logo: '/images/etihad-logo.png'
    },
    {
      name: 'Japan Airlines',
      description: 'Japan Airlines delivers unparalleled service with Japanese hospitality to destinations across the globe.',
      destinations: ['Tokyo', 'Osaka', 'Los Angeles', 'Hawaii', 'Taipei'],
      logo: '/images/japan-airlines-logo.png'
    },
    {
      name: 'Air China',
      description: 'As the flag carrier of China, Air China provides comprehensive routes connecting China to the world.',
      destinations: ['Beijing', 'Shanghai', 'Chengdu', 'Seoul', 'Vancouver'],
      logo: '/images/air-china-logo.png'
    }
  ];
  
  const popularDestinations = [
    {
      region: 'Europe',
      cities: ['London', 'Paris', 'Rome', 'Barcelona', 'Amsterdam', 'Prague']
    },
    {
      region: 'Asia',
      cities: ['Tokyo', 'Singapore', 'Bangkok', 'Dubai', 'Hong Kong', 'Seoul']
    },
    {
      region: 'Americas',
      cities: ['New York', 'Los Angeles', 'Toronto', 'Mexico City', 'Rio de Janeiro', 'Buenos Aires']
    },
    {
      region: 'Africa & Middle East',
      cities: ['Cairo', 'Dubai', 'Cape Town', 'Marrakech', 'Johannesburg', 'Tel Aviv']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Banner - Prominent background, touches Navbar, visible text */}
      <div 
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/world-map.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Where We Fly</h1>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button 
            className={`tab ${activeTab === 'partners' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('partners')}
          >
            Partner Airlines
          </button>
          <button 
            className={`tab ${activeTab === 'destinations' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            Destinations
          </button>
        </div>
        
        {/* Partners Tab Content */}
        {activeTab === 'partners' && (
          <div className="space-y-8">
            {partnerAirlines.map((airline, index) => (
              <div key={index} className="card">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-none">
                    <img 
                      src={airline.logo} 
                      alt={`${airline.name} logo`} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold">{airline.name}</h2>
                </div>
                
                <p className="mb-4 text-gray-600">{airline.description}</p>
                
                <h3 className="font-semibold mb-2">Popular Routes</h3>
                <div className="flex flex-wrap gap-2">
                  {airline.destinations.map((destination, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-100"
                      onClick={() => navigateToDestination(destination)}
                    >
                      {destination}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Destinations Tab Content */}
        {activeTab === 'destinations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularDestinations.map((region, index) => (
              <div key={index} className="card">
                <h2 className="text-xl font-bold mb-4">{region.region}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {region.cities.map((city, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                      onClick={() => navigateToDestination(city)}
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                      <span>{city}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to explore the world?</h2>
          <p className="text-lg mb-6">Find your perfect flight to any of our global destinations.</p>
          <button 
            onClick={() =>navigate('/book')}
            className="bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default WhereWeFly;