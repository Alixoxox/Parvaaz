import { Router } from "express";
import services_tb from "../models/service_db.js";
import { CheckAdmin } from "../middleware/authenicate.js";
import { checkTerminal } from "../utilis/adminHelper.js";
const router = Router();

router.post('/new',CheckAdmin,(req,res)=>{
    try{
        const {terminalno,service_name, description} = req.body
        if(!terminalno || !service_name){
            return res.json({message:"You must at least enter terminalno and service_name"});
        }
        checkTerminal(terminalno);
        const sql=`INSERT INTO services(service_name,description,terminal_no) VALUES (?,?,?);`
        services_tb.query(sql,(err,result)=>{
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

router.get('/show',(req,res)=>{
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