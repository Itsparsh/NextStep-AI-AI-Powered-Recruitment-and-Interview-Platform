const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev, allow all. In prod, restrict to client URL.
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB with timeout protection
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.log('MongoDB connection notice (operating with in-memory auth store):', err.message));

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/candidate', require('./routes/candidateRoutes'));
app.use('/api/recruiter', require('./routes/recruiterRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'NextStep AI Backend is running!' });
});

// Fallback 404 for unhandled API requests
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Serve Frontend in Production/Merged mode
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Socket.io for WebRTC Signaling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    // Notify others in the room
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

