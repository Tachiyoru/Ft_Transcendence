import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateMessageDto } from "./create-message.dto";

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  readonly msgId: number;
}
