import { NextFunction, Request, Response } from "express";
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { Service } from "typedi";

@Service()
@Middleware({ type: "after" })
export class ClassValidationError implements ExpressErrorMiddlewareInterface
{
  error(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    if (error.errors) {
      console.log("ERROR", error);
      let formattedErrors = error.errors.reduce((acc: any, err: any) => {
        acc[err.property] = Object.values(err.constraints).join(", ");
        return acc;
      }, {});

      response.status(400).json({
        data: null,
        status: 400,
        message: "Validation failed",
        errors: formattedErrors,
      });
    } else {
      response.status(error.status || 500).json({ error: error.message });
    }
  }
}
