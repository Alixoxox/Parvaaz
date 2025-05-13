import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/parvaaz';
import { loginadmin } from '../utils/admin_stuff.js';

const AdminLogin = () => {
  const navigate = useNavigate();
  const {setAdmin}=useApp()
  const [admincred,setadmincred]=useState({username:"",password:""})
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate authentication (replace with actual auth logic)
    setTimeout(async() => {
      if (admincred.username === 'admin' && admincred.password === 'admin123') {
        const data=await loginadmin(admincred.username,admincred.password)
        if(data.user){
          setAdmin(admincred)
          navigate('/admin-dashboard');
        }else{
          setError(data.message)
        }
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 200);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Admin Portal</h2>
            <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={admincred.username}
                  onChange={({ target: { name, value } }) =>
                    setadmincred((prev) => ({ ...prev, [name]: value }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
                
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={admincred.password}
                  onChange={({ target: { name, value } }) =>
                    setadmincred((prev) => ({ ...prev, [name]: value }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;