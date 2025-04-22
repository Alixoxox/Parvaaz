import { Router } from "express";
import { CheckAdmin } from "../middleware/authenicate.js";
import terminal_tb from "../models/terminal_db.js";

const router=Router();

router.post("/new",CheckAdmin,(req,res)=>{
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

router.get('/show',(req,res)=>{
    const sql="SELECT * FROM terminal";
    terminal_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return res.json({message:"Something went wrong please try again later"});
        }
        if(result.length>0){
            return res.json(result)
        }return res.json({message:"Sorry there are no active terminal as of now"});
    })
})


export default router