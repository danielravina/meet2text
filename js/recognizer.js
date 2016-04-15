"use strict"

var final_transcript = '';
var interim_transcript = '';
var ignore_onend;
var start_timestamp;


var socket = io('http://127.0.0.1:4000');

var recognition = new webkitSpeechRecognition();
var message = document.getElementById('speaking')

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
  console.log('Starting..')
};

recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    console.log('info_no_speech');
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    console.log('info_no_microphone');
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    if (event.timeStamp - start_timestamp < 100) {
      console.log('info_blocked');
    } else {
      console.log('info_denied');
    }
    ignore_onend = true;
  }
};

recognition.onresult = function(event) {

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      console.log("final_transcript")
      final_transcript += event.results[i][0].transcript;
    } else {
      console.log("interim_transcript")
      interim_transcript += event.results[i][0].transcript;
    }
  }

  final_transcript = capitalize(final_transcript);

  socket.emit('interim_transcript', { transcript: interim_transcript })
  // socket.emmit('final_transcript', final_transcript)
};

socket.on('speaking', function(data) {
  console.log(data)
  message.innerHTML = data.message
})

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

recognition.start()





