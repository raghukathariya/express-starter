import { JWT_SECRET_KEY } from "../../Config/app";
import jwt, { Secret, SignOptions, VerifyOptions } from "jsonwebtoken";

interface JwtPayload {
  [key: string]: any;
}

export interface JwtServiceOptions {
  secretKey?: Secret;
  signingOptions?: SignOptions;
  verifyOptions?: VerifyOptions;
}

export class JwtManager {
  private secretKey: Secret;
  private signingOptions: SignOptions;
  private verifyOptions: VerifyOptions;

  constructor(options?: JwtServiceOptions) {
    this.secretKey = options?.secretKey || JWT_SECRET_KEY;
    this.signingOptions = options?.signingOptions || {};
    this.verifyOptions = options?.verifyOptions || {};
  }

  public sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secretKey, this.signingOptions);
  }

  public verify(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        this.secretKey,
        this.verifyOptions
      ) as JwtPayload;
      return decoded;
    } catch (error) {
      return error;
    }
  }

  public generateRefreshToken(userId: string) {
    try {
      const refreshToken = this.sign({ userId });
      return refreshToken;
    } catch (error) {
      return error;
    }
  }
}
