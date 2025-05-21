export const getAllInquiries = async () => {
  try {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      throw new Error("You must be an Admin");
    }
    const response = await fetch("http://localhost:5000/api/inquiries/show", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to fetch booking history");
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("getBookingHistory error:", err);
    return { message: err.message || "An error occurred" };
  }
};

export const updateInquiry = async (id, status) => {
  try {
    console.log(status)
    const token = localStorage.getItem("admintoken");
    if (!token) {
      throw new Error("You must be an Admin");
    }
    const response = await fetch(`http://localhost:5000/api/inquiries/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to update inquiry");
    }

    const data = await response.json();
    return data; // message: 'Inquiry updated!'

  } catch (err) {
    console.error("updateInquiry error:", err);
    return { message: err.message || "An error occurred" };
  }
}

export const deleteInquiry = async (id) => {
  try {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      throw new Error("You must be an Admin");
    }
    const response = await fetch(`http://localhost:5000/api/inquiries/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to delete inquiry");
    }

    const data = await response.json();
    return data; // message: 'Inquiry deleted!'

  } catch (err) {
    console.error("deleteInquiry error:", err);
    return { message: err.message || "An error occurred" };
  }
}

export const sendInquiry = async (name, email, subject, message,user) => {
  try {

    const response = await fetch("http://localhost:5000/api/inquiries/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"},
      body: JSON.stringify({ name, email, subject, message,user })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to send inquiry");
    }

    const data = await response.json();
    return data; // message: 'Thanks for contacting us! Our support team has received your message and will be in touch soon.'

  } catch (err) {
    console.error("sendInquiry error:", err);
    return { message: err.message || "An error occurred" };
  }
}