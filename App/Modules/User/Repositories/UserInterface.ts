import { BaseInterface } from "../../../Utils/Core/BaseInterface";
import { User } from "../Models/User";

export interface UserInterface extends BaseInterface<User> {
  findByEmail(email: string): Promise<User | null>;
}
