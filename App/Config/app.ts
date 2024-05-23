import { config } from 'dotenv';
import { JwtServiceOptions } from "../Utils/Common/JwtManager";

/**
 |
 |=====================================================================
 | Environment Variable Config
 |=====================================================================
 |
 */
config();
/**
 |
 |=====================================================================
 |APPLICATION
 |=====================================================================
 |
 */

export const PORT = process.env.PORT ?? 3000;
export const ENV = process.env.ENV ?? "development";
export const API_KEY = process.env.API_KEY;
export const LIST_ROUTES = process.env.LIST_ROUTES ?? false;

export const CONTROLLER_PATH = process.env.ENV == "development" ? "/Modules/**/Controllers/*.ts" : "/Modules/**/Controllers/*.js";
export const GLOBAL_MIDDLEWARE_PATH = process.env.ENV == "development" ? "/Utils/GLobalMiddlewares/*.ts" : "/Utils/GLobalMiddlewares/*.js";

/**
 |
 |=====================================================================
 | LOG
 |=====================================================================
 |
 */
export const LOG_DIR = process.env.LOG_DIR ?? "./logs";

/**
 |
 |=====================================================================
 | CORS(Cross-Origin Resource Sharing)
 |=====================================================================
 |
 */
const ALLOWED_DOMAINS = JSON.parse(process.env.ALLOWED_DOMAIN);
export const CORS_OPTIONS = {
  origin: function (origin: any, callback: any) {
    if (ALLOWED_DOMAINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

/**
 |
 |=====================================================================
 | EXECUTION TIME
 |=====================================================================
 |
 */
export const EXECUTION_TIME_LIMIT = process.env.EXECUTION_TIME_LIMIT ?? 1000;

/**
 |
 |=====================================================================
 | JWT (Json Web Token)
 |=====================================================================
 |
 */
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? "q&^W2wMf32]6PK$nvuCo,]NiI8Gyht^d$W*q|>j7;lTJ5@-=Sv{7w)9!knD3C";
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME ?? "1h";

export const JWT_OPTIONS: JwtServiceOptions = {
  secretKey: JWT_SECRET_KEY,
  signingOptions: {
    expiresIn: JWT_EXPIRATION_TIME,
  },
  verifyOptions: { algorithms: ["HS256"] },
};
