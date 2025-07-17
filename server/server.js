import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';    //cors allows communication b/w different ports
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import chatRoute from './routes/chat.js';
import messageRoute from './routes/message.js';
import userRoute from './routes/user.js';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', registerRoute);
app.use('/api/auth', loginRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.use('/api/users', userRoute);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on('new message', (newMessage) => {
        const chatId = newMessage.chat;     //This is the chat field we included when making the messageSchema

        // Broadcasts the message to everyone in that chat room except the sender.
        socket.to(chatId).emit('message received', newMessage); 
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// This returns a Promise so we're just checking if everything went well
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected succesfully');

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch ((error) => {
    console.error('MongoDB connectione error:', error);
});


