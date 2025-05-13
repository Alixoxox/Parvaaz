
import { queryAsync } from "../models/booking.js";
const map = {
  economy:         'economy_seats',
  business:        'business_seats',
  first:           'first_class_seats',
  premium_economy: 'premium_economy_seats'
};


// Fetch schedule
export async function getFlightSchedule(id) {
  const rows = await queryAsync(
    `SELECT * FROM flight_schedules WHERE id = ?`,
    [id]
  );
  if (!rows.length) throw new Error(`No schedule with id=${id}`);
  return rows[0];
}
export async function checkScheduleSeats(schedule, cabinClass, count) {
  
    if (typeof cabinClass !== 'string') {
      throw new Error(`Invalid cabin class type: expected a string but got ${typeof cabinClass}`);
    }
  
    const col = map[cabinClass.toLowerCase()];
   
    if (!col) {
      throw new Error(`Invalid cabin class: ${cabinClass}`);
    }
  
    const availableSeats = schedule[col];

    if (typeof availableSeats !== 'number' || availableSeats < count)  {
      throw new Error(
        `Only ${availableSeats} ${cabinClass} seats left; you requested ${count}.`
      );
    }
  }
// Check class seats
export async function checkFlightClassSeats(flightId, cabinClass, count) {
  const rows = await queryAsync(`SELECT * FROM flight_schedules WHERE flight_id = ?`, [flightId]);
  if (!rows.length) throw new Error(`Flight ${flightId} not found`);
  const flight = rows[0];
  const col = map[cabinClass];
  if (!col) throw new Error(`Unknown cabin class '${cabinClass}'`);
  if (flight[col] < count) {
    throw new Error(`Only ${flight[col]} seats left in ${cabinClass}, requested ${count}.`);
  }
}

// Assign seat numbers
export async function assignSeatNumbers(scheduleId, count) {
  const rows = await queryAsync(
    `SELECT seat_no FROM bookings WHERE flight_schedule = ?`,
    [scheduleId]
  );
  const used = new Set(rows.map(r => r.seat_no));
  const seats = [];
  let n = 1;
  while (seats.length < count) {
    if (!used.has(n)) seats.push(n);
    n++;
  }
  return seats;
}

// Create booking entries for a given user_id
export async function createBookingEntries(schedule, cabinClass, userId, seatNumbers) {
    // build VALUES array
    const rows = seatNumbers.map(seatNo => [
      userId,
      schedule.flight_id,
      seatNo,
      schedule.id,
      cabinClass
    ]);
  
    // bulk insert & grab insertId + affectedRows
    const { insertId, affectedRows } = await queryAsync(
      `INSERT INTO bookings
         (user_id, flight_id, seat_no, flight_schedule, cabin_class)
       VALUES ?`,
      [rows]
    );
  
    // generate IDs from insertId onward
    const bookingIds = [];
    for (let i = 0; i < affectedRows; i++) {
      bookingIds.push(insertId + i);
    }
  
    return bookingIds;
  }

// Update seat counts for the specific cabin class in flight_schedules
export async function updateSeatCounts(scheduleId, cabinClass, count) {
    const col = map[cabinClass];  // Get the column name dynamically
    if (!col) throw new Error(`Invalid cabin class: ${cabinClass}`);
  
    // Subtract the booked count from the specific cabin class column
    await queryAsync(
      `UPDATE flight_schedules
          SET ${col} = ${col} - ?
        WHERE id = ?`,
      [count, scheduleId]
    );
  }
  export async function getScheduleBySearch(origin, destination, flight_code, flight_date) {
    const rows = await queryAsync(
      `SELECT fs.* FROM flight_schedules fs
       JOIN flights f ON fs.flight_id = f.id
       WHERE fs.origin = ? AND fs.destination = ? AND f.flight_code = ? AND fs.flight_date = ?`,
      [origin, destination, flight_code, flight_date]
    );
    if(!rows||rows.length===0){
      return null
    }
    return rows[0];
  }