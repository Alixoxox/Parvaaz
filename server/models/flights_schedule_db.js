import mysql, { createConnection } from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const flight_schedule_tb=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

flight_schedule_tb.connect((err)=>{
    err? console.log("Schedules Table ran into an error",err) : console.log("Connected To schedules Table")
})

const sql=`CREATE TABLE IF NOT EXISTS flight_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    flight_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    available_seats INT NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    UNIQUE (flight_id, flight_date)
);
`
flight_schedule_tb.query(sql,(err)=>{
    if(err){
        console.log(err)
    }
})
export default flight_schedule_tb;