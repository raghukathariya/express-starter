// typedi-config.ts
import { Container, Token } from "typedi";
import { UserRepository } from "./User/Repositories/UserRepository";
import { UserInterface } from "./User/Repositories/UserInterface";

/**
  |
  |=====================================================================
  | Create token of every interface of modules
  |=====================================================================
  | After creating token it can be injected in Services class.
  | Eg. @Inject(UserInterfaceToken) private userRepo: UserInterface,
  |
  */
export const UserInterfaceToken = new Token<UserInterface>("UserInterface");

/**
  |
  |=====================================================================
  | Binding Interfaces
  |=====================================================================
  | Every interface need to be bind before injecting to services.
  |
  */
Container.set(UserInterfaceToken, new UserRepository());
