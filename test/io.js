var socket = io('http://localhost:3000');
var $text = $('#test');
socket.on('connected',function(msg) {
    console.log('connected');
    console.log(msg);
});
socket.on('oe', function(msg) {
    console.log('event oe');
    console.log(msg);
});
socket.emit('oe',{left:30});
socket.emit('oe',{right:40});
socket.emit('oe',{1:40});
socket.emit('oe',{2:40});
socket.emit('oe',{3:40});
socket.emit('oe',{4:40});
socket.emit('oe',{5:40});
socket.emit('oe',{6:40});
socket.emit('oe',{7:40});
