import mongoose, { Mongoose } from "mongoose";
import { DatabaseConfig } from "../Config/database";
import { ENV } from "../Config/app";
import { logger } from "../Utils/Common/Logger";

export default class DatabaseConnection {
  private static instance: DatabaseConnection;
  private mongooseInstance: Mongoose;

  private constructor() {
    this.mongooseInstance = mongoose;
    this.connect();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private async connect() {
    let dbUri: string;
    switch (DatabaseConfig.CONNECTION_TYPE) {
      case "database":
        if (ENV === "test") {
          dbUri = `mongodb://${DatabaseConfig.DB_HOST}:${DatabaseConfig.DB_PORT}/${DatabaseConfig.TEST_DB_NAME}`;
        } else {
          dbUri = `mongodb://${DatabaseConfig.DB_HOST}:${DatabaseConfig.DB_PORT}/${DatabaseConfig.DB_NAME}`;
        }
        break;
      case "uri":
        if (ENV === "test") {
          dbUri = DatabaseConfig.TEST_DB_URI;
        } else {
          dbUri = DatabaseConfig.DB_URI;
        }
        break;
      default:
        break;
    }
    await this.mongooseInstance
      .connect(dbUri)
      .then(() => {
        console.log(`🚀 Database connected successfully!!`);
      })
      .catch((error) => {
        console.error("Error connecting to database:", error);
        logger.error(`Error in database connection >>========>>>> ${error}`);
      });
  }
}
