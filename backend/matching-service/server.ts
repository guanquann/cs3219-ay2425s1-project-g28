import http from "http";
import app from "./app.ts";
import Websocket from "./src/websocket/websocket.ts";
import { handleMatchRequest } from "./src/websocket/websocketHandlers.ts";

const server = http.createServer(app);
const io = Websocket.getInstance(server);
io.initSocketHandlers([{ path: "/matching", handler: handleMatchRequest }]);

const PORT = process.env.PORT || 3002;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(
      `Matching service server listening on http://localhost:${PORT}`
    );
  });
}
