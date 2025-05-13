import { Router } from "express";
import flights_tb from "../models/flights_db.js";
const router = Router();
//user accessible
router.post("/show", (req, res) => {
  const { source, destination, date, cabin_class, passengers } = req.body;
  console.log(source,destination,cabin_class,passengers)
  const conditions = [`TIMESTAMP(fs.flight_date, fs.departure_time) >= NOW()`]; // Ensure future flights
  const params = [];

  if (source) {
    conditions.push("fs.origin = ?");
    params.push(source);
  }

  if (destination) {
    conditions.push("fs.destination = ?");
    params.push(destination);
  }

  if (date) {
    conditions.push("fs.flight_date = ?");
    params.push(date);
  }

  // Handle cabin class, available seat checks, and cost
  if (cabin_class && passengers) {
    let seat_column, cost_column;
  
    if (cabin_class === 'economy') {
      seat_column = 'fs.economy_seats';
      cost_column = 'fs.cost_eco';
    } else if (cabin_class === 'business') {
      seat_column = 'fs.business_seats';
      cost_column = 'fs.cost_buis';
    } else if (cabin_class === 'first') {
      seat_column = 'fs.first_class_seats';
      cost_column = 'fs.cost_first_class';
    } else if (cabin_class === 'premium_economy') {
      seat_column = 'fs.premium_economy_seats';
      cost_column = 'fs.cost_pre_eco';
    }
  
    conditions.push(`${seat_column} >= ?`);
    params.push(passengers);
    conditions.push(`${cost_column} IS NOT NULL`);
  }

  const whereClause = "WHERE " + conditions.join(" AND ");

  // Main SQL query to fetch all available flights for the selected cabin class
  const sql = `
    SELECT 
      f.flight_code, 
      fs.departure_time, 
      fs.arrival_time, 
      fs.origin, 
      fs.destination, 
      fs.flight_date,
      fs.stops,
      fs.id AS schedule_id,
      fs.economy_seats, 
      fs.business_seats, 
      fs.first_class_seats, 
      f.id as flight_id,
      fs.premium_economy_seats, 
      a.airline_code, 
      a.id as airline_id,
      a.name AS airline_name, 
      a.country AS airline_country,
      -- Fetch the cost based on selected cabin class
      fs.cost_buis,
      fs.cost_first_class,
      fs.cost_pre_eco,
      fs.cost_eco
    FROM 
      flights f
    JOIN 
      flight_schedules fs ON fs.flight_id = f.id
    JOIN 
      airlines a ON f.airline_id = a.id
    ${whereClause}
    ORDER BY 
      fs.departure_time DESC;
  `;

  // Query to fetch available flights
  flights_tb.query(sql, params, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching flights." });
    }

    if (result.length > 0) {
      // List all available flights with cost
      return res.json({ available_flights: result });
    } else {
      return res.json({ message: "No available flights found." });
    }
  });
});


export default router;
