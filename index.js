import express from "express";
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
})

// estrutura pra armazenar, pois nao temos banco de dados
const messages = [];

io.on('connection', (socket) => {
  console.log(`socket conectado`, socket.id);

  socket.emit('previousMessages', messages); // pra nao perder as mensagens ao conectar

  socket.on('sendMessage', (data) => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data); // passa mensagem pra todos
  })

  socket.on('disconnect', () => {
    console.log('user desconectou');
  })
})


server.listen(3000, () => {
  console.log('Server listening on port 3000');
});