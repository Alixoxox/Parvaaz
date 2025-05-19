import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function People() {
  const navigate=useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const teamMembers = [
    {
      name: 'Aisha Khan',
      role: 'Customer Experience Lead',
      description: 'Aisha ensures every traveler enjoys a seamless booking process with our partner airlines.',
    },
    {
      name: 'Hiroshi Tanaka',
      role: 'Partnerships Manager',
      description: 'Hiroshi strengthens our relationships with airlines like Japan Airlines and Air China.',
    },
    {
      name: 'Omar Al-Mansoori',
      role: 'Technology Director',
      description: 'Omar drives the innovation behind our platform, making travel planning effortless.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-0 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div 
        className="hero"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/7109063/pexels-photo-7109063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)" }}
        data-hero="true"
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white hero-text">Our People</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">The Heart of Parvaaz</h2>
        <p className="text-gray-600 text-lg mb-4">
          At Parvaaz, our team is dedicated to making your travel dreams a reality. From curating flights with our exclusive airline partners—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China—to providing top-notch customer support, our people are the driving force behind every seamless journey.
        </p>
        <p className="text-gray-600 text-lg mb-8">
          Meet the passionate individuals who work tirelessly to connect you to over 500 destinations worldwide, ensuring every trip is unforgettable.
        </p>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{member.role}</p>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Explore the World?</h2>
          <p className="text-lg mb-6">Join our team or book your next flight with Parvaaz to experience travel like never before.</p>
          <button
            onClick={() => navigate('/book')}
            className="bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            View Careers
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default People;