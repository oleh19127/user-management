import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  gmail: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MaxLength(20)
  password: string;
}
