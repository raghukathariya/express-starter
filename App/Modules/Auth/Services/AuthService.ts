import bcrypt from "bcrypt";
import { Service, Inject } from "typedi";
import { SendMailOptions } from "nodemailer";
import { User } from "../../User/Models/User";
import { MAIL_FROM } from "../../../Config/mail";
import { JWT_OPTIONS } from "../../../Config/app";
import { JwtManager } from "../../../Utils/Common/JwtManager";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { HttpException } from "../../../Utils/Common/HttpException";
import { UserInterface } from "../../User/Repositories/UserInterface";
import { EmailService } from "../../../Modules/Common/Services/EmailService";

@Service()
export class AuthService {
  constructor(@Inject('UserInterface') private userRepo: UserInterface, private emailService: EmailService) { }

  async login(payload: any): Promise<any> {
    try {
      const email = payload.email;
      const password = payload.password;
      const user = await this.userRepo.findByEmail(email);
      if (user) {
        const isValidUser: boolean | false = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValidUser)
          throw new HttpException(HttpStatus.NOT_FOUND, "User doesn't exist");
        const jwtPayload = {
          sub: user._id,
          data: {
            userId: user._id,
            userName: user.userName,
            email: user.email,
          },
        };
        const _jwtService = new JwtManager(JWT_OPTIONS);
        const _token = _jwtService.sign(jwtPayload);
        return _token;
      } else {
        throw new HttpException(
          HttpStatus.SERVER_ERROR,
          "Failed to find user by email"
        );
      }
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to find user by email");
    }
  }

  async register(payload: User): Promise<User> {
    try {
      const user = await this.userRepo.save(payload);
      return user ? user : null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to find user by emaildd" + error);
    }
  }

  async emailExist(email: string): Promise<boolean> {
    try {
      const user = await this.userRepo.findByEmail(email);
      return user ? true : false;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to find user by emaild");
    }
  }

  async sendSuccessMail(payload: any): Promise<void> {
    const templatePath =
      process.cwd() + "/resource/email-template/register-success.html";
    const user = await this.userRepo.findByEmail(payload.email);

    const currentDate = new Date();

    const emailOption: SendMailOptions = {
      from: MAIL_FROM,
      to: `${payload.firstName} ${payload.lastName} <${payload.email}>`,
      subject: "My Nepal : Account registered successfully ✔",
    };

    const templateData = {
      fullName: payload.firstName + " " + payload.lastName,
      companyName: "My Nepal",
      fromName: "Abc Xyz",
      contactNumber: "1234567892",
      email: user.email,
      userName: user.userName,
      currentYear: currentDate.getFullYear(),
    };

    try {
      await this.emailService.sendEmail(
        emailOption,
        templatePath,
        templateData
      );
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Error in sending Email. Please contact to system admin");
    }
  }
}

// App/Modules/Auth/Services/AuthService.ts
