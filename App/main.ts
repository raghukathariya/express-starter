// App/Modules/main.ts
import "reflect-metadata";
import path from "path";
import express from "express";
import { Container } from "typedi";
import errorHandler from "strong-error-handler";
import DatabaseConnection from "./Bootstrap/DatabaseConnection";
import PrettyErrorMiddleware from "./Utils/Common/PrettyErrorMiddleware";
import ExecutionTimeMiddleware from "./Utils/Common/ExecutionTimeMiddleware";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { PORT, CORS_OPTIONS, ENV, LIST_ROUTES, ROUTE_PREFIX } from "./Config/app";
import { RouteManager } from "./Utils/Core/RouteManager";
import { ModuleServiceProvider } from "./Utils/Core/ModuleServiceProvider";
import { ClassAutoLoader } from "./Utils/Core/ClassAutoLoader";
import { cyanBright } from "colorette";

const start = performance.now();

const modulesBaseDir = path.resolve(__dirname, './Modules');
const middlewareBaseDir = path.resolve(__dirname, './Utils/GlobalMiddlewares');

/**
  |
  |=====================================================================
  | Auto Register Interface and Repository from MODULES to typedi
  |=====================================================================
  |
  */
const bindRepository = new ModuleServiceProvider(modulesBaseDir);
bindRepository.bindRepositoriesRecursively();

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
    CORS_OPTIONS, //origin: '*' // Allow requests from any origin
  },
  validation: true,
  routePrefix: ROUTE_PREFIX,
  classTransformer: true,
  defaultErrorHandler: false,
  controllers: ClassAutoLoader.loadClasses(modulesBaseDir, 'Controller'),
  middlewares: ClassAutoLoader.loadClasses(middlewareBaseDir, 'Middleware')
});

app.use(express.json());
app.use('/assets/uploads', express.static(path.join(__dirname, '../assets/uploads')));

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

const end = performance.now();
console.log(">>>>-------------------------------------->>>>>");
console.log(cyanBright(`APPLICATION LOADING TIME : ${(end - start).toFixed(2)} ms`));
console.log("<<<<--------------------------------------<<<<<");

export default app;
