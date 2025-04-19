import { Router } from "express";
import airlines_tb from "../models/airlines_db.js";
const router = Router();

//fetch airline by code or country
router.post('/search',(req,res)=>{
    const {airline_code,country} =req.body
    if((airline_code && airline_code.trim()!=='') || (country && country.trim()!=="")){ //atleast one must be present -> checks if object defined and not empty
        const sql=`SELECT * FROM airlines WHERE airline_code= ? OR country=? `
        airlines_tb.query(sql,[airline_code||"",country||""],(error,result)=>{
            if(error){
                console.log(error);
                return res.json({message:"Please Try Again Later"});
            }
            if(result.length===0){
                return res.json({message:"Nothing matched with the pre-existent data"});
            }
            return res.json(result);
        })   
    }else{
        return res.json({message:"At least enter airline code or its country"})
    }
})


export default router;