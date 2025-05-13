import jwt  from "jsonwebtoken";
import { SECRET_KEY } from "../config/dotenv.js";

const initialV = (req) => {
    const authheader = req.headers.authorization;
    if (!authheader || !authheader.startsWith("Bearer ")) {
        throw new Error("Missing or malformed token");
    }
    const token = authheader.split(" ")[1];
    if (!token) {
        throw new Error("Token value missing after Bearer");
    }
    return token;
};
export const authenicator = (req, res, next) => {
    try {
        const token = initialV(req); // now this throws if token is missing
        const decoded = jwt.decode(token);
        if (decoded?.exp < Math.floor(Date.now() / 1000)) {
            return res.json({ message: "Session Expired. Please log in again." });
        }
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.log("JWT Verification Error:", err);
                return res.json({ message: "Invalid or expired token" });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        return res.json({ message: err.message || "Unauthorized" });
    }
};
export const CheckAdmin=(req,res,next)=>{
    try{
        const token=initialV(req,res)
        const decoded=jwt.decode(token);
        if(decoded?.exp < Math.floor(Date.now() / 1000) ){  //convert current time from miliseconds to seconds
            return res.json({message:"Session Expired. \nPlease Login In."})
        }
        jwt.verify(token,SECRET_KEY,(err,user)=>{
            if(err){
                console.log("Error occured at authenicator",err);
                return res.json({message:"Expired/Invalid Token"});
            }
            if(decoded.role!=="admin"){
                return res.json({message:"admin access only"});
            }
            req.user=user;
            next();
        })
    }catch(err){
        console.log(err)
    }
}
