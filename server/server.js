import express from 'express';
import cors from 'cors';    //cors allows communication b/w different ports
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const app = express()

app.use(express.json());
app.use(cors());

// This returns a Promise so we're just checking if everything went well
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected succesfully');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch ((error) => {
    console.error('MongoDB connectione error:', error);
})


;


