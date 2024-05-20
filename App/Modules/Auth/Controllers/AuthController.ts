import { Inject, Service } from "typedi";
import { User } from "../../User/Models/User";
import { AuthService } from "../Services/AuthService";
import { LoginRequest } from "../Requests/AuthRequest";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { CreateUserRequest } from "../../User/Requests/UserRequest";
import { Res, Body, Post, JsonController } from "routing-controllers";

@Service()
@JsonController("/auth")
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}

  @Post("/login")
  async login(@Body() payload: LoginRequest, @Res() res: any) {
    try {
      const _token = await this.authService.login(payload);
      return res
        .status(HttpStatus.OK)
        .json({ token: _token, success: "Login Successfully" });
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({
        success: false,
        message: "Invalid login credentials: " + error,
      });
    }
  }

  @Post("/register")
  async register(@Body() payload: CreateUserRequest, @Res() res: any) {
    try {
      const user = await this.authService.register(payload);
      if (user) {
        await this.authService.sendSuccessMail(payload);
        return res
          .status(HttpStatus.OK)
          .json({ data: user, message: "User registered successfully" });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: user, message: "Failed to register!" });
      }
    } catch (error) {
      return res
        .status(HttpStatus.SERVER_ERROR)
        .json({ data: error.message, message: "Failed to register" });
    }
  }

  @Post("/forgot-password")
  async authenticate(@Body() payload: User, @Res() res: any) {
    const user = await this.authService.login(payload);
    return res
      .status(HttpStatus.OK)
      .json({ user: user, success: "Login Successfully" });
  }
}

// App/Modules/Auth/Controllers/AuthController.ts
