import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
