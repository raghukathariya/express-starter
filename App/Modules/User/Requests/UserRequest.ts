import { isUniqueEmail } from "../Middlewares/UniqueEmailValidator";
import { IsBoolean, IsEmail, Length, IsOptional, IsArray } from "class-validator";

export class UserRequest {

  @Length(4, 8, {
    message:
      "Username must be greater than $constraint1 and must be less than or equal to $constraint2 character long",
  })
  userName: string;

  @Length(3, 20, {
    message:
      "First Name must be greater than $constraint1 and must be less than or equal to $constraint2 character long",
  })
  firstName: string;

  @Length(3, 15, {
    message:
      "Middle Name must be greater than $constraint1 and must be less than or equal to $constraint2 character long",
  })
  @IsOptional()
  middleName?: string;

  @Length(3, 15, {
    message:
      "Last Name must be greater than $constraint1 and must be less than or equal to $constraint2 character long",
  })
  lastName: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEmail({}, { message: "Email is not a valid email address!" })
  @isUniqueEmail()
  email: string;

  @Length(3, 25, {
    message:
      "Password must be greater than $constraint1 and must be less than or equal to $constraint2 character long",
  })
  password: string;

  @IsArray({ message: "Role must be an array" })
  roles: string[];

}
