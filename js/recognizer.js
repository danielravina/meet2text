"use strict"

var interim_transcript = '';

var name = prompt("What's your name?")
var currentSpeaking = '';
var socket = io('http://192.168.148.74:4000');

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

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

  socket.emit('interim_transcript', { transcript: interim_transcript, name: name })

};

socket.on('speaking', function(data) {

  if (data.newSpeaker) {
  }

  messageBox.innerHTML = data.message
})

socket.on('connect', function() {
  console.log("Client connected")
  recognition.start()
})
