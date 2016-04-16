var io = require('socket.io')(4000);

var currentSpeaker = ''
var isFirst = true
var atendees = []

io.on('connection', function (socket) {
  var sendMessage = function(name ,data) {
    socket.broadcast.emit(name, data)
    socket.emit(name, data)
  }

  socket.on('clientJoined', function(client){
    console.log('clientJoined welcome!', client)
    atendees.push(client.name)
    sendMessage('update-atendees' , atendees)
  })

  socket.on('interim_transcript', function(message) {
    var message = {
      message: message.transcript,
      name: message.name,
      newSpeaker: (currentSpeaker != message.name),
      isFirst: isFirst,
      resultIndex: message.resultIndex,
      avatar: message.avatar
    }
    sendMessage('speaking' ,message)
    currentSpeaker = message.name
    isFirst = false
  })
})

