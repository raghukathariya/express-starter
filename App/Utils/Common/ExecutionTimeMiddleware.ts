import { logger } from "./Logger";
import { greenBright, yellow } from "colorette"
import { EXECUTION_TIME_LIMIT } from "../../Config/app";
import { Request, Response, NextFunction } from "express";
class ExecutionTimeMiddleware {
  private start: number;

  constructor() {
    this.start = 0;
  }

  public handle(req: Request, res: Response, next: NextFunction): void {

    // this.start = Date.now(); 
    const startTime = process.hrtime();

    res.on("finish", () => {

      const [seconds, nanoseconds] = process.hrtime(startTime); // End time
      const milliseconds = (seconds * 1000) + (nanoseconds / 1e6);

      if (milliseconds > Number(EXECUTION_TIME_LIMIT)) {
        console.log(yellow(`API call: ${req.method} ${req.originalUrl} executed in ${milliseconds.toFixed(2)} ms`));
        logger.info(yellow(`API call: ${req.method} ${req.originalUrl} executed in ${milliseconds.toFixed(2)} ms`));
      } else {
        console.log(greenBright(`API call: ${req.method} ${req.originalUrl} executed in ${milliseconds.toFixed(2)} ms`));
      }

    });

    next();
  }
}

export default ExecutionTimeMiddleware;
