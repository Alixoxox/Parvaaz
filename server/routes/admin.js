import { Router } from "express";
import airlines_tb from "../models/airlines_db.js";
import flights_tb from '../models/flights_db.js'
import flight_schedule_tb from "../models/flights_schedule_db.js";
const router=Router()

router.post('/',(req,res)=>{
    const {username,password} = req.body
    if(!username || ! password){
        return res.json({message:"Please Fill in the propper credentials"})
    }
    if(username==="admin" && password==="admin123"){
        return res.json({message:"Welcome admin"});
    }
    return res.json({message:"U Don't Have the Propper Credentials"});
})

const checkAirline=(airline_code)=>{
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

router.post('/create/flight',async(req,res)=>{
    const {origin,destination,departure_date,departure_time,arrival_time,airline_code,total_seats}=req.body;
    if( !origin || !destination|| !departure_date || !departure_time || !arrival_time || !total_seats ){
       return res.json({message:"Fill in the required fields"})
    }
    try{
        const airline_id=await checkAirline(airline_code)
        const flight_code=airline_code + Math.floor(Math.random() * 900 + 100)   //3-digit number between 100 and 999
        const sql=`INSERT INTO flights(airline_id,flight_code,total_seats) VALUES (?,?,?);`;
        flights_tb.query(sql,[airline_id,flight_code,total_seats],(error,result)=>{
            if(error){
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.json({ message: "This code already exists. Please use a unique airline code." });
                }
                console.log(error);
                return res.json({message:"Please Try Again Later"});
            }
            const flight_id=result.insertId
            const sql2=`INSERT INTO flight_schedules(flight_id, flight_date, departure_time, arrival_time,origin,destination, available_seats) VALUES (?,?,?,?,?,?,?);`;
            flight_schedule_tb.query(sql2,[flight_id,departure_date,departure_time,arrival_time,origin,destination,total_seats],(error,result)=>{
                if(error){
                    console.log(error);
                    return res.json({message:'Something went wront plz try again'})
                } return res.json({message:"successfully created flight route"});
            }) 
        })
    }catch(error){
        return res.json({message:error})
    }  
})

router.post('/create/airline',(req,res)=>{
        const { airline_code,airline_name,country,contact} = req.body
        if(!airline_code || !airline_name || !country || !contact){
            return res.json({message:"Please fill up the required fields"});
        }
        const sql=`INSERT INTO airlines(airline_code,name,country,contact) VALUES(?,?,?,?)`;
        airlines_tb.query( sql,[airline_code,airline_name,country,contact], (error,result)=>{
            if(error){
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.json({ message: "This code already exists. Please use a unique airline code." });
                }
            return res.json({message:"Please Try Again Later"})
            }
            return res.json({message:"airline successfully registerd"});
        })
})
export default router



