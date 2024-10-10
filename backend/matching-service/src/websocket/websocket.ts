import http from "http";
import { Server, Socket } from "socket.io";

// Adapted from https://dev.to/nickfelix/how-to-implement-socketio-using-typescript-3ne2
const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

interface MatchRequestParams {
  user: string;
  complexities: string[];
  categories: string[];
  languages: string[];
  timeout: number;
}

class Websocket extends Server {
  private static io: Websocket;

  constructor(server: http.Server) {
    super(server, {
      cors: WEBSOCKET_CORS,
    });
  }

  public static getInstance(server: http.Server): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(server);
    }

    return Websocket.io;
  }

  public initSocketHandlers(socketHandlers: Array<any>) {
    socketHandlers.forEach((element) => {
      Websocket.io.of(element.path, (socket: Socket) => {
        element.handler(socket);
      });
    });
  }
}

export default Websocket;
