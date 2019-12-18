const express = require("express");
const app = express();
require("dotenv").config();

const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

app.use(express.static(__dirname + "/views")); // html
app.use(express.static(__dirname + "/public")); // js, css, images

const port = process.env.PORT || 5000;

const server = app.listen(port);

const io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const apiai = require("apiai")(APIAI_SESSION_ID);

io.on("connection", function(socket) {
  socket.on("chat message", text => {
    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on("response", response => {
      let aiText = response.result.fulfillment.speech;
      socket.emit("bot reply", aiText);
    });

    apiaiReq.on("error", error => {
      console.log(error);
    });

    apiaiReq.end();
  });
});
