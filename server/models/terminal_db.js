import mysql, { createConnection } from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const terminal_tb=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

terminal_tb.connect((err)=>{
    err? console.log("Terminal Table ran into an error",err) : console.log("Connected To terminal Table")
})

const sql=`CREATE TABLE IF NOT EXISTS terminal(
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(50) NOT NULL,       -- Domestic, International
    max_capacity INT NOT NULL,           -- people it can contain
    no_of_gates INT NOT NULL
);`

terminal_tb.query(sql,(err)=>{
    if(err){
        console.log(err);
    }
})

export default terminal_tb;