"use strict"

var avatars = {
  "doc": 'assets/img/doc_photo.jpeg',
  "jason": 'assets/img/jason_photo.jpeg',
  "matias": 'assets/img/matias_photo.jpeg'
}
var interim_transcript = '';
var defaultAvatar = 'assets/img/default_photo.png';

EJS.config({cache: false});

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
var $atendeelist = $('.atendee-list')

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

  socket.emit('interim_transcript', { transcript: interim_transcript, name: name, resultIndex: event.resultIndex, avatar: avatars[name]})

};

socket.on('speaking', function(data) {
  if (data.newSpeaker || data.isFirst) {
    var data = {
      name: data.name,
      avatar: (data.avatar || defaultAvatar),
      time: moment().format("h:mm a")
    }
    var MessageTemplate = new EJS({url: '/js/templates/message.ejs'}).render(data)

    $meetingNotes.append(MessageTemplate)

    $messageContent = $meetingNotes.find('.content-body')
  }

  if($messageContent) {
    if (currentResultIndex != data.resultIndex) {
      if(data.message && data.message.length > 0) {
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

socket.on('connect', function() {
  socket.emit('clientJoined', { name: name })
});

socket.on('update-atendees', function(atendees) {
  $atendeelist.html('<li>' + atendees.join('</li><li>'))
});

recognition.start()
