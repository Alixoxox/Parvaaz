// src/services/flightService.js
import { toIata } from './aviationstack';

export const searchFlights = async (from, to, date,cabinClass,passengers) => {
  try{
      const source=await toIata(from)
      const destination=await toIata(to)
      console.log(source)
      console.log(destination)
      const response = await fetch("http://localhost:5000/api/data/flights/show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source,destination ,date,cabinClass,passengers})
    });
    if (!response.ok) {
      throw new Error("Failed to verify user info")
    }
    const data = await response.json()
    
    return data
} catch (err) {
  console.log(err);
}
};
export const bookFlight = async (schedule_id, flight_id, tripType, returnDate, fromCity, toCity, cabin_class, passengers) => {
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
      schedule_id, flight_id, tripType, returnDate, fromCity, toCity, cabin_class, passengers
    });
    
    if (tripType === "roundtrip") {
      response = await fetch("http://localhost:5000/api/users/booking/new/roundtrip", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${cleaned_token}` 
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
          'Authorization': `Bearer ${cleaned_token}` 
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
    console.log("Booking response:", data);
    
    if (data.message) {
      return { message: data.message, bookingIds: data.bookingIds ,seats:data.seats };
    }
    if(tripType==='roundtrip'){
      return { message: data.message, trip:"roud",   outbound: { seats: outSeats, bookingIds: outBookingIds }, inbound: { seats: inSeats,  bookingIds: inBookingIds }}
    }
    return {message:data.error, bookingIds: data.bookingIds,seats:data.seats };
    
  } catch (err) {
    console.log(err);
    return { message: "An error occurred during booking" };
  }
}