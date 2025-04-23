import {authenicator} from "../middleware/authenicate.js";
import booking_tb from "../models/booking.js";
import flight_schedule_tb from '../models/flights_schedule_db.js';
import { FindFlightID,ScheduleOfFlight,SearchSeatNotTaken } from "../utilis/bookingHelper.js";
import {  Router } from "express";

const router=Router()

router.post('/new',authenicator,async(req,res)=>{
    try{
    const user_id =req.user.id;
    if(!user_id){
        return res.json({message:"You must be a user to access this"})
    }
    const {flight_code,seatno,booking_date} = req.body //search flight id by ising flight_code and search if seat no. not pre taken
    if(!flight_code || !seatno || !booking_date ){
        return res.json({message:"You must fill in all the required fields"})
    } 
    const flight_id=await FindFlightID(flight_code);
    let schedule_data=await ScheduleOfFlight(booking_date,flight_id,user_id);
    const seatAvailable=await SearchSeatNotTaken(flight_id,seatno);

    if(seatAvailable){
        const sql0=` UPDATE flight_schedules SET available_seats=available_seats - 1 WHERE id= ? AND available_seats > 0; `;
        flight_schedule_tb.query(sql0,[schedule_data.schedule_id],(error,result)=>{
            if(error){
                console.log(error);
                return res.json({message:"Please. Try again later"})
            }if (result.affectedRows === 0) {
                return res.json({ message: "No seats available" });
            }
            const sql=`INSERT INTO bookings(user_id, flight_id,seat_no,flight_schedule) VALUES(?,?,?,?);`;

            booking_tb.query(sql,[user_id,flight_id,seatno,schedule_data.schedule_id],(error,result)=>{
                if(error){console.log(error);
                    return res.json({message:"Ran into an unexpected error"});
                }
                schedule_data.seatno=seatno
                return res.json({message:`Your Flight has been booked for ${booking_date}`,schedule_data})
        })
    })}}catch(err){
        return res.json({message:err})
    }
})
//cancel or delete booking
router.delete('/delete',authenicator,(req,res)=>{
    const user_id =req.user.id;
    if(!user_id){
        return res.json({message:"You must be a user to access this"})
    }
    const {flight_id,schedule_id} = req.body; //flight id attained after
    const sql='DELETE FROM bookings WHERE flight_schedule=? AND flight_id=? AND user_id=?'
    
    booking_tb.query(sql,[schedule_id,flight_id,user_id],(error,result)=>{
        if(error){
            console.log(error);
            return res.json({message:"Please Try Again Later"});
        }
        if(result.affectedRows===0){
            return res.json({message:"No Booking Found for this data"});
        }//booking removed increase seats now
    const sql2='UPDATE flight_schedules SET available_seats=available_seats + 1 WHERE id= ?;';
    flight_schedule_tb.query(sql2,[schedule_id],(error1,qresult)=>{
        if(error1){
            console.log(error);
            return res.json({message:"Something went wrong Please try again later"});
        }
        return res.json({message:"Your Booking has been successfully removed"})
    })
    })
})

//for flight history -> GET /show/history
//for future -> GET /show/future
router.get('/show/:type',authenicator,(req,res)=>{
    const user_id=req.user.id;
    if(!user_id){
        return res.json({message:"You must be logged in"})
    }
    const flightType=req.params.type;
    const sortby=(flightType==="history" ? "fs.flight_date DESC" : flightType === "future"? "fs.fs.flight_date ASC":null);
    if(!sortby){
        return res.json({message:"enter history or future only in the param i.e show/history"});
    }
    const sql=`SELECT fs.id as schedule_id,fs.flight_id, fs.flight_date, fs.departure_time, fs.arrival_time, fs.origin, fs.destination,f.flight_code,a.airline_code, a.name AS airline_name, a.country AS airline_country, a.contact AS airline_contact,b.seat_no
    FROM flight_schedules fs, flights f,airlines a, bookings b
    WHERE fs.flight_id=f.id AND f.airline_id=a.id AND b.user_id=?
    ORDER BY ${sortby};`;

    flight_schedule_tb.query(sql,[user_id],(error,result)=>{
        if(error){
            console.log(error);
            return res.json({message:"Please try Again Later"});
        }
        if(result.length===0){
            return res.json({message:"This is your first time using out site.\nBook A flight to View info"});
        }
        return res.json(result[0]);
    })
})
export default router