import { useContext, useEffect } from "react";
import { WebSocketContext } from "../socket/socket";

export const Websocket = () => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server", socket.id, socket);
    });
    socket.on("disconnect", () => {
      console.log("disconnected from server");
      socket.emit("gotDisconnected");
    });
    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return <div></div>;
};