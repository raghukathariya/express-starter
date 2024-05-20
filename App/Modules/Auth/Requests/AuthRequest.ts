import { IsEmail, Length } from "class-validator";

export class LoginRequest {
  @IsEmail()
  @Length(4, 30)
  email: string;

  @Length(3, 16, {
    message:
      "Password must not be less than $constraint1 and greater or equal to then $constraint2.",
  })
  password: string;
}
