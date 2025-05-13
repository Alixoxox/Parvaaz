import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/material_blue.css";
import { createFlightRoute, ShowRoutes } from "../../utils/admin_stuff.js";
const Routes = () => {
  const [error, setError] = useState("");
  const [flights, setFlights] = useState([]);
  useEffect(()=>{
    setTimeout(async()=>{
      const data=await ShowRoutes()
      if(data.message){
        setError(data.message)
      }else{
        setFlights(data)
      }
    },20)
  },[])
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    flight_date: "",
    departure_time: "",
    arrival_time: "",
    stops: "",
    cost_eco: "",
    cost_pre_eco: "",
    cost_buis: "",
    cost_first_class: "",
    economy_seats: "",
    premium_economy_seats: "",
    business_seats: "",
    first_class_seats: "",
  });

  

  const handleAddFlight = (e) => {
    e.preventDefault();
    setTimeout(async()=>{
    const data=await createFlightRoute(newFlight.flightNumber,newFlight.origin,newFlight.destination,newFlight.flight_date,newFlight.departure_time,newFlight.arrival_time, newFlight.cost_eco, newFlight.cost_pre_eco, newFlight.cost_buis, newFlight.cost_first_class, newFlight.economy_seats,newFlight.premium_economy_seats,newFlight.business_seats, newFlight.first_class_seats , newFlight.stops)
      setError(data?.message)
  },20)
    const newId = flights.length + 1;
    setFlights([...flights, { id: newId, ...newFlight }]);
    setNewFlight({
      flightNumber: "",
      origin: "",
      destination: "",
      flight_date: "",
      departure_time: "",
      arrival_time: "",
      stops: "",
      cost_eco: "",
      cost_pre_eco: "",
      cost_buis: "",
      cost_first_class: "",
      economy_seats: "",
      premium_economy_seats: "",
      business_seats: "",
      first_class_seats: "",
    });
    setError("");
  };

  const handleUpdateFlight = (id, updatedFlight) => {
    setFlights(
      flights.map((f) => (f.id === id ? { ...f, ...updatedFlight } : f))
    );
  };

  const handleDeleteFlight = (id) => {
    setFlights(flights.filter((f) => f.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Flight Routes</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      <form
        onSubmit={handleAddFlight}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Flight Number"
            value={newFlight.flightNumber}
            onChange={(e) =>
              setNewFlight({ ...newFlight, flightNumber: e.target.value })
            }
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Origin"
            value={newFlight.origin}
            onChange={(e) =>
              setNewFlight({ ...newFlight, origin: e.target.value })
            }
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={newFlight.destination}
            onChange={(e) =>
              setNewFlight({ ...newFlight, destination: e.target.value })
            }
            className="input"
            required
          />
          {/* Flight Date */}
          <Flatpickr
            placeholder="Select date"
            options={{ dateFormat: "Y-m-d", allowInput: true }}
            value={newFlight.flight_date}
            onChange={([d]) =>
              setNewFlight((f) => ({
                ...f,
                flight_date: d.toISOString().slice(0, 10),
              }))
            }
            className="w-full cursor-pointer border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <Flatpickr
            placeholder="Departs (HH:mm:ss)"
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "H:i:S",     
              time_24hr: true,
              allowInput: true,
              enableSeconds: true
            }}
            value={newFlight.departure_time}
            onChange={([d]) =>
              setNewFlight((f) => ({
                ...f,
                departure_time: d.toTimeString().slice(0,  8),
              }))
            }
            className="w-full cursor-pointer border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
          />

          <Flatpickr
            placeholder="Arrives (HH:mm:ss)"
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "H:i:S",     
              time_24hr: true,
              allowInput: true,
              enableSeconds: true
            }}
            value={newFlight.arrival_time}
            onChange={([d]) =>
              setNewFlight((f) => ({
                ...f,
                arrival_time: d.toTimeString().slice(0,  8),
              }))
            }
            className="w-full  cursor-pointer border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="number"
            placeholder="Economy Cost"
            value={newFlight.cost_eco}
            min="0"
            onChange={(e) =>
              setNewFlight({ ...newFlight, cost_eco: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="Premium Economy Cost"
            value={newFlight.cost_pre_eco}
            onChange={(e) =>
              setNewFlight({ ...newFlight, cost_pre_eco: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="Business Cost"
            value={newFlight.cost_buis}
            onChange={(e) =>
              setNewFlight({ ...newFlight, cost_buis: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="First Class Cost"
            value={newFlight.cost_first_class}
            onChange={(e) =>
              setNewFlight({ ...newFlight, cost_first_class: e.target.value })
            }
            className="input"
          />

          <input
            type="number"
            min="0"
            placeholder="Economy Seats"
            value={newFlight.economy_seats}
            onChange={(e) =>
              setNewFlight({ ...newFlight, economy_seats: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="Premium Eco Seats"
            value={newFlight.premium_economy_seats}
            onChange={(e) =>
              setNewFlight({
                ...newFlight,
                premium_economy_seats: e.target.value,
              })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="Business Seats"
            value={newFlight.business_seats}
            onChange={(e) =>
              setNewFlight({ ...newFlight, business_seats: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="First Class Seats"
            value={newFlight.first_class_seats}
            onChange={(e) =>
              setNewFlight({ ...newFlight, first_class_seats: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            min="0"
            placeholder="Stops"
            value={newFlight.stops}
            onChange={(e) =>
              setNewFlight({ ...newFlight, stops: e.target.value })
            }
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary mt-5">
          Add Flight Route
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 ">ID</th>
              <th className="px-3 py-3 ">Flight No.</th>
              <th className="px-3 py-3 ">Origin</th>
              <th className="px-3 py-3 ">Dest</th>
              <th className="px-3 py-3 ">Date</th>
              <th className="px-3 py-3 ">Departs</th>
              <th className="px-3 py-3 ">Arrives</th>
              <th className="px-3 py-3 ">Stops</th>
              <th className="px-3 py-3 ">Eco Cost</th>
              <th className="px-3 py-3 ">Pre-Eco Cost</th>
              <th className="px-3 py-3 ">Business Cost</th>
              <th className="px-3 py-3 ">First Cost</th>
              <th className="px-3 py-3 ">Eco Seats</th>
              <th className="px-3 py-3 ">Pre-Eco Seats</th>
              <th className="px-3 py-3 ">Business Seats</th>
              <th className="px-3 py-3 ">First Seats</th>
              <th className="px-3 py-3 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} className="border-b text-center">
                <td className="px-3 py-4">{f.id}</td>
                <td className="px-3 py-4">{f.flightNumber}</td>
                <td className="px-3 py-4">{f.origin}</td>
                <td className="px-3 py-4">{f.destination}</td>
                <td className="px-3 py-4">{f.flight_date.slice(0,10)}</td>
                <td className="px-3 py-4">{f.departure_time}</td>
                <td className="px-3 py-4">{f.arrival_time}</td>
                <td className="px-3 py-4">{f.stops}</td>
                <td className="px-3 py-4">${f.cost_eco}</td>
                <td className="px-3 py-4">${f.cost_pre_eco}</td>
                <td className="px-3 py-4">${f.cost_buis}</td>
                <td className="px-3 py-4">${f.cost_first_class}</td>
                <td className="px-3 py-4">{f.economy_seats}</td>
                <td className="px-3 py-4">{f.premium_economy_seats}</td>
                <td className="px-3 py-4">{f.business_seats}</td>
                <td className="px-3 py-4">{f.first_class_seats}</td>
                <td className="px-3 py-4">
                  {/* <button
                    onClick={() => {
                      const updated = prompt("New flight no:", f.flightNumber);
                      if (updated)
                        handleUpdateFlight(f.id, { flightNumber: updated });
                    }}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDeleteFlight(f.id)}
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
  );
};

export default Routes;
