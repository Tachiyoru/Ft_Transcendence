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
    });
    socket.on("message", (message: string) => {
      console.log(message);
    });
    // socket.on('newMessage', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newLocationMessage', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('updateUserList', (users: string[]) => {
    // 	console.log(users);
    // });
    // socket.on('newUser', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeUser', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newFriendRequest', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newFriend', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeFriend', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newGameRequest', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newGame', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeGame', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newChat', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeChat', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newChatMessage', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeChatMessage', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newChatMessageNotification', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeChatMessageNotification', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newFriendNotification', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('removeFriendNotification', (message: string) => {
    // 	console.log(message);
    // });
    // socket.on('newGameNotification', (message: string) => {
    // 	console.log(message);
    // });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  return <div></div>;
};
