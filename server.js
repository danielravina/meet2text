var io = require('socket.io')(4000);

var currentSpeaker = ''
var isFirst = true
io.on('connection', function (socket) {
  console.log('user connection')

  socket.on('interim_transcript', function(message) {
    console.log(message)
    var message = {
      message: message.transcript,
      name: message.name,
      newSpeaker: (currentSpeaker != message.name),
      isFirst: isFirst,
      resultIndex: message.resultIndex
    }
    socket.broadcast.emit('speaking', message)
    socket.emit('speaking', message)
    currentSpeaker = message.name
    isFirst = false
  })
})
