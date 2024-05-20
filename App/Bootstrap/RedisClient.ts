import Redis from "ioredis";
import { HttpStatus } from "../Utils/Common/HttpStatus";
import { HttpException } from "../Utils/Common/HttpException";
import { RedisConfig } from "../Config/cache";
export class RedisClient {
  private client: Redis;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = RedisConfig.REDIS_ENABLED === "true";

    if (this.isEnabled) {
      this.client = new Redis({
        host: RedisConfig.REDIS_HOST,
        port: Number(RedisConfig.REDIS_PORT),
      });
      this.client.on("error", (error) => {
        this.close();
        return new HttpException(HttpStatus.SERVER_ERROR, error.message);
      });
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isEnabled) {
        return;
      }
      const result = await this.client.get(key);
      if (result) {
        return JSON.parse(result);
      }
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, error.message);
      return null;
    }
  }

  async set(
    key: string,
    value: any,
    expirationSeconds: number = 300
  ): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        return false;
      }
      await this.client.set(
        key,
        JSON.stringify(value),
        "EX",
        expirationSeconds
      );
      return true;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, error.message);
      return false;
    }
  }

  async update(key: string, value: string): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        return false;
      }
      const exists = await this.client.exists(key);
      if (exists === 1) {
        await this.client.set(key, value);
        return true;
      } else {
        console.error("Key does not exist:", key);
        return false;
      }
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, error.message);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        return false;
      }
      const result = await this.client.del(key);
      if (result === 1) {
        return true;
      } else {
        throw new HttpException(
          HttpStatus.SERVER_ERROR,
          `Key: ${key} not found`
        );
        return false;
      }
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, error.message);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
