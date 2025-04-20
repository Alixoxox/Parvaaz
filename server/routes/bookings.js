import {authenicator} from "../middleware/authenicate.js";
import booking_tb from "../models/booking.js";
import flights_tb from "../models/flights_db.js";
import flight_schedule_tb from '../models/flights_schedule_db.js'
import {  Router } from "express";

const router=Router()
const FindFlightID=(flight_code)=>{
    return new Promise((resolve,reject)=>{
        const sql=`SELECT * FROM flights WHERE flight_code=?;`;
        flights_tb.query(sql,[flight_code],(error,result)=>{
            if(error){
                console.log(error);
                return reject ("Something went wrong please try again later");
            }
            console.log(result[0].id)
            return resolve(result[0].id)
        })
    })}

const SearchSeatNotTaken=(flight_id,seat_no)=>{
    return new Promise((resolve,reject)=>{
        const sql=` SELECT * FROM bookings WHERE flight_id=? AND seat_no=?;`;
        booking_tb.query(sql,[flight_id,seat_no],(error,result)=>{
            if(error){return reject("PLease _try again later")}
            if (result.length===0){
                return resolve(true)
            }else{
                return reject("sorry Selected seat is pre-booked")
            }
        })
    })
}

const ScheduleOfFlight=(booking_date,flight_id)=>{
    return new Promise((resolve,reject)=>{
        const sql=`SELECT * FROM flight_schedules WHERE flight_date=? AND flight_id=? ;`;
        flight_schedule_tb.query(sql,[booking_date,flight_id],(error,result)=>{
            if(error){console.error("DB error:", error);
                return reject("Please_ try again later")
            }
            if(result.length!==0){
                return resolve(result[0])
            }return reject(`Sorry Flight is not scheduled for ${booking_date}`)
        })
    })
};

router.post('/new',authenicator,async(req,res)=>{
    try{
    const user_id =req.user.id;;
    const {flight_code,seatno,booking_date} = req.body //search flight id by ising flight_code and search if seat no. not pre taken
    if(!flight_code || !seatno || !booking_date ){
        return res.json({message:"You must fill in all the required fields"})
    } 
    let x;
    x=await FindFlightID(flight_code);
    let flight_id=x; 
    const schedule_data=await ScheduleOfFlight(booking_date,flight_id);
    const y=await SearchSeatNotTaken(flight_id,seatno);

    if(y===true){
        const sql0=` UPDATE flight_schedules SET available_seats=available_seats - 1 WHERE id= ? AND available_seats > 0; `;
        flight_schedule_tb.query(sql0,[schedule_data.id],(error,result)=>{
            if(error){
                console.log(error);
                return res.json({message:"Please. Try again later"})
            }if (result.affectedRows === 0) {
                return res.json({ message: "No seats available" });
            }
            const sql=`INSERT INTO bookings(user_id, flight_id,seat_no,flight_schedule) VALUES(?,?,?,?);`;

            booking_tb.query(sql,[user_id,flight_id,seatno,schedule_data.id,schedule_data.id],(error,result)=>{
                if(error){console.log(error);
                    return res.json({message:"Ran into an unexpected error"});
                }
                return res.json({message:`Your Flight has been booked for ${booking_date}`,schedule_data})
        })
    })}}catch(err){
        return res.json({message:err})
    }
})
//flight history
router.get('/history',authenicator,(req,res)=>{
    const user_id=req.user.id;
    const sql=`SELECT fs.flight_date, fs.departure_time, fs.arrival_time, fs.origin, fs.destination,f.flight_code,a.airline_code, a.name AS airline_name, a.country AS airline_country, a.contact AS airline_contact,b.seat_no
    FROM flight_schedules fs, flights f,airlines a, bookings b
    WHERE fs.flight_id=f.id AND f.airline_id=a.id AND b.user_id=?;`;

    flight_schedule_tb.query(sql,[user_id],(error,result)=>{
        if(error){
            console.log(error);
            return res.json({message:"Please try Again Later"});
        }
        if(result.length===0){
            return res.json({message:"This is your first time using out site"});
        }
        return res.json(result[0]);
    })
})
export default router