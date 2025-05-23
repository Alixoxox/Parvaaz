import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/parvaaz';
import { createUser } from '../utils/sendData';
import { loginUser } from '../utils/getData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginSignup = () => {
  const navigate=useNavigate()
  const [isSignup, setIsSignup] = useState(false);
  const {setUser}=useApp()
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [password, setPassword] = useState("");
  const [passportScan,setPassportImg]=useState("");
  const [cnic,setcnicNo]=useState("");
  const [IdScan,setIdImg]=useState("");
  const [dob,setDob]=useState("");
  const [nationality,setnationality]=useState("")
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (isSignup) {
      if (name.trim().split(" ").length < 2) {
        toast.warn("Please enter your full name (first and last).");
        return;
      }
      const userDetails = await createUser(name, dob, nationality, passportNo, passportScan, email,password ,IdScan,cnic);
      if (userDetails.message==="An error occurred") {
        toast.warn(userDetails.message);
      } else {
        toast.success(userDetails.message)
        setUser(userDetails);
        navigate(-1)
      }
    }else{
      const { user, message } = await loginUser(email, password);
      if (message) {
        toast.info(message);
      } else {
        toast.success("Logged in successfully!!")
        setUser(user);
        navigate(-1);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">     
    <Navbar /> 
      <div className="flex-grow flex items-center justify-center py-32 mt-10">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
            {isSignup && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="Name" 
                    required 
                    placeholder="Enter your full name" 
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    id="dob" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="nationality" className="block text-gray-700 font-medium mb-2">Nationality</label>
                  <input 
                    type="text" 
                    id="nationality" 
                    placeholder="Enter your nationality" 
                    value={nationality}
                    onChange={(e) => setnationality(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="idNumber" className="block text-gray-700 font-medium mb-2">National ID Number</label>
                  <input 
                    type="text" 
                    id="idNumber" 
                    placeholder="Enter your ID number" 
                    value={cnic}
                    maxLength={13}
                    onChange={(e) => setcnicNo(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  </div>
                <div>
                  <label htmlFor="passport" className="block text-gray-700 font-medium mb-2">Passport Number</label>
                  <input 
                    type="text" 
                    id="passport" 
                    placeholder="Enter your passport number" 
                    value={passportNo}
                    required
                    maxLength={9}
                    onChange={(e) => setPassportNo(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="passportScan" className="block text-gray-700 font-medium mb-2">Passport Scan</label>
                  <input 
                    type="file" 
                    id="passportScan" 
                    accept="image/*" 
                    required
                    name="passportScan"
                    onChange={(e) => setPassportImg(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>   
                <div>
                  <label htmlFor="idScan" className="block text-gray-700 font-medium mb-2">National ID Scan</label>
                  <input 
                    type="file" 
                    id="idScan" 
                    required
                    accept="image/*" 
                    onChange={(e) => setIdImg(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
          
              </>
            )}
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                required
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-full font-medium text-lg hover:opacity-90 transition-opacity"
            >{isLoading && (
              <svg className="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsSignup(!isSignup)} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >  {window.scrollTo({ top: 0, behavior: "smooth" }) }
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginSignup;