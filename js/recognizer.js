"use strict"

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
    $meetingNotes.append('<div class="message"><span class="speaker">'+ data.name +':</span><div class="content"></div></div>')
    $messageContent = $meetingNotes.find('.content')
  }

  if($messageContent) {
    if (currentResultIndex != data.resultIndex) {
      $messageContent.append('<span></span>')
      $span = $messageContent.find('span').last()
    }
    $span.html(data.message)
  }
  currentResultIndex = data.resultIndex
})


recognition.start()
