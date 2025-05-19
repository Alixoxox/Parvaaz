import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Journey() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const milestones = [
    {
      year: '2018',
      event: 'Parvaaz founded with a mission to simplify global travel.',
    },
    {
      year: '2019',
      event: 'Partnered with Emirates and Qatar Airways, expanding our network.',
    },
    {
      year: '2020',
      event: 'Launched our innovative booking platform, connecting to 200+ destinations.',
    },
    {
      year: '2022',
      event: 'Added Turkish Airlines, PIA, and Etihad Airways to our partners.',
    },
    {
      year: '2024',
      event: 'Expanded with Japan Airlines and Air China, reaching 500+ destinations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/3082851/pexels-photo-3082851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Our Journey</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
        <p className="text-gray-600 text-lg mb-8">
          Parvaaz was born from a vision to make global travel effortless and accessible. Since our founding, we’ve grown into a trusted platform, partnering with world-class airlines to connect travelers to over 500 destinations worldwide.
        </p>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Key Milestones</h3>
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold text-gray-800">{milestone.year}</h4>
              <p className="text-gray-600">{milestone.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Be Part of Our Journey</h2>
          <p className="text-lg mb-6">Book your next flight with Parvaaz and join us in exploring the world.</p>
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

export default Journey;