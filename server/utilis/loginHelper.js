import user_tb from "../models/user_db.js";

export const usernameNotTaken=(username)=>{
    return new Promise((resolve,reject)=>{
        const sql=`SELECT * FROM users WHERE username=?`;
        user_tb.query(sql,[username],(error,result)=>{
            if(err){
                console.log(err);
                return reject(err)
            }
            if(result.length>0){
                return reject("Username already Taken");
            }
            return resolve(true)
        })
    })
}
export const emailNotTaken=(email)=>{
    return new Promise((resolve,reject)=>{
        const sql="SELECT * FROM users WHERE email=?";
        user_tb.query(sql,[email],(err,result)=>{
            if(err){
                console.log(err);
                return reject(err)
            }
            if(result.length>0){
                return reject("Email already Taken");
            }
            return resolve(true)
        })
    })
}