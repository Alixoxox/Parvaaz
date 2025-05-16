import { toIata } from "./aviationstack";

export const loginadmin = async (username, password) => {
    try {
      if (!username || !password) {
        return { message: "Enter both the required fields" };
      }
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({})); 
      if (!response.ok || !data.token || !data.user) {
        return { message: data.message || "Login failed. Try again." };
      }
      localStorage.setItem("admintoken", data.token);
      return { user: data.user }; // always return an object
    } catch (err) {
      console.error("Login error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };

  export const createAirline = async ( airline_code,airline_name,country,contact,info) => {
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
      if (!airline_code || !airline_name || !country) {
        return { message: "Enter the required fields" };
      }
      const response = await fetch("http://localhost:5000/api/create/airline", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } ,
             body: JSON.stringify({ airline_code,airline_name,country,contact,info})})
       
      
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return
        } catch (err) {
      console.error("Login error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };

  export const createFlight = async ( flight_code,total_seats,airline_code) => {
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
      if (!flight_code || !airline_code ) {
        return { message: "Enter the required fields" };
      }
      const response = await fetch("http://localhost:5000/api/admin/add/flight", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } ,
             body: JSON.stringify({ flight_code:flight_code.toUpperCase(),total_seats,airline_code:airline_code.toUpperCase()})})
      
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return {message:"Successfully updated Route"}
        } catch (err) {
      console.error("Login error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };

  export const ShowFlights = async()=>{
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
     
      const response = await fetch("http://localhost:5000/api/admin/show/flights", {
        method: "GET",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } 
            })
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return data
        } catch (err) {
      console.error("Login error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };

export const ShowAirlines = async()=>{
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
     
      const response = await fetch("http://localhost:5000/api/admin/show/airlines", {
        method: "GET",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } 
            })
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return data
        } catch (err) {
      console.error("Login error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };
  export const CreateAirline = async(airline_code, name, country, contact, info) => {
    try {
        console.log(airline_code, name, country, contact, info);
        const token = localStorage.getItem("admintoken");
        if(!token) {
            return {message: "You must be an active admin"};
        }
        
        if (!airline_code || !name || !country) {
            return {message: "Enter the required fields"};
        }

        const response = await fetch("http://localhost:5000/api/admin/create/airline", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}`
            },
            body: JSON.stringify({airline_code, name, country, contact, info})
        });
        const data = await response.json().catch(() => ({}));
        console.log("Server response:", data); // Added for debugging
        if (!response.ok) {
            return {message: data.message || "Something went wrong"};
        }
        
        return {message: data.message || "Operation completed"};
    } catch (err) {
        console.error("Operation error:", err);
        return {message: "An error occurred. Please try again later."};
    }
}

export const createFlightRoute = async(flight_code,origin,destination,departure_date,departure_time,arrival_time, cost_eco, cost_pre_eco, cost_buis, cost_first_class, economy_seats,premium_economy_seats,business_seats, first_class_seats ,  stops) => {
    try {
        const token = localStorage.getItem("admintoken");
        if(!token) {
            return {message: "You must be an active admin"};
        }
        
        if (!flight_code || !departure_date || !departure_time ||!arrival_time ||!origin||!destination) {
            return {message: "Enter the required fields"};
        }
        let orgin_iata=await toIata(origin)
        if(!orgin_iata){
            orgin_iata=origin.trim()
        }
        let dest_iata=await toIata(destination)
        if(!dest_iata){
            dest_iata=destination.trim()
        }
                const response = await fetch("http://localhost:5000/api/admin/add/flight/schedule ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}`
            },
            body: JSON.stringify({flight_code:flight_code.toUpperCase(),origin:orgin_iata,destination:dest_iata,departure_date,departure_time,arrival_time, cost_eco, cost_pre_eco, cost_buis, cost_first_class, economy_seats,premium_economy_seats,business_seats, first_class_seats ,  stops})
        });
        const data = await response.json().catch(() => ({}));
        console.log("Server response:", data); // Added for debugging
        if (!response.ok) {
            return {message: data.message || "Something went wrong"};
        }
        
        return {message: data.message || "Operation completed"};
    } catch (err) {
        console.error("Operation error:", err);
        return {message: "An error occurred. Please try again later."};
    }
}
export const ShowRoutes = async()=>{
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
     
      const response = await fetch("http://localhost:5000/api/admin/show/flights/schedules", {
        method: "GET",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } 
            })
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return data
        } catch (err) {
      console.error("Route error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };

  export const ShowUsers = async()=>{
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
     
      const response = await fetch("http://localhost:5000/api/admin/show/users", {
        method: "GET",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } 
            })
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return data
        } catch (err) {
      console.error("User show error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };
  
  export const ShowBookings = async()=>{
    try {
        const token=localStorage.getItem("admintoken")
        if(!token){
            return {message:"You must be an active admin"}
        }
     
      const response = await fetch("http://localhost:5000/api/admin/show/bookings", {
        method: "GET",
        headers: { "Content-Type": "application/json", 
            'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` } 
            })
      const data = await response.json().catch(() => ({})); 
      if (!response.ok ) {
        return { message: data.message || "Something went wrong" };
      }
      return data
        } catch (err) {
      console.error("booking show error:", err);
      return { message: "An error occurred. Please try again later." };
    }
  };
  
  export const CreateBooking=async(user_id, origin, destination, flight_code, flight_date, cabin_class )=>{
    try {
      const token=localStorage.getItem("admintoken")
      if(!token){
          return {message:"You must be an active admin"}
      }
      let orgin_iata=await toIata(origin)
        if(!orgin_iata){
            orgin_iata=origin.trim()
        }
        let dest_iata=await toIata(destination)
        if(!dest_iata){
            dest_iata=destination.trim()
        }
   
    const response = await fetch("http://localhost:5000/api/admin/create/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", 
          'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
          body: JSON.stringify({user_id,flight_code:flight_code.toUpperCase(),origin:orgin_iata,destination:dest_iata,flight_date,cabin_class})
        })
    const data = await response.json().catch(() => ({})); 
    if (!response.ok ) {
      return { message: data.message || "Something went wrong" };
    }
    return data
      } catch (err) {
    console.error("booking create error:", err);
    return { message: "An error occurred. Please try again later." };
  }
};
export const DeleteBooked=async(bookingId)=>{
  try {
    const token=localStorage.getItem("admintoken")
    if(!token){
        return {message:"You must be an active admin"}
    } 
  const response = await fetch("http://localhost:5000/api/admin/delete/booked", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
        body: JSON.stringify({bookingId})
      })
  const data = await response.json().catch(() => ({})); 
  if (!response.ok ) {
    return { message: data.message || "Something went wrong" };
  }
  return {message:data.message}
    } catch (err) {
  console.error("booking create error:", err);
  return { message: "An error occurred. Please try again later." };
}
}



export const EnterPassenger=async(fname,lname,email,password,passport,nationality,dob,cnicNo)=>{
  const token = localStorage.getItem('admintoken');
  if (!token) {
    return { message: 'You must be an active admin' };
  }

  const form = new FormData();
  // Always append your text fields
  form.append('fname',       fname);
  form.append('lname',       lname);
  form.append('email',       email);
  form.append('password',    password);
  form.append('passport_no', passport);
  form.append('nationality', nationality);
  form.append('dob',         dob);
  form.append('cnicNo',      cnicNo);

  const response = await fetch('http://localhost:5000/api/users/signup', {
    method: 'POST',
    body: form
  });

  const data = await response.json();
  if (!response.ok) {
    return { message: data.message || 'Signup failed' };
  }
  return {message:"Successfully Added A Passenger"}; // { token, user }
};

export const RemovePassenger=async(userid)=>{
  try {
    const token=localStorage.getItem("admintoken")
    if(!token){
        return {message:"You must be an active admin"}
    } 
  const response = await fetch("http://localhost:5000/api/admin/delete/passenger", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
        body: JSON.stringify({userid})
      })
  const data = await response.json().catch(() => ({})); 
  if (!response.ok ) {
    return { message: data.message || "Something went wrong" };
  }
  return {message:data.message}
    } catch (err) {
  return { message: "An error occurred. Please try again later." };
}
}
export const RemoveAirline=async(airline_id)=>{
  try {
    const token=localStorage.getItem("admintoken")
    if(!token){
        return {message:"You must be an active admin"}
    } 
  const response = await fetch("http://localhost:5000/api/admin/delete/airline", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
        body: JSON.stringify({airline_id})
      })
  const data = await response.json().catch(() => ({})); 
  if (!response.ok ) {
    return { message: data.message || "Something went wrong" };
  }
  return {message:data.message}
    } catch (err) {
  return { message: "An error occurred. Please try again later." };
}
}

export const RemoveFlight =async(flight_id)=>{
  try {
    const token=localStorage.getItem("admintoken")
    if(!token){
        return {message:"You must be an active admin"}
    } 
  const response = await fetch("http://localhost:5000/api/admin/delete/flights", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
        body: JSON.stringify({flight_id})
      })
  const data = await response.json().catch(() => ({})); 
  if (!response.ok ) {
    return { message: data.message || "Something went wrong" };
  }
  return {message:data.message}
    } catch (err) {
  return { message: "An error occurred. Please try again later." };
}
}
export const RemoveRoute=async(route_id)=>{
  try {
    const token=localStorage.getItem("admintoken")
    if(!token){
        return {message:"You must be an active admin"}
    } 
  const response = await fetch("http://localhost:5000/api/admin/delete/route", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
        body: JSON.stringify({route_id})
      })
  const data = await response.json().catch(() => ({})); 
  if (!response.ok ) {
    return { message: data.message || "Something went wrong" };
  }
  return {message:data.message}
    } catch (err) {
  return { message: "An error occurred. Please try again later." };
}
}
export const ShowDashboard=async()=>{
  try {
    const token=localStorage.getItem("admintoken")
    if(!token){
        return {message:"You must be an active admin"}
    } 
  const response = await fetch("http://localhost:5000/api/admin/show/dashboard", {
    method: "GET",
    headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` }
        
      })
  const data = await response.json().catch(() => ({})); 
  if (!response.ok ) {
    return { message: data.message || "Something went wrong" };
  }
  return data
    } catch (err) {
  return { message: "An error occurred. Please try again later." };
}
}