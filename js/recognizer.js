var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var final_span, interim_span;

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
  recognizing = true;
  console.log('info_speak_now');
  final_span = document.getElementById('final_span')
  interim_span = document.getElementById('interim_span')
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
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

recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
  if (!final_transcript) {
    console.log('info_start');
    return;
  }
};

recognition.onresult = function(event) {
  var interim_transcript = '';

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
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);
};

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

recognition.start()
