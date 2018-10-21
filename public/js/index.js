var socket = io();

socket.on('connect',function () {
    console.log('connected to server');
});

socket.on('newMessage', function(message) {
    console.log('New Message:',message);

    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('disconnect',function () {
    console.log('Disconnected from server');
});

socket.emit('createMessage',{
    from : 'Frank',
    text : 'hi'
}, function (data){
    console.log('Got it',data);
});


jQuery('#message-form').on('submit',function (e){
    e.preventDefault();

    socket.emit('createMessage',{
        from : 'User',
        text : jQuery('#message').val()
    },function(e){

    })
});