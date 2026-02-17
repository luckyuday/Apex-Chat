import { io, Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../types/socket";
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000/",
  { withCredentials: true, reconnectionAttempts: 3 },
);
