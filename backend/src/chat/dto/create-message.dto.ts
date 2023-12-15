import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Channel, Message } from "../entities/entities";
import { PartialType } from "@nestjs/mapped-types";
import { Mode, User } from "@prisma/client";

export class CreateMessageDto extends Message {
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content cannot be empty" })
  @MaxLength(255, { message: "Content must not exceed 255 characters" })
  readonly content: string;
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content cannot be empty" })
  readonly chanName: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  readonly msgId: number;
}

export class createChannel extends Channel {
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content cannot be empty" })
  @MaxLength(16, { message: "Content must not exceed 16 characters" })
  name: string;
  mode: Mode;
  password: string;
  members: User[];
}

export class joinChannel extends Channel {
  name: string;
  password: string;
}
