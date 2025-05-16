import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../context/parvaaz";
import { useNavigate } from "react-router-dom";
import { updateImg, updateUser } from "../utils/sendData";
import BookingCard from "../components/bookingCard";
import { getBookingHistory } from "../utils/getData";
import { toast } from "react-toastify";
function UserProfile() {
  const navigate = useNavigate();
  const { user, setUser,bookingHistory,setbookingHistory,bookedAnchor} = useApp();
  const [activeTab,setActiveTab]=useState(bookedAnchor? "bookings":"profile")
  const [loading, setLoading] = useState(true);
  const passportInputRef = useRef(null);
  const idCardInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [idCardPreviewImage, setIdCardPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    nationality: "",
    passportNumber: "",
    dateOfBirth: "",
    phoneNumber: "",
    idNumber: "",
    passportImg: null,
  });

 
  useEffect(() => {
    const fetchHistory=async()=>{
      const data=await getBookingHistory()
      if(data.message){
        toast.warn(data.message)
      }
      console.log(data)
      if (Array.isArray(data)) {
        setbookingHistory(data);
      }
    }
    if (user) {
      setFormData({
        id: user.id,
        displayName: user.fname + " " + user.lname || "-",
        email: user.email || "-",
        idNumber: user.cnicNo || "-",
        nationality: user.nationality || "-",
        passportNumber: user.passport_no || "-",
        dateOfBirth: user.DOB?.slice(0, 10) || "",
        phoneNumber: user.phoneNo || "-",
        passportImg: user.passportImg || null,
        idCardImg: user.cnicImg || null,
      });
      // Set preview images if they exist
      if (user.passportImg) {
        setPreviewImage(user.passportImg);
      }

      if (user.cnicImg) {
        setIdCardPreviewImage(user.cnicImg);
      }
      fetchHistory()
           
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        if (JSON.stringify(formData) !== JSON.stringify(user)) {
          const data = await updateUser(formData);
          if (data.message==="Something went wrong please try later") {
            toast.warn(data.message);
            console.log(data.message);
          }
          if (data.user) {
            setUser(data.user);
            toast.success("Profile updated successfully!");
          }
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.warn("Something Went wrong updating user profile")
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("authtoken");
    setUser(null);
    setFormData(null);
    navigate("/", { replace: true });
  };

  // Handle passport file input click without redirect
  const handlePassportButtonClick = (e) => {
    e.preventDefault(); // Prevent default button behavior
    passportInputRef.current.click();
  };

  // Handle ID card file input click without redirect
  const handleIdCardButtonClick = (e) => {
    e.preventDefault(); // Prevent default button behavior
    idCardInputRef.current.click();
  };

  // Handle passport file selection
  const handlePassportFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setFormData({
          ...formData,
          passportImg: file, // In a real app, this would be the URL after upload
        });
        const msg = await updateImg("passport", file);
        if (msg.success) {
          toast.success(msg.success);
        }
      }
    } catch (err) {
      console.log(err);
      toast.warn(err.message);
    }
  };

  // Handle ID card file selection
  const handleIdCardFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setIdCardPreviewImage(previewUrl);

        setFormData({
          ...formData,
          idCardImg: file, // In a real app, this would be the URL after upload
        });
        const msg = await updateImg("cnic", file);
        if (msg.success) {
          toast.success(msg.success);
        }
      }
    } catch (err) {
      console.log(err);
      toast.warn(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[95vh] bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">
              Please Sign In
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              You need to be logged in to view your profile
            </p>
            <Link
              to="/login"
              className="block w-full py-3 px-4 bg-blue-600 text-white rounded-md text-center font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-10 mt-20">
        <div className="container mx-auto px-4 mb-20">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                  {formData.displayName && formData.displayName !== "-"
                    ? formData.displayName.charAt(0).toUpperCase()
                    : formData.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {formData.displayName !== "-"
                      ? formData.displayName
                      : "Traveler"}
                  </h2>
                  <p className="text-blue-100">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition"
              >
                Sign Out
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === "profile"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  My Profile
                </button>
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === "bookings"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("bookings")}
                >
                  My Bookings
                </button>
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === "documents"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("documents")}
                >
                  My Documents
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {activeTab === "profile" && (
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nationality
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        ID Number
                      </label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    My Booking History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Booking ID
                          </th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Route
                          </th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Date
                          </th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Airline
                          </th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Status
                          </th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Price
                          </th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                      {Array.isArray(bookingHistory) &&
                         bookingHistory?.map((booking) => (
                         <BookingCard key={booking.booking_id} booking={booking} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Travel Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium mb-3">Passport</h4>
                      <div
                        className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] bg-cover bg-center relative"
                        style={
                          previewImage
                            ? { backgroundImage: `url(${previewImage})` }
                            : {}
                        }
                      >
                        {!previewImage && (
                          <>
                            <svg
                              className="w-12 h-12 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <p className="text-gray-500 text-center mb-4">
                              No passport image uploaded
                            </p>
                          </>
                        )}

                        <div className="mt-3">
                          <button
                            onClick={handlePassportButtonClick}
                            className={`py-2 px-4 rounded font-medium shadow-lg ${
                              previewImage
                                ? "bg-gray-300 text-black"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {previewImage
                              ? "Change Passport Image"
                              : "Upload Passport Image"}
                          </button>
                        </div>

                        {/* Hidden file input for passport image */}
                        <input
                          type="file"
                          ref={passportInputRef}
                          onChange={handlePassportFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium mb-3">ID Card</h4>
                      <div
                        className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] bg-cover bg-center relative"
                        style={
                          idCardPreviewImage
                            ? { backgroundImage: `url(${idCardPreviewImage})` }
                            : {}
                        }
                      >
                        {!idCardPreviewImage && (
                          <>
                            <svg
                              className="w-12 h-12 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                              ></path>
                            </svg>
                            <p className="text-gray-500 text-center mb-4">
                              No ID card uploaded
                            </p>
                          </>
                        )}

                        <div className="mt-3">
                          <button
                            onClick={handleIdCardButtonClick}
                            className={`py-2 px-4 rounded font-medium shadow-lg ${
                              idCardPreviewImage
                                ? "bg-gray-300 text-black"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {idCardPreviewImage
                              ? "Change ID Card"
                              : "Upload ID Card"}
                          </button>
                        </div>

                        {/* Hidden file input for ID card image */}
                        <input
                          type="file"
                          ref={idCardInputRef}
                          onChange={handleIdCardFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default UserProfile;
