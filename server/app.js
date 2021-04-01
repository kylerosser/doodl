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
// TODO: Check if the client is actually allowed to draw, ie it is their turn.
// Perhaps with middleware or something?

// TODO: Potentially batch draw points so the client doesn't spam the server with packets when the mouse moves?

// If you have any other ideas or were thinking of something else please feel free to suggest?

/*
* Idea: When the client does any actions that can be listened to via javascript event listeners
* the client will send it to the server via socket.io
*
* The server will validate some things such as:
* - It's actually the client's turn and it's allowed to draw
* - the data is indeed parsable and won't crash all the clients
* then will send the data back to all the connected clients
*
* The clients will the parse the data and draw it onto the screen (including onto the drawer's own screen)
* This will NOT work well with high latency as the drawer will get quite a lot of lag
* 
* Order of events transmitted will also be important
*/

// Emitted whenever a user draws something onto the canvas
io.on("draw", (data) => {
    try {
        // Data should be an array of points?
        // [{x: 100, y: 1000}, {x: 100, y: 1000}]
        console.log(data);
        console.log("A point was drawn");
        // Broadcast drawn point(s)? to all clients
        // Should it contain color data or should we leave that for another "type" of event?
    } catch (e) {
        // Hopefully this will ever happen
        // Not gonna trust the user but uh yeah
        // Someome might be able to attack the server by sending invalid packets
    }
});

// Emitted whenever the client decides to choose a different pen
// Different size pens? Fill, Eraser?
io.on("pentype", (data) => {
    try {
    } catch (e) {}
});

// Emitted whenever the client presses down onto the canvas
io.on("pendown", (data) => {
    try {
    } catch (e) {}
});

// Emitted whenever the client lefts the pen up
io.on("penup", (data) => {
    try {
    } catch (e) {}
});


http.listen(3000, () => {
    console.log("Listening on port 3000");
});
