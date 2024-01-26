import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const backendUrl = import.meta.env.REACT_APP_URL_BACKEND as string


export const socket = io(backendUrl, {
	withCredentials: true,
});
export const WebSocketContext = createContext<Socket>(socket);