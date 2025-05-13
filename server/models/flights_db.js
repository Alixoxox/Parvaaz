import mysql from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const flights_tb = mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

flights_tb.connect((err)=>{
    err? console.log("Flights Table ran into an error", err) : console.log("Connected To Flights Table")
})

const sql=`CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT NOT NULL,
    flight_code VARCHAR(10) NOT NULL UNIQUE,
    total_seats INT NOT NULL DEFAULT 200,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);`

flights_tb.query(sql,(error)=>{
    if(error){
        console.log("Error Occured while creating Flights table",error);
    }
})
export default flights_tb;