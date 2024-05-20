import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import UserSchema from "../Schemas/UserSchema";
import { Service } from "typedi";

@Service()
@ValidatorConstraint({ name: "isUniqueEmail", async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments): Promise<any> {
    const user = await UserSchema.findOne({ email: email });
    return !user;
  }

  defaultMessage(args: ValidationArguments): string {
    return "Email has already been taken. Please try another one.";
  }
}

export function isUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}
