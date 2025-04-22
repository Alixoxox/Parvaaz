import mysql from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const staff_tb = mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

staff_tb.connect((err)=>{
    err? console.log("Staff Table ran into an error", err) : console.log("Connected To Staff Table")
})
const sql=`CREATE TABLE IF NOT EXISTS staff(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname_emp VARCHAR(50) NOT NULL,
    lname_emp VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,          -- security,cleaning etc
    shift_time VARCHAR(50) NOT NULL,
    service_id INT NOT NULL,

    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);`
staff_tb.query(sql,(err)=>{
    if(err){
        console.log(err)
    }
})

export default staff_tb;