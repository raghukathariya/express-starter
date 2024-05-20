import { JwtManager } from "../../../Utils/Common/JwtManager";
import { JWT_OPTIONS } from "../../../Config/app";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: any, res: any, next?: (err?: any) => any): any {
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader && authHeader.split(" ")[1];
    const jwt = new JwtManager(JWT_OPTIONS);
    const decoded = jwt.verify(bearerToken);
    if (decoded && decoded.name === "TokenExpiredError") {
      return res
        .status(HttpStatus.UN_AUTHORIZED)
        .json({ message: decoded.message, expiredAt: decoded.expiredAt });
    } else {
      req.user = decoded;
      return next();
    }
  }
}
