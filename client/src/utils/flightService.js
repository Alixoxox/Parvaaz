// src/services/flightService.js
import { getCityFromIATA, toIata } from './aviationstack';
export const searchFlights = async (fromCity, toCity, departDate, returnDate, cabinClass, passengers, tripType) => {
  try {
    const source = await toIata(fromCity);
    const destination = await toIata(toCity);
    const today = new Date().toISOString().split('T')[0];
    console.log(fromCity, toCity, departDate, returnDate, cabinClass, passengers, tripType)
    console.log(tripType)
    console.log(passengers)
    const payload = {
      source,
      destination,
      date: departDate || today,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      cabin_class: cabinClass,
      passengers,
      tripType
    };
    
    const res = await fetch('http://localhost:5000/api/data/flights/show', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    // Fixed extraction of flight data
    const outboundFlights = data.available_flights?.outbound || [];
    const returnFlights = tripType === 'roundtrip' ? (data.available_flights?.inbound || []) : [];
    
    return {
      outbound_flights: outboundFlights,
      return_flights: returnFlights,
      message: data.message
    };
  } catch (err) {
    console.error("Flight search error:", err);
    return {
      outbound_flights: [],
      return_flights: [],
      message: err.message || "Something went wrong"
    };
  }}
  export const bookFlight = async (schedule_id, flight_id, tripType, returnDate, FromCity, ToCity, cabin_class, passengers) => {
    try {
      if (tripType === 'roundtrip' && !returnDate) {
        alert('Please select a return date before confirming a round-trip booking.');
        return;
      }
      passengers = Number(passengers);
      if (isNaN(passengers) || passengers < 1) {
        return { message: "Invalid passenger count" };
      }
  
      const token = localStorage.getItem("authtoken");
      if (!token) {
        return { message: "You must be an active user" };
      }
  
      let cleaned_token = token.trim();
      // Remove quotes if they exist
      if (cleaned_token.startsWith('"') && cleaned_token.endsWith('"')) {
        cleaned_token = cleaned_token.slice(1, -1);
      }
  
      let response;
      
      console.log("Booking flight with parameters:", {
        schedule_id, flight_id, tripType, returnDate, FromCity, ToCity, cabin_class, passengers
      });
      let fromCity=await toIata(FromCity)
       let toCity=await toIata(ToCity)
      
      if (tripType === "roundtrip") {
        response = await fetch("http://localhost:5000/api/users/booking/new/roundtrip", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${cleaned_token}` // Fixed template literal syntax
          },
          body: JSON.stringify({ 
            schedule_id, 
            flight_id, 
            returnDate, 
            fromCity, 
            toCity, 
            cabin_class, 
            passengers: Number(passengers) 
          })
        });
      } else {
        response = await fetch("http://localhost:5000/api/users/booking/new/oneway", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${cleaned_token}` // Fixed template literal syntax
          },
          body: JSON.stringify({ 
            flight_id, 
            schedule_id, 
            cabin_class, 
            passengers: Number(passengers) 
          })
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking error:", errorData);
        return { message: errorData.message || "Failed to book flight" };
      }
      
      const data = await response.json();
      
      if(tripType === 'roundtrip') {
        // Fixed return structure to match backend response
        return { 
          message: data.message, 
          trip: "roundtrip",   
          outbound: { seats: data.outbound.seats, bookingIds: data.outbound.bookingIds }, 
          inbound: { seats: data.inbound.seats, bookingIds: data.inbound.bookingIds }
        };
      }
      if (data.message) {
        return { message: data.message, bookingIds: data.bookingIds, seats: data.seats };
      }
      
      return { message: data.error || "Booking successful", bookingIds: data.bookingIds, seats: data.seats };
      
    } catch (err) {
      console.error("Booking error:", err);
      return { message: "An error occurred during booking" };
    }
  }