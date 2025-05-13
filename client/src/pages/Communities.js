import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Communities() {
  const navigate=useNavigate()
  const initiatives = [
    {
      title: 'Sustainable Travel',
      description: 'We partner with airlines to promote eco-friendly practices, reducing carbon emissions for a greener planet.',
    },
    {
      title: 'Local Engagement',
      description: 'Supporting communities in our destinations through education and cultural preservation programs.',
    },
    {
      title: 'Travel Accessibility',
      description: 'Working to make travel inclusive and accessible for all, with tailored services for diverse needs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url('/images/communities-hero.jpg')" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Our Communities</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Giving Back to the World</h2>
        <p className="text-gray-600 text-lg mb-8">
          At Parvaaz, we believe travel is about more than just reaching a destination—it’s about making a positive impact. Through our partnerships with leading airlines, we support communities and promote sustainable travel practices worldwide.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initiatives.map((initiative) => (
            <div
              key={initiative.title}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800">{initiative.title}</h3>
              <p className="text-gray-600">{initiative.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Join Our Mission</h2>
          <p className="text-lg mb-6">Support our community initiatives by traveling with Parvaaz.</p>
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

export default Communities;