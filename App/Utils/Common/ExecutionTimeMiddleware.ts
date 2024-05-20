import { logger } from "./Logger";
import { EXECUTION_TIME_LIMIT } from "../../Config/app";
import { Request, Response, NextFunction } from "express";
class ExecutionTimeMiddleware {
  private start: number;

  constructor() {
    this.start = 0;
  }

  public handle(req: Request, res: Response, next: NextFunction): void {
    this.start = new Date().getTime();

    res.on("finish", () => {
      const end = new Date().getTime();
      const executionTime = end - this.start;
      if (executionTime > Number(EXECUTION_TIME_LIMIT))
        logger.info(`API call: ${req.method} ${req.originalUrl} executed in ${executionTime}ms`);
    });

    next();
  }
}

export default ExecutionTimeMiddleware;
