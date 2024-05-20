// typedi-config.ts
import { Container, Token } from "typedi";
import { UserRepository } from "./User/Repositories/UserRepository";
import { UserInterface } from "./User/Repositories/UserInterface";
import { UploadInterface } from "./Common/Repositories/UploadInterface";
import { UploadRepository } from "./Common/Repositories/UploadRepository";

/**
  |
  |=====================================================================
  | Create token of every interface of modules
  |=====================================================================
  | 1.After creating token it can be injected in Services class.
  |   Eg. @Inject(UserInterfaceToken) private userRepo: UserInterface,
  | 2.Every interface need to be bind before injecting to services.
  |
  */

//User Module
export const UserInterfaceToken = new Token<UserInterface>("UserInterface");
Container.set(UserInterfaceToken, new UserRepository());

//Common Module
export const UploadInterfaceToken = new Token<UploadInterface>("UploadInterface");
Container.set(UploadInterfaceToken, new UploadRepository());
