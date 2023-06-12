import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInUserArgs {
  @IsEmail()
  @IsNotEmpty()
  emailAddress?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
