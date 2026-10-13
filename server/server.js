import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PlanPulse Real-Time Server', time: new Date() });
});

let activeMembers = [];

io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  socket.on('member:join', (user) => {
    socket.user = user;
    if (user && !activeMembers.find((m) => m.id === user.id)) {
      activeMembers.push({ ...user, socketId: socket.id });
    }
    io.emit('members:active', activeMembers);
  });

  socket.on('task:move', (data) => {
    socket.broadcast.emit('task:moved', data);
  });

  socket.on('task:create', (data) => {
    socket.broadcast.emit('task:created', data);
  });

  socket.on('comment:add', (data) => {
    socket.broadcast.emit('comment:added', data);
  });

  socket.on('disconnect', () => {
    activeMembers = activeMembers.filter((m) => m.socketId !== socket.id);
    io.emit('members:active', activeMembers);
  });
});

httpServer.listen(PORT, () => {
  console.log('🚀 PlanPulse Real-Time Server running on http://localhost:' + PORT);
});
