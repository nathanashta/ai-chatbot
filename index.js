// Instantiate express
const express = require("express");
const app = express();

// Import .env
require("dotenv").config();

// Instantiate APIAI (Dialogflow)
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const apiai = require("apiai")(APIAI_SESSION_ID);

// Import HTML, JS, CSS, images
app.use(express.static(__dirname + "/views")); // html
app.use(express.static(__dirname + "/public")); // js, css, images

// Instantiate server using socket.io
const port = process.env.PORT || 5000;
const server = app.listen(port);
const io = require("socket.io")(server);

// Start the server
console.log("Server is listening on port", port, "...");
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// On connection to script
io.on("connection", function(socket) {
  // On chat message
  socket.on("chat message", text => {
    // Send API call to APIAI
    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    // Get API response
    apiaiReq.on("response", response => {
      let aiText = response.result.fulfillment.speech;
      socket.emit("bot reply", aiText);
    });

    // Log any error
    apiaiReq.on("error", error => {
      console.log(error);
    });

    // End the request
    apiaiReq.end();
  });
});
