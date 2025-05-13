import React, { useState,useEffect } from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useApp } from '../context/parvaaz';
// Reusable NavLink component
const NavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`text-white hover:bg-gray-600 hover:text-white px-3 py-1 rounded-md text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

const NavButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`text-white hover:bg-gray-600 hover:text-white px-3 py-1 rounded-md text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

function Navbar() {
  const {user,setUser,admin} = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isAdmin = admin && admin.username === 'admin';
  
 // Mock searchable content
 const searchableContent = [
  {
    page: 'Home',
    route: '/',
    keywords: ['home', 'welcome', 'parvaaz', 'explore', 'book your flight', 'popular destinations', 'dubai', 'new york', 'london'],
  },
  {
    page: 'Book',
    route: '/book',
    keywords: ['book', 'flight booking', 'reserve', 'ticket'],
  },
  {
    page: 'Where We Fly',
    route: '/where-we-fly',
    keywords: ['where we fly', 'destinations', 'flights', 'routes'],
  },
  {
    page: 'Help',
    route: '/help',
    keywords: ['help', 'support', 'faq', 'customer service', 'inquiry'],
  },
  {
    page: 'User Profile',
    route: '/user-profile',
    keywords: ['profile', 'user', 'account', 'flight records', 'edit profile'],
  },
  {
    page: 'Admin Dashboard',
    route: '/admin-dashboard',
    keywords: ['admin', 'dashboard', 'manage', 'passengers', 'bookings', 'inquiries', 'flights', 'content'],
  },
];
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem("authtoken")
      toggleMobileMenu();
    } catch (error) {
      console.error('Sign-out failed:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();

    // Check for flight search pattern (e.g., "from, to, date")
    const flightPattern = /^([^,]+),\s*([^,]+),\s*(\d{4}-\d{2}-\d{2})$/;
    if (flightPattern.test(query)) {
      const [_, from, to, date] = query.match(flightPattern);
      navigate(`/flights?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}&date=${encodeURIComponent(date)}`);
    } else {
      // General content search
      let matchedRoute = '/';
      for (const item of searchableContent) {
        if (item.keywords.some(keyword => query.includes(keyword.toLowerCase()))) {
          matchedRoute = item.route;
          break;
        }
      }
      navigate(matchedRoute);
    }

    setSearchQuery('');
    toggleMobileMenu();
  };
return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="text-xl font-bold uppercase">
              Parvaaz
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 mx-4">
            {!isHomePage && <NavLink to="/">Home</NavLink>}
            <NavLink to="/book">Book</NavLink>
            <NavLink to="/where-we-fly">Where We Fly</NavLink>
            <NavLink to="/help">Help</NavLink>
            {user  ? (
              <>
                <NavLink to="/user-profile">Profile</NavLink>
                <NavButton onClick={handleSignOut}>Sign Out</NavButton>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/admin-login">Admin</NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin-dashboard">Dashboard</NavLink>
            )}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center ml-auto">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content or flights (e.g., From, To, Date)"
                className="px-3 py-1 rounded-l-md text-black focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-600 text-white px-3 py-1 rounded-r-md hover:bg-gray-500"
              >
                Search
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden bg-gray-700 px-4 py-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="mobile-menu-button"
          >
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="py-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flights..."
                className="w-full px-3 py-1 rounded-l-md text-black focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gray-600 text-white px-3 py-1 rounded-r-md hover:bg-gray-500 mt-2"
              >
                Search
              </button>
            </form>

            {/* Mobile Navigation Links */}
            {!isHomePage && (
              <NavLink to="/" onClick={toggleMobileMenu} className="block py-2">
                Home
              </NavLink>
            )}
            <NavLink to="/book" onClick={toggleMobileMenu} className="block py-2">
              Book
            </NavLink>
            <NavLink to="/where-we-fly" onClick={toggleMobileMenu} className="block py-2">
              Where We Fly
            </NavLink>
            <NavLink to="/help" onClick={toggleMobileMenu} className="block py-2">
              Help
            </NavLink>
            {user ? (
              <>
                <NavLink to="/user-profile" onClick={toggleMobileMenu} className="block py-2">
                  Profile
                </NavLink>
                <NavButton onClick={handleSignOut} className="block w-full text-left py-2">
                  Sign Out
                </NavButton>
                {isAdmin && (
                  <NavLink to="/admin-dashboard" onClick={toggleMobileMenu} className="block py-2">
                    Dashboard
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={toggleMobileMenu} className="block py-2">
                  Login
                </NavLink>
                <NavLink to="/admin-login" onClick={toggleMobileMenu} className="block w-full text-left py-2">
                  Admin
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default React.memo(Navbar);