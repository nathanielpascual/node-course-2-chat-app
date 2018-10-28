const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message');
var {generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
var {Users} = require('./utils/user');
var {Rooms} = require('./utils/room');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var rooms = new Rooms();

io.on('connection',(socket) =>{
    console.log('New User connected');


   socket.emit('updateRoomList',rooms.getRoomList());

   socket.on('join',(params,callback)=>{
       
        if(!isRealString(params.name)|| !isRealString(params.room))
        {
            return callback('Name and Room are required.')
        }

        socket.join(params.room);
        
        if(users.getUserByName(params.name))
        {
            return callback('Name already exist.')
        }

        if(!rooms.getRoom(params.room))
        {
            rooms.addRoom(params.room);
        }
        
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        //socket.leave()

        //io.emit
        //socket.broadcast.emit
        //socket.emit

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));

        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
   
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));
     
        callback();
    });

   socket.on('createMessage',(message,callback)=>{
     var user = users.getUser(socket.id);
     
      if(user &&  isRealString(message.text))
        {
            io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
        }
      
       callback();
   });

   socket.on('createLocationMessage',(coords) => {
      var user = users.getUser(socket.id);
    
      if(user)
        {
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
       
   });

   socket.on('disconnect',()=>
    {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room)); 
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room.`));  
        }
        console.log('User was disconnected')
    });
});

app.use(express.static(publicPath));

server.listen(port,() => {
    console.log(`Started on port ${port}`);
});