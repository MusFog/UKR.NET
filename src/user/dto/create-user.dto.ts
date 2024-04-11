import { IsString, IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  readonly login: string

  @IsEmail()
  readonly email: string

  @IsString()
  @MinLength(6)
  readonly password: string
}
