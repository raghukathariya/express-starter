import { User } from "../Models/User";
import { Service, Inject } from "typedi";
import { UserRequest } from "../Requests/UserRequest";
import { UserService } from "../Services/UserService";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { AuthMiddleware } from "../../Auth/Middlewares/AuthMiddleware";
import { Req, Res, Get, UseBefore, Body, Param, Post, Put, Delete, JsonController } from "routing-controllers";

@Service()
@JsonController("/user")
@UseBefore(AuthMiddleware)
export class UserController {

  constructor(@Inject() private usersService: UserService) { }

  @Get("/")
  async getAll(@Req() req: any, @Res() res: any) {
    try {
      console.log("REQ USER", req.user);
      const users: User[] = await this.usersService.findAll();
      if (users && users.length !== 0) {
        return res
          .status(HttpStatus.OK)
          .json({ data: users, message: "Success" });
      }
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ data: users, message: "Failed" });
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({ message: "Something went wrong. Please contact system admin!", error: error, });
    }
  }

  @Get("/:id")
  async getById(@Param("id") id: string, @Req() req: any, @Res() res: any): Promise<User | null> {
    try {
      const user: User | null = await this.usersService.findById(id);
      return res.status(HttpStatus.OK).json({ data: user, message: "Success" });
    } catch (error) {
      return res
        .status(HttpStatus.SERVER_ERROR)
        .json({ data: null, message: error.message });
    }
  }

  @Post("/")
  async create(@Body() payload: UserRequest, @Res() res: any): Promise<string> {
    const userResult = await this.usersService.save(payload);
    if (userResult) {
      return res.status(HttpStatus.OK).json({ message: "ok" });
    }
  }

  @Put("/:id")
  async update(@Body() userData: UserRequest, @Param("id") id: string, @Res() res: any): Promise<void> {
    try {
      const data = await this.usersService.update(id, userData);
      if (data) {
        return res
          .status(HttpStatus.OK)
          .json({ message: "Data updated sucessfully" });
      }
    } catch (error) {
      return res
        .status(HttpStatus.SERVER_ERROR)
        .json({ message: "Failed to update data" });
    }
  }

  @Delete("/:id")
  async delete(@Param("id") id: string, @Res() res: any): Promise<void> {
    try {
      const data = await this.usersService.delete(id);
      if (data) {
        return res
          .status(HttpStatus.OK)
          .json({ message: "Data deleted sucessfully" });
      }
    } catch (error) {
      return res.status(HttpStatus.SERVER_ERROR).json({ message: "failed" });
    }
  }
}

// App/Modules/User/Controllers/UserController.ts
