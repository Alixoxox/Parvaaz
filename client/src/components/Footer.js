import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/parvaaz';
function Footer() {
  const { admin}=useApp()

  const isAdmin = admin && admin.username === 'admin';

  return (
    <footer className="bg-gray-700 text-white py-12" style={{ backgroundImage: 'url(/images/luxury-aircraft-cabin.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* ABOUT US Column */}
          <div>
            <h3 className="font-bold text-xl mb-6 uppercase tracking-wider text-white">ABOUT US</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">About us</Link></li>
              <li><Link to="/partners" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Our partners</Link></li>
              <li><Link to="/people" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Our people</Link></li>
              <li><Link to="/careers" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Careers</Link></li>
              <li><Link to="/communities" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Communities</Link></li>
              <li><Link to="/journey" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Our journey</Link></li>
            </ul>
            <h3 className="font-bold text-xl mt-10 mb-6 uppercase tracking-wider text-white">BEFORE YOU FLY</h3>
            <ul className="space-y-2">
              <li><Link to="/rules-notices" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Rules and Notices</Link></li>
            </ul>
          </div>
          
          {/* BOOK A FLIGHT Column */}
          <div>
            <h3 className="font-bold text-xl mb-6 uppercase tracking-wider text-white">BOOK A FLIGHT</h3>
            <ul className="space-y-2">
              <li><Link to="/book" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Book flights</Link></li>
              <li><Link to="/login" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">View your profile</Link></li>
              <li><Link to="/travel-services" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Travel services</Link></li>
              <li><Link to="/transportation" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Transportation</Link></li>
              <li><Link to="/planning" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Planning your trip</Link></li>
              <li><Link to="/pricing" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Pricing</Link></li>
            </ul>
          </div>
          
          {/* HELP and AIRLINES Column */}
          <div>
            <h3 className="font-bold text-xl mb-6 uppercase tracking-wider text-white">HELP</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Help</Link></li>
              <li><Link to="/help" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Contact us</Link></li>
              <li><Link to="/help" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">FAQs</Link></li>
              <li><Link to="/travel-guide" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Travel guide</Link></li>
              <li><Link to="/know-how-to-travel" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Know how to travel</Link></li>
            </ul>
            
            <h3 className="font-bold text-xl mt-10 mb-6 uppercase tracking-wider text-white">ADMIN PORTAL</h3>
            <ul className="space-y-2">
              <li><Link to="/admin-login" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Admin Login</Link></li>
              {isAdmin && (
                <li><Link to="/admin-dashboard" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Admin Dashboard</Link></li>
              )}
            </ul>
            
            <h3 className="font-bold text-xl mt-10 mb-6 uppercase tracking-wider text-white">AIRLINES WE MANAGE</h3>
            <ul className="space-y-2">
              <li><a href="https://www.pia.com.pk" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">PIA</a></li>
              <li><a href="https://www.emirates.com" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Emirates</a></li>
              <li><a href="https://www.turkishairlines.com" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Turkish Airlines</a></li>
              <li><a href="https://www.qatarairways.com" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Qatar Airways</a></li>
              <li><a href="https://www.etihad.com" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Etihad Airways</a></li>
              <li><a href="https://www.jal.com" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Japan Airlines</a></li>
              <li><a href="https://www.airchina.com" className="text-white hover:text-gray-300 transition-colors duration-200 text-sm">Air China</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm">© {new Date().getFullYear()} Parvaaz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;