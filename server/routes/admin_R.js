import { Router } from "express";
import { CreateNewSchedule,checkFlightId,checkAirline, Checkairline } from "../utilis/adminHelper.js";
import { CheckAdmin } from "../middleware/authenicate.js";
import airlines_tb from "../models/airlines_db.js";
import flights_tb from '../models/flights_db.js';

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/dotenv.js";
import user_tb from "../models/user_db.js";
import { assignSeatNumbers, checkScheduleSeats, createBookingEntries, getScheduleBySearch, updateSeatCounts } from "../utilis/bookingHelper.js";
import { queryAsync } from "../models/booking.js";
const router=Router()

//admin loging
router.post('/login',(req,res)=>{
    const {username ,password} = req.body
    if(!username || ! password){
        return res.json({message:"Please Fill in the propper credentials"})
    }
    if(username==="admin" && password==="admin123"){
        const user={username,role:"admin"}
        const token=jwt.sign(user,SECRET_KEY,{expiresIn:"2h"})
        return res.json({message:"Welcome admin",token,user});
    }
    return res.json({message:"You Don't Have the Propper Credentials"});
})
router.post('/create/airline', CheckAdmin, async(req, res) => {
    try {
        const { airline_code, name, country, contact, info } = req.body;
        console.log(airline_code, name, country, contact, info);
        
        if(!airline_code || !name || !country) {
            return res.json({message: "Please fill up the required fields"});
        }
        try {
            // This will throw an error if the airline already exists, which is what we want
            await checkAirline(airline_code);
            // If we get here, it means the airline with this code exists
            return res.json({message: "This code already exists. Please use a unique airline code."});
        } catch(error) {
            // If the error message is "Airline Not available", it means the airline doesn't exist
            // which is what we want for creating a new airline
            if(error === "Airline Not available") {
                const sql = `INSERT INTO airlines(airline_code, name, country, contact, info) VALUES(?, ?, ?, ?, ?)`;
                airlines_tb.query(sql, [airline_code, name, country, contact, info], (error, result) => {
                    if(error) {
                        console.log(error);
                        if (error.code === 'ER_DUP_ENTRY') {
                            return res.json({message: "This code already exists. Please use a unique airline code."});
                        }
                        return res.json({message: "Please Try Again Later"});
                    }
                    return res.json({message: "airline successfully registered"});
                });
            } else {
                return res.json({message: error});
            }
        }
    } catch(err) {
        console.log(err);
        return res.json({message: "An unexpected error occurred"});
    }
});

//add more flight_schedule
router.post("/add/flight/schedule",CheckAdmin,async(req,res)=>{
    try{
        const {flight_code,origin,destination,departure_date,departure_time,arrival_time, cost_eco, cost_pre_eco, cost_buis, cost_first_class, economy_seats,premium_economy_seats,business_seats, first_class_seats ,  stops}=req.body
        const flight_id=await checkFlightId(flight_code)
        if(flight_id.total_seats< (economy_seats+premium_economy_seats+business_seats+ first_class_seats) ){
            return {message:`The Total Seats of Flight ${flight_code} are ${flight_id.total_seats}\nYou exceded the maximum seats`}
        }
        console.log(flight_id)
        const x=await CreateNewSchedule(flight_id.id,departure_date,departure_time,arrival_time,origin,destination, cost_eco, cost_pre_eco, cost_buis, cost_first_class, economy_seats, first_class_seats, business_seats, premium_economy_seats, stops);
        console.log(x)
        return res.json({message:x})
    }catch(err){
        return res.json({message:err})
    }
})

router.get("/show/airlines",CheckAdmin,(req,res)=>{
    const sql=`SELECT * FROM airlines
    ORDER BY id ;`
    user_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            return res.json(result)
        }
        return res.json({message:"No users have signed up yet"})
    })
})
router.get("/show/bookings",CheckAdmin,(req,res)=>{
    const sql=`SELECT 
                  b.*, 
                  f.flight_code, 
                  fs.origin, 
                  fs.destination ,
                  fs.flight_date
                FROM bookings b
                JOIN flights f ON f.id = b.flight_id
                JOIN flight_schedules fs ON fs.id = b.flight_schedule
                ORDER BY b.id DESC 
                LIMIT 30;`
    user_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result && result.length>0){
            return res.json(result)
        }else{
          return res.json({message:"No users have signed up yet"})
        }
    })
})


router.get('/show/users',CheckAdmin,(req,res)=>{
    const sql=`SELECT id ,fname,lname,email,passport_no,nationality FROM users
    ORDER BY id ;`
    user_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            return res.json(result)
        }
        return res.json({message:"No users have signed up yet"})
    })
})

router.get("/show/flights",CheckAdmin,(req,res)=>{
    const sql="SELECT f.id,f.flight_code,f.total_seats,a.airline_code FROM flights f ,airlines a WHERE a.id=f.airline_id ORDER BY f.id ASC ;";
    flights_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            return res.json(result)
        }
        return res.json({message:"No users have signed up yet"})
    })
})
router.post("/add/flight", CheckAdmin, async (req, res) => {
    try {
      const { flight_code, total_seats, airline_code } = req.body;
        const airline_id =await Checkairline(airline_code);
  
      if (!airline_id || !flight_code || !total_seats) {
        return res.json({ message: "Missing required fields" });
      }
      const sql = "INSERT INTO flights (airline_id, flight_code, total_seats) VALUES (?, ?, ?)";
      flights_tb.query(sql, [airline_id, flight_code, total_seats], (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.json({ message: "This flight code already exists." });
          }
          return res.json({ message: "Internal server error" });
        }
        return res.json({ message: "Successfully created flight" });
      });
    } catch (err) {
      console.error("Route error:", err);
      return res.status(500).json({ message: "An error occurred", error: err });
    }
  });

  router.get("/show/flights/schedules",CheckAdmin,(req,res)=>{
    const sql="SELECT fs.* , f.flight_code AS flightNumber FROM flight_schedules fs ,flights f WHERE fs.flight_id=f.id  ORDER BY id DESC ;";
    flights_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            return res.json(result)
        }
        return res.json({message:"No users have signed up yet"})
    })
})


router.post('/create/bookings', CheckAdmin, async (req, res) => {
    try {
      const { user_id, origin, destination, flight_code, flight_date, cabin_class } = req.body;
      console.log('Received booking creation request', req.body); // Debug log

      // Step 1: Get the flight schedule matching those fields
      const schedule = await getScheduleBySearch(origin, destination, flight_code, flight_date);
      if (!schedule) {
        console.log("failed")
        return res.json({ message: 'No matching Flight Schedule found' });
      }
      // Step 2: Check seat availability
      await checkScheduleSeats(schedule, cabin_class, 1); // Always check for 1 seat
  
      // Step 3: Assign a seat
      const [seatNo] = await assignSeatNumbers(schedule.id, 1); // Returns an array
  
      // Step 4: Create booking
      const bookingIds = await createBookingEntries(schedule, cabin_class, user_id, [seatNo]);
  
      // Step 5: Update seats
      await updateSeatCounts(schedule.id, cabin_class, 1);
  
      res.json({ message: 'Booking successful', bookingId: bookingIds[0], seat: seatNo });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  router.delete('/delete/booked', CheckAdmin, async (req, res) => {
    try {
      const { bookingId } = req.body;
      if (!bookingId) {
        return res.status(400).json({ error: 'bookingId is required' });
      }
        const bookings = await queryAsync(
        `SELECT flight_schedule AS scheduleId, cabin_class AS cabinClass, 
                fs.flight_date
           FROM bookings b
           JOIN flight_schedules fs ON b.flight_schedule = fs.id
          WHERE b.id = ?`,
        [bookingId]
      );
      if (bookings.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      const { scheduleId, cabinClass, flight_date } = bookings[0];
  
      // 2. If the flight is still in the future, increment that class’s seats
      const now = new Date();
      if (new Date(flight_date) > now) {
        // updateSeatCounts subtracts the count you pass,
        // so passing -1 will ADD one seat back
        await updateSeatCounts(scheduleId, cabinClass, -1);
      }
      // 3. Delete the booking record
      await queryAsync(`DELETE FROM bookings WHERE id = ?`, [bookingId]);
  
      return res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
      console.error('Error deleting booking:', err);
      return res.json({ message: 'Internal server error' });
    }
  });

  router.delete('/delete/passenger',CheckAdmin,async(req,res)=>{
    try {
        const { userid } = req.body;
        if (!userid) {
          return res.json({ error: 'user id is required' });
        }
          const sql = "DELETE FROM users WHERE id=?"
          user_tb.query(sql,[userid],(error,result)=>{
            if(error){
                console.log(error)
                return res.json({message:"Something Went Wrong Try Again Later"})
            }
          })
        return res.json({ message: 'Passenger Deleted successfully' });
      } catch (error) {
        console.error('Error deleting booking:', error);
        return res.json({ message: 'Internal server error' });
      }
    });
    router.delete('/delete/flights',CheckAdmin,async(req,res)=>{
        try {
            const { flight_id } = req.body;
            if (!flight_id) {
              return res.json({ error: 'Flight id is required' });
            }
              const sql = "DELETE FROM flights WHERE id=?"
              user_tb.query(sql,[flight_id],(error,result)=>{
                if(error){
                    console.log(error)
                    return res.json({message:"Something Went Wrong Try Again Later"})
                }
              })
            return res.json({ message: 'Flight Deleted successfully' });
          } catch (error) {
            console.error('Error deleting booking:', error);
            return res.json({ message: 'Internal server error' });
          }
        });

    router.delete("/delete/airline",CheckAdmin,async(req,res)=>{
        try {
            const { airline_id } = req.body;
            if (!airline_id) {
              return res.json({ error: 'Flight id is required' });
            }
              const sql = "DELETE FROM airlines WHERE id=?"
              user_tb.query(sql,[airline_id],(error,result)=>{
                if(error){
                    console.log(error)
                    return res.json({message:"Something Went Wrong Try Again Later"})
                }
              })
            return res.json({ message: 'Airline Deleted successfully' });
          } catch (error) {
            console.error('Error deleting booking:', error);
            return res.json({ message: 'Internal server error' });
          }
        });
        
        router.get('/show/dashboard',CheckAdmin,async(req,res)=>{
            try{
                const passengerCountQuery = await queryAsync('SELECT COUNT(*) as total FROM users');
                const bookingsQuery = await queryAsync('SELECT origin,destination,flight_date FROM flight_schedules');
                const totalBooked =await queryAsync("SELECT COUNT(*) as booked FROM bookings")
                res.json({
                    passengerCount: passengerCountQuery[0].total,
                    bookings: bookingsQuery,
                    totalBooked
                });
                
            }catch(err){
                console.error('Error deleting booking:', err);
                return res.json({ message: 'Internal server error' });
            }
        }
    );
    
export default router;