import { Router } from "express";
import { CheckAdmin } from "../middleware/authenicate.js";
import staff_tb from "../models/staff_db.js";

const router=Router();

router.post("/new",CheckAdmin,(req,res)=>{
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

router.get("/show",(req,res)=>{
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

export default router;