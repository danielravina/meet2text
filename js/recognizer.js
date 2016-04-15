"use strict"

var avatars = {
  "doc": 'img/doc.png',
  "jason": 'img/',
}
var interim_transcript = '';

var name = prompt("What's your name?")
var currentSpeaking = '';
var socket = io('http://192.168.148.74:4000');

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

var $span;
var $meetingNotes = $('.meeting-notes')
var $messageContent = 0;
var currentResultIndex;

recognition.onstart = function() {
  console.log("Starting")
};

recognition.onerror = function(event) {
  console.log("error!", event.error)
};

recognition.onresult = function(event) {
  interim_transcript = '';

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    interim_transcript += event.results[i][0].transcript;
  }

  socket.emit('interim_transcript', { transcript: interim_transcript, name: name, resultIndex: event.resultIndex})

};

socket.on('speaking', function(data) {
  if (data.newSpeaker || data.isFirst) {
    var data = {
      name: data.name,
      avatar: 'http://placehold.it/150x150',
      time: moment().format("h:mm:ss a")
    }
    var template = new EJS({url: '/js/templates/message.ejs'}).render(data)

    $meetingNotes.append(template)

    $messageContent = $meetingNotes.find('.content-body')
  }

  if($messageContent) {
    if (currentResultIndex != data.resultIndex) {
      if(data.message) {
        $messageContent.append('<span></span>')
        $span = $messageContent.find('span').last()
      }
    }
    if (data.message && data.message.length > 0) {
      $span.html(data.message)
    }
  }
  currentResultIndex = data.resultIndex
})


recognition.start()
