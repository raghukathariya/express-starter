import {
  Req,
  Res,
  Get,
  UseBefore,
  JsonController,
} from "routing-controllers";
import { AuthMiddleware } from "../../Auth/Middlewares/AuthMiddleware";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { Service } from "typedi";

@Service()
@JsonController("")
export class HomeController {
  constructor() { }

  @Get("/")
  async get(@Req() req: any, @Res() res: any) {

    return res
      .status(HttpStatus.OK)
      .json({ data: "Welcome to home page.", message: "Success" });
  }
}

// App/Modules/Upload/Controllers/HomeController.ts
