import { Router } from "express";
import user_tb from "../models/user_db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../config/dotenv.js";
import {authenicator} from '../middleware/authenicate.js'
const router = Router();
//add authenicate func here with jwt
router.post("/signup", (req, res) => {
    try{
        const { username, fname, lname, email, password } = req.body;
        if (!username || !fname || !lname || !email || !password) {  //if any-field empty
           return res.json("Please fill out the propper credentails");
        }
        
        const sql = `SELECT * FROM users WHERE username = ? OR email = ?;`;
        user_tb.query(sql, [username,email],async(err, qres) => {
        if (err) {
            console.log("Error selecting data from users table", err);
            return res.json({message:"Please Try Again Later\nSorry For the inconvenience"})
        }
        if (qres.length > 0) {
           return res.json({message: "username or email already taken"});
        }
        const hashed_pass= await bcrypt.hash(password,10)
        const put_data_sql=`INSERT INTO users (username,fname,lname,email,password) VALUES (?,?,?,?,?);`
        user_tb.query(put_data_sql,[username,fname,lname,email,hashed_pass],(error,result)=>{
            if(error){
                console.log("erorr inserting data",error);
                if(err.code==="ER_DUP_ENTRY"){ 
                    return res.json({ message: "username or email already taken" });
                } return res.json({message:"Please Try Again Later\nSorry For the inconvenience"})
            }else{
                const user={id:result.insertId,username:username,fname:fname,lname:lname,email:email,role:"user"}
                const token=jwt.sign(user, SECRET_KEY, {expiresIn:'24h'})
                return res.json({message:"User successfully created",token,user});
            }
          })
        });
    }catch(err){
        console.log(err)}
});

router.post("/login", (req, res) => {
    try{
        const { username, password } = req.body;
        if (!username || !password) {
          return res.json("Please fill out the propper credentails");
        }

        const sql= `SELECT * FROM users WHERE username=? ;`;
        user_tb.query(sql,[username], async(err,result)=>{
            if(err){
                console.log(err);
                return res.json({message:"Please Try Again Later\nSorry For the inconvenience"})
            }
            if(result.length>0){
                const data=result[0]
                const user={id:data.id,username:data.username,fname:data.fname,lname:data.lname,email:data.email,role:"user"}
                const hashed_pass= await bcrypt.compare(password,data.password);
                if(hashed_pass){
                    const token=jwt.sign(user, SECRET_KEY, {expiresIn:'24h'})
                    return res.json({message:"successfully logged in",token,user});
                }
            }
            return res.json({message:"user not Found.\nPlease Create a new Account"});
        })
    }catch(err){
        console.log(err)
    }
});

router.patch("/changePassword",authenicator,(req,res)=>{
    const user_id=req.user.id;
    const {oldPassword,newPassword}=req.body;
    
    const sq1='SELECT password FROM users WHERE id=?';
    user_tb.query(sq1,[user_id],async(error,result)=>{
        if(error){
            console.log(err);
            return res.json({message:"Sorry You must have an account"})
        }
        const recoveredPass=result[0].password;
        const issame=await bcrypt.compare(oldPassword,recoveredPass)
        if(issame){
            const newhashedpass=await bcrypt.hash(newPassword,10)

            const sql2='UPDATE users SET password=? WHERE id=?;';
            user_tb.query(sql2,[newhashedpass,user_id],(error2,result2)=>{
                if(error2){
                    console.log("ERROR",error2);
                    return res.json({message:"Something went wrong please try again later"});
                }
                return res.json({message:"Successfully Updated Password"})
            })
        }else{
            return res.json({message:"Sorry Your password doesnt match with the old password."})
        }
    })
})
export default router;