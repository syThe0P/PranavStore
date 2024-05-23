import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


//Utilities
import connectDB from './config/db.js'
//Routes
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()
const port = process.env.PORT || 3000

connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


//routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/',productRoutes);

app.listen(port, ()=> console.log(`Server running on port ${port}`))