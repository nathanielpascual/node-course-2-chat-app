jQuery(function() {
    jQuery('#errorMessage').hide();
});

var socket = io();

socket.on('connect',function(){
    socket.on('updateRoomList',function (rooms){
        rooms.forEach(function(room) {
            jQuery('#active__rooms').append(`<option value ="${room.name}"`);
        });
    });
});

socket.on('disconnect',function(){
    console.log('Disconnected from chat');
});
