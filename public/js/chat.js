

var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect',function () {
    console.log('Connect');
   
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
    var params = jQuery.deparam(window.location.search);
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);

     var list = jQuery('#messages').children('li:last-child');
     var title = jQuery('.message__title');
     var body; 
     var name = '';

     jQuery('.message__title h4').each(function(){
         if($(this).text()===params.name)
         {
          if(message.from === params.name) {
                $(this).parent().parent().removeClass('message_container');
                $(this).parent().parent().addClass('message__container dark');
                $(this).parent().removeClass('message__title');
                $(this).parent().addClass('message__title pull-right clear');
                body = $(this).parent().parent().children('.message__body');
                body.removeClass('message__body'); 
                body.addClass('message__body pull-right clear');
            }
         }
         else
         {
            $(this).parent().parent().removeClass('message_container');
            $(this).parent().parent().addClass('message__container light');
         }
     });

    // if (message.from === 'Admin') {
    //     list.css({'display':'table', 'margin':'0 auto'});
    // }
    scrollToBottom();
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
    var params = jQuery.deparam(window.location.search);
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template,{
        url : message.url,
        from : message.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);
    
    var list = jQuery('#messages').children('li:last-child');
    jQuery('.message__title h4').each(function(){
        if($(this).text()===params.name)
        {
         if(message.from === params.name) {
               $(this).parent().parent().removeClass('message_container');
               $(this).parent().parent().addClass('message__container dark');
               $(this).parent().removeClass('message__title');
               $(this).parent().addClass('message__title pull-right clear');
               body = $(this).parent().parent().children('.message__body');
               body.removeClass('message__body'); 
               body.addClass('message__body pull-right clear');
           }
        }
        else
        {
           $(this).parent().parent().removeClass('message_container');
           $(this).parent().parent().addClass('message__container light');
        }
    });
    scrollToBottom();
});


jQuery('#message-form').on('submit',function (e){
    e.preventDefault();
    var params = jQuery.deparam(window.location.search);

    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
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

