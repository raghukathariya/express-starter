// FormattedError.ts
import { validate, ValidationError } from "class-validator";

interface ValidationErrors {
  property: string;
  messages: string[];
}

export class FormattedError {
  private errors: ValidationErrors[];

  private constructor(errors: ValidationErrors[]) {
    this.errors = errors;
  }

  toJSON() {
    return {
      errors: this.errors,
    };
  }

  static async fromDto<T>(dto: any): Promise<FormattedError | null> {
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors: ValidationErrors[] = errors.map((error) => ({
        property: error.property,
        messages: Object.values(error.constraints),
      }));
      return new FormattedError(formattedErrors);
    }

    return null;
  }
}
