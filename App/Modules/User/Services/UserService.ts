import { UserInterface } from "../Repositories/UserInterface";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { HttpException } from "../../../Utils/Common/HttpException";
import { Service, Inject } from "typedi";
import { RedisClient } from "../../../Bootstrap/RedisClient";
import { User } from "../Models/User";
import { UserInterfaceToken } from "../../ServiceProvider";

@Service()
export class UserService {
  private redisClient;

  constructor(@Inject(UserInterfaceToken) private userRepo: UserInterface) {
    this.redisClient = new RedisClient();
  }

  async findAll(): Promise<User[] | []> {
    let users: any;
    const _Key = "userList";

    try {
      let cached = await this.redisClient.get(_Key);

      if (!cached) {
        users = await this.userRepo.findAll();
        users ? this.redisClient.set(_Key, users, 10) : [];
      } else {
        users = cached;
      }
      return users ?? [];
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Unable to retrieve data"
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    const _Key = "userById";
    let user: any;

    try {
      let cached = await this.redisClient.get(_Key);

      if (!cached) {
        user = await this.userRepo.find(id, { password: 0 });
        user ? this.redisClient.set(_Key, user, 10) : null;
      } else {
        user = cached;
      }

      return user ?? null;
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Failed to find data by emaill"
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user: User = await this.userRepo.findByEmail(email);
      return user ? user : null;
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Failed to find data by email"
      );
    }
  }

  async save(payload: User): Promise<User> {
    try {
      const data = await this.userRepo.save(payload);
      return data ?? null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to save data");
    }
  }

  async update(id: string, payload: any): Promise<any> {
    try {
      const data = await this.userRepo.update(id, payload);
      return data ?? null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to update data");
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const data = await this.userRepo.delete(id);
      return data ?? null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to delete data");
    }
  }
}

// App/Modules/User/Services/UserService.ts
