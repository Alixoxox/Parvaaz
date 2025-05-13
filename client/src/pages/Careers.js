import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Careers() {
  const jobOpenings = [
    {
      title: 'Software Engineer',
      location: 'Remote',
      description: 'Join our tech team to build cutting-edge travel solutions for a global audience.',
    },
    {
      title: 'Customer Support Specialist',
      location: 'Dubai, UAE',
      description: 'Provide exceptional support to our customers, ensuring a seamless booking experience.',
    },
    {
      title: 'Marketing Manager',
      location: 'London, UK',
      description: 'Drive our brand’s growth through innovative marketing strategies and campaigns.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section - Prominent background, touches Navbar, no text shadow */}
      <div
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/careers-hero.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-text-container">
            <h1 className="text-4xl font-bold text-white">Careers at Parvaaz</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Our Team</h2>
        <p className="text-gray-600 text-lg mb-8">
          At Parvaaz, we’re passionate about connecting people with the world. Join our dynamic team to work on innovative travel solutions alongside our trusted airline partners—Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad Airways, Japan Airlines, and Air China.
        </p>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Open Positions</h3>
        <div className="space-y-6">
          {jobOpenings.map((job) => (
            <div
              key={job.title}
              className="card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold text-gray-800">{job.title}</h4>
              <p className="text-blue-600 font-medium mb-2">{job.location}</p>
              <p className="text-gray-600">{job.description}</p>
              <button
                className="mt-4 text-blue-600 font-medium hover:underline"
                onClick={() => window.location.href = 'mailto:careers@parvaaz.com'}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--header-bg)] py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Soar?</h2>
          <p className="text-lg mb-6">Join Parvaaz and help shape the future of travel.</p>
          <button
            onClick={() => window.location.href = 'mailto:careers@parvaaz.com'}
            className="bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Careers;