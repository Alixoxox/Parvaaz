import React, { useEffect } from 'react'
import { useState } from 'react';
import { EnterPassenger, RemovePassenger, ShowUsers } from '../../utils/admin_stuff';
import { toast } from 'react-toastify';
const Passengers = () => {
    const [passengers, setPassengers] = useState([]);
    useEffect(()=>{
      (async () => {
        const data = await ShowUsers();
        setPassengers(data);
      })();
    },[])
    
    const [newPassenger, setNewPassenger] = useState({ name: '', email: '', password: '', passport: '', nationality: '', dob:'', cnicNo:'' });
      const handleAddPassenger = async(e) => {
        e.preventDefault();
        if (newPassenger.name.trim()?.split(" ").length<2) {
          toast.warn('Full Name is required.');
          return;
        }
        const[fname,lname]=newPassenger.name.trim()?.split(" ")
        await EnterPassenger(fname,lname,newPassenger.email,newPassenger.password,newPassenger.passport,newPassenger.nationality,newPassenger.dob,newPassenger.cnicNo)
        toast.success("Passenger added successfully!")
        const updatedList = await ShowUsers();
        setPassengers(updatedList);
        setNewPassenger({ name: '', email: '', password: '', passport: '', nationality: '' });
      };
    //   const handleUpdatePassenger = (id, updatedPassenger) => {
    //     setPassengers(passengers.map(p => (p.id === id ? { ...p, ...updatedPassenger } : p)));
    //   };
    
      const handleDeletePassenger = async(id) => {
        const reply=await RemovePassenger(id)
        if(reply.message==='Passenger Deleted successfully'){
          toast.success(reply.message)
          const data=await ShowUsers()
          setPassengers(data);
        }else{
            toast.warn(reply.message)
        }
      };
    
  return (
    <div>
                <h2 className="text-3xl font-bold mb-6">Registered Users</h2>
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
                    <th className="px-6 py-3 text-gray-700 font-medium">Action</th>
                  </tr>
                </thead>
                    <tbody>
                      {Array.isArray(passengers) && passengers.length>0 ?( passengers.map(passenger => (
                        <tr key={passenger.id} className="border-b ">
                          <td className="px-6 py-4">{passenger.id}</td>
                          <td className="px-6 py-4 capitalize">{passenger.fname&&passenger.lname ?( passenger.fname+" "+passenger.lname):passenger.name}</td>
                          <td className="px-6 py-4">{passenger.email}</td>
                          <td className="px-6 py-4">{passenger.passport_no|| passenger.passport}</td>
                          <td className="px-6 py-4 capitalize">{passenger.nationality||"Null"}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeletePassenger(passenger.id)}
                              className="text-red-600 hover:underline "
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
                      ))):(
                        <tr>
                        <td colSpan="8" className="px-6 py-4 text-center">No Users found</td>
                      </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
  )
}

export default Passengers