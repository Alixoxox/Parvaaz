import React, { useEffect } from 'react'
import { useState } from 'react';
import { EnterPassenger, RemovePassenger, ShowUsers } from '../../utils/admin_stuff';
const Passengers = () => {
    const [passengers, setPassengers] = useState([]);
    useEffect(()=>{
        setTimeout(async()=>{
            const data= await ShowUsers()   //display users
            console.log(data)
            setPassengers(data)
        },20)
    },[])
    const [error, setError] = useState('');
    
    const [newPassenger, setNewPassenger] = useState({ name: '', email: '', password: '', passport: '', nationality: '', dob:'', cnicNo:'' });
      const handleAddPassenger = async(e) => {
        e.preventDefault();
        if (newPassenger.name.trim()?.split(" ").length<2) {
          setError('Full Name is required.');
          return;
        }
        const[fname,lname]=newPassenger.name.trim()?.split(" ")
        await EnterPassenger(fname,lname,newPassenger.email,newPassenger.password,newPassenger.passport,newPassenger.nationality,newPassenger.dob,newPassenger.cnicNo)
        const newId = passengers.length + 1;
        setPassengers([...passengers, { id: newId, ...newPassenger }]);
        setNewPassenger({ name: '', email: '', password: '', passport: '', nationality: '' });
        setError('');
      };
    //   const handleUpdatePassenger = (id, updatedPassenger) => {
    //     setPassengers(passengers.map(p => (p.id === id ? { ...p, ...updatedPassenger } : p)));
    //   };
    
      const handleDeletePassenger = async(id) => {
        const reply=await RemovePassenger(id)
        if(reply.message==='Passenger Deleted successfully'){
            setPassengers(passengers.filter(p => p.id !== id));
        }else{
            setError(reply.message)
        }
      };
    
  return (
    <div>
        { error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

                <h2 className="text-3xl font-bold mb-6">Passengers</h2>
                <form onSubmit={handleAddPassenger} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newPassenger.name}
                      onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newPassenger.email}
                      onChange={(e) => setNewPassenger({ ...newPassenger, email: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newPassenger.password}
                      onChange={(e) => setNewPassenger({ ...newPassenger, password: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Passport"
                      value={newPassenger.passport}
                      maxLength={9}
                      onChange={(e) => setNewPassenger({ ...newPassenger, passport: e.target.value })}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Nationality"
                      value={newPassenger.nationality}
                      onChange={(e) => setNewPassenger({ ...newPassenger, nationality: e.target.value })}
                      className="input"
                    />
                  </div>
                  <button type="submit" className="btn-primary mt-4">Add Passenger</button>
                </form>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                  <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-6 py-3 text-gray-700 font-medium">ID</th>
                    <th className="px-6 py-3 text-gray-700 font-medium">Name</th>
                    <th className="px-6 py-3 text-gray-700 font-medium">Email</th>
                    <th className="px-6 py-3 text-gray-700 font-medium">Passport</th>
                    <th className="px-6 py-3 text-gray-700 font-medium">Nationality</th>
                    <th className="px-6 py-3 text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                    <tbody>
                      {passengers.map(passenger => (
                        <tr key={passenger.id} className="border-b ">
                          <td className="px-6 py-4">{passenger.id}</td>
                          <td className="px-6 py-4">{passenger.fname&&passenger.lname ?( passenger.fname+" "+passenger.lname):passenger.name}</td>
                          <td className="px-6 py-4">{passenger.email}</td>
                          <td className="px-6 py-4">{passenger.passport_no|| passenger.passport}</td>
                          <td className="px-6 py-4">{passenger.nationality||"Null"}</td>
                          <td className="px-6 py-4">
                            {/* <button
                              onClick={() => {
                                const updated = prompt('Enter new name:', passenger.name);
                                if (updated) handleUpdatePassenger(passenger.id, { name: updated });
                              }}
                              className="text-blue-600 hover:underline mr-2"
                            >
                              Edit
                            </button> */}
                            <button
                              onClick={() => handleDeletePassenger(passenger.id)}
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

export default Passengers
