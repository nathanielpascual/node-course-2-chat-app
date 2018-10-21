const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) =>{
    console.log('New User connected');


    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
   
    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

   socket.on('createMessage',(newMessage)=>{
       console.log('createMessage',newMessage);

       socket.broadcast.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
   });
   
   socket.on('disconnect',()=>
    {
        console.log('User was disconnected')
    });
});

app.use(express.static(publicPath));

server.listen(port,() => {
    console.log(`Started on port ${port}`);
});