// utils/socket.js
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND, {
  withCredentials: true,
  autoConnect: false,
});
