import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  socket = io({
    withCredentials: true,
  });
  return socket;
};

export const getSocket = () => socket;
