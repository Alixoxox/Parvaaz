import mysql, { createConnection } from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const booking_tb=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

booking_tb.connect((err)=>{
    err? console.log("Bookings Table ran into an error", err) : console.log("Connected To Bookings Table")
})
const sql=`CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_no INT NOT NULL,
    flight_schedule INT NOT NULL,
    cabin_class ENUM('economy', 'business', 'first', 'premium_economy') NOT NULL DEFAULT 'economy',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_schedule) REFERENCES flight_schedules(id) ON DELETE CASCADE, 
    UNIQUE ( seat_no,flight_schedule)     -- To make sure one seat can't be double-booked
);`
booking_tb.query(sql,(error)=>{
    if(error){
        console.log(error)
    }
})

// 2) Promise wrapper
export function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
      booking_tb.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  
export default booking_tb;