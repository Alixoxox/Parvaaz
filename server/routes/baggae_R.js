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

router.post("/",authenicator,(req,res)=>{
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
    const user_id=req.user.id
    const sql=`SELECT ba.id as baggae_id,ba.booking_id ,ba.weight, ba.size_tag,ba.extra_charge,b.flight_id, b.flight_schedule ,fs.flight_date, fs.departure_time, fs.arrival_time, fs.origin, fs.destination 
    FROM baggage ba, bookings b, flight_schedules fs 
    WHERE ba.booking_id=b.id AND b.flight_schedule=fs.id AND b.user_id=? `

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