import React, { useEffect, useState } from "react";
import { CreateBooking, DeleteBooked, ShowBookings } from "../../utils/admin_stuff";
import { toast } from "react-toastify";

const Booking = () => {
  // Booking Handlers
  const [newBooking, setNewBooking] = useState({ 
    user_id: '', 
    flight_code: '', 
    origin: '', 
    destination: '', 
    flight_date: '', 
    cabin_class: 'economy' 
  });
  
  // Initialize bookings as an empty array
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await ShowBookings();
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          toast.warn("No users Have Booked A flight yet!");
          setBookings([]); // Set to empty array as fallback
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDeleteBooking = async (id) => {
    try {
      const msg = await DeleteBooked(id);
      if (msg.message === "Booking cancelled successfully") {
        toast.success(msg.message);
        setBookings(bookings.filter(b => b.id !== id));
      } else {
        toast.warn(msg.message);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };
  
  const handleAddBooking = async (e) => {
    e.preventDefault();
    if (!newBooking.user_id || !newBooking.flight_date) {
      toast.warn('Passenger ID and flight number are required.');
      return;
    }
    
    try {
      const response = await CreateBooking(
        newBooking.user_id, 
        newBooking.origin, 
        newBooking.destination, 
        newBooking.flight_code, 
        newBooking.flight_date, 
        newBooking.cabin_class
      );
      
      if (response.message === 'Booking successful') {
        toast.success(response.message);
        setBookings([...bookings, { id: response.bookingId, ...newBooking }]);
        setNewBooking({ 
          user_id: '', 
          flight_code: '', 
          origin: '', 
          destination: '', 
          flight_date: '', 
          cabin_class: 'economy' 
        });
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      toast.error("Failed to add booking");
    }
  };

  return (
    <div>       
      <h2 className="text-3xl font-bold mb-6">Bookings</h2>
      <form onSubmit={handleAddBooking} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Passenger ID"
            value={newBooking.user_id}
            onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Flight Number"
            value={newBooking.flight_code}
            onChange={(e) => setNewBooking({ ...newBooking, flight_code: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="From City"
            value={newBooking.origin}
            onChange={(e) => setNewBooking({ ...newBooking, origin: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="To City"
            value={newBooking.destination}
            onChange={(e) => setNewBooking({ ...newBooking, destination: e.target.value })}
            className="input"
          />
          <input
            type="date"
            placeholder="Date"
            value={newBooking.flight_date}
            onChange={(e) => setNewBooking({ ...newBooking, flight_date: e.target.value })}
            className="input"
          />
          <select
            value={newBooking.cabin_class}
            onChange={(e) => setNewBooking({ ...newBooking, cabin_class: e.target.value })}
            className="input"
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="first">First Class</option>
            <option value="buisness">Business Class</option>
          </select>
        </div>
        <button type="submit" className="btn-primary mt-4">Add Booking</button>
      </form>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">Loading bookings...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">ID</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Passenger ID</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Flight Number</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Route</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Seat No</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Date</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Cabin Class</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map(booking => (
                  <tr key={booking.id} className="border-b">
                    <td className="px-6 py-4">{booking.id}</td>
                    <td className="px-6 py-4">{booking.user_id}</td>
                    <td className="px-6 py-4">{booking.flight_code}</td>
                    <td className="px-6 py-4">{booking.origin + "->" + booking.destination}</td>
                    <td className="px-6 py-4">{booking.seat_no}</td>
                    <td className="px-6 py-4">
                      {booking.flight_date && typeof booking.flight_date === 'string' 
                        ? booking.flight_date.slice(0, 10) 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 capitalize">{booking.cabin_class}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:underline"
                      >
                         <img
                    src={process.env.PUBLIC_URL + '/images/trash-bin.png'}
                    alt="Delete"
                    width={24}
                    height={24}
                  />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Booking;