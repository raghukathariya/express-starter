// App/Modules/main.ts
import "reflect-metadata";
import path from "path";
import express from "express";
import { Container } from "typedi";
import "./Modules/ServiceProvider";
import errorHandler from "strong-error-handler";
import DatabaseConnection from "./Bootstrap/DatabaseConnection";
import PrettyErrorMiddleware from "./Utils/Common/PrettyErrorMiddleware";
import ExecutionTimeMiddleware from "./Utils/Common/ExecutionTimeMiddleware";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { CONTROLLER_PATH, PORT, CORS_OPTIONS, ENV, GLOBAL_MIDDLEWARE_PATH, LIST_ROUTES } from "./Config/app";
import { RouteManager } from "./Utils/Core/RouteManager";

// Set the container for routing-controllers
routingUseContainer(Container);

/**
  |
  |=====================================================================
  | Routing Controller
  |=====================================================================
  | For Routing purpose [routing-controller] package has been used
  |
  */

const app = createExpressServer({
  cors: {
    CORS_OPTIONS,
  },
  classTransformer: true, // Show or Hide validation errors
  controllers: [path.join(__dirname + CONTROLLER_PATH)],
  validation: true, //Add Class Validator
  middlewares: [path.join(__dirname + GLOBAL_MIDDLEWARE_PATH)],
  defaultErrorHandler: false,
});
app.use(express.json());

/**
  |
  |=====================================================================
  | Error Handler(strong-error-handler)
  |=====================================================================
  | This is for logging error in file located in logs dir.
  |
  */
app.use(
  errorHandler({
    debug: ENV === "development",
    log: true,
  })
);

/**
  |
  |=====================================================================
  | API Execution Time Middleware
  |=====================================================================
  | This will find execution time of each api calls threshold time is
  | defined in .env file as EXECUTION_TIME_LIMIT
  | 
  */
const executionTimeMiddleware = new ExecutionTimeMiddleware();
app.use(executionTimeMiddleware.handle.bind(executionTimeMiddleware));

/**
  |
  |=====================================================================
  | Database Connection
  |=====================================================================
  | Database connection for mongodb
  |
  */
DatabaseConnection.getInstance();

/**
  |
  |=====================================================================
  | Pretty Error Middleware
  |=====================================================================
  | This will show error in formatted way
  |
  */

// const prettyErrorMiddleware = new PrettyErrorMiddleware();
// app.use(prettyErrorMiddleware.handle.bind(prettyErrorMiddleware));

/**
  |
  |=====================================================================
  | Run application
  |=====================================================================
  | This will start server at given port
  |
  */
app.listen(PORT, () => {
  console.log(`🚀 App listening on the port ${PORT}`);
});

if (LIST_ROUTES == "true") {
  const routeManager = new RouteManager(app);
  routeManager.displayRoutes();
}
export default app;
