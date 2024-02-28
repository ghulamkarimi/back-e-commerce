import express from 'express';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect';
import userRouter from './routes/userRouter'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config();
dbConnect()

const app = express();
const PORT = process.env.PORT || 3600;

app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(userRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))