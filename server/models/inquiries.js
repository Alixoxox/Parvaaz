
import mysql from "mysql"
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/dotenv.js'

const inquiries_tb=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    port:DB_PORT })

inquiries_tb.connect((err)=>{
    err? console.log("inquiries Table ran into an error",err) : console.log("Connected To inquiries Table")
})
// Create the inquiries table
const sql= ` CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,                       -- if the sender is a logged-in user
    name VARCHAR(100) NOT NULL,             -- if it's a guest, capture their name
    email VARCHAR(100) NOT NULL,            -- their reply-to address
    subject VARCHAR(150) DEFAULT NULL,      -- optional short summary
    message TEXT NOT NULL,                  -- the body of their inquiry
    status ENUM('open','closed')      -- track handling progress
    NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );`
    
inquiries_tb.query(sql,(error)=>{
    if(error){
        console.log("Failed to create inquiries Table: ",error);
    }
})
export default inquiries_tb;
