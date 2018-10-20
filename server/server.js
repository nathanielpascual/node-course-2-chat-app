const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) =>{
    console.log('New User connected');

    socket.emit('newMessage', {
        from : 'nathan',
        text : 'hello everyone',
        createdAt : 123
    });

    socket.on('createMessage',(newMessage)=>{
       console.log('createMessage',newMessage);
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