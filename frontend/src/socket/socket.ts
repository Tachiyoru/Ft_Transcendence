import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io("http://localhost:5001", {
	withCredentials: true,
});
export const WebSocketContext = createContext<Socket>(socket);