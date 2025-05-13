import mysql, { createConnection } from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const airlines_tb=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

airlines_tb.connect((err)=>{
    err? console.log("Airlines Table ran into an error",err) : console.log("Connected To airlines Table")
})

const sql=`CREATE TABLE IF NOT EXISTS airlines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline_code VARCHAR(10) NOT NULL UNIQUE,  -- Optional PIA , UAE
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL,
    contact VARCHAR(100) ,
    info VARCHAR(255)
);`;

airlines_tb.query(sql,(error)=>{
    if(error){
        console.log("Error Occured while creating airlines table",error) };
})

export default airlines_tb;