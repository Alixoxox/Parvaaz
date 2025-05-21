import React, { useState, useEffect } from 'react'
import { deleteInquiry, getAllInquiries, sendInquiry, updateInquiry } from '../../utils/contact';
import { toast } from 'react-toastify';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    (async () => {
      const x = await getAllInquiries();
      if (Array.isArray(x) && x.length > 0) {
        setInquiries(x);
      }
    })();
  }, []);
  
  const [newInquiry, setNewInquiry] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    status: "Open",
  });
  
  // Inquiry Handlers
  const handleAddInquiry =async (e) => {
    e.preventDefault();
    if (!newInquiry.name || !newInquiry.email) {
      toast.warn("Name and email are required.");
      return;
    }
    const x=await sendInquiry(newInquiry.name,newInquiry.email, newInquiry.subject, newInquiry.message)
    if(x.message=== 'Thanks for contacting us! Our support team has received your message and will be in touch soon.'){
        toast.success(x.message)
        const y=await getAllInquiries()
        setInquiries(y)

    setNewInquiry({
      name: "",
      email: "",
      subject: "",
      message: "",
      status: "Open",
    });
    }else{
        toast.warn(x.message)}
        toast.success("Successfully Added An Inquiry");
  };
  
  const handleUpdateInquiry = async (id, updatedInquiry) => {
    const x=await updateInquiry(id, updatedInquiry)
    if(x.message==='Inquiry updated!'){
      toast.success(x.message)
      const y=await getAllInquiries()
        setInquiries(y)
    }
    else{
      toast.warn(x.message)
    }
  };
  
  const handleDeleteInquiry =async (id) => {
    const x= await deleteInquiry(id)
    if(x.message==='Inquiry deleted!'){
      toast.success(x.message)
      const y=await getAllInquiries()
      setInquiries(y)
    }
    else{
      toast.warn(x.message)
    }
  };
  
  // Modal handlers
  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };
  
  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold mb-6">Inquiries</h2>
        <form
          onSubmit={handleAddInquiry}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newInquiry.name}
              onChange={(e) =>
                setNewInquiry({ ...newInquiry, name: e.target.value })
              }
              className="input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newInquiry.email}
              onChange={(e) =>
                setNewInquiry({ ...newInquiry, email: e.target.value })
              }
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={newInquiry.subject}
              onChange={(e) =>
                setNewInquiry({ ...newInquiry, subject: e.target.value })
              }
              className="input"
            />
            
            <input
              type="text"
              placeholder="message"
              value={newInquiry.message}
              onChange={(e) =>
                setNewInquiry({ ...newInquiry, message: e.target.value })
              }
              className="input col-span-full"
            />
          </div>
          <button type="submit" className="btn-primary mt-4">
            Add Inquiry
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Last Updated At
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(inquiries) && inquiries.length > 0 ? (inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>{inquiry.id}</td>
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>{inquiry.name}</td>
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>{inquiry.email}</td>
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>{inquiry.subject}</td>
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>{inquiry.created_at?.slice(0,10) || '—'}</td>
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>{inquiry.updated_at?.slice(0,10) || '—'}</td>
                  <td className="px-6 py-4" onClick={() => openModal(inquiry)}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inquiry.status.toLowerCase() === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        const updated = inquiry.status === "open" ? "closed" : "open";
                          handleUpdateInquiry(inquiry.id, {
                            status: updated,
                          });
                      }}
                      className="text-blue-600 hover:underline mr-2"
                    >
                     {inquiry.status.toLowerCase() === 'open' ? (
                      <img
                        src={process.env.PUBLIC_URL + '/images/check.png'}
                        alt="open"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <img
                        src={process.env.PUBLIC_URL + '/images/cross.png'}
                        alt="closed"
                        width={24}
                        height={24}
                      />
                    )}
                    </button>
                    <button
                      onClick={() => handleDeleteInquiry(inquiry.id)}
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
              ))) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">No Inquiries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal for viewing inquiry details */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Inquiry Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium">{selectedInquiry.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${
                  selectedInquiry.status.toLowerCase() === 'open' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {selectedInquiry.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedInquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedInquiry.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{selectedInquiry.created_at?.slice(0,10) || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Updated</p>
                <p className="font-medium">{selectedInquiry.updated_at?.slice(0,10) || '—'}</p>
                </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Subject</p>
              <p className="font-medium">{selectedInquiry.subject}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Message</p>
              <p className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                {selectedInquiry.message || "No message content available."}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  const updated = prompt("Enter new status:", selectedInquiry.status);
                  if (updated) {
                    handleUpdateInquiry(selectedInquiry.id, { status: updated });
                    setSelectedInquiry({...selectedInquiry, status: updated});
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Status
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inquiries