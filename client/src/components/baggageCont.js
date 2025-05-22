import React from 'react';

// NEW: Baggage Modal Component - moved outside and accepting props
const BaggageModal = ({ 
  selectedBaggage, 
  setSelectedBaggage, 
  setShowBaggageModal, 
  baggageOptions,
  multiplier 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Extra Baggage</h3>
        <button 
          onClick={() => setShowBaggageModal(false)}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
  {/* Extra Checked Baggage */}
  <div>
    <h4 className="font-medium mb-3">Extra Checked Baggage</h4>
    <div className="space-y-2">
      <div 
        className={`border rounded-lg p-3 cursor-pointer ${
          selectedBaggage.checked === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={() => setSelectedBaggage(prev => ({ ...prev, checked: 0 }))}
      >
        <div className="flex justify-between items-center">
          <span>No extra checked baggage</span>
          <span className="text-green-600 font-medium">$0</span>
        </div>
      </div>

      {baggageOptions.checked.map((option, index) => (
        <div 
          key={index}
          className={`border rounded-lg p-3 cursor-pointer ${
            selectedBaggage.checked === index + 1 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedBaggage(prev => ({ 
            ...prev, 
            checked: prev.checked === index + 1 ? 0 : index + 1 
          }))}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">Extra {option.weight}</span>
            <span className="text-blue-600 font-semibold">
              ${option.price}
              {multiplier > 1 && <span className="text-xs text-gray-500 ml-1">each way</span>}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Optional Extra Cabin Baggage */}
  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
    <h4 className="font-medium text-gray-700">Cabin Baggage</h4>
    <p className="text-sm text-gray-600">
      7kg cabin baggage is included for all passengers.
    </p>
    <div 
      className={`border rounded-lg p-3 cursor-pointer flex justify-between items-center ${
        selectedBaggage.cabin ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedBaggage(prev => ({ 
        ...prev, 
        cabin: !prev.cabin 
      }))}
    >
      <span className="font-medium">Add Extra 7kg Cabin Baggage</span>
      <span className="text-blue-600 font-semibold">
        ${189}
        {multiplier > 1 && <span className="text-xs text-gray-500 ml-1">each way</span>}
      </span>
    </div>
  </div>
</div>

      <div className="mt-6 flex gap-3">
        <button 
          onClick={() => setShowBaggageModal(false)}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={() => setShowBaggageModal(false)}
          className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg"
        >
          Add Baggage
        </button>
      </div>
    </div>
  </div>
);

export default BaggageModal