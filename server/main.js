import {PORT} from './config/dotenv.js'
import express from 'express'
import cors from 'cors'
import userRouter from './routes/user_R.js'
import authenicator from './middleware/authenicate.js'
const app=express()

app.use(express.json());
app.use(cors()) // used to by pass cors Limitation by browser
app.use(authenicator);
app.use('/api/users',userRouter)


app.listen(PORT,()=>{
    console.log("Server running in Port : ",PORT);
})