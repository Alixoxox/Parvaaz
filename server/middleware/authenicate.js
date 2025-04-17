import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/dotenv.js";
const authenicator=(req,res,next)=>{
    try{
        const authheader=req.headers.authorization; //authorization header 
        if(!authheader || !authheader.startsWith("Bearer ")){
            return res.json({message:"Please start with : Bearer token_val"});
        }
        const token=authheader.split(" ")[1];
        if(!token){
            return res.json({message:"You forgot to put token val after Bearer"});
        }
        const decoded=jwt.decode(token);
        if(decoded?.exp < Math.floor(Date.now() / 1000) ){  //convert current time from miliseconds to seconds
            return res.json({message:"Session Expired. \nPlease Login In."})
        }
        jwt.verify(token,SECRET_KEY,(err,user)=>{
            if(err){
                console.log("Error occured at authenicator",err);
                return res.json({message:"Expired/Invalid Token"});
            }
            req.user=user;
            console.log(req.user);
            console.log("Passed authenicator");
            next();
        })
    }catch(err){
        console.log("Error occured at authenicator");
    }
}
export default authenicator;