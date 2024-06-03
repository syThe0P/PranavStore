import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'


//Utilities
import connectDB from './config/db.js'
//Routes
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/OrderRoutes.js'

dotenv.config()
const port = process.env.PORT || 8080

connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors());


//routes
app.use('/api/v1', userRoutes);
app.use('/api/v1',productRoutes);
app.use('/api/v1', orderRoutes)

app.listen(port, ()=> console.log(`Server running on port ${port}`))