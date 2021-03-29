const express = require("express");
const { join } = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Serve assets in /assets, found via <url>/assets/stuff
// This is used to serve static files such as styles, scripts and images
app.use("/assets", express.static(join(__dirname, "..", "client", "assets")));

// This where the main game is served at, when there is a request to / (no/root path), the server sends index.html 
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "client", "index.html"));
});

io.on("connection", (socket) => {
    console.log("a user connected");
});


// TODO: Handle incoming draw packets
// better names apprecieated

// Potentially batch draw points so the client doesn't spam the server with packets when the mouse moves?

// Draw? fill, erase? Not sure what else we may need.

// Emitted whenever a user draws something onto the canvas
// io.on("draw", (data) => {
//   console.log("A point was drawn");
//  // Broadcast drawn point(s)? to all clients
//  // Should it contain color data or should we leave that for another "type" of event?
// });

http.listen(3000, () => {
    console.log("Listening on port 3000");
});
