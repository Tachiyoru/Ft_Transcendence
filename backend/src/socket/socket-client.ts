import { Injectable, OnModuleInit } from "@nestjs/common";
import { io, Socket } from "socket.io-client";

@Injectable()
export class SocketClient implements OnModuleInit {
  public socketCLient: Socket;

  constructor() {
    this.socketCLient = io("http://localhost:5001");
  }

  onModuleInit() {
    this.registerConsumerEvents();
  }

  private registerConsumerEvents() {
    this.socketCLient.on("connect", () => {
      console.log("Connected to socket server", this.socketCLient.id);
    });
  }
}
