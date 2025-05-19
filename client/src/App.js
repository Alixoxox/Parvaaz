import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import Book from './pages/Book';
import WhereWeFly from './pages/WhereWeFly';
import Help from './pages/Help';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FlightSearch from './pages/FlightSearch';
import FlightDetails from './pages/FlightDetails';
import TicketBooking from './pages/TicketBooking';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Partners from './pages/Partners';
import People from './pages/People';
import Careers from './pages/Careers';
import Communities from './pages/Communities';
import Journey from './pages/Journey';
import TravelServices from './pages/TravelServices';
import Transportation from './pages/Transportation';
import Planning from './pages/Planning';
import Pricing from './pages/Pricing';
import TravelGuide from './pages/TravelGuide';
import KnowHowToTravel from './pages/KnowHowToTravel';
import RulesNotices from './pages/RulesNotices';
import { useApp } from './context/parvaaz';
import { updateData } from './utils/getData';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewTicket from './pages/viewTicket';
function App() {
  // const [user] = useAuthState(auth);
  const {user,setUser}=useApp()
   useEffect(() => {
     const fetchuserdata = async () => {
       try {
         const userData = await updateData();
         if (userData && userData.id && userData.email) {
          setUser(userData);
        } else {
          localStorage.removeItem("authtoken");
          setUser(null);
        }
       } catch (err) {
         console.error("Failed to fetch user data:", err);
       }
     };
     fetchuserdata();
   }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/book" element={<Book />} />
        <Route path="/ticket/:id" element={<ViewTicket />} />
        <Route path="/where-we-fly" element={<WhereWeFly />} />
        <Route path="/help" element={<Help />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/flights" element={<FlightSearch />} />
        <Route path="/flight-details" element={<FlightDetails />} />
        <Route path="/ticket-booking" element={<TicketBooking />} />
        <Route path="/user-profile" element={user ? <UserProfile /> : <Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/people" element={<People />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/travel-services" element={<TravelServices />} />
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/travel-guide" element={<TravelGuide />} />
        <Route path="/know-how-to-travel" element={<KnowHowToTravel />} />
        <Route path="/rules-notices" element={<RulesNotices />} />
      </Routes>
    </Router>
  );
}

export default App;