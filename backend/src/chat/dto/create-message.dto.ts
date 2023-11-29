import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Message } from "../entities/entities";

export class CreateMessageDto extends Message {
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content cannot be empty" })
  @MaxLength(255, { message: 'Content must not exceed 255 characters' })
  readonly content: string;
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content cannot be empty" })
  readonly chanName: string;
}
