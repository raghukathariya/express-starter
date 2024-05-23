// import dotenv from "dotenv";
import { config } from 'dotenv';
config();
/**
 |
 |=====================================================================
 | DATABASE
 |=====================================================================
 |
 */
export const DatabaseConfig = {
    CONNECTION_TYPE: process.env.CONNECTION_TYPE ?? "database",
    DB_HOST: process.env.DB_HOST ?? "localhost",
    DB_PORT: process.env.DB_PORT ?? "27017",
    DB_NAME: process.env.DB_NAME,
    TEST_DB_NAME: process.env.TEST_DB_NAME,
    DB_URI: process.env.DB_URI,
    TEST_DB_URI: process.env.TEST_DB_URI,
}
