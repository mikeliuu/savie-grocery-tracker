import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/auth.service';

export interface JWTRequest extends Request {
  user: JwtPayload & {
    iat?: number;
    exp?: number;
    [key: string]: any;
  };
}
