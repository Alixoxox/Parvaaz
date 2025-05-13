import React,{ useEffect, useState } from "react";
import { CreateBooking, DeleteBooked, ShowBookings } from "../../utils/admin_stuff";

const Booking = () => {
     // Booking Handlers
      const [newBooking, setNewBooking] = useState({ user_id: '', flight_code: '', origin: '', destination: '', flight_date: '', cabin_class: 'economy' });
         const [bookings, setBookings] = useState([]);
         const [error,setError]=useState('')
         useEffect(()=>{
            setTimeout(async()=>{
                const data=await ShowBookings()
                setBookings(data)
            },20)
         },[])
    
      const handleDeleteBooking = async(id) => {
        const msg=await DeleteBooked(id);
        if(msg.message==="Booking cancelled successfully"){
            setBookings(bookings.filter(b => b.id !== id));
        }else{
            setError(msg.message)
        }
      };
      const handleAddBooking = async(e) => {
        e.preventDefault();
        if (!newBooking.user_id || !newBooking.flight_date) {
          setError('Passenger ID and flight number are required.');
          return;
        }
        const response=await CreateBooking(newBooking.user_id, newBooking.origin, newBooking.destination, newBooking.flight_code, newBooking.flight_date, newBooking.cabin_class )
        if(response.message==='Booking successful'){
            setBookings([...bookings, { id: response.bookingId, ...newBooking }]);
            setNewBooking({ user_id: '', flight_code: '', origin: '', destination: '', flight_date: '', cabin_class: 'economy' });
            setError('');
        }else{
            setError(response.message)
        }
      };
  return (
    <div>        { error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

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
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">ID</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">Passenger ID</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">Flight Number</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">Route</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">Seat No</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">Date</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">cabin_class</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id} className="border-b">
                          <td className="px-6 py-4">{booking.id}</td>
                          <td className="px-6 py-4">{booking.user_id}</td>
                          <td className="px-6 py-4">{booking.flight_code}</td>
                          <td className="px-6 py-4">{booking.origin +"->"+booking.destination}</td>
                          <td className="px-6 py-4">{booking.seat_no}</td>
                          <td className="px-6 py-4">{booking.flight_date.slice(0,10)}</td>
                          <td className="px-6 py-4">{booking.cabin_class}</td>
                          <td className="px-6 py-4">
                            {/* <button
                              onClick={() => {
                                const updated = prompt('Enter new status:', booking.status);
                                if (updated) handleUpdateBooking(booking.id, { status: updated });
                              }}
                              className="text-blue-600 hover:underline mr-2"
                            >
                              Edit
                            </button> */}
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
  )
}

export default Booking
