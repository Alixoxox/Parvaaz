import React, { useEffect, useState } from 'react';
import { createFlight, RemoveFlight, ShowFlights } from '../../utils/admin_stuff.js';
import { toast } from 'react-toastify';

const Flights = () => {

  const [flights, setFlights] = useState([]);
  useEffect(()=>{

    setTimeout(async()=>{
      const fdata=await ShowFlights()
      setFlights(fdata);
    },20)
  },[])

  const [newFlight, setNewFlight] = useState({
    airline_code: '',
    flight_code: '',
    total_seats: ''
  });

  const handleAddFlight = (e) => {
    e.preventDefault();
    setTimeout(async()=>{
      const create=await createFlight( newFlight.flight_code,newFlight.total_seats,newFlight.airline_code);
      if(create.message==="Airline Not Present please Create an Airline First"||create.message==="An error occurred. Please try again later."){
        toast.error(create.message)
      }else{
        toast.success(create?.message)
      }
      const newEntry = await ShowFlights()
      setFlights(newEntry);
    },20)
    setNewFlight({ airline_code: '', flight_code: '', total_seats: '' });
  };
 const handleDeleteFlight=async(id)=>{
  const reply=await RemoveFlight(id);
  if(reply.message==='Flight Deleted successfully'){
    toast.warn(reply.message)
    const data=await ShowFlights()
    setFlights(data)
  }else{
    toast.warn(reply.message)
  }
   }
     return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Add Flight</h2>
      <form
        onSubmit={handleAddFlight}
        className="mb-8 bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Airline Code"
          value={newFlight.airline_code}
          onChange={(e) => setNewFlight({ ...newFlight, airline_code: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Flight Code"
          value={newFlight.flight_code}
          onChange={(e) => setNewFlight({ ...newFlight, flight_code: e.target.value })}
          className="input"
          required
        />
        <input
          type="number"
          placeholder="Total Seats"
          value={newFlight.total_seats}
          onChange={(e) => setNewFlight({ ...newFlight, total_seats: e.target.value })}
          className="input"
          required
        />
   <button type="submit" className="btn-primary mt-4">Add Flight</button>      </form>

      <table className="w-full bg-white shadow-md rounded-lg justify-center text-center">
        <thead className="bg-gray-100">
          <tr>
          <th className="px-4 py-2">Id</th>
            <th className="px-4 py-2">Airline Code</th>
            <th className="px-4 py-2">Flight Code</th>
            <th className="px-4 py-2">Total Seats</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(flights) && flights.length>0 ?(flights.map((flight) => (
            <tr key={flight.id} className="border-b">
              <td className="px-4 py-2">{flight.id}</td>
              <td className="px-4 py-2">{flight.airline_code}</td>
              <td className="px-4 py-2">{flight.flight_code}</td>
              <td className="px-4 py-2">{flight.total_seats}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDeleteFlight(flight.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))):( <tr>
            <td colSpan="8" className="px-6 py-4 text-center">No Flights found</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
};

export default Flights;
