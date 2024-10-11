import http from "http";
import app, { allowedOrigins } from "./app.ts";
import { handleWebsocketMatchEvents } from "./src/handlers/websocketHandler.ts";
import { Server } from "socket.io";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {},
});

io.on("connection", (socket) => {
  handleWebsocketMatchEvents(socket);
});

const PORT = process.env.PORT || 3002;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(
      `Matching service server listening on http://localhost:${PORT}`
    );
  });
}
