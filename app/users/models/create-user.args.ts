import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password?: string;

  @IsMobilePhone('en-NG', { message: 'Phone number is not valid' })
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceModel?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceIp?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  transactionPassword?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platform?: string;
}

export class CreateUserArgs {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password?: string;

  @IsMobilePhone('en-NG', { message: 'Phone number is not valid' })
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceModel?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceIp?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  transactionPassword?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platform?: string;
}
