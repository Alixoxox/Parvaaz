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


  function toRadians(deg) {
    return deg * Math.PI / 180;
  }
  
  function toDegrees(rad) {
    return rad * 180 / Math.PI;
  }
  
 export const generateGreatCirclePath = (start, end, numPoints = 100) => {
    const path = [];
  
    const lat1 = toRadians(start.lat);
    const lon1 = toRadians(start.lon);
    const lat2 = toRadians(end.lat);
    const lon2 = toRadians(end.lon);
  
    const d = 2 * Math.asin(Math.sqrt(
      Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.pow(Math.sin((lon2 - lon1) / 2), 2)
    ));
  
    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);
  
      const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
      const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
      const z = A * Math.sin(lat1) + B * Math.sin(lat2);
  
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
      const lon = Math.atan2(y, x);
  
      path.push([toDegrees(lat), toDegrees(lon)]);
    }
  
    return path;
  };

  export function calculateTotalPrice({
    cabinClass,
    tripType,
    flightData,
    totalExtraBaggageCost,
  }) {
    // Get base ticket price
    let baseCost = 0;
    if (cabinClass === "economy") {
      baseCost = tripType === "roundtrip" ? flightData.cost_eco * 2 : flightData.cost_eco;
    } else if (cabinClass === "business") {
      baseCost = tripType === "roundtrip" ? flightData.cost_buis * 2 : flightData.cost_buis;
    } else if (cabinClass === "first") {
      baseCost = tripType === "roundtrip" ? flightData.cost_first_class * 2 : flightData.cost_first_class;
    } else if (cabinClass === "premium_economy") {
      baseCost = tripType === "roundtrip" ? flightData.cost_pre_eco * 2 : flightData.cost_pre_eco;
    } else {
      return null;
    }
  
    // Taxes per cabin class, per flight leg
    let taxesPerLeg = 0;
    if (cabinClass === "economy") taxesPerLeg = 75;
    else if (cabinClass === "business") taxesPerLeg = 150;
    else if (cabinClass === "first") taxesPerLeg = 120;
    else if (cabinClass === "premium_economy") taxesPerLeg = 100;
  
    let numberOfLegs = tripType === "roundtrip" ? 2 : 1;
    let taxes = taxesPerLeg * numberOfLegs;
  
    console.log(baseCost,taxes,totalExtraBaggageCost)
    return baseCost + taxes + totalExtraBaggageCost;
  }