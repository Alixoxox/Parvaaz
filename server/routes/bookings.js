// booking-routes.js
import { Router } from "express";
import { authenicator } from "../middleware/authenicate.js";
import flight_schedule_tb from "../models/flights_schedule_db.js";
import booking_tb from "../models/booking.js";
import { queryAsync } from "../models/booking.js";
import {
  getFlightSchedule,
  checkScheduleSeats,
  checkFlightClassSeats,
  assignSeatNumbers,
  createBookingEntries,
  updateSeatCounts,
} from "../utilis/bookingHelper.js";
const router = Router();

// One-way booking
export async function handleOnewayBooking(req, res) {
  // passengers is now a number
  const { schedule_id, cabin_class, passengers } = req.body;
  console.log(schedule_id, cabin_class, passengers);
  // user_id comes from your auth middleware, e.g. req.user.id
  const userId = req.user.id;

  try {
    await queryAsync("START TRANSACTION");

    const schedule = await getFlightSchedule(schedule_id);
    checkScheduleSeats(schedule, cabin_class, passengers);
    await checkFlightClassSeats(schedule.flight_id, cabin_class, passengers);

    const seats = await assignSeatNumbers(schedule_id, passengers);
    const bookingIds = await createBookingEntries(
      schedule,
      cabin_class,
      userId,
      seats
    );
    await updateSeatCounts(schedule_id, cabin_class, passengers);

    await queryAsync("COMMIT");
    res.json({ message: "One-way booking successful", seats, bookingIds });
  } catch (err) {
    await queryAsync("ROLLBACK").catch(() => {});
    res.status(400).json({ error: err.message });
  }
}
router.post("/new/oneway", authenicator, handleOnewayBooking);

// Round-trip booking
export async function handleRoundtripBooking(req, res) {
  const {
    schedule_id, // outbound schedule
    returnDate, // e.g. "2025-05-20"
    fromCity, // e.g. "Karachi"
    toCity, // e.g. "Islamabad"
    cabin_class, // e.g. "economy"
    passengers, // number of seats
  } = req.body;
  const userId = req.user.id;

  console.log( schedule_id, // outbound schedule
    returnDate, // e.g. "2025-05-20"
    fromCity, // e.g. "Karachi"
    toCity, // e.g. "Islamabad"
    cabin_class, // e.g. "economy"
    passengers)
  try {
    await queryAsync("START TRANSACTION");

    // 1) OUTBOUND leg — exactly like one-way
    const outboundSched = await getFlightSchedule(schedule_id);
    checkScheduleSeats(outboundSched, cabin_class, passengers);
    await checkFlightClassSeats(
      outboundSched.flight_id,
      cabin_class,
      passengers
    );
    const outSeats = await assignSeatNumbers(schedule_id, passengers);
    console.log(outSeats)
    // ← NEW: capture bookingIds for outbound
    const outBookingIds = await createBookingEntries(
      outboundSched,
      cabin_class,
      userId,
      outSeats
    );
    await updateSeatCounts(schedule_id, cabin_class, passengers);
    const returnDateOnly = returnDate.split("T")[0];
    console.log("Looking for returnDateOnly:", returnDateOnly, toCity, fromCity);
    // 2) FIND RETURN leg schedule by date + flipped cities

    const returnRows = await queryAsync(
      `SELECT * 
           FROM flight_schedules 
          WHERE flight_date = ? 
            AND origin = ? 
            AND destination = ?`,
            [returnDateOnly, toCity, fromCity]
    );
    console.log("GOT FLIGHT data",returnRows)
    if (returnRows.length === 0) {
      throw new Error(
        `No return flight on ${returnDate} from ${toCity} to ${fromCity}`
      );
    }
    const inboundSched = returnRows[0];

    // 3) INBOUND leg — same checks & inserts
    checkScheduleSeats(inboundSched, cabin_class, passengers);
    await checkFlightClassSeats(
      inboundSched.flight_id,
      cabin_class,
      passengers
    );
    const inSeats = await assignSeatNumbers(inboundSched.id, passengers);
    console.log('GOT SEATS',inSeats)
    // ← NEW: capture bookingIds for inbound
    const inBookingIds = await createBookingEntries(
      inboundSched,
      cabin_class,
      userId,
      inSeats
    );
    await updateSeatCounts(inboundSched.id, cabin_class, passengers);

    // 4) COMMIT & respond
    await queryAsync("COMMIT");
    res.json({
      message: "Round-trip booking successful",
      outbound: { seats: outSeats, bookingIds: outBookingIds },
      inbound: { seats: inSeats, bookingIds: inBookingIds },
    });
  } catch (err) {
    await queryAsync("ROLLBACK").catch(() => {});
    res.status(400).json({ error: err.message });
  }
}
router.post("/new/roundtrip", authenicator, handleRoundtripBooking);

//cancel or delete booking
router.delete("/delete", authenicator, (req, res) => {
  const user_id = req.user.id;
  if (!user_id) {
    return res.json({ message: "You must be a user to access this" });
  }
  const { flight_id, schedule_id } = req.body; //flight id attained after
  const sql =
    "DELETE FROM bookings WHERE flight_schedule=? AND flight_id=? AND user_id=?";

  booking_tb.query(sql, [schedule_id, flight_id, user_id], (error, result) => {
    if (error) {
      console.log(error);
      return res.json({ message: "Please Try Again Later" });
    }
    if (result.affectedRows === 0) {
      return res.json({ message: "No Booking Found for this data" });
    } //booking removed increase seats now
    const sql2 =
      "UPDATE flight_schedules SET available_seats=available_seats + 1 WHERE id= ?;";
    flight_schedule_tb.query(sql2, [schedule_id], (error1, qresult) => {
      if (error1) {
        console.log(error);
        return res.json({
          message: "Something went wrong Please try again later",
        });
      }
      return res.json({
        message: "Your Booking has been successfully removed",
      });
    });
  });
});
router.get("/show/all", authenicator, (req, res) => {
  const user_id = req.user.id;
  if (!user_id) {
    return res.json({ message: "You must be logged in" });
  }
  const sql = `SELECT 
    b.id AS booking_id,
    fs.origin AS origin,
    fs.destination AS destination,
    DATE_FORMAT(fs.flight_date, '%d %M %Y') AS date,
    a.name AS airline_name,
    IF(fs.flight_date >= CURDATE(), 'upcoming', 'completed') AS status,
    fs.id AS schedule_id,
    fs.flight_id,
    fs.flight_date,
    fs.departure_time,
    fs.arrival_time,
   
    f.flight_code,
    a.airline_code,
    a.country AS airline_country,
    a.contact AS airline_contact,
    b.seat_no,
    CASE 
        WHEN b.cabin_class = 'economy' THEN fs.cost_eco
        WHEN b.cabin_class = 'business' THEN fs.cost_buis
        WHEN b.cabin_class = 'first' THEN fs.cost_first_class
        WHEN b.cabin_class = 'premium_economy' THEN fs.cost_pre_eco
        ELSE NULL
    END AS cabin_class_cost
FROM 
    flight_schedules fs
JOIN 
    flights f ON fs.flight_id = f.id
JOIN 
    airlines a ON f.airline_id = a.id
JOIN 
    bookings b ON fs.id = b.flight_schedule
WHERE 
    b.user_id = ? 
ORDER BY 
    fs.flight_date DESC
LIMIT 20;`;

  flight_schedule_tb.query(sql, [user_id], (error, result) => {
    if (error) {
      console.log(error);
      return res.json({ message: "Please try Again Later" });
    }
    if (result.length === 0) {
      return res.json({
        message:
          "This is your first time using out site.\nBook A flight to View info",
      });
    }
    return res.json(result);
  });
});
export default router;
