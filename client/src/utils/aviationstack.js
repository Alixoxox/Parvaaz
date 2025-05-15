import iataCodes from './iata.json';

export const toIata = async (input) => {
  const query = input.trim().toLowerCase();
  if (/^[A-Za-z]{3}$/.test(query)) {
    return query.toUpperCase();
  }
  return iataCodes[query] || null;
};

export const calculateDuration = (departureTime, arrivalTime) => {
  const depDate = new Date(`1970-01-01T${departureTime}Z`);
  const arrDate = new Date(`1970-01-01T${arrivalTime}Z`);
  if (isNaN(depDate.getTime()) || isNaN(arrDate.getTime())) {
    console.error("Invalid date format:", { depDate, arrDate });
    return "Invalid Time";
  }
  // Handle case where the arrival time is earlier than departure time (i.e., crossing midnight)
  if (arrDate < depDate) arrDate.setDate(arrDate.getDate() + 1);
  // Check if both departure and arrival times are the same, assume 24-hour flight
  if (departureTime === arrivalTime) {
    return "24 hours";
  }
  // Calculate the difference in minutes
  const durationMinutes = (arrDate - depDate) / 60000; // Convert milliseconds to minutes
  const hours = Math.floor(durationMinutes / 60);
  return `${hours} hours`;
};


export const convertTimeName = (time) => {
  const hour = parseInt(time?.slice(0, 2)); // corrected from slice(0,1) to slice(0,2)
  
  if (hour > 0 && hour <= 12) {
    return "Morning";
  } else if (hour > 12 && hour <= 15) {
    return "Afternoon";
  } else if (hour > 15 && hour <= 18) {
    return "Evening";
  }
  return "Night";
};

export const getCityFromIATA = (iataCode) => {
  let a= iataCode.toUpperCase()
  const entries = Object.entries(iataCodes);
  const match = entries.find(([city, code]) => code === a.toUpperCase());
  return match ? match[0] : "Unknown city";
};
