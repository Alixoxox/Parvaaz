import { Router } from "express";
import terminal_tb from "../models/terminal_db.js";
import staff_tb from "../models/staff_db.js";
import services_tb from "../models/service_db.js";
const router=Router();

router.get("/staff/show",(req,res)=>{
    const sql=`SELECT * FROM staff`;
    staff_tb.query(sql,(error,result)=>{
        if(error){
            console.log(error);
            return res.json({message:"Something went wrong"});
        }
        if(result.length>0){
            return res.json(result);
        }return res.json({message:"Sorry staff data has not been uploaded yet by the admin"});
    })
})

router.get('/terminals/show',(req,res)=>{
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

router.get('/services/show',(req,res)=>{
    const sql=`SELECT * FROM services;`;
    services_tb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return res.json({message:"Something went wrong please try again later"})
        }
        if(result.length>0){
            return res.json(result);
        }
        return res.json({message:"No service precreated to view"});
    })
})

export default router;