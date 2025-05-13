import { Router } from "express";
import { authenicator } from "../middleware/authenicate.js";
import baggage_tb from "../models/baggage_db.js";

const router=Router()

const CalcExtraCharges=(weight,size_tag)=>{
    if(size_tag==="L"){
        return weight*1000
    }else if(size_tag==="XL"){
        return weight*2000
    }else if(size_tag==="XXL"){
        return weight*3000
    }return 0
}

router.post("/new",authenicator,(req,res)=>{
    try{
        const {booking_id, weight , size_tag}=req.body;
        if(!booking_id || !weight || !size_tag ){
            return res.json({message:"You must pass booking_id,weight and size_tag"});
        }
        let capsSizetag=size_tag.toUpperCase()
        const extra_charge=CalcExtraCharges(weight,capsSizetag)
        const sql=`INSERT INTO baggage(booking_id,weight,size_tag,extra_charge) VALUES(?,?,?,?);`;
        baggage_tb.query(sql,[booking_id,weight,capsSizetag,extra_charge],(err,result)=>{
            if(err){
                console.log(err);
                return res.json({message:"Please Try Again Later"});
            }return res.json({message:"Your Baggage has been stored successfully.",id:result.insertId})
        })
    }catch(err){
        console.log(err)
    }
})

router.get("/show",authenicator,(req,res)=>{
    const user_id =req.user.id;
    if(!user_id){
        return res.json({message:"You must be a user to access this"})
    }
    const sql=`SELECT 
        ba.id AS baggage_id,  -- Baggage ID
        ba.booking_id,        -- Booking ID
        ba.weight,            -- Baggage weight
        ba.size_tag,          -- Baggage size tag
        ba.extra_charge,      -- Extra charge for baggage
        b.flight_id,          -- Flight ID
        b.flight_schedule,    -- Flight schedule ID
        fs.flight_date,       -- Flight date
        fs.departure_time,    -- Departure time
        fs.arrival_time,      -- Arrival time
        fs.origin,            -- Flight origin
        fs.destination        -- Flight destination
    FROM 
        baggage ba
    JOIN 
        bookings b ON ba.booking_id = b.id  -- Join baggage with bookings
    JOIN 
        flight_schedules fs ON b.flight_schedule = fs.id  -- Join bookings with flight_schedules
    WHERE 
        b.user_id = ?;  -- Filter by user ID`
    
    baggage_tb.query(sql,[user_id],(err,result)=>{
        if(err){
            console.log(err);
            return res.json({message:"Something Went wrong. PLease try again later"});
        }
        if(result.length>0){
            return res.json({message:"Showing Baggage Details",details:result})
        }
        return res.json({message:"Sorry You must be a user to actively view the data"});
    })
})


export default router;