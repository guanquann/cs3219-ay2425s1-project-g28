import http from "http";
import app, { allowedOrigins } from "./app.ts";
import { handleWebsocketMatchEvents } from "./src/handlers/websocketHandler.ts";
import { Server } from "socket.io";
import { connectRabbitMq } from "./config/rabbitmq.ts";

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
  connectRabbitMq()
    .then(() => {
      console.log("RabbitMq connected!");

      server.listen(PORT, () => {
        console.log(
          `Matching service server listening on http://localhost:${PORT}`
        );
      });

      //can use this to test if rabbitmq works for you (import sendRabbitMq from rabbitmq.ts first)
      /*const message1 = {
        userId: "1",
        categories: "Algorithms",
        complexities: "Easy",
        sentTimestamp: Date.now(),
        ttlInSecs: 30,
      };
      sendRabbitMq(message1);
      const message2 = {
        userId: "2",
        categories: "Algorithms",
        complexities: "Medium",
        sentTimestamp: Date.now(),
        ttlInSecs: 30,
      };
      sendRabbitMq(message2);*/
    })
    .catch((err) => {
      console.error("Failed to connect to RabbitMq");
      console.error(err);
    });
}
