import { Router } from "express";
import user_tb from "../models/user_db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../config/dotenv.js";
import {authenicator} from '../middleware/authenicate.js'
import { upload } from "../utilis/imgUpload.js";

const router = Router();
router.post("/signup",upload.fields([
    { name: "passportScan", maxCount: 1 },
    { name: "cnicImg", maxCount: 1 }]),(req, res) => {
    try{
        const passportFile = req.files?.passportScan?.[0];
        const cnicFile = req.files?.cnicImg?.[0];

        const passportImg = passportFile?.path || null;
        const cnicImg = cnicFile?.path||null;
        const { fname, lname, email, passport_no, password ,nationality,dob,cnicNo} = req.body;
        if (!fname || !lname || !email || !passport_no ||!password ) {  //if any-field empty
           return res.json({fail:"Please fill out the propper credentails"});
        }
        const sql = `SELECT * FROM users WHERE email = ? OR passport_no=?;`;
        user_tb.query(sql, [email,passport_no],async(err, qres) => {
        if (err) {
            console.log("Error selecting data from users table", err);
            return res.json({fail:"Please Try Again Later\nSorry For the inconvenience"})
        }
        if (qres.length > 0) {
           return res.json({fail: "Email or Passport-no already taken"});
        }
        const hashed_pass= await bcrypt.hash(password,10)
        const put_data_sql=`INSERT INTO users (fname,lname,email, passport_no, password,nationality,passportImg,DOB,cnicNo,cnicImg) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?);;`
        user_tb.query(put_data_sql,[fname,lname,email,passport_no,hashed_pass,nationality,passportImg, dob && dob !== 'undefined' ? dob : null, cnicNo && cnicNo !== 'undefined' ? cnicNo : null,cnicImg],(error,result)=>{
            if(error){
                console.log("erorr inserting data",error);
                if(error.code==="ER_DUP_ENTRY"){ 
                    return res.json({ fail: " email or passport already taken" });
                } return res.json({message:"Please Try Again Later\nSorry For the inconvenience"})
            }else{
                const user={id:result.insertId,fname:fname,lname:lname,email:email,passport_no:passport_no,role:"user",DOB:dob,nationality,passportImg,cnicNo,cnicImg}
                const token=jwt.sign(user, SECRET_KEY, {expiresIn:'24h'})
                return res.json({token,user});
            }
          })
        });
    }catch(err){
        console.log(err);
        return res.json({fail:"somehing went wrong Please try again later"})}
});
router.post("/login", (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
          return res.json("Please fill out the propper credentails");
        }
        const sql= `SELECT * FROM users WHERE email=? ;`;
        user_tb.query(sql,[email], async(err,result)=>{
            if(err){
                console.log(err);
                return res.json({message:"Please Try Again Later\nSorry For the inconvenience"})
            }
            if(result.length>0){
                const data=result[0]
                const user={id:data.id,fname:data.fname,lname:data.lname,email:data.email,passport_no:data.passport_no,role:"user",DOB:data.DOB,nationality:data.nationality,passportImg:data.passportImg,cnicNo:data.cnicNo,phoneNo:data.phoneNo,cnicImg:data.cnicImg}
                const hashed_pass= await bcrypt.compare(password,data.password);
                if(hashed_pass){
                    const token=jwt.sign(user, SECRET_KEY, {expiresIn:'24h'})
                    return res.json({token,user});
                }
            }
            console.log('exiting query')
            return res.json({message:"user not Found.\nPlease Create a new Account"});
        })
    }catch(err){
        console.log(err);
        return res.json({message:"somehing went wrong Please try again later"})
    }
});
router.patch("/changePassword",authenicator,(req,res)=>{
    const user_id =req.user.id;
        if(!user_id){
            return res.json({message:"You must be a user to access this"})
        }
    const {oldPassword,newPassword}=req.body;
    
    const sq1='SELECT password FROM users WHERE id=?';
    user_tb.query(sq1,[user_id],async(error,result)=>{
        if(error){
            console.log(err);
            return res.json({message:"Sorry You must have an account"})
        }
        if(result.length>0){
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
        }
        return res.json({message:"You must have an account"})
    })
})
router.delete('/acc/delete',authenicator,(req,res)=>{
    const user_id=req.user.id;
    if(!user_id){
        return res.json({message:"You must be a user to delete an account"});
    }
    const sql=`DELETE FROM users WHERE id=?`;
    user_tb.query(sql,(error,result)=>{
        if(error){
            console.log(error)
            res.json({message:"Something went wrong please try again later"})
        }
        if(result.affectedRows===0){
            return res.json({message:"No User Found for this id"});
        }
        return res.json({message:"Successfully Deleted User Account"});
    })
})
router.put("/acc/update",authenicator,async(req,res)=>{
    try{
        console.log("Request body:", req.body);
        const user_id=req.user.id;
        if(!user_id){
            return res.json({message:"You must be a user to update account details"});
        }
        const {fname,email,lname,phoneNo,DOB,nationality,passport_no,cnic} = req.body
        if( !fname || !lname || !DOB ||!nationality ||!passport_no  ){
            return res.json({message:"Please give the required info"})
        }
        const sql="UPDATE users SET fname=?,lname=?,phoneNo=?,DOB=?,nationality=?,passport_no=?,cnicNo=? WHERE id=?"
        user_tb.query(sql,[fname,lname,phoneNo||"",DOB,nationality,passport_no ,cnic||"",user_id],(err,result)=>{
            if(err){
                console.log(err);
                return res.json({message:"Please. Try again later"})
            }if (result.affectedRows === 0) {
                return res.json({ message: "No pre defined user available" });
            }
            const user={id:user_id,fname,lname,email,role:"user",phoneNo:phoneNo||"",DOB,nationality,passport_no,cnic:cnic||""}
            const token=jwt.sign(user, SECRET_KEY, {expiresIn:'24h'})
            return res.json({token,user});
        })
    }catch(err){
        console.log(err);
        return res.json({message:err})
    }
})
router.get('/acc/info',authenicator,(req,res)=>{
    const user_id=req.user.id;
    console.log("req.user:", req.user); 
    if(!user_id){
        return res.json({message:"You must be a user to update account details"})
    }
    const sql='SELECT * FROM users WHERE id=?;';
    user_tb.query(sql,[user_id],(err,result)=>{
        if(err){
            console.log(err);
            return res.json({message:"Please Try again later"});
        }
        if(result.length>0){
            const data=result[0]
            const user={id:data.id,fname:data.fname,lname:data.lname,email:data.email,passport_no:data.passport_no,role:"user",DOB:data.DOB,nationality:data.nationality,passportImg:data.passportImg,cnicNo:data.cnicNo,phoneNo:data.phoneNo,cnicImg:data.cnicImg}
            return res.json(user)
        }
        return res.json({message:"Data of current user not available"})
    })
})

router.put('/acc/update/imgs', authenicator, upload.single('image'), (req, res) => {
    const user_id = req.user.id;
    if (!user_id) {
        return res.json({ message: "You must be a user to update account details" });
    }
    const imageType = req.body.type; // 'cnic' or 'passport'
    const imageUrl = req.file?.path;

    if (!imageType || !['cnic', 'passport'].includes(imageType) || !imageUrl) {
        return res.json({ message: "Invalid request. Make sure to send the image and type (cnic/passport)." });
    }
    const columnName = imageType === 'cnic' ? 'cnicImg' : 'passportImg';
    const sql = `UPDATE users SET ${columnName} = ? WHERE id = ?`;
    user_tb.query(sql, [imageUrl, user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.json({ message: "Something went wrong, please try later" });
        }
        if (result.affectedRows === 1) {
            return res.json({ success: `${imageType.toUpperCase()} image uploaded successfully!` });
        }
        return res.json({ message: "No predefined user available" });
        
    });
});
export default router;