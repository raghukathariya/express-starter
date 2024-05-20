import { User } from "../Models/User";
import { UserInterface } from "./UserInterface";
import { HttpException } from "../../../Utils/Common/HttpException";
import UserSchema, { UserDocument } from "../Schemas/UserSchema";
import { BaseRepository } from "../../../Utils/Core/BaseRepository";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { Service } from "typedi";

@Service()
export class UserRepository
  extends BaseRepository<UserDocument>
  implements UserInterface
{
  constructor() {
    super(UserSchema);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserSchema.findOne({ email: email });
      return user ?? null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "User doesn't exist");
    }
  }
}

// App/Modules/User/Repositories/Userrepository.ts
