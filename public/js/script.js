// Instantiate speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

// Instantiate socket
const socket = io();

// Get elements of user output and bot output
const outputYou = document.querySelector(".output-you");
const outputBot = document.querySelector(".output-bot");

// Add event listener on the button
document.querySelector("button").addEventListener("click", () => {
  recognition.start();
});

// On end of recognition
recognition.addEventListener("result", e => {
  // Get text and emit the message
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;

  socket.emit("chat message", text);
});

// Function to do text to speech
function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

// Socket for bot reply
socket.on("bot reply", function(replyText) {
  synthVoice(replyText);

  if (replyText == "") replyText = "(No answer...)";
  outputBot.textContent = replyText;
});
