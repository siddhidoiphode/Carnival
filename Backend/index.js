import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import eventRoute from './routes/event.js'
import studentRoutes from './routes/student.js'
import guideRoutes from './routes/guide.js'
import noticeRoutes from './routes/notice.js'
import contactRoutes from './routes/contact.js'


dotenv.config();

const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// middleware for parsing request body
app.use(express.json());

// Middleware to handle cors policy
app.use(cors());

app.get('/',(req,res)=>{
    return res.status(234).send('Home Page is here')
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/events',eventRoute);
app.use('/api/v1/student',studentRoutes);
app.use('/api/v1/guide',guideRoutes);
app.use('/api/v1/notice',noticeRoutes);
app.use('/api/v1/contact', contactRoutes);

// app.use('/user',userRoutr);

mongoose.connect(MONGODB_URI)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.log(err);
})