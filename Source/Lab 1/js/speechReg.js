/*
This template was extracted as one of the demo guides on GitHub. This API is built in the Chrome Browser version 26 or later.

The API is contained within the window.SpeechRecognition (which used to be webkitSpeechRecognition)
Therefore it is important to note both names and assign it to Speech Recognition to widen the selection and variety

If the browser does not support this API, the catch function will execute with an error that says no-browser support.
The no-browser support is already placed within the html file, but hidden until error occurs.
*/
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}
/* *
noteTextarea is used to reference the myInput element in the newhome.html
noteContent is used to capture the transcript from the Voice Recognition tool
instructions is used to display status and message to users regarding whether
recording function has started or paused.
 */

var noteTextarea = $('#myInput');
var instructions = $('#recording-instructions');
var noteContent = '';


/*continuous variable helps prolong the interval of listening. If set to true, user will have up to 15 seconds of staying silend
 * before it stops */
recognition.continuous = true;

// This function is called whenever the Web Speech API captures a line.
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  /* According to MDSN, resultIndex returns the smallest SpeechRecognitionObject
  in the event that has been changed  */

  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript; //Get the transcript from the result index object

  // Append the transcript to the note and display the value of the note in the noteTextarea
    noteContent += transcript;
    noteTextarea.val(noteContent);
};

recognition.onstart = function() { 
  instructions.text('Voice Recognition Feature of the Engine has been activated. Please speak.');
}

recognition.onspeechend = function() {
  instructions.text('Voice Recognition Feature has been de-activated due to user inactivity.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('Did you say something? Please try again.');
  };
}

/*After defining what each function does (the HOW), let's determine the WHEN. The functions will execute
 as soon as start-record or pause-recognition is clicked. */
$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

//Regardless of the time, noteTextarea should be in sync with the noteContent in order to provide
//consistent output.
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})


