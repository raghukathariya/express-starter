import moment from 'moment';
import { Service } from "typedi";
import { JWT_OPTIONS } from "../../../Config/app";
import { JwtManager } from "../../../Utils/Common/JwtManager";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { ExpressMiddlewareInterface } from "routing-controllers";

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {

  use(req: any, res: any, next?: (err?: any) => any): any {

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const bearerToken = authHeader && authHeader.split(" ")[1];
    const jwt = new JwtManager(JWT_OPTIONS);

    if (!bearerToken) {
      return res.status(HttpStatus.UN_AUTHORIZED).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(bearerToken);

    if (decoded && !decoded.hasOwnProperty('data')) {

      return res.status(HttpStatus.UN_AUTHORIZED).json({ message: "Invalid token" });
    } else {

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const expiryTime = moment.unix(decoded.exp);

      if (decoded.exp < currentTime) {

        const expMessage = `Token expired at ${expiryTime.format('MMMM Do YYYY, h:mm A')}`;
        return res.status(HttpStatus.UN_AUTHORIZED).json({ message: "Token Expired", expiredAt: expMessage });
      }

      req.user = decoded || {};
      return next();

    }

  }

}
