const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let sharedContent = "";

wss.on("connection", (ws) => {
  console.log("🟢 New user connected");

  // Send existing content to new user
  ws.send(sharedContent);

  ws.on("message", (message) => {
    sharedContent = message.toString();

    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(sharedContent);
      }
    });
  });

  ws.on("close", () => {
    console.log("🔴 User disconnected");
  });
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
