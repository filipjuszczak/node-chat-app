const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const chalk = require('chalk');

const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
} = require('./utils/users');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR_PATH = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(PUBLIC_DIR_PATH));

io.on('connection', (socket) => {
  console.log('New WebSocket connection!');

  socket.on('join', ({ username, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) return cb(error);

    socket.join(user.room);

    const msgObj = generateMessage(
      'Server',
      `👋 Hello, ${user.username}! Welcome to chat!`,
    );

    socket.emit('message', msgObj);

    const msgObj2 = generateMessage(
      'Server',
      `👋 ${user.username} has joined!`,
    );

    socket.broadcast.to(user.room).emit('message', msgObj2);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    cb();
  });

  socket.on('sendMessage', (message, cb) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return cb('❌ Profanity is not allowed!');
    }

    const user = getUser(socket.id);
    const msgObj = generateMessage(user.username, message);

    io.to(user.room).emit('message', msgObj);

    cb();
  });

  socket.on('sendLocation', (coordsObj, cb) => {
    const user = getUser(socket.id);
    const locationObj = generateLocationMessage(user.username, coordsObj);

    io.to(user.room).emit('locationMessage', locationObj);

    cb();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  const message = chalk.green.inverse(`✅ Server is up on port ${PORT}!`);
  console.log(message);
});
