import { Router } from "express";
import flights_tb from "../models/flights_db.js";
const router = Router();

//show the list of 20 latest flight display
router.get('/',(req,res)=>{
    const sql=`SELECT f.flight_code,fs.departure_time,fs.arrival_time,fs.origin,fs.destination ,a.airline_code,a.name as airline_name, a.country as airline_country FROM flights f , airlines a ,flight_schedules fs
                WHERE f.airline_id = a.id AND fs.flight_id=f.id
                ORDER BY fs.departure_time DESC LIMIT 20;`
    flights_tb.query(sql,(error,result)=>{
        if(error){
            console.log(error)
            return res.json({message:"Error Generate Sample data"});
        }
        if(result.length>0){ 
           return res.json({result}) 
        }
       return res.json({message:"Data not found."})
    })
})
//search by flight_code ,country,airline secific, if seats available
router.post('/search',(req,res)=>{
    const {flight_code,country,airline_code}=req.body;
    if((flight_code && flight_code.trim()!=='') || (country && country.trim()!=='') || (airline_code && airline_code.trim()!=='')){
        const sql1=`SELECT f.flight_code,fs.departure_time,fs.arrival_time,fs.origin,fs.destination ,a.airline_code,a.name as airline_name, a.country as airline_country,fs.available_seats 
            FROM flights f , airlines a ,flight_schedules fs
            WHERE fs.available_seats!=0 AND (f.flight_code =? OR a.country=? OR a.airline_code=?) `;
        flights_tb.query(sql1,[flight_code||"",country||"",airline_code||""],(error,result)=>{
            if(error){
                console.log(error);
                return res.json({message:"Something went wrong please try again later"});
            }
            if(result.length>0){
                return res.json(result);
            }
            return res.json({message:"Data not found."});
        })
    }else{
        return res.json({message:"select at least one field"})
    }
})
export default router;