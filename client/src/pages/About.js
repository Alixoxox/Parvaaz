import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function About() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const values = [
    {
      title: 'Effortless Booking',
      description: 'Book flights with our partner airlines—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China—in just a few clicks.',
    },
    {
      title: 'Global Connectivity',
      description: 'Access over 500 destinations worldwide through our trusted airline partners, ensuring seamless travel to every corner of the globe.',
    },
    {
      title: 'Customer-First Approach',
      description: 'Your journey is our priority. Enjoy personalized support and innovative tools to make every trip unforgettable.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section - Prominent background, touches Navbar, visible text */}
      <div
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/about-hero.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">About Parvaaz</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Trusted Travel Companion</h2>
        <p className="text-gray-600 text-lg mb-4">
          Parvaaz is a premier travel platform designed to simplify your journey from start to finish. As a one-stop solution, we partner exclusively with world-class airlines—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China—to bring you unparalleled access to over 500 destinations across the globe.
        </p>
        <p className="text-gray-600 text-lg mb-8">
          Our mission is to make travel effortless, affordable, and memorable. Whether you're planning a business trip to Dubai, a cultural adventure in Tokyo, or a relaxing getaway to Cape Town, Parvaaz connects you to the perfect flight with our trusted partners, all through a seamless booking experience.
        </p>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Explore the World?</h2>
          <p className="text-lg mb-6">Book your next flight with Parvaaz and soar to new horizons with our trusted airline partners.</p>
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

export default About;