import React, { useEffect, useState } from 'react';
import { CreateAirline, RemoveAirline, ShowAirlines } from '../../utils/admin_stuff.js';
import { toast } from 'react-toastify';

const Airlines = () => {
  const [airlines, setAirlines] = useState([])
  const [newAirline, setNewAirline] = useState({
    airline_code: '',
    name: '',
    country: '',
    contact: '',
    info:""
  });
  useEffect(() => {
    const fetchData = async () => {
      const data = await ShowAirlines();
      setAirlines(data);
    };
    fetchData();
  }, []); 

const handleAddAirline = async (e) => {
  e.preventDefault();
  const data = await CreateAirline(newAirline.airline_code, newAirline.name, newAirline.country, newAirline.contact, newAirline.info);
  toast.success(data?.message)
  setNewAirline({
    airline_code: '',
    name: '',
    country: '',
    contact: '',
    info: ''
  });
  const details=await ShowAirlines()
  setAirlines(details);
};
const handleDeleteAirline = async (id) => {
    const reply=await RemoveAirline(id);
    if(reply.message==='Airline Deleted successfully'){
      toast.success(reply.message)
      setAirlines(airlines.filter(a => a.id !== id));
    }else{
      toast.warn(reply.message)
    }
  
};
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Airlines</h2>
      <form onSubmit={handleAddAirline} className="rounded-lg shadow-md  bg-white p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Airline Code"
          value={newAirline.airline_code}
          onChange={(e) => setNewAirline({ ...newAirline, airline_code: e.target.value.toUpperCase() })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={newAirline.name||""}
          onChange={(e) => setNewAirline({ ...newAirline, name: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={newAirline.country||""}
          onChange={(e) => setNewAirline({ ...newAirline, country: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={newAirline.contact||""}
          onChange={(e) => setNewAirline({ ...newAirline, contact: e.target.value })}
          className="input"
       
        />
          <input
          type="text"
          placeholder="General Info About the Airline"
          value={newAirline.info ||""}
          onChange={(e) => setNewAirline({ ...newAirline, info: e.target.value })}
          className="input col-span-full"
         
        />
        <button type="submit" className="btn-primary mt-4">Add Airline</button>      </form>

      <table className="w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Contact</th>
            <th className="px-4 py-2">Info</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(airlines) && airlines.length>0 ?(airlines.map((airline) => (
            <tr key={airline.id} className="border-b text-center">
              <td className="px-4 py-2">{airline.airline_code}</td>
              <td className="px-4 py-2 capitalize">{airline.name}</td>
              <td className="px-4 py-2 capitalize">{airline.country}</td>
              <td className="px-4 py-2">{airline.contact||"Null"}</td>
              <td className="px-4 py-2">{airline.info||"Null"}</td>
              <td className="px-4 py-2">
              <button
                  onClick={() => handleDeleteAirline(airline.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
              
            </tr>
          ))):( <tr>
            <td colSpan="8" className="px-6 py-4 text-center">No airlines found</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
};

export default Airlines;
