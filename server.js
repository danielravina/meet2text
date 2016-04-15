var io = require('socket.io')(4000);

io.on('connection', function (socket) {
  console.log('user connection')

  socket.on('interim_transcript', function(message) {
    // console.log(message.transcript);
    socket.emit('speaking', { message: message.transcript })
  })
// io.emit('tweet', tweet);
});
