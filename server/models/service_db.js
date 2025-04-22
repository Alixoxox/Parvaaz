import mysql from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const services_tb = mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

services_tb.connect((err)=>{
    err? console.log("Services Table ran into an error", err) : console.log("Connected To Services Table")
})

const sql=`CREATE TABLE IF NOT EXISTS services(
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) ,
    terminal_no INT NOT NULL,

    FOREIGN KEY (terminal_no) REFERENCES terminal(id) ON DELETE CASCADE
);`
services_tb.query(sql,(err)=>{
    if(err){
        console.log(err);
    }
})
export default services_tb;