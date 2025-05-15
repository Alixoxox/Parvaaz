import { Router } from "express";
import flights_tb from "../models/flights_db.js";
import { queryAsync } from "../models/booking.js";
const router = Router();

// User accessible endpoint for searching flights
router.post("/show", async (req, res) => {
  const {
    source,
    destination,
    date: departDate,
    returnDate,
    cabin_class,
    passengers,
    tripType
  } = req.body;
  const formatDate = (d) => new Date(d).toISOString().split('T')[0];
  const startDate = departDate?.trim() ? formatDate(departDate) : formatDate(new Date()); 
  
  // common WHERE + params builder
  const buildFilters = (src, dst, flightDate) => {
    const conds = [`fs.flight_date >= CURDATE()`];
    const p = [];
    if (src)      { conds.push("fs.origin = ?");       p.push(src); }
    if (dst)      { conds.push("fs.destination = ?");  p.push(dst); }
    if (flightDate) { conds.push("fs.flight_date = ?"); p.push(flightDate); }

    if (cabin_class && passengers) {
      let seatCol, costCol;
      if (cabin_class === 'economy')          [seatCol, costCol] = ['fs.economy_seats',      'fs.cost_eco'];
      else if (cabin_class === 'premium_economy') [seatCol, costCol] = ['fs.premium_economy_seats','fs.cost_pre_eco'];
      else if (cabin_class === 'business')     [seatCol, costCol] = ['fs.business_seats',     'fs.cost_buis'];
      else /* first */                        [seatCol, costCol] = ['fs.first_class_seats',  'fs.cost_first_class'];
      conds.push(`${seatCol} >= ?`); p.push(passengers);
      conds.push(`${costCol} IS NOT NULL`);
    }
    return { where: conds.join(" AND "), params: p };
  };

  try {
    // Build outbound filters
    const { where: outWhere, params: outParams } = buildFilters(source, destination, startDate);

    const baseSQL = `
      SELECT 
        f.id AS flight_id,
        f.flight_code,
        fs.flight_date,
        fs.id AS schedule_id,
        fs.origin, fs.destination,
        fs.flight_date, fs.departure_time, fs.arrival_time,
        fs.stops,
        a.id   AS airline_id,   a.name   AS airline_name,   a.airline_code,
        fs.economy_seats, fs.premium_economy_seats,
        fs.business_seats, fs.first_class_seats,
        fs.cost_eco, fs.cost_pre_eco, fs.cost_buis, fs.cost_first_class
      FROM flight_schedules fs
      JOIN flights f  ON fs.flight_id = f.id
      JOIN airlines a ON f.airline_id = a.id
      WHERE ${outWhere}
      ORDER BY fs.departure_time ASC
    `;

    // 1) Outbound leg
    const outboundRows = await queryAsync(baseSQL, outParams);

    let inboundRows = [];
    // 2) Inbound leg only for roundtrip
    if (tripType === 'roundtrip' && returnDate) {
      const { where: inWhere, params: inParams } = buildFilters(destination, source, formatDate(returnDate));
      const inboundSQL = baseSQL.replace(outWhere, inWhere);
      inboundRows = await queryAsync(inboundSQL, inParams);
    }
  
    console.log("Final outbound:", outboundRows);
    console.log("Final inbound:", inboundRows);
  
    // 3) Respond with both legs
    return res.json({
      available_flights: {
        outbound: outboundRows,
        inbound: inboundRows
      },
      message:
        (Array.isArray(inboundRows) && inboundRows.length) ||
        (Array.isArray(outboundRows) && outboundRows.length)
          ? undefined
          : "No available flights found.",
    });
  } catch (err) {
    console.error("Error fetching flights:", err);
    return res.status(500).json({ message: "Error fetching flights." });
  }
});

export default router;