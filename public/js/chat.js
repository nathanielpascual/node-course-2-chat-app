var socket = io();

socket.on('connect',function () {
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join',params,function (err){
        if(err){
            alert(err);
            window.location.href = "/";
        }
        else{
            console.log('no error');
        }

    });

});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);
});

socket.on('disconnect',function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList',function(users){
    console.log('Users List',users);
    var ol = jQuery('<ol></ol>');

    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template,{
        url : message.url,
        from : message.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);
});


jQuery('#message-form').on('submit',function (e){
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from : 'User',
        text :  messageTextbox.val()
    },function(){
        messageTextbox.val('');
    })
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(e){
    if(!navigator.geolocation)
    {
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled','disabled').text('Sending location ....');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Sending location');
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    },function() {
        locationButton.removeAttr('disabled').text('Sending location');
        alert('Unable to fetch location');
    });
    e.preventDefault();
});