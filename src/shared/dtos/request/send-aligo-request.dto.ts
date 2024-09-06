import { IsString, IsNotEmpty } from 'class-validator';

export class SendAligoRequestDto {
  @IsString()
  @IsNotEmpty()
  apikey: string;

  @IsString()
  @IsNotEmpty()
  userid: string;

  @IsString()
  @IsNotEmpty()
  senderkey: string;

  @IsString()
  @IsNotEmpty()
  tpl_code: string;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver_1: string;

  @IsString()
  @IsNotEmpty()
  subject_1: string;

  @IsString()
  @IsNotEmpty()
  message_1: string;
}
