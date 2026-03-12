import { io, Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../types/socket";
const getSocketUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "http://localhost:3000";
};
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  getSocketUrl(),
  { withCredentials: true, reconnectionAttempts: 3 },
);
