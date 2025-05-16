import React, { useState } from 'react'

const Multicity = () => {
  // Define city data
  const cityCodes = {
    'Karachi': 'KHI',
    'Lahore': 'LHE',
    'Islamabad': 'ISB',
    'Dubai': 'DXB',
    'London': 'LHR',
    'New York': 'JFK'
  }

  // State for multi-city trips
  const [multiCity, setMultiCity] = useState([{ from: '', to: '', date: '' }])
  
  // State for search suggestions
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  
  // State to track which dropdown is visible and for which row
  const [activeDropdowns, setActiveDropdowns] = useState({
    from: null,
    to: null
  })

  // Handle city selection from dropdown
  const handleCitySelect = (field, city, index) => {
    const updated = [...multiCity]
    updated[index][field] = city
    setMultiCity(updated)
    
    // Close the dropdown
    setActiveDropdowns({
      ...activeDropdowns,
      [field]: null
    })
  }

  // Handle changes in multi-city inputs
  const handleMultiCityChange = (index, e) => {
    const { name, value } = e.target
    const updated = [...multiCity]
    updated[index] = { ...updated[index], [name]: value }
    setMultiCity(updated)

    // Update suggestions for city inputs
    if (name === 'from' || name === 'to') {
      const filtered = Object.keys(cityCodes).filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      
      if (name === 'from') {
        setFromSuggestions(filtered)
        // Show dropdown only for this specific row
        setActiveDropdowns({
          ...activeDropdowns,
          from: value.length > 0 && filtered.length > 0 ? index : null
        })
      } else if (name === 'to') {
        setToSuggestions(filtered)
        // Show dropdown only for this specific row
        setActiveDropdowns({
          ...activeDropdowns,
          to: value.length > 0 && filtered.length > 0 ? index : null
        })
      }
    }
  }

  // Add another city for multi-city trip
  const addMultiCity = () => {
    setMultiCity([...multiCity, { from: '', to: '', date: '' }])
  }

  // Remove a city (only if there's more than one)
  const removeMultiCity = (index) => {
    if (multiCity.length > 1) {
      const updated = [...multiCity]
      updated.splice(index, 1)
      setMultiCity(updated)
    }
  }

  return (
    <div className="space-y-6">
      {multiCity.map((city, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              name="from"
              value={city.from}
              onChange={(e) => handleMultiCityChange(index, e)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter departure city"
              required
            />
            {activeDropdowns.from === index && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {fromSuggestions.map(city => (
                  <li
                    key={city}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect('from', city, index)}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              name="to"
              value={city.to}
              onChange={(e) => handleMultiCityChange(index, e)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination city"
              required
            />
            {activeDropdowns.to === index && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {toSuggestions.map(city => (
                  <li
                    key={city}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect('to', city, index)}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={city.date}
              onChange={(e) => handleMultiCityChange(index, e)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeMultiCity(index)}
              className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
              aria-label="Remove city"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      
      <div className="mt-4">
        <button
          type="button"
          onClick={addMultiCity}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add City
        </button>
      </div>
    </div>
  )
}

export default Multicity