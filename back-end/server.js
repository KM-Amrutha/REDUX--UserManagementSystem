import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from 'morgan';

import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((error) => console.log('MongoDB connection failed:', error.message));

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
