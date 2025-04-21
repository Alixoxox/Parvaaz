import flight_schedule_tb from "../models/flights_schedule_db.js";
import booking_tb from "../models/booking.js";
import flights_tb from "../models/flights_db.js";

export const FindFlightID=(flight_code)=>{
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

export const SearchSeatNotTaken=(flight_id,seat_no)=>{
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

export const ScheduleOfFlight=(booking_date,flight_id)=>{
    return new Promise((resolve,reject)=>{
        const sql=`SELECT id as schedule_id, flight_id, flight_date, departure_time,arrival_time, origin, destination FROM flight_schedules 
        WHERE flight_date=? AND flight_id=?`;
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