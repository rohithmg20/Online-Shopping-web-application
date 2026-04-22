const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const seedDatabase = require('./seed');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ FATAL ERROR: MONGO_URI is missing in .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
      console.log('⚡ MongoDB Connected successfully to:', MONGO_URI);
      await seedDatabase();
  })
  .catch(err => {
      console.error('❌ MongoDB Connection Error. Please ensure local MongoDB is running.', err);
      process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items')); // Keeping legacy for DB seeding
app.use('/api/payment', require('./routes/payment'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/search', require('./routes/search'));
app.use('/api/reviews', require('./routes/reviews'));

// Sample Route
app.get('/', (req, res) => {
    res.send('PriceHunt Active API Server');
});

// Socket.IO Integration for chat
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
});
