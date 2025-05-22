export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      return { message: "Enter both the required fields" };
    }
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({})); 
    if (!response.ok || !data.token || !data.user) {
      return { message: data.message || "Login failed. Try again." };
    }
    localStorage.setItem("authtoken", data.token);
    return { user: data.user }; // always return an object
  } catch (err) {
    console.error("Login error:", err);
    return { message: "An error occurred. Please try again later." };
  }
};
export const updateData = async () => {
  try {
    const token = localStorage.getItem("authtoken");

    if (token) {
      const cleanedToken = token.trim().replace(/^"|"$/g, "");
      const response = await fetch("http://localhost:5000/api/users/acc/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanedToken}`,
        },
      });

      const data = await response.json();

      if (data && data.id && data.email) {
        return data;
      }
    }
    return null;
  } catch (err) {
    console.error("Error in updateData:", err);
    localStorage.removeItem("authtoken");
    return null;
  }
};

export const getBookingHistory=async()=>{
  try{
      const token= localStorage.getItem("authtoken");
  if(token){
      const response = await fetch("http://localhost:5000/api/users/booking/show/all", {
          method: "GET",
          headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, "")}` },
      });
      if (!response.ok) {
          throw new Error("Failed to verify user info")
      }
      const data = await response.json()
      return data
  }else{
      return [
          {
            id: "PV12345",
            from: "New York",
            to: "London",
            date: "12 May, 2025",
            airline: "Emirates",
            status: "Confirmed",
            price: "$549",
          },
          {
            id: "PV67890",
            from: "Dubai",
            to: "Mumbai",
            date: "23 June, 2025",
            airline: "Qatar Airways",
            status: "Upcoming",
            price: "$420",
          },
          {
            id: "PV54321",
            from: "London",
            to: "New York",
            date: "18 April, 2025",
            airline: "Turkish Airlines",
            status: "Completed",
            price: "$575",
          },
        ];
  }
  }catch(err){
      console.log(err)
      return {message:"An error Occoured"}
}}