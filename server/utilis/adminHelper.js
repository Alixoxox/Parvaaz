import flights_tb from "../models/flights_db.js";
import airlines_tb from "../models/airlines_db.js";
import flight_schedule_tb from "../models/flights_schedule_db.js";

export const checkFlightId=(flight_code)=>{
    return new Promise((resolve,reject)=>{
        const sql=`SELECT id FROM flights WHERE flight_code=?`;
        flights_tb.query(sql,[flight_code],(error,result)=>{
            if(error){
                return reject("Please try again later");
            }if(result.length>0){
                return resolve(result[0].id)
            }return reject("Enter a valid Flight code")
        })
    })
}
export const checkAirline=(airline_code)=>{
    return new Promise((resolve,reject)=>{
        const sql=`SELECT id FROM airlines WHERE airline_code=?`;
        airlines_tb.query(sql,[airline_code],(error,result)=>{
            if(error){
                console.log(error)
                return reject("Please Try again later")
            }if (result.length>0){
                return resolve(result[0].id)
            }return reject("Airline Not available");
        })
    })
}
export const CreateNewSchedule=(flight_id,departure_date,departure_time,arrival_time,origin,destination,total_seats)=>{
    return new Promise((resolve,reject)=>{
        const sql2=`INSERT INTO flight_schedules(flight_id, flight_date, departure_time, arrival_time,origin,destination, available_seats) VALUES (?,?,?,?,?,?,?);`;
        flight_schedule_tb.query(sql2,[flight_id,departure_date,departure_time,arrival_time,origin,destination,total_seats],(error,result)=>{
            if(error){
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject("This route already exists. Please create a new route." );
                }
                console.log(error);
                return reject('Something went wront plz try again')
            } return resolve("successfully created flight route");
        }) 
    })
}
