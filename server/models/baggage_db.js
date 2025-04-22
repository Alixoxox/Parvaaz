import mysql, { createConnection } from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const baggage_tb=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

baggage_tb.connect((err)=>{
    err? console.log("Baggage Table ran into an error", err) : console.log("Connected To Baggage Table")
})

const sql=`CREATE TABLE IF NOT EXISTS baggage(
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    weight FLOAT NOT NULL,             -- In kgs
    size_tag VARCHAR(10),              -- like 'S', 'L', 'XL',"XXL"
    extra_charge FLOAT DEFAULT 0.0,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);`
baggage_tb.query(sql,(error)=>{
    if(error){
        console.log(error);
    }
});

export default baggage_tb;