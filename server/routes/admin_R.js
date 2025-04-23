import { Router } from "express";
import { CreateNewSchedule,checkFlightId,checkAirline,checkTerminal } from "../utilis/adminHelper.js";
import { CheckAdmin } from "../middleware/authenicate.js";
import airlines_tb from "../models/airlines_db.js";
import flights_tb from '../models/flights_db.js';
import terminal_tb from "../models/terminal_db.js";
import services_tb from "../models/service_db.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/dotenv.js";
const router=Router()
//admin loging
router.post('/login',(req,res)=>{
    const {username,password} = req.body
    if(!username || ! password){
        return res.json({message:"Please Fill in the propper credentials"})
    }
    if(username==="admin" && password==="admin123"){
        const user={username,role:"admin"}
        const token=jwt.sign(user,SECRET_KEY,{expiresIn:"12h"})
        return res.json({message:"Welcome admin",token,user});
    }
    return res.json({message:"You Don't Have the Propper Credentials"});
})
//flight+schedule
router.post('/create/flight',CheckAdmin,async(req,res)=>{
    const {origin,destination,departure_date,departure_time,arrival_time,airline_code,total_seats,terminal_no}=req.body;
    if( !origin || !destination|| !departure_date || !departure_time || !arrival_time || !total_seats || !terminal_no){
       return res.json({message:"Fill in the required fields"})
    }
    try{
        checkTerminal(terminal_no)
        const airline_id=await checkAirline(airline_code)
        const flight_code=airline_code + Math.floor(Math.random() * 900 + 100)   //3-digit number between 100 and 999
        const sql=`INSERT INTO flights(airline_id,flight_code,total_seats) VALUES (?,?,?);`;
        flights_tb.query(sql,[airline_id,flight_code,total_seats],async(error,result)=>{
            if(error){
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.json({ message: "This code already exists. Please use a unique airline code." });
                }
                console.log(error);
                return res.json({message:"Please Try Again Later"});
            }
            const flight_id=result.insertId
            const x=await CreateNewSchedule(flight_id,departure_date,departure_time,arrival_time,origin,destination,total_seats,terminal_no);
            return res.json({message:x})
        })
    }catch(error){
        return res.json({message:error})
    }  
})

router.post('/create/airline',CheckAdmin,(req,res)=>{
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
//flight_schedule
router.post("/create/schedule",CheckAdmin,async(req,res)=>{
    try{
        const {flight_code,departure_date,departure_time,arrival_time,origin,destination,total_seats}=req.body
        console.log(flight_code,departure_date,departure_time,arrival_time,origin,destination,total_seats)
        const flight_id=await checkFlightId(flight_code)
        console.log(flight_id)
        const x=await CreateNewSchedule(flight_id,departure_date,departure_time,arrival_time,origin,destination,total_seats);
        console.log(x)
        return res.json({message:x})
    }catch(err){
        return res.json({message:err})
    }
})

router.post("/create/terminal",CheckAdmin,(req,res)=>{
    const {location,capacity,gates }=req.body;
    if(! location || !(capacity > 0) || !(gates > 0)){
        return res.json({message:"Enter all the required fields"});
    }
    let newloc=location.charAt(0).toUpperCase() + location.slice(1);
    const sql=`INSERT INTO terminal(location,max_capacity,no_of_gates) VALUES (?,?,?);`
    terminal_tb.query(sql,[newloc,capacity,gates],(Error,result)=>{
        if(Error){
            console.log(Error);
            return res.json({message:"Please Try again later"})
        }
        return res.json({message:`Terminal no ${result.insertId} created successfully`});
    })
})

router.post("/create/staffid",CheckAdmin,(req,res)=>{
    const {fname,lname,role,shift_time,service_id } = req.body   //emp data
    if(!fname || !lname || !role || !shift_time || !service_id){
        return res.json({message:"Enter all the given fields"});
    }
    const sql="INSERT INTO staff(fname_emp,lname_emp,role,shift_time,service_id) VALUES (?,?,?,?,?);";
    staff_tb.query(sql,[fname,lname,role,shift_time,service_id],(error,result)=>{
        if(error){
            console.log(error);
            return res.json({message:"Something went wrong please try again later"});
        }
        return res.json({message:`Successfully created staff ${fname +" "+lname} info`})
    })
})

router.post('/create/service',CheckAdmin,(req,res)=>{
    try{
        const {terminalno,service_name, description} = req.body
        if(!terminalno || !service_name){
            return res.json({message:"You must at least enter terminalno and service_name"});
        }
        checkTerminal(terminalno);
        const sql=`INSERT INTO services(service_name,description,terminal_no) VALUES (?,?,?);`
        services_tb.query(sql,[service_name,description,terminalno],(err,result)=>{
            if(err){
                console.log(err);
                return res.json({message:"Something went wrong please try again later"})
            }
            return res.json({message:`Service ${result.insertId} Successfully created`})
        })
    }catch(err){
        console.log(err);
        return res.json({message:err})
    }
})
export default router