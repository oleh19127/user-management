import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  gmail: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsEnum(UserRole)
  userRole: UserRole;
}
