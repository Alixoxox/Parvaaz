import { Router } from "express";
import user_tb from "../models/user_db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../config/dotenv.js";
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
                if(err.code="ER_DUP_ENTRY"){ 
                    return res.json({ message: "username or email already taken" });
                } return res.json({message:"Please Try Again Later\nSorry For the inconvenience"})
            }else{
                const user_data={username,fname,lname,email};
                const token=jwt.sign(user_data, SECRET_KEY, {expiresIn:'24h'})
                return res.json({message:"User successfully created",token,user_data});
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
                const user=result[0]
                const hashed_pass= await bcrypt.compare(password,user.password);
                if(hashed_pass){
                    const user_data={username,fname:user.fname,lname:user.lname,email:user.email};
                    const token=jwt.sign(user_data, SECRET_KEY, {expiresIn:'24h'})
                    return res.json({message:"successfully logged in",token,user_data});
                }
            }
            return res.json({message:"user not Found.\nPlease Create a new Account"});
        })
    }catch(err){
        console.log(err)
    }
});

export default router;
